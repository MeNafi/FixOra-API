export interface IPaginationOptions {
  page?: string | number;
  limit?: string | number;
  sortBy?: string;
  sortOrder?: string;
}

export interface IPaginationResult {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

// one place to normalise page/limit/sort so every module behaves the same
export const calculatePagination = (
  options: IPaginationOptions,
  defaultSortBy = "createdAt",
): IPaginationResult => {
  const page = Number(options.page) > 0 ? Number(options.page) : 1;
  const rawLimit = Number(options.limit) > 0 ? Number(options.limit) : 10;
  const limit = rawLimit > 100 ? 100 : rawLimit;
  const skip = (page - 1) * limit;

  const sortBy = options.sortBy ? options.sortBy : defaultSortBy;
  const sortOrder = options.sortOrder === "asc" ? "asc" : "desc";

  return { page, limit, skip, sortBy, sortOrder };
};

export const buildMeta = (page: number, limit: number, total: number) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
});
