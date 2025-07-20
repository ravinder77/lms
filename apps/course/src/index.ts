import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './db/index.js';
import courseRouter from './routes/courseRoute.js';
import { createJWTService } from '@lms/shared/jwt';
import { errorMiddleware } from './middleware/errorMiddleware.js';

dotenv.config();
const app = express();

const PORT = process.env.PORT || 4002;
const JWT_SECRET = process.env.JWT_SECRET!;

// cors options
const corsOptions = {
  origin: ['http://localhost:4000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use(express.json());

export const jwtService = createJWTService(JWT_SECRET);

app.use('/api/v1/courses', courseRouter);

// error middleware
app.use(errorMiddleware);

app.listen(PORT, async () => {
  console.log(`⚡️Course Service is running on port ${PORT}`);
  await connectDB();
});
