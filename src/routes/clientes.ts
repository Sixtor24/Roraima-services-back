import { Router } from 'express';
import { clienteController } from '../controllers/cliente.controller';
import { asyncHandler } from '../helpers/asyncHandler';
import { validate } from '../middlewares/validate';
import { createClienteSchema } from '../validators/cliente.validator';

export const clientesRouter = Router();

clientesRouter.get('/', asyncHandler(clienteController.getAll));
clientesRouter.post('/', validate(createClienteSchema), asyncHandler(clienteController.create));
