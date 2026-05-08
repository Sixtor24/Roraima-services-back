export interface VehiculoResponse {
  id: number;
  marca: string;
  tipo: string;
  ano: number;
  modelo: string;
  color: string;
  placa: string;
  serialMotor: string;
  kilometrajeActual: number;
  estado: string;
  precioPorDia: number;
  transmision: string;
  asientos: number;
  tipoCombustible: string;
  imagen: string | null;
  descripcion: string | null;
  velocidadMaxima: string | null;
  aceleracion: string | null;
  autonomia: string | null;
  caracteristicas: string[];
}

export interface VehiculoDetailResponse extends VehiculoResponse {
  contratos: Array<{
    id: number;
    fechaInicio: Date;
    fechaFin: Date;
    estado: string;
    cliente: {
      id: number;
      nombreCompleto: string;
      cedula: string;
    };
  }>;
}
