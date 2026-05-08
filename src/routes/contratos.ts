import { Router } from 'express';
import { contratoController } from '../controllers/contrato.controller';
import { asyncHandler } from '../helpers/asyncHandler';
import { validate } from '../middlewares/validate';
import { createContratoSchema, finalizarContratoSchema } from '../validators/contrato.validator';

export const contratosRouter = Router();

contratosRouter.post('/', validate(createContratoSchema), asyncHandler(contratoController.create));
contratosRouter.get('/activos', asyncHandler(contratoController.getActivos));
contratosRouter.get('/', asyncHandler(contratoController.getAll));
contratosRouter.get('/:id/pdf', asyncHandler(contratoController.getPdf));
contratosRouter.get('/:id', asyncHandler(contratoController.getById));
contratosRouter.patch('/:id/finalizar', validate(finalizarContratoSchema), asyncHandler(contratoController.finalizar));
