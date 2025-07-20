import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRouter from './routes/authRoute.js';
import { createJWTService } from '@lms/shared/jwt';
import { connectDB } from './config/db.js';

dotenv.config();

const app = express();

//cors options
const corsOptions = {
  origin: ['http://localhost:4002'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

//
const PORT = process.env.PORT || 4001;
const JWT_SECRET = process.env.JWT_SECRET!;

//cors options
app.use(cors(corsOptions));

// middleware to parse json data
app.use(express.json());

// JWT Service
export const jwtService = createJWTService(JWT_SECRET);

// Routes
app.use('/api/v1/auth', authRouter);

// Start the server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`⚡️Auth Service listening at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }

};
startServer().then( ()=> {
  console.log('Server started');
});
