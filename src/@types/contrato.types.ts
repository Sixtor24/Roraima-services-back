export interface CreateContratoDTO {
  vehiculoId: number;
  cliente: {
    cedula: string;
    nombreCompleto: string;
    direccion?: string;
    telefono?: string;
    email?: string;
  };
  fechaInicio: string;
  fechaFin: string;
  canonDiarioUsd?: number;
  depositoUsd?: number;
  kilometrajeInicio: number;
}

export interface FinalizarContratoDTO {
  kilometrajeFin: number;
  observaciones?: string;
}

export interface ContratoResponse {
  id: number;
  vehiculoId: number;
  clienteId: number;
  fechaInicio: Date;
  fechaFin: Date;
  dias: number;
  canonDiarioUsd: number;
  depositoUsd: number;
  kilometrajeInicio: number;
  kilometrajeFin: number | null;
  estado: string;
  observaciones: string | null;
  createdAt: Date;
  vehiculo: {
    id: number;
    marca: string;
    tipo: string;
    modelo: string;
    placa: string;
    color: string;
    serialMotor: string;
  };
  cliente: {
    id: number;
    nombreCompleto: string;
    cedula: string;
    direccion: string | null;
    telefono: string | null;
  };
}
