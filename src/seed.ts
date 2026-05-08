import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const vehiculos = [
  {
    marca: 'Mitsubishi', tipo: 'Sedan', ano: 2015, modelo: 'Lancer', color: 'Gris',
    placa: 'AC3BD1R', serialMotor: '4A91-BK4567', kilometrajeActual: 237428,
    estado: 'disponible', precioPorDia: 45, transmision: 'Manual', asientos: 5,
    tipoCombustible: 'Gasolina', descripcion: 'Sedán deportivo confiable con buen rendimiento de combustible.',
    velocidadMaxima: '190 km/h', aceleracion: '9.0s (0-100)', autonomia: '600 km',
    caracteristicas: ['Aire Acondicionado', 'Bluetooth', 'Ventanas Eléctricas', 'Radio AM/FM'],
  },
  {
    marca: 'Hyundai', tipo: 'Sedan', ano: 2006, modelo: 'Accent', color: 'Gris',
    placa: 'AB456CD', serialMotor: 'G4ED-HY2006', kilometrajeActual: 189340,
    estado: 'disponible', precioPorDia: 35, transmision: 'Manual', asientos: 5,
    tipoCombustible: 'Gasolina', descripcion: 'Sedán económico ideal para recorridos urbanos.',
    velocidadMaxima: '175 km/h', aceleracion: '10.5s (0-100)', autonomia: '550 km',
    caracteristicas: ['Aire Acondicionado', 'Radio AM/FM', 'Ventanas Eléctricas'],
  },
  {
    marca: 'Toyota', tipo: 'Sedan', ano: 2007, modelo: 'Yaris', color: 'Negro',
    placa: 'AC789EF', serialMotor: '2NZ-FE-TY07', kilometrajeActual: 210567,
    estado: 'disponible', precioPorDia: 40, transmision: 'Automático', asientos: 5,
    tipoCombustible: 'Gasolina', descripcion: 'Compacto eficiente con excelente rendimiento Toyota.',
    velocidadMaxima: '170 km/h', aceleracion: '11.0s (0-100)', autonomia: '620 km',
    caracteristicas: ['Aire Acondicionado', 'Bluetooth', 'Cámara de Reversa', 'Control Crucero'],
  },
  {
    marca: 'Chevrolet', tipo: 'Sedan', ano: 2011, modelo: 'Aveo', color: 'Blanco',
    placa: 'AD012GH', serialMotor: 'F16D3-CV11', kilometrajeActual: 175892,
    estado: 'disponible', precioPorDia: 35, transmision: 'Manual', asientos: 5,
    tipoCombustible: 'Gasolina', descripcion: 'Sedán accesible y práctico para uso diario.',
    velocidadMaxima: '170 km/h', aceleracion: '11.2s (0-100)', autonomia: '580 km',
    caracteristicas: ['Aire Acondicionado', 'Radio AM/FM', 'Ventanas Eléctricas'],
  },
  {
    marca: 'Ford', tipo: 'Sedan', ano: 2008, modelo: 'Fiesta', color: 'Rojo',
    placa: 'AE345IJ', serialMotor: 'FYJA-FD08', kilometrajeActual: 198234,
    estado: 'mantenimiento', precioPorDia: 38, transmision: 'Manual', asientos: 5,
    tipoCombustible: 'Gasolina', descripcion: 'Ágil y divertido de conducir. Compacto y eficiente.',
    velocidadMaxima: '185 km/h', aceleracion: '10.0s (0-100)', autonomia: '560 km',
    caracteristicas: ['Aire Acondicionado', 'Bluetooth', 'SYNC', 'Ventanas Eléctricas'],
  },
  {
    marca: 'Kia', tipo: 'Sedan', ano: 2014, modelo: 'Rio', color: 'Azul',
    placa: 'AF678KL', serialMotor: 'G4FA-KR14', kilometrajeActual: 156780,
    estado: 'disponible', precioPorDia: 42, transmision: 'Automático', asientos: 5,
    tipoCombustible: 'Gasolina', descripcion: 'Sedán moderno con buen equipamiento de serie.',
    velocidadMaxima: '185 km/h', aceleracion: '9.8s (0-100)', autonomia: '600 km',
    caracteristicas: ['Aire Acondicionado', 'Bluetooth', 'Cámara de Reversa', 'Pantalla Táctil', 'Ventanas Eléctricas'],
  },
  {
    marca: 'Nissan', tipo: 'Sedan', ano: 2009, modelo: 'Tiida', color: 'Plata',
    placa: 'AG901MN', serialMotor: 'HR16DE-NT09', kilometrajeActual: 223456,
    estado: 'disponible', precioPorDia: 38, transmision: 'Automático', asientos: 5,
    tipoCombustible: 'Gasolina', descripcion: 'Espacioso y cómodo para viajes largos.',
    velocidadMaxima: '180 km/h', aceleracion: '10.2s (0-100)', autonomia: '620 km',
    caracteristicas: ['Aire Acondicionado', 'Bluetooth', 'Ventanas Eléctricas', 'Baúl Espacioso'],
  },
  {
    marca: 'Toyota', tipo: 'Camioneta', ano: 2018, modelo: 'Hilux', color: 'Blanco',
    placa: 'AH234OP', serialMotor: '2GD-FTV-TH18', kilometrajeActual: 142300,
    estado: 'disponible', precioPorDia: 80, transmision: 'Automático', asientos: 5,
    tipoCombustible: 'Diesel', descripcion: 'La camioneta más resistente del mercado. Ideal para rutas exigentes.',
    velocidadMaxima: '170 km/h', aceleracion: '10.1s (0-100)', autonomia: '700 km',
    caracteristicas: ['Aire Acondicionado', 'Bluetooth', 'Tracción 4x4', 'Control de Estabilidad', 'Frenos ABS'],
  },
  {
    marca: 'Chevrolet', tipo: 'Camioneta', ano: 2012, modelo: 'Luv D-Max', color: 'Negro',
    placa: 'AI567QR', serialMotor: '4JH1-CVL12', kilometrajeActual: 267890,
    estado: 'disponible', precioPorDia: 70, transmision: 'Manual', asientos: 5,
    tipoCombustible: 'Diesel', descripcion: 'Camioneta robusta para trabajo pesado y todo terreno.',
    velocidadMaxima: '165 km/h', aceleracion: '11.5s (0-100)', autonomia: '680 km',
    caracteristicas: ['Aire Acondicionado', 'Radio AM/FM', 'Tracción 4x4', 'Frenos ABS'],
  },
  {
    marca: 'Toyota', tipo: 'SUV', ano: 2016, modelo: 'Fortuner', color: 'Gris',
    placa: 'AJ890ST', serialMotor: '2TR-FE-TF16', kilometrajeActual: 185670,
    estado: 'disponible', precioPorDia: 120, transmision: 'Automático', asientos: 7,
    tipoCombustible: 'Diesel', descripcion: 'SUV premium con espacio, potencia y lujo para familias grandes.',
    velocidadMaxima: '175 km/h', aceleracion: '9.8s (0-100)', autonomia: '750 km',
    caracteristicas: ['Aire Acondicionado', 'Bluetooth', 'Cámara 360°', 'Tracción 4x4', '7 Asientos', 'Pantalla Táctil', 'Puertos USB'],
  },
  {
    marca: 'Chevrolet', tipo: 'Hatch Back', ano: 2010, modelo: 'Spark', color: 'Amarillo',
    placa: 'AK123UV', serialMotor: 'B10S1-CS10', kilometrajeActual: 134560,
    estado: 'no_disponible', precioPorDia: 30, transmision: 'Manual', asientos: 4,
    tipoCombustible: 'Gasolina', descripcion: 'Compacto y económico, ideal para movilidad urbana.',
    velocidadMaxima: '155 km/h', aceleracion: '13.0s (0-100)', autonomia: '500 km',
    caracteristicas: ['Aire Acondicionado', 'Radio AM/FM'],
  },
];

async function main() {
  console.log('🌱 Iniciando seed de vehículos...');

  for (const v of vehiculos) {
    const upserted = await prisma.vehiculo.upsert({
      where: { placa: v.placa },
      update: {
        estado: v.estado,
        precioPorDia: v.precioPorDia,
        transmision: v.transmision,
        asientos: v.asientos,
        tipoCombustible: v.tipoCombustible,
        descripcion: v.descripcion,
        velocidadMaxima: v.velocidadMaxima,
        aceleracion: v.aceleracion,
        autonomia: v.autonomia,
        caracteristicas: v.caracteristicas,
      },
      create: v,
    });
    console.log(`  ✅ ${upserted.marca} ${upserted.modelo} (${upserted.placa})`);
  }

  console.log(`\n🎉 ${vehiculos.length} vehículos sincronizados correctamente.`);
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
