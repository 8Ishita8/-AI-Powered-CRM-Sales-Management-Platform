import mongoose from "mongoose";
import { CallRepository } from "../repositories/call.repository";
import { LeadRepository } from "../../leads/repositories/lead.repository";
import { ICallRecord } from "../models/callRecord.model";
import { updateLastActivity } from "../../../shared/utils/activity.helper";
import { runInTransaction } from "../../../shared/utils/transaction.helper";
import { AppError } from "../../../middleware/error.middleware";
import { UserContext } from "../../../shared/types";
import { CreateCallInput } from "../validators/call.validator";

export class CallService {
  private callRepository: CallRepository;
  private leadRepository: LeadRepository;

  constructor() {
    this.callRepository = new CallRepository();
    this.leadRepository = new LeadRepository();
  }

  private checkLeadAccess(lead: any, user: UserContext): void {
    if (user.role === "EXECUTIVE") {
      if (lead.assigned_to !== user.id) {
        throw new AppError("Forbidden: You only have access to your own leads.", 403);
      }
    } else if (user.role === "MANAGER") {
      if (lead.team_id !== user.teamId) {
        throw new AppError("Forbidden: You only have access to leads within your team.", 403);
      }
    }
  }

  public async logCall(
    leadId: string,
    input: CreateCallInput,
    user: UserContext
  ): Promise<ICallRecord> {
    const lead = await this.leadRepository.findById(leadId);
    if (!lead) {
      throw new AppError("Lead not found", 404);
    }

    this.checkLeadAccess(lead, user);

    return runInTransaction(async (session) => {
      const callRecord = await this.callRepository.create(
        {
          lead_id: lead._id as mongoose.Types.ObjectId,
          duration: input.duration,
          summary: input.summary,
          time: input.time
        },
        session
      );

      // Update lead's last activity
      await updateLastActivity(leadId, new Date(), session);

      return callRecord;
    });
  }
}
