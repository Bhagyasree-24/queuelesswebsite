import cors from 'cors';
import express from 'express';
import healthRoutes from './routes/health.routes.js';
import userRoutes from './routes/user.routes.js';

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  }),
);
app.use(express.json());

app.use('/api/health', healthRoutes);
app.use('/api/users', userRoutes);

export default app;
