export interface ICreateService {
  title: string;
  description?: string;
  price: number;
  durationMin?: number;
  categoryId: string;
  isActive?: boolean;
}

export interface IUpdateService {
  title?: string;
  description?: string;
  price?: number;
  durationMin?: number;
  categoryId?: string;
  isActive?: boolean;
}

export interface IServiceQuery {
  searchTerm?: string;
  categoryId?: string;
  category?: string;
  location?: string;
  minPrice?: string;
  maxPrice?: string;
  minRating?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
}
