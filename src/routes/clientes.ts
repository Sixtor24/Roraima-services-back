import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const clientesRouter = Router();

// GET /clientes?cedula=... - Buscar cliente por cédula
clientesRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { cedula } = req.query;

    if (cedula && typeof cedula === 'string') {
      const cliente = await prisma.cliente.findUnique({
        where: { cedula },
      });
      if (!cliente) {
        res.status(404).json({ error: 'Cliente no encontrado' });
        return;
      }
      res.json(cliente);
      return;
    }

    const clientes = await prisma.cliente.findMany({
      orderBy: { nombreCompleto: 'asc' },
    });
    res.json(clientes);
  } catch (error) {
    console.error('Error al buscar cliente:', error);
    res.status(500).json({ error: 'Error al buscar cliente' });
  }
});

// POST /clientes - Crear nuevo cliente
clientesRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { nombreCompleto, cedula, direccion, telefono, email } = req.body;

    if (!nombreCompleto || !cedula) {
      res.status(400).json({ error: 'Nombre completo y cédula son obligatorios' });
      return;
    }

    const existing = await prisma.cliente.findUnique({ where: { cedula } });
    if (existing) {
      res.status(409).json({ error: 'Ya existe un cliente con esa cédula', cliente: existing });
      return;
    }

    const cliente = await prisma.cliente.create({
      data: { nombreCompleto, cedula, direccion, telefono, email },
    });
    res.status(201).json(cliente);
  } catch (error) {
    console.error('Error al crear cliente:', error);
    res.status(500).json({ error: 'Error al crear cliente' });
  }
});
