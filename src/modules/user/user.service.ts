import { prisma } from "../../lib/prisma";
import { IUpdateProfilePayload } from "./user.interface";

// the logged-in user's own account, with the technician profile attached when relevant
const getMyProfileFromDB = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    omit: { password: true },
    include: {
      technicianProfile: {
        include: {
          services: { include: { category: true } },
          availabilities: { orderBy: { startTime: "asc" } },
        },
      },
    },
  });

  return user;
};

// only safe, self-editable fields are accepted here - role and activeStatus are admin territory
const updateMyProfileInDB = async (userId: string, payload: IUpdateProfilePayload) => {
  const { name, phone, address, profilePhoto } = payload;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { name, phone, address, profilePhoto },
    omit: { password: true },
    include: { technicianProfile: true },
  });

  return updatedUser;
};

export const userService = {
  getMyProfileFromDB,
  updateMyProfileInDB,
};
