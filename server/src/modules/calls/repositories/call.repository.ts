import { ClientSession, FilterQuery } from "mongoose";
import { CallRecordModel, ICallRecord } from "../../../models/callRecord.model";

export class CallRepository {
  public async create(callData: Partial<ICallRecord>, session?: ClientSession): Promise<ICallRecord> {
    const docs = await CallRecordModel.create([callData], { session });
    return docs[0];
  }

  public async findById(id: string, session?: ClientSession): Promise<ICallRecord | null> {
    return CallRecordModel.findById(id).session(session || null).exec();
  }

  public async find(filter: FilterQuery<ICallRecord>, session?: ClientSession): Promise<ICallRecord[]> {
    return CallRecordModel.find(filter).sort({ time: -1 }).session(session || null).exec();
  }

  public async findByLeadId(leadId: string, session?: ClientSession): Promise<ICallRecord[]> {
    return CallRecordModel.find({ lead_id: leadId }).sort({ time: -1 }).session(session || null).exec();
  }
}
