export interface ClienteResponse {
  id: number;
  nombreCompleto: string;
  cedula: string;
  direccion: string | null;
  telefono: string | null;
  email: string | null;
  createdAt: Date;
}

export interface CreateClienteDTO {
  nombreCompleto: string;
  cedula: string;
  direccion?: string;
  telefono?: string;
  email?: string;
}
