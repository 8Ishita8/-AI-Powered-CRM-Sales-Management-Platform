import { Pool, QueryResult } from 'pg';
import env from './env';
import logger from '../utils/logger';

// Instantiate the Postgres connection pool
const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: env.NODE_ENV === 'production' ? 20 : 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Attach event listener for new database clients
pool.on('connect', () => {
  logger.debug('PostgreSQL database pool allocated a new client connection');
});

// Attach event listener for pool errors
pool.on('error', (err) => {
  logger.error('Unexpected error from idle PostgreSQL client connection pool', {
    message: err.message,
    stack: err.stack,
  });
});

/**
 * Executes a parameterized SQL query against the pool.
 * Wraps calls to audit timing and record failures.
 */
export const query = async (text: string, params?: any[]): Promise<QueryResult> => {
  const startTime = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - startTime;
    logger.debug(`SQL Query completed: ${duration}ms`, {
      text,
      rowsAffected: res.rowCount,
    });
    return res;
  } catch (error: any) {
    const duration = Date.now() - startTime;
    logger.error(`SQL Query failed after ${duration}ms: ${error.message}`, {
      text,
      errorStack: error.stack,
    });
    throw error;
  }
};

export default pool;
