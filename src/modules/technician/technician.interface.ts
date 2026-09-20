import { WeekDay } from "../../../generated/prisma/enums";

export interface IUpdateTechnicianProfile {
  bio?: string;
  skills?: string[];
  experienceYears?: number;
  hourlyRate?: number;
  location?: string;
  nidNumber?: string;
  isAvailable?: boolean;
}

export interface IAvailabilitySlot {
  dayOfWeek: WeekDay;
  startTime: string;
  endTime: string;
  isActive?: boolean;
}

export interface IUpdateAvailability {
  slots: IAvailabilitySlot[];
}

export interface ITechnicianQuery {
  searchTerm?: string;
  skill?: string;
  location?: string;
  minRating?: string;
  minRate?: string;
  maxRate?: string;
  isAvailable?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface IUpdateBookingStatus {
  status: "ACCEPTED" | "DECLINED" | "IN_PROGRESS" | "COMPLETED";
  reason?: string;
}
