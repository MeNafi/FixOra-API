import { Role } from "../../generated/prisma/enums";

export interface ILoginUser {
  email: string;
  password: string;
}

export interface IRegisterUser {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  profilePhoto?: string;
  role?: Role;

  // technician-only optional fields, used to seed the profile at registration
  bio?: string;
  skills?: string[];
  experienceYears?: number;
  hourlyRate?: number;
  location?: string;
}

export interface IChangePassword {
  oldPassword: string;
  newPassword: string;
}
