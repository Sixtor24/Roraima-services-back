import { Request, Response } from 'express';
import { vehiculoService } from '../services/vehiculo.service';

export class VehiculoController {
  async getAll(_req: Request, res: Response) {
    const vehiculos = await vehiculoService.findAll();
    res.json(vehiculos);
  }

  async getById(req: Request, res: Response) {
    const vehiculo = await vehiculoService.findById(Number(req.params.id));
    res.json(vehiculo);
  }

  async create(req: Request, res: Response) {
    const vehiculo = await vehiculoService.create(req.body);
    res.status(201).json(vehiculo);
  }
}

export const vehiculoController = new VehiculoController();
