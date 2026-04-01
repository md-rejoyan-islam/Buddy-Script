import { Response } from 'express';

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T | null;
  pagination?: Pagination;
}

export const sendSuccessResponse = <T>(
  res: Response,
  options: {
    statusCode?: number;
    message: string;
    data?: T | null;
    pagination?: Pagination;
  }
): Response<SuccessResponse<T>> => {
  const { statusCode = 200, message, data = null, pagination } = options;

  const response: SuccessResponse<T> = {
    success: true,
    message,
    data,
  };

  if (pagination) {
    response.pagination = pagination;
  }

  return res.status(statusCode).json(response);
};
