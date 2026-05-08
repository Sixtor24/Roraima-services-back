import express from 'express';
import cors from 'cors';
import path from 'path';
import { env } from './config/env';
import { vehiculosRouter } from './routes/vehiculos';
import { clientesRouter } from './routes/clientes';
import { contratosRouter } from './routes/contratos';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

// ── Global Middleware ──
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json({ limit: '10mb' }));
app.use('/public', express.static(path.join(__dirname, '..', 'public')));

// ── API Routes ──
app.use('/vehiculos', vehiculosRouter);
app.use('/clientes', clientesRouter);
app.use('/contratos', contratosRouter);

// ── Health Check ──
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', environment: env.NODE_ENV, timestamp: new Date().toISOString() });
});

// ── Serve frontend in production ──
const frontendPath = path.join(__dirname, '..', 'client');
app.use(express.static(frontendPath));
app.get('/{*splat}', (_req, res) => {
  const indexPath = path.join(frontendPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(404).json({ error: 'Not found' });
    }
  });
});

// ── Global Error Handler (must be last) ──
app.use(errorHandler);

// ── Start Server ──
app.listen(env.PORT, () => {
  console.log(`🚀 Roraima Services API running on port ${env.PORT} [${env.NODE_ENV}]`);
});

export default app;
