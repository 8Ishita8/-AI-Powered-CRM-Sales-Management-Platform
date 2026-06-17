import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 */
export async function connectDatabase(): Promise<void> {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/crm-ai-engine';

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(mongoUri);
    console.log('[Database] MongoDB connected successfully.');
  } catch (error) {
    console.error('[Database] Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

/**
 * Disconnect from MongoDB database
 */
export async function disconnectDatabase(): Promise<void> {
  try {
    await mongoose.disconnect();
    console.log('[Database] MongoDB disconnected successfully.');
  } catch (error) {
    console.error('[Database] Error disconnecting MongoDB:', error);
  }
}
