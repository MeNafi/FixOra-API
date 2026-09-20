export interface IUserQuery {
  searchTerm?: string;
  role?: string;
  activeStatus?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface IAdminBookingQuery {
  status?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface IUpdateUserStatus {
  activeStatus: "ACTIVE" | "BLOCKED";
}

export interface IVerifyTechnician {
  isVerified: boolean;
}

export interface ICreateAdmin {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

export interface IAdminLogin {
  email: string;
  password: string;
}