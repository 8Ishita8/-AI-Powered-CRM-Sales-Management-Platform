import mongoose from "mongoose";
import { FollowupRepository } from "../repositories/followup.repository";
import { LeadRepository } from "../../leads/repositories/lead.repository";
import { IFollowup } from "../models/followup.model";
import { updateLastActivity } from "../../../shared/utils/activity.helper";
import { runInTransaction } from "../../../shared/utils/transaction.helper";
import { AppError } from "../../../middleware/error.middleware";
import { UserContext } from "../../../shared/types";
import { CreateFollowupInput } from "../validators/followup.validator";

export class FollowupService {
  private followupRepository: FollowupRepository;
  private leadRepository: LeadRepository;

  constructor() {
    this.followupRepository = new FollowupRepository();
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

  public async createFollowup(input: CreateFollowupInput, user: UserContext): Promise<IFollowup> {
    const lead = await this.leadRepository.findById(input.lead_id.toString());
    if (!lead) {
      throw new AppError("Lead not found", 404);
    }

    this.checkLeadAccess(lead, user);

    return runInTransaction(async (session) => {
      const followup = await this.followupRepository.create(
        {
          lead_id: lead._id as mongoose.Types.ObjectId,
          date: input.date,
          note: input.note,
          status: input.status
        },
        session
      );

      await updateLastActivity(lead._id.toString(), new Date(), session);

      return followup;
    });
  }

  public async getFollowups(
    filters: { start?: string; end?: string; status?: string; lead_id?: string },
    user: UserContext
  ): Promise<IFollowup[]> {
    const query: any = {};

    // Enforce RBAC
    if (filters.lead_id) {
      const lead = await this.leadRepository.findById(filters.lead_id);
      if (!lead) {
        throw new AppError("Lead not found", 404);
      }
      this.checkLeadAccess(lead, user);
      query.lead_id = lead._id;
    } else {
      // Find eligible lead IDs
      if (user.role === "EXECUTIVE") {
        const leads = await this.leadRepository.find({ assigned_to: user.id }, { page: 1, limit: 1000 });
        query.lead_id = { $in: leads.map((l) => l._id) };
      } else if (user.role === "MANAGER") {
        const leads = await this.leadRepository.find({ team_id: user.teamId || "NO_TEAM" }, { page: 1, limit: 1000 });
        query.lead_id = { $in: leads.map((l) => l._id) };
      }
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.start || filters.end) {
      query.date = {};
      if (filters.start) {
        query.date.$gte = new Date(filters.start);
      }
      if (filters.end) {
        query.date.$lte = new Date(filters.end);
      }
    }

    return this.followupRepository.find(query);
  }

  public async updateFollowupStatus(
    id: string,
    status: "COMPLETED" | "MISSED",
    user: UserContext
  ): Promise<IFollowup> {
    const followup = await this.followupRepository.findById(id);
    if (!followup) {
      throw new AppError("Followup not found", 404);
    }

    const lead = await this.leadRepository.findById(followup.lead_id.toString());
    if (!lead) {
      throw new AppError("Associated lead not found", 404);
    }

    this.checkLeadAccess(lead, user);

    return runInTransaction(async (session) => {
      const updated = await this.followupRepository.updateOne(id, { status }, session);
      if (!updated) {
        throw new AppError("Followup not found during update", 404);
      }

      await updateLastActivity(lead._id.toString(), new Date(), session);

      return updated;
    });
  }
}
