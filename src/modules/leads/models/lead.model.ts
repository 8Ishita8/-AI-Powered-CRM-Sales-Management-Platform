import { Schema, model, Document } from "mongoose";
import { LeadStage, LeadStages } from "../constants/stage.constants";

export interface ILead extends Document {
  name: string;
  company?: string;
  phone: string;
  email: string;
  source: string;
  stage: LeadStage;
  assigned_to?: string;
  team_id?: string;
  last_activity_at: Date;
  created_at: Date;
  updated_at: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true },
    company: { type: String },
    phone: { type: String, required: true },
    email: { type: String, required: true, index: true },
    source: { type: String, required: true, index: true },
    stage: {
      type: String,
      required: true,
      enum: Object.values(LeadStages),
      default: LeadStages.NEW_LEAD,
      index: true
    },
    assigned_to: { type: String, index: true },
    team_id: { type: String, index: true },
    last_activity_at: { type: Date, required: true, default: Date.now, index: true }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    },
    collection: "leads"
  }
);

export const LeadModel = model<ILead>("Lead", LeadSchema);
