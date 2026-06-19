import { z } from "zod";

export const createLeadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  company: z.string().optional(),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email format"),
  source: z.string().min(1, "Source is required"),
  assigned_to: z.string().optional(),
  team_id: z.string().optional()
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
