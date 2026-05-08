import { prisma } from '../lib/prisma';
import { NotFoundError, ConflictError } from '../helpers/errors';
import type { CreateClienteDTO } from '../@types';

export class ClienteService {
  async findAll() {
    return prisma.cliente.findMany({ orderBy: { nombreCompleto: 'asc' } });
  }

  async findByCedula(cedula: string) {
    const cliente = await prisma.cliente.findUnique({ where: { cedula } });
    if (!cliente) {
      throw new NotFoundError('Cliente no encontrado');
    }
    return cliente;
  }

  async create(data: CreateClienteDTO) {
    const existing = await prisma.cliente.findUnique({ where: { cedula: data.cedula } });
    if (existing) {
      throw new ConflictError('Ya existe un cliente con esa cédula');
    }

    return prisma.cliente.create({
      data: {
        nombreCompleto: data.nombreCompleto,
        cedula: data.cedula,
        direccion: data.direccion || null,
        telefono: data.telefono || null,
        email: data.email || null,
      },
    });
  }

  async findOrCreate(data: CreateClienteDTO) {
    const existing = await prisma.cliente.findUnique({ where: { cedula: data.cedula } });
    if (existing) return existing;

    return prisma.cliente.create({
      data: {
        nombreCompleto: data.nombreCompleto,
        cedula: data.cedula,
        direccion: data.direccion || null,
        telefono: data.telefono || null,
        email: data.email || null,
      },
    });
  }
}

export const clienteService = new ClienteService();
