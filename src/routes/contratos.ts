import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';
import { generateContratoPdf } from '../services/pdfService';

export const contratosRouter = Router();

// POST /contratos - Crear contrato (+ cliente si es nuevo)
contratosRouter.post('/', async (req: Request, res: Response) => {
  try {
    const {
      vehiculoId,
      cliente: clienteData,
      fechaInicio,
      fechaFin,
      canonDiarioUsd = 140,
      depositoUsd = 200,
      kilometrajeInicio,
    } = req.body;

    // Validaciones básicas
    if (!vehiculoId || !clienteData?.cedula || !clienteData?.nombreCompleto || !fechaInicio || !fechaFin || kilometrajeInicio === undefined) {
      res.status(400).json({ error: 'Faltan campos obligatorios: vehiculoId, cliente (cedula, nombreCompleto), fechaInicio, fechaFin, kilometrajeInicio' });
      return;
    }

    // Verificar vehículo
    const vehiculo = await prisma.vehiculo.findUnique({ where: { id: vehiculoId } });
    if (!vehiculo) {
      res.status(404).json({ error: 'Vehículo no encontrado' });
      return;
    }

    // Validar kilometraje
    if (kilometrajeInicio < vehiculo.kilometrajeActual) {
      res.status(400).json({
        error: `El kilometraje de inicio (${kilometrajeInicio}) no puede ser menor al kilometraje actual del vehículo (${vehiculo.kilometrajeActual})`,
      });
      return;
    }

    // Calcular días
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const diffMs = fin.getTime() - inicio.getTime();
    const dias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (dias <= 0) {
      res.status(400).json({ error: 'La fecha fin debe ser posterior a la fecha inicio' });
      return;
    }

    // Buscar o crear cliente
    let cliente = await prisma.cliente.findUnique({ where: { cedula: clienteData.cedula } });
    if (!cliente) {
      cliente = await prisma.cliente.create({
        data: {
          nombreCompleto: clienteData.nombreCompleto,
          cedula: clienteData.cedula,
          direccion: clienteData.direccion || null,
          telefono: clienteData.telefono || null,
          email: clienteData.email || null,
        },
      });
    }

    // Crear contrato y actualizar kilometraje en transacción
    const contrato = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const newContrato = await tx.contrato.create({
        data: {
          vehiculoId,
          clienteId: cliente!.id,
          fechaInicio: inicio,
          fechaFin: fin,
          dias,
          canonDiarioUsd,
          depositoUsd,
          kilometrajeInicio,
          estado: 'activo',
        },
        include: { vehiculo: true, cliente: true },
      });

      await tx.vehiculo.update({
        where: { id: vehiculoId },
        data: { kilometrajeActual: kilometrajeInicio },
      });

      return newContrato;
    });

    res.status(201).json(contrato);
  } catch (error) {
    console.error('Error al crear contrato:', error);
    res.status(500).json({ error: 'Error al crear contrato' });
  }
});

// GET /contratos/activos - Lista contratos activos
contratosRouter.get('/activos', async (_req: Request, res: Response) => {
  try {
    const contratos = await prisma.contrato.findMany({
      where: { estado: 'activo' },
      include: { vehiculo: true, cliente: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(contratos);
  } catch (error) {
    console.error('Error al obtener contratos activos:', error);
    res.status(500).json({ error: 'Error al obtener contratos activos' });
  }
});

// GET /contratos - Lista todos los contratos
contratosRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const contratos = await prisma.contrato.findMany({
      include: { vehiculo: true, cliente: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(contratos);
  } catch (error) {
    console.error('Error al obtener contratos:', error);
    res.status(500).json({ error: 'Error al obtener contratos' });
  }
});

// PATCH /contratos/:id/finalizar - Finalizar contrato
contratosRouter.patch('/:id/finalizar', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { kilometrajeFin, observaciones } = req.body;

    if (kilometrajeFin === undefined) {
      res.status(400).json({ error: 'El kilometraje final es obligatorio' });
      return;
    }

    const contrato = await prisma.contrato.findUnique({
      where: { id: Number(id) },
      include: { vehiculo: true },
    });

    if (!contrato) {
      res.status(404).json({ error: 'Contrato no encontrado' });
      return;
    }

    if (contrato.estado === 'finalizado') {
      res.status(400).json({ error: 'Este contrato ya fue finalizado' });
      return;
    }

    if (kilometrajeFin < contrato.kilometrajeInicio) {
      res.status(400).json({
        error: `El kilometraje final (${kilometrajeFin}) no puede ser menor al kilometraje de inicio (${contrato.kilometrajeInicio})`,
      });
      return;
    }

    const updated = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const updatedContrato = await tx.contrato.update({
        where: { id: Number(id) },
        data: {
          kilometrajeFin,
          observaciones: observaciones || null,
          estado: 'finalizado',
        },
        include: { vehiculo: true, cliente: true },
      });

      await tx.vehiculo.update({
        where: { id: contrato.vehiculoId },
        data: { kilometrajeActual: kilometrajeFin },
      });

      return updatedContrato;
    });

    res.json(updated);
  } catch (error) {
    console.error('Error al finalizar contrato:', error);
    res.status(500).json({ error: 'Error al finalizar contrato' });
  }
});

// GET /contratos/:id/pdf - Generar PDF del contrato
contratosRouter.get('/:id/pdf', async (req: Request, res: Response) => {
  try {
    const contrato = await prisma.contrato.findUnique({
      where: { id: Number(req.params.id) },
      include: { vehiculo: true, cliente: true },
    });

    if (!contrato) {
      res.status(404).json({ error: 'Contrato no encontrado' });
      return;
    }

    const pdfBuffer = await generateContratoPdf(contrato);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="contrato-${contrato.id}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error al generar PDF:', error);
    res.status(500).json({ error: 'Error al generar PDF del contrato' });
  }
});

// GET /contratos/:id - Detalle de un contrato
contratosRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const contrato = await prisma.contrato.findUnique({
      where: { id: Number(req.params.id) },
      include: { vehiculo: true, cliente: true },
    });
    if (!contrato) {
      res.status(404).json({ error: 'Contrato no encontrado' });
      return;
    }
    res.json(contrato);
  } catch (error) {
    console.error('Error al obtener contrato:', error);
    res.status(500).json({ error: 'Error al obtener contrato' });
  }
});
