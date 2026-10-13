import mongoose from 'mongoose';
export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is missing. Add it to Backend/.env or Render environment variables.');
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 12000 });
  console.log(`MongoDB connected (${mongoose.connection.name})`);
}
