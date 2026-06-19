import mongoose from 'mongoose';
import env from './env';
import logger from '../utils/logger';

/**
 * Connect to MongoDB database
 */
export async function connectDB(): Promise<void> {
  const mongoUri = env.MONGO_URI;

  try {
    mongoose.set('strictQuery', true);

    mongoose.connection.on('connected', () => {
      logger.info('MongoDB database connection successfully established.');
    });

    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB connection encountered an error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected from database.');
    });

    await mongoose.connect(mongoUri);
  } catch (error) {
    logger.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

export const connectDatabase = connectDB;

/**
 * Disconnect from MongoDB database
 */
export async function disconnectDB(): Promise<void> {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB database disconnected successfully.');
  } catch (error) {
    logger.error('Error disconnecting MongoDB:', error);
  }
}

export const disconnectDatabase = disconnectDB;

export default mongoose;
