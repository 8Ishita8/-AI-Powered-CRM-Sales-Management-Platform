import { Schema, model, Document } from 'mongoose';

export interface ILead extends Document {
  name: string;
  email: string;
  stage: string;
  conversionScore?: number;
  aiAnalysisSummary?: string;
  probabilityClass?: string;
  nextBestAction?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    stage: {
      type: String,
      required: true,
      trim: true,
    },
    conversionScore: {
      type: Number,
      default: null,
    },
    aiAnalysisSummary: {
      type: String,
      default: null,
    },
    probabilityClass: {
      type: String,
      default: null,
    },
    nextBestAction: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Lead = model<ILead>('Lead', LeadSchema);
