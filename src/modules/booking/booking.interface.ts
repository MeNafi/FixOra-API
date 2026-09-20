export interface ICreateBooking {
  serviceId: string;
  scheduledAt: string;
  address: string;
  note?: string;
}

export interface ICancelBooking {
  reason?: string;
}

export interface IBookingQuery {
  status?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
}
