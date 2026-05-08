import express from 'express';
import cors from 'cors';
import path from 'path';
import { vehiculosRouter } from './routes/vehiculos';
import { clientesRouter } from './routes/clientes';
import { contratosRouter } from './routes/contratos';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, '..', 'public')));

// API Routes
app.use('/vehiculos', vehiculosRouter);
app.use('/clientes', clientesRouter);
app.use('/contratos', contratosRouter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve frontend static files in production
const frontendPath = path.join(__dirname, '..', 'client');
app.use(express.static(frontendPath));
app.get('*', (_req, res) => {
  const indexPath = path.join(frontendPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(404).json({ error: 'Not found' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Roraima Services API running on port ${PORT}`);
});

export default app;
