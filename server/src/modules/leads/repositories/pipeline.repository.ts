import { ClientSession } from "mongoose";
import { PipelineHistoryModel, IPipelineHistory } from "../../../models/pipelineHistory.model";

export class PipelineRepository {
  public async create(
    historyData: Partial<IPipelineHistory>,
    session?: ClientSession
  ): Promise<IPipelineHistory> {
    const docs = await PipelineHistoryModel.create([historyData], { session });
    return docs[0];
  }

  public async findByLeadId(leadId: string): Promise<IPipelineHistory[]> {
    return PipelineHistoryModel.find({ lead_id: leadId })
      .sort({ changed_at: -1 })
      .exec();
  }
}
