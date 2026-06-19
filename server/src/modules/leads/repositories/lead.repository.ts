import { ClientSession, FilterQuery, UpdateQuery } from "mongoose";
import { LeadModel, ILead } from "../../../models/lead.model";

export class LeadRepository {
  public async create(leadData: Partial<ILead>, session?: ClientSession): Promise<ILead> {
    const docs = await LeadModel.create([leadData], { session });
    return docs[0];
  }

  public async findById(id: string, session?: ClientSession): Promise<ILead | null> {
    return LeadModel.findById(id).session(session || null).exec();
  }

  public async findOne(filter: FilterQuery<ILead>, session?: ClientSession): Promise<ILead | null> {
    return LeadModel.findOne(filter).session(session || null).exec();
  }

  public async updateOne(
    id: string,
    updateData: UpdateQuery<ILead>,
    session?: ClientSession
  ): Promise<ILead | null> {
    return LeadModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .session(session || null)
      .exec();
  }

  public async find(
    filter: FilterQuery<ILead>,
    options: { page: number; limit: number; sort?: any },
    session?: ClientSession
  ): Promise<ILead[]> {
    const { page, limit, sort = { last_activity_at: -1 } } = options;
    const skip = (page - 1) * limit;

    return LeadModel.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .session(session || null)
      .exec();
  }

  public async count(filter: FilterQuery<ILead>, session?: ClientSession): Promise<number> {
    return LeadModel.countDocuments(filter).session(session || null).exec();
  }
}
