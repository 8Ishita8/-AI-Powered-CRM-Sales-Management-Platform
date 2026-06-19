import { ClientSession, FilterQuery, UpdateQuery } from "mongoose";
import { FollowupModel, IFollowup } from "../../../models/followup.model";

export class FollowupRepository {
  public async create(followupData: Partial<IFollowup>, session?: ClientSession): Promise<IFollowup> {
    const docs = await FollowupModel.create([followupData], { session });
    return docs[0];
  }

  public async findById(id: string, session?: ClientSession): Promise<IFollowup | null> {
    return FollowupModel.findById(id).session(session || null).exec();
  }

  public async updateOne(
    id: string,
    updateData: UpdateQuery<IFollowup>,
    session?: ClientSession
  ): Promise<IFollowup | null> {
    return FollowupModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .session(session || null)
      .exec();
  }

  public async find(filter: FilterQuery<IFollowup>, session?: ClientSession): Promise<IFollowup[]> {
    return FollowupModel.find(filter).sort({ date: 1 }).session(session || null).exec();
  }

  public async findByLeadId(leadId: string, session?: ClientSession): Promise<IFollowup[]> {
    return FollowupModel.find({ lead_id: leadId }).sort({ date: 1 }).session(session || null).exec();
  }
}
