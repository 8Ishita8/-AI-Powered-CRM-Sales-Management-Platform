import mongoose, { ClientSession } from "mongoose";
import { LeadRepository } from "../repositories/lead.repository";
import { PipelineRepository } from "../repositories/pipeline.repository";
import { FollowupRepository } from "../../followups/repositories/followup.repository";
import { CallRepository } from "../../calls/repositories/call.repository";
import { ILead } from "../models/lead.model";
import { isValidStageTransition, LeadStage } from "../constants/stage.constants";
import { updateLastActivity } from "../../../shared/utils/activity.helper";
import { runInTransaction } from "../../../shared/utils/transaction.helper";
import { AppError } from "../../../middleware/error.middleware";
import { UserContext } from "../../../shared/types";
import { CreateLeadInput } from "../validators/createLead.schema";
import { UpdateLeadInput } from "../validators/updateLead.schema";

export class LeadService {
  private leadRepository: LeadRepository;
  private pipelineRepository: PipelineRepository;
  private followupRepository: FollowupRepository;
  private callRepository: CallRepository;

  constructor() {
    this.leadRepository = new LeadRepository();
    this.pipelineRepository = new PipelineRepository();
    this.followupRepository = new FollowupRepository();
    this.callRepository = new CallRepository();
  }

  private buildRbacFilter(user: UserContext, queryFilters: any = {}): any {
    const filter: any = { ...queryFilters };

    if (user.role === "EXECUTIVE") {
      filter.assigned_to = user.id;
    } else if (user.role === "MANAGER") {
      filter.team_id = user.teamId || "NO_TEAM";
    }

    return filter;
  }

  private checkLeadAccess(lead: ILead, user: UserContext): void {
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

  public async createLead(input: CreateLeadInput, user: UserContext): Promise<ILead> {
    const leadData: Partial<ILead> = {
      ...input,
      last_activity_at: new Date()
    };

    // If EXECUTIVE creates a lead, automatically assign it to them
    if (user.role === "EXECUTIVE") {
      leadData.assigned_to = user.id;
      leadData.team_id = user.teamId;
    } else if (user.role === "MANAGER") {
      // If manager creates, default lead team_id to manager's team
      if (!leadData.team_id) {
        leadData.team_id = user.teamId;
      }
    }

    return this.leadRepository.create(leadData);
  }

  public async getLeads(
    filters: { stage?: string; source?: string; assigned_to?: string },
    pagination: { page: number; limit: number },
    user: UserContext
  ): Promise<{ leads: ILead[]; total: number; page: number; limit: number }> {
    const rbacFilter = this.buildRbacFilter(user, filters);
    
    const [leads, total] = await Promise.all([
      this.leadRepository.find(rbacFilter, pagination),
      this.leadRepository.count(rbacFilter)
    ]);

    return {
      leads,
      total,
      page: pagination.page,
      limit: pagination.limit
    };
  }

  public async getLeadDetails(
    id: string,
    user: UserContext
  ): Promise<{ lead: ILead; history: any[]; followups: any[]; calls: any[] }> {
    const lead = await this.leadRepository.findById(id);
    if (!lead) {
      throw new AppError("Lead not found", 404);
    }

    this.checkLeadAccess(lead, user);

    const [history, followups, calls] = await Promise.all([
      this.pipelineRepository.findByLeadId(id),
      this.followupRepository.findByLeadId(id),
      this.callRepository.findByLeadId(id)
    ]);

    return {
      lead,
      history,
      followups,
      calls
    };
  }

  public async updateLead(id: string, input: UpdateLeadInput, user: UserContext): Promise<ILead> {
    const lead = await this.leadRepository.findById(id);
    if (!lead) {
      throw new AppError("Lead not found", 404);
    }

    this.checkLeadAccess(lead, user);

    // Executives cannot assign/reassign leads
    if (input.assigned_to !== undefined && user.role === "EXECUTIVE" && input.assigned_to !== lead.assigned_to) {
      throw new AppError("Forbidden: Executives cannot assign leads.", 403);
    }

    const newStage = input.stage;
    const now = new Date();

    if (newStage && newStage !== lead.stage) {
      // Validate transition
      if (!isValidStageTransition(lead.stage as LeadStage, newStage as LeadStage)) {
        throw new AppError("Invalid stage transition", 400);
      }

      // Execute transaction for stage changes
      return runInTransaction(async (session) => {
        const updatedLead = await this.leadRepository.updateOne(
          id,
          {
            ...input,
            last_activity_at: now
          },
          session
        );

        if (!updatedLead) {
          throw new AppError("Lead not found during update transaction", 404);
        }

        await this.pipelineRepository.create(
          {
            lead_id: lead._id as mongoose.Types.ObjectId,
            from_stage: lead.stage,
            to_stage: newStage,
            changed_by: user.id,
            changed_at: now
          },
          session
        );

        return updatedLead;
      });
    }

    // No stage change, simple update
    const updated = await this.leadRepository.updateOne(id, {
      ...input,
      last_activity_at: now
    });

    if (!updated) {
      throw new AppError("Lead not found", 404);
    }

    return updated;
  }

  public async assignLead(id: string, assignedTo: string, user: UserContext): Promise<ILead> {
    const lead = await this.leadRepository.findById(id);
    if (!lead) {
      throw new AppError("Lead not found", 404);
    }

    this.checkLeadAccess(lead, user);

    // Executives cannot assign leads
    if (user.role === "EXECUTIVE") {
      throw new AppError("Forbidden: Executives cannot assign leads.", 403);
    }

    // Managers can assign, but lead must belong to their team
    if (user.role === "MANAGER") {
      if (lead.team_id !== user.teamId) {
        throw new AppError("Forbidden: You can only assign leads belonging to your team.", 403);
      }
    }

    const now = new Date();
    const updated = await this.leadRepository.updateOne(id, {
      assigned_to: assignedTo,
      last_activity_at: now
    });

    if (!updated) {
      throw new AppError("Lead not found", 404);
    }

    return updated;
  }
}
