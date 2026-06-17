import { Schema, model, Document, Types } from 'mongoose';

export interface IActivity extends Document {
  leadId: Types.ObjectId;
  type: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ActivitySchema = new Schema<IActivity>(
  {
    leadId: {
      type: Schema.Types.ObjectId,
      ref: 'Lead',
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Activity = model<IActivity>('Activity', ActivitySchema);
