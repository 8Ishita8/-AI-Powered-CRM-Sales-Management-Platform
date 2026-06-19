import { z } from "zod";

export const createFollowupSchema = z.object({
  lead_id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid lead_id format"),
  date: z.string().datetime({ message: "Invalid date format, must be ISO-8601 string" }).transform((val) => new Date(val)),
  note: z.string().min(1, "Note is required"),
  status: z.enum(["PENDING", "COMPLETED", "MISSED"]).optional().default("PENDING")
});

export const updateFollowupStatusSchema = z.object({
  status: z.enum(["COMPLETED", "MISSED"], {
    errorMap: () => ({ message: "Status must be either COMPLETED or MISSED" })
  })
});

export type CreateFollowupInput = z.infer<typeof createFollowupSchema>;
export type UpdateFollowupStatusInput = z.infer<typeof updateFollowupStatusSchema>;
