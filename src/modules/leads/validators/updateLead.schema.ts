import { z } from "zod";
import { LeadStages } from "../constants/stage.constants";

export const updateLeadSchema = z.object({
  name: z.string().min(1).optional(),
  company: z.string().optional(),
  phone: z.string().min(1).optional(),
  email: z.string().email("Invalid email format").optional(),
  source: z.string().min(1).optional(),
  assigned_to: z.string().optional(),
  stage: z.nativeEnum(LeadStages).optional()
});

export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
