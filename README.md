# Roraima Services Backend

API REST para gestión de contratos de arrendamiento de vehículos.

## Stack

- **Runtime**: Node.js 20+
- **Framework**: Express 5 (TypeScript)
- **ORM**: Prisma 6
- **Base de datos**: PostgreSQL (Railway)
- **PDF**: Puppeteer

## Configuración Local

### 1. Instalar dependencias

```bash
npm install
```

### 2. Variables de entorno

Copia `.env.example` a `.env` y configura:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/roraima_services?schema=public"
PORT=3001
```

### 3. Migraciones y seed

```bash
npx prisma migrate dev --name init
npm run seed
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

El servidor estará en `http://localhost:3001`.

### 5. Logo para PDFs

Coloca el logo en `public/logo-pdf.png`. Si no existe, el PDF mostrará el nombre de la empresa en texto.

## Endpoints API

| Método | Ruta                        | Descripción                         |
| ------ | --------------------------- | ----------------------------------- |
| GET    | `/vehiculos`                | Lista todos los vehículos           |
| GET    | `/vehiculos/:id`            | Detalle de un vehículo              |
| GET    | `/clientes?cedula=...`      | Buscar cliente por cédula           |
| POST   | `/clientes`                 | Crear nuevo cliente                 |
| POST   | `/contratos`                | Crear contrato + cliente            |
| GET    | `/contratos`                | Listar todos los contratos          |
| GET    | `/contratos/activos`        | Listar contratos activos            |
| GET    | `/contratos/:id`            | Detalle de un contrato              |
| PATCH  | `/contratos/:id/finalizar`  | Finalizar contrato                  |
| GET    | `/contratos/:id/pdf`        | Generar/descargar PDF del contrato  |
| GET    | `/health`                   | Health check                        |

## Deploy en Railway

1. Conectar el repo a Railway
2. Agregar servicio PostgreSQL
3. Configurar variable `DATABASE_URL` (Railway la provee automáticamente)
4. El `Dockerfile` maneja build, migraciones y seed automáticamente

## Estructura

```
src/
├── index.ts              # Entry point Express
├── seed.ts               # Seed de vehículos
├── lib/
│   └── prisma.ts         # Prisma client instance
├── routes/
│   ├── vehiculos.ts      # CRUD vehículos
│   ├── clientes.ts       # CRUD clientes
│   └── contratos.ts      # CRUD contratos + PDF
└── services/
    └── pdfService.ts     # Generación de PDF con Puppeteer
```
