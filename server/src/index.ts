import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';
import convertRouter from './routes/convert.js';
import historyRouter from './routes/history.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use((pinoHttp as any)());

app.use(
  '/api/convert',
  rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
  }),
  convertRouter,
);

app.use('/api/history', historyRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
