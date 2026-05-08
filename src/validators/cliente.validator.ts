import { z } from 'zod';

export const createClienteSchema = z.object({
  body: z.object({
    nombreCompleto: z.string({ message: 'Nombre completo es obligatorio' }).min(1),
    cedula: z.string({ message: 'Cédula es obligatoria' }).min(1),
    direccion: z.string().optional(),
    telefono: z.string().optional(),
    email: z.string().email('Email inválido').optional().or(z.literal('')),
  }),
});

export const cedulaQuerySchema = z.object({
  query: z.object({
    cedula: z.string().optional(),
  }),
});
