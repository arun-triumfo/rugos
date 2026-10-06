import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { env } from './config/env.js';
import { connectDb } from './config/db.js';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

async function boot() {
  await connectDb();

  const app = express();
  app.use(cors({ origin: env.clientUrl, credentials: true }));
  app.use(express.json({ limit: '2mb' }));
  app.use(morgan('dev'));

  app.get('/', (req, res) => {
    res.json({ ok: true, message: 'RugOS API', docs: '/api/health' });
  });

  app.use('/api', routes);
  app.use(notFound);
  app.use(errorHandler);

  app.listen(env.port, () => {
    console.log(`RugOS API listening on http://localhost:${env.port}`);
  });
}

boot().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
