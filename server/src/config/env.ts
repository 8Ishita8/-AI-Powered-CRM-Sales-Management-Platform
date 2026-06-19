import { z } from 'zod';
import dotenv from 'dotenv';

// Load dotenv configuration
dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  JWT_SECRET: z
    .string()
    .min(1, 'JWT_SECRET is missing or empty.'),
  JWT_EXPIRES_IN: z.string().default('1h'),
  DATABASE_URL: z
    .string()
    .min(1, 'DATABASE_URL connection string is missing.')
    .url('DATABASE_URL must be a valid connection URL schema.'),
  REDIS_URL: z
    .string()
    .min(1, 'REDIS_URL connection string is missing.')
    .url('REDIS_URL must be a valid connection URL schema.'),
});

const parseEnvironment = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      console.error('\n========================================================');
      console.error('❌ FATAL BOOT ERROR: Environment Configuration Invalid');
      console.error('========================================================');
      error.issues.forEach((issue) => {
        console.error(`  - Property "${issue.path.join('.')}" : ${issue.message}`);
      });
      console.error('========================================================\n');
    } else {
      console.error('Fatal error parsing process environment:', error);
    }
    process.exit(1);
  }
};

export const env = parseEnvironment();
export default env;
