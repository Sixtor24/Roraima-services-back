import { z } from 'zod';

export const createContratoSchema = z.object({
  body: z.object({
    vehiculoId: z.number({ message: 'vehiculoId es obligatorio y debe ser un número' }).int().positive(),
    cliente: z.object({
      cedula: z.string({ message: 'La cédula del cliente es obligatoria' }).min(1),
      nombreCompleto: z.string({ message: 'El nombre completo es obligatorio' }).min(1),
      direccion: z.string().optional(),
      telefono: z.string().optional(),
      email: z.string().email('Email inválido').optional().or(z.literal('')),
    }),
    fechaInicio: z.string({ message: 'Fecha de inicio es obligatoria' }).min(1),
    fechaFin: z.string({ message: 'Fecha de fin es obligatoria' }).min(1),
    canonDiarioUsd: z.number().positive().optional(),
    depositoUsd: z.number().min(0).optional(),
    kilometrajeInicio: z.number({ message: 'Kilometraje de inicio es obligatorio' }).int().min(0),
  }),
});

export const finalizarContratoSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    kilometrajeFin: z.number({ message: 'El kilometraje final es obligatorio' }).int().min(0),
    observaciones: z.string().optional(),
  }),
});

export const idParamSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});
