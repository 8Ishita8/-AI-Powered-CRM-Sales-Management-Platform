import mongoose, { ClientSession } from "mongoose";

/**
 * Executes operations in a MongoDB transaction.
 * Automatically falls back to standard execution if the target MongoDB
 * deployment is not configured as a replica set (i.e. standalone dev db).
 */
export const runInTransaction = async <T>(
  work: (session?: ClientSession) => Promise<T>
): Promise<T> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const result = await work(session);
    await session.commitTransaction();
    return result;
  } catch (error: any) {
    await session.abortTransaction();
    if (error.message && error.message.includes("Transaction numbers are only allowed")) {
      console.warn("MongoDB does not support transactions (not a replica set). Falling back to non-transactional execution.");
      return work(undefined);
    }
    throw error;
  } finally {
    session.endSession();
  }
};
