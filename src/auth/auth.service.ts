import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { IChangePassword, ILoginUser, IRegisterUser } from "./auth.interface";
import { jwtUtils } from "../utils/jwt";
import { AppError } from "../utils/AppError";
import config from "../config";

// build the payload once so access and refresh tokens always agree
const buildJwtPayload = (user: { id: string; name: string; email: string; role: string }) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

// ---------- REGISTER ----------
const registerUser = async (payload: IRegisterUser) => {
  const {
    name,
    email,
    password,
    phone,
    address,
    profilePhoto,
    role,
    bio,
    skills,
    experienceYears,
    hourlyRate,
    location,
  } = payload;

  const isUserExist = await prisma.user.findUnique({ where: { email } });

  if (isUserExist) {
    throw new AppError(httpStatus.CONFLICT, "A user with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));
  const userRole = role === "TECHNICIAN" ? "TECHNICIAN" : "CUSTOMER";

  // user + technician profile must be created together, so use a transaction
  const createdUser = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        address,
        profilePhoto,
        role: userRole,
      },
    });

    if (userRole === "TECHNICIAN") {
      await tx.technicianProfile.create({
        data: {
          userId: user.id,
          bio,
          skills: skills ?? [],
          experienceYears: experienceYears ?? 0,
          hourlyRate: hourlyRate ?? 0,
          location: location ?? address,
        },
      });
    }

    return tx.user.findUniqueOrThrow({
      where: { id: user.id },
      omit: { password: true },
      include: { technicianProfile: true },
    });
  });

  return createdUser;
};

// ---------- LOGIN ----------
const loginUser = async (payload: ILoginUser) => {
  const { email, password } = payload;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }

  if (user.activeStatus === "BLOCKED") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Your account has been blocked. Please contact support",
    );
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }

  const jwtPayload = buildJwtPayload(user);

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in,
  );

  const { password: _pwd, ...safeUser } = user;

  return { accessToken, refreshToken, user: safeUser };
};

// ---------- REFRESH TOKEN ----------
const refreshToken = async (token: string) => {
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Refresh token is missing");
  }

  const verifiedRefreshToken = jwtUtils.verifyToken(token, config.jwt_refresh_secret);

  if (!verifiedRefreshToken.success) {
    throw new AppError(httpStatus.UNAUTHORIZED, verifiedRefreshToken.error as string);
  }

  const { id } = verifiedRefreshToken.data as JwtPayload;

  const user = await prisma.user.findUniqueOrThrow({ where: { id } });

  if (user.activeStatus === "BLOCKED") {
    throw new AppError(httpStatus.FORBIDDEN, "Your account has been blocked");
  }

  const accessToken = jwtUtils.createToken(
    buildJwtPayload(user),
    config.jwt_access_secret,
    config.jwt_access_expires_in,
  );

  return { accessToken };
};

// ---------- GET CURRENT USER ----------
const getMe = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    omit: { password: true },
    include: {
      technicianProfile: {
        include: {
          availabilities: true,
          _count: { select: { services: true, bookings: true } },
        },
      },
      _count: { select: { bookings: true, reviews: true } },
    },
  });

  return user;
};

// ---------- CHANGE PASSWORD ----------
const changePassword = async (userId: string, payload: IChangePassword) => {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

  const isPasswordMatched = await bcrypt.compare(payload.oldPassword, user.password);

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Your old password is incorrect");
  }

  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return null;
};

export const authService = {
  registerUser,
  loginUser,
  refreshToken,
  getMe,
  changePassword,
};
