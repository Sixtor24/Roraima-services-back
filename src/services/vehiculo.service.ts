import { prisma } from '../lib/prisma';
import { NotFoundError, ConflictError } from '../helpers/errors';

export class VehiculoService {
  async findAll() {
    return prisma.vehiculo.findMany({ orderBy: { id: 'asc' } });
  }

  async create(data: {
    marca: string; tipo: string; ano: number; modelo: string; color: string;
    placa: string; serialMotor: string; kilometrajeActual?: number; estado?: string;
    precioPorDia?: number; transmision?: string; asientos?: number; tipoCombustible?: string;
    imagen?: string; descripcion?: string; velocidadMaxima?: string; aceleracion?: string;
    autonomia?: string; caracteristicas?: string[];
  }) {
    const existing = await prisma.vehiculo.findUnique({ where: { placa: data.placa } });
    if (existing) throw new ConflictError('Ya existe un vehículo con esa placa');
    return prisma.vehiculo.create({ data });
  }

  async findById(id: number) {
    const vehiculo = await prisma.vehiculo.findUnique({
      where: { id },
      include: {
        contratos: {
          include: { cliente: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!vehiculo) {
      throw new NotFoundError('Vehículo no encontrado');
    }

    return vehiculo;
  }
}

export const vehiculoService = new VehiculoService();
