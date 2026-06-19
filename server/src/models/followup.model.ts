import { Schema, model, Document, Types } from 'mongoose';

export interface IFollowup extends Document {
  lead_id: Types.ObjectId;
  leadId: Types.ObjectId;
  date: Date;
  followUpDate: Date;
  note: string;
  status: string;
  assigned_to?: string;
  created_at: Date;
  updated_at: Date;
}

export type IFollowUp = IFollowup;

const FollowupSchema = new Schema<IFollowup>(
  {
    lead_id: { type: Schema.Types.ObjectId, ref: 'Lead', required: true, index: true },
    leadId: { type: Schema.Types.ObjectId, ref: 'Lead', index: true },
    date: { type: Date, required: true, index: true },
    followUpDate: { type: Date },
    note: { type: String, default: '' },
    status: {
      type: String,
      required: true,
      default: 'PENDING',
      index: true,
    },
    assigned_to: { type: String, default: null },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    collection: 'follow_ups',
  }
);

// Sync fields before saving
FollowupSchema.pre<IFollowup>('save', function (next) {
  if (this.lead_id && !this.leadId) {
    this.leadId = this.lead_id;
  } else if (this.leadId && !this.lead_id) {
    this.lead_id = this.leadId;
  }

  if (this.date && !this.followUpDate) {
    this.followUpDate = this.date;
  } else if (this.followUpDate && !this.date) {
    this.date = this.followUpDate;
  }

  next();
});

export const FollowupModel = model<IFollowup>('Followup', FollowupSchema);
export const FollowUp = FollowupModel;
export default FollowupModel;
