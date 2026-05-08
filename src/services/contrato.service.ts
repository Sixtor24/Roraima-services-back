import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { NotFoundError, ValidationError } from '../helpers/errors';
import { clienteService } from './cliente.service';
import { DEFAULTS, VEHICULO_ESTADOS } from '../config/constants';
import type { CreateContratoDTO, FinalizarContratoDTO } from '../@types';

const contratoIncludes = { vehiculo: true, cliente: true } as const;

export class ContratoService {
  async create(data: CreateContratoDTO) {
    const {
      vehiculoId,
      cliente: clienteData,
      fechaInicio,
      fechaFin,
      canonDiarioUsd = DEFAULTS.CANON_DIARIO_USD,
      depositoUsd = DEFAULTS.DEPOSITO_USD,
      kilometrajeInicio,
    } = data;

    const vehiculo = await prisma.vehiculo.findUnique({ where: { id: vehiculoId } });
    if (!vehiculo) {
      throw new NotFoundError('Vehículo no encontrado');
    }

    if (vehiculo.estado === VEHICULO_ESTADOS.ALQUILADO) {
      throw new ValidationError('Este vehículo ya está alquilado');
    }

    if (kilometrajeInicio < vehiculo.kilometrajeActual) {
      throw new ValidationError(
        `El kilometraje de inicio (${kilometrajeInicio}) no puede ser menor al actual del vehículo (${vehiculo.kilometrajeActual})`,
      );
    }

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const dias = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));

    if (dias <= 0) {
      throw new ValidationError('La fecha fin debe ser posterior a la fecha inicio');
    }

    const cliente = await clienteService.findOrCreate(clienteData);

    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const contrato = await tx.contrato.create({
        data: {
          vehiculoId,
          clienteId: cliente.id,
          fechaInicio: inicio,
          fechaFin: fin,
          dias,
          canonDiarioUsd,
          depositoUsd,
          kilometrajeInicio,
          estado: 'activo',
        },
        include: contratoIncludes,
      });

      await tx.vehiculo.update({
        where: { id: vehiculoId },
        data: {
          kilometrajeActual: kilometrajeInicio,
          estado: VEHICULO_ESTADOS.ALQUILADO,
        },
      });

      return contrato;
    });
  }

  async findAll() {
    return prisma.contrato.findMany({
      include: contratoIncludes,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findActivos() {
    return prisma.contrato.findMany({
      where: { estado: 'activo' },
      include: contratoIncludes,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: number) {
    const contrato = await prisma.contrato.findUnique({
      where: { id },
      include: contratoIncludes,
    });
    if (!contrato) {
      throw new NotFoundError('Contrato no encontrado');
    }
    return contrato;
  }

  async finalizar(id: number, data: FinalizarContratoDTO) {
    const contrato = await prisma.contrato.findUnique({
      where: { id },
      include: { vehiculo: true },
    });

    if (!contrato) {
      throw new NotFoundError('Contrato no encontrado');
    }

    if (contrato.estado === 'finalizado') {
      throw new ValidationError('Este contrato ya fue finalizado');
    }

    if (data.kilometrajeFin < contrato.kilometrajeInicio) {
      throw new ValidationError(
        `El kilometraje final (${data.kilometrajeFin}) no puede ser menor al de inicio (${contrato.kilometrajeInicio})`,
      );
    }

    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const updated = await tx.contrato.update({
        where: { id },
        data: {
          kilometrajeFin: data.kilometrajeFin,
          observaciones: data.observaciones || null,
          estado: 'finalizado',
        },
        include: contratoIncludes,
      });

      await tx.vehiculo.update({
        where: { id: contrato.vehiculoId },
        data: {
          kilometrajeActual: data.kilometrajeFin,
          estado: VEHICULO_ESTADOS.DISPONIBLE,
        },
      });

      return updated;
    });
  }
}

export const contratoService = new ContratoService();
