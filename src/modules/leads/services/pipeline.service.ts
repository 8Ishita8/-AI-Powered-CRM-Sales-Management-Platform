import { PipelineRepository } from "../repositories/pipeline.repository";
import { IPipelineHistory } from "../models/pipelineHistory.model";

export class PipelineService {
  private pipelineRepository: PipelineRepository;

  constructor() {
    this.pipelineRepository = new PipelineRepository();
  }

  public async getHistoryByLeadId(leadId: string): Promise<IPipelineHistory[]> {
    return this.pipelineRepository.findByLeadId(leadId);
  }
}
