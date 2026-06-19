import { z } from "zod";

export const assignLeadSchema = z.object({
  assigned_to: z.string().min(1, "assigned_to is required")
});

export type AssignLeadInput = z.infer<typeof assignLeadSchema>;
