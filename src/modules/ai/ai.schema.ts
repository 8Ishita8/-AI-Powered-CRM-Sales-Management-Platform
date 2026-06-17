import { z } from 'zod';

// Lead Analysis Schema for validating Gemini response
export const LeadAnalysisSchema = z.object({
  conversion_score: z.number().min(0).max(100),
  probability_class: z.string().trim().min(1),
  next_best_action: z.string().trim().min(1),
  summary: z.string().trim().min(1),
});

// TypeScript type inference
export type LeadAnalysisResult = z.infer<typeof LeadAnalysisSchema>;

// Email Generation Schema for validating Gemini response
export const EmailGenerationSchema = z.object({
  subject: z.string().trim().min(1),
  body_html: z.string().trim().min(1),
});

// TypeScript type inference
export type EmailGenerationResult = z.infer<typeof EmailGenerationSchema>;
