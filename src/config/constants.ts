export const DEFAULTS = {
  CANON_DIARIO_USD: 140,
  DEPOSITO_USD: 200,
} as const;

export const VEHICULO_ESTADOS = {
  DISPONIBLE: 'disponible',
  ALQUILADO: 'alquilado',
  MANTENIMIENTO: 'mantenimiento',
  NO_DISPONIBLE: 'no_disponible',
} as const;

export const CONTRATO_ESTADOS = {
  ACTIVO: 'activo',
  FINALIZADO: 'finalizado',
} as const;

export type VehiculoEstado = typeof VEHICULO_ESTADOS[keyof typeof VEHICULO_ESTADOS];
export type ContratoEstado = typeof CONTRATO_ESTADOS[keyof typeof CONTRATO_ESTADOS];
