import { Request, Response, NextFunction } from 'express';
import { ZodType, ZodError } from 'zod';
import { ValidationError } from '../helpers/errors';

export const validate = (schema: ZodType) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.issues.map((e) => ({
          field: e.path.map(String).join('.'),
          message: e.message,
        }));
        next(new ValidationError('Error de validación', details));
      } else {
        next(error);
      }
    }
  };
};
