import { z } from "zod";

export const createCallSchema = z.object({
  duration: z.number().positive("Duration must be a positive number"),
  summary: z.string().min(1, "Summary is required"),
  time: z.string().datetime({ message: "Invalid date format, must be ISO-8601 string" }).transform((val) => new Date(val))
});

export type CreateCallInput = z.infer<typeof createCallSchema>;
