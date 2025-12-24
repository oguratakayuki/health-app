// 共通のレスポンス型
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SearchParams {
  keyword: string;
  pagination?: PaginationParams;
}

// エラーハンドリング用
export interface RepositoryError {
  code: string;
  message: string;
  details?: unknown;
}

export type Result<T, E = RepositoryError> = 
  | { success: true; data: T }
  | { success: false; error: E };
