import mongoose from "mongoose";


export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅Connected to MongoDB');
  } catch (error) {
    console.log(error);
    throw error;
  }
};
