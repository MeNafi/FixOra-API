export interface ICreatePayment {
  bookingId: string;
}

export interface IConfirmPayment {
  sessionId?: string;
  transactionId?: string;
}

export interface IPaymentQuery {
  status?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
}
