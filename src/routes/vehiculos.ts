import { Router } from 'express';
import { vehiculoController } from '../controllers/vehiculo.controller';
import { asyncHandler } from '../helpers/asyncHandler';

export const vehiculosRouter = Router();

vehiculosRouter.get('/', asyncHandler(vehiculoController.getAll));
vehiculosRouter.post('/', asyncHandler(vehiculoController.create));
vehiculosRouter.get('/:id', asyncHandler(vehiculoController.getById));
