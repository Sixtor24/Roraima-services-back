import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const vehiculosRouter = Router();

// GET /vehiculos - Lista todos los vehículos
vehiculosRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const vehiculos = await prisma.vehiculo.findMany({
      orderBy: { id: 'asc' },
      select: {
        id: true,
        marca: true,
        tipo: true,
        ano: true,
        modelo: true,
        color: true,
        placa: true,
        serialMotor: true,
        kilometrajeActual: true,
      },
    });
    res.json(vehiculos);
  } catch (error) {
    console.error('Error al obtener vehículos:', error);
    res.status(500).json({ error: 'Error al obtener vehículos' });
  }
});

// GET /vehiculos/:id - Detalle de un vehículo
vehiculosRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const vehiculo = await prisma.vehiculo.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        contratos: {
          include: { cliente: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
    if (!vehiculo) {
      res.status(404).json({ error: 'Vehículo no encontrado' });
      return;
    }
    res.json(vehiculo);
  } catch (error) {
    console.error('Error al obtener vehículo:', error);
    res.status(500).json({ error: 'Error al obtener vehículo' });
  }
});
