import dotenv from 'dotenv';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
dotenv.config();

export const db = drizzle(process.env.DATABASE_URL!);


export const connectDB = async () => {
  try {
    await db.execute(sql`SELECT 1`);
    console.log('✅Database connection successful');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
};