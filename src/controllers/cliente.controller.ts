import { Request, Response } from 'express';
import { clienteService } from '../services/cliente.service';

export class ClienteController {
  async getAll(req: Request, res: Response) {
    const { cedula } = req.query;

    if (cedula && typeof cedula === 'string') {
      const cliente = await clienteService.findByCedula(cedula);
      res.json(cliente);
      return;
    }

    const clientes = await clienteService.findAll();
    res.json(clientes);
  }

  async create(req: Request, res: Response) {
    const cliente = await clienteService.create(req.body);
    res.status(201).json(cliente);
  }
}

export const clienteController = new ClienteController();
