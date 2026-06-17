import { ClientSession } from "mongoose";
import { LeadModel } from "../../modules/leads/models/lead.model";

/**
 * Centralized utility to update a lead's last_activity_at timestamp.
 */
export const updateLastActivity = async (
  leadId: string,
  date: Date = new Date(),
  session?: ClientSession
): Promise<void> => {
  await LeadModel.findByIdAndUpdate(
    leadId,
    { last_activity_at: date },
    { session, new: true }
  ).exec();
};
