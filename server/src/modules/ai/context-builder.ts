import { Types } from 'mongoose';
import { Lead, ILead } from '../../models/lead.model';
import { Activity, IActivity } from '../../models/activity.model';
import { FollowUp, IFollowUp } from '../../models/followup.model';

export interface LeadContext {
  lead: ILead;
  activities: IActivity[];
  followups: IFollowUp[];
}

/**
 * Builds the historical context of a lead, including their profile details,
 * last 5 activities, and last 5 follow-ups.
 * 
 * @param leadId - MongoDB Lead ObjectId as a string
 * @returns Combined LeadContext object
 */
export async function buildLeadContext(leadId: string): Promise<LeadContext> {
  if (!Types.ObjectId.isValid(leadId)) {
    throw new Error(`Invalid Lead ID format: ${leadId}`);
  }

  const leadObjectId = new Types.ObjectId(leadId);

  // 1. Fetch Lead
  const lead = await Lead.findById(leadObjectId);
  if (!lead) {
    throw new Error(`Lead not found with ID: ${leadId}`);
  }

  // 2. Fetch last 5 activities (most recent first)
  const activities = await Activity.find({ $or: [{ leadId: leadObjectId }, { lead_id: leadObjectId }] })
    .sort({ createdAt: -1 })
    .limit(5);

  // 3. Fetch last 5 followups (most recent follow-up date first)
  const followups = await FollowUp.find({ $or: [{ leadId: leadObjectId }, { lead_id: leadObjectId }] })
    .sort({ followUpDate: -1, date: -1 })
    .limit(5);

  return {
    lead,
    activities,
    followups,
  };
}
