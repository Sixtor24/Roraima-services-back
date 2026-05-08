import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const vehiculos = [
  { marca: 'Mitsubishi', tipo: 'Sedan', ano: 2015, modelo: 'Lancer', color: 'Gris', placa: 'AC3BD1R', serialMotor: '4A91-BK4567', kilometrajeActual: 237428 },
  { marca: 'Hyundai', tipo: 'Sedan', ano: 2006, modelo: 'Accent', color: 'Gris', placa: 'AB456CD', serialMotor: 'G4ED-HY2006', kilometrajeActual: 189340 },
  { marca: 'Toyota', tipo: 'Sedan', ano: 2007, modelo: 'Yaris', color: 'Negro', placa: 'AC789EF', serialMotor: '2NZ-FE-TY07', kilometrajeActual: 210567 },
  { marca: 'Chevrolet', tipo: 'Sedan', ano: 2011, modelo: 'Aveo', color: 'Blanco', placa: 'AD012GH', serialMotor: 'F16D3-CV11', kilometrajeActual: 175892 },
  { marca: 'Ford', tipo: 'Sedan', ano: 2008, modelo: 'Fiesta', color: 'Rojo', placa: 'AE345IJ', serialMotor: 'FYJA-FD08', kilometrajeActual: 198234 },
  { marca: 'Kia', tipo: 'Sedan', ano: 2014, modelo: 'Rio', color: 'Azul', placa: 'AF678KL', serialMotor: 'G4FA-KR14', kilometrajeActual: 156780 },
  { marca: 'Nissan', tipo: 'Sedan', ano: 2009, modelo: 'Tiida', color: 'Plata', placa: 'AG901MN', serialMotor: 'HR16DE-NT09', kilometrajeActual: 223456 },
  { marca: 'Toyota', tipo: 'Camioneta', ano: 2018, modelo: 'Hilux', color: 'Blanco', placa: 'AH234OP', serialMotor: '2GD-FTV-TH18', kilometrajeActual: 142300 },
  { marca: 'Chevrolet', tipo: 'Camioneta', ano: 2012, modelo: 'Luv D-Max', color: 'Negro', placa: 'AI567QR', serialMotor: '4JH1-CVL12', kilometrajeActual: 267890 },
  { marca: 'Toyota', tipo: 'SUV', ano: 2016, modelo: 'Fortuner', color: 'Gris', placa: 'AJ890ST', serialMotor: '2TR-FE-TF16', kilometrajeActual: 185670 },
  { marca: 'Chevrolet', tipo: 'Hatch Back', ano: 2010, modelo: 'Spark', color: 'Amarillo', placa: 'AK123UV', serialMotor: 'B10S1-CS10', kilometrajeActual: 134560 },
];

async function main() {
  console.log('🌱 Iniciando seed de vehículos...');

  const count = await prisma.vehiculo.count();
  if (count > 0) {
    console.log(`⚠️  Ya existen ${count} vehículos. Saltando seed.`);
    return;
  }

  for (const v of vehiculos) {
    const created = await prisma.vehiculo.create({ data: v });
    console.log(`  ✅ ${created.marca} ${created.modelo} (${created.placa})`);
  }

  console.log(`\n🎉 ${vehiculos.length} vehículos insertados correctamente.`);
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
