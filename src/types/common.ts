export interface PaginationData<T> {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  data: T[];
}

export interface PaginatedResponse<T> {
  pagination: PaginationData<T>;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}
