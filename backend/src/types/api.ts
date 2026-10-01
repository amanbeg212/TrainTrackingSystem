export interface ApiError {
  error: {
    code: string;
    message: string;
    requestId?: string;
    details?: unknown;
  };
}

export interface ApiResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
}
