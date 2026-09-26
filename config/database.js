import mongoose from 'mongoose';

let connected = false;

export function mongoConfigured() {
  const uri = process.env.MONGODB_URI || '';
  return uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://');
}

const connectDB = async () => {
  if (!mongoConfigured()) return false;

  mongoose.set('strictQuery', true);

  if (connected) return true;

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    connected = true;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export default connectDB;
