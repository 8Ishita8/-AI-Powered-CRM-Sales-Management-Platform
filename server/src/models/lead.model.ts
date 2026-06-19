import { Schema, model, Document } from 'mongoose';

export interface ILead extends Document {
  name: string;
  company?: string;
  phone: string;
  email: string;
  source: string;
  stage: string;
  assigned_to?: string;
  team_id?: string;
  last_activity_at: Date;
  conversionScore?: number;
  aiAnalysisSummary?: string;
  probabilityClass?: string;
  nextBestAction?: string;
  created_at: Date;
  updated_at: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true, trim: true },
    company: { type: String, trim: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    source: { type: String, required: true, trim: true, index: true },
    stage: {
      type: String,
      required: true,
      default: 'new_lead',
      index: true,
    },
    assigned_to: { type: String, default: null, index: true },
    team_id: { type: String, default: null, index: true },
    last_activity_at: { type: Date, required: true, default: Date.now, index: true },
    conversionScore: { type: Number, default: null },
    aiAnalysisSummary: { type: String, default: null },
    probabilityClass: { type: String, default: null },
    nextBestAction: { type: String, default: null },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    collection: 'leads',
  }
);

export const LeadModel = model<ILead>('Lead', LeadSchema);
// Export as Lead as well for Member 4 branch imports compatibility
export const Lead = LeadModel;
export default LeadModel;
