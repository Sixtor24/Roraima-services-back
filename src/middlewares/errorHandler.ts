import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../helpers/errors';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      ...(err instanceof ValidationError && err.details ? { details: err.details } : {}),
    });
    return;
  }

  console.error('Unhandled error:', err);

  const message = process.env.NODE_ENV === 'production'
    ? 'Error interno del servidor'
    : err.message;

  res.status(500).json({ status: 'error', message });
};
