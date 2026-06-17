import { Schema, model, Document, Types } from 'mongoose';

export interface IFollowUp extends Document {
  leadId: Types.ObjectId;
  followUpDate: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const FollowUpSchema = new Schema<IFollowUp>(
  {
    leadId: {
      type: Schema.Types.ObjectId,
      ref: 'Lead',
      required: true,
      index: true,
    },
    followUpDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      trim: true,
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export const FollowUp = model<IFollowUp>('FollowUp', FollowUpSchema);
