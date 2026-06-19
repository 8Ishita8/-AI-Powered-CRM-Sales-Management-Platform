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
  MONGO_URI: z
    .string()
    .min(1, 'MONGO_URI connection string is missing.'),
  REDIS_URL: z
    .string()
    .min(1, 'REDIS_URL connection string is missing.'),
  GEMINI_API_KEY: z
    .string()
    .min(1, 'GEMINI_API_KEY is missing or empty.'),
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
