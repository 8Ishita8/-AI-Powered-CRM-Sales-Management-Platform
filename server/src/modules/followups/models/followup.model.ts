import { Schema, model, Document, Types } from "mongoose";

export type FollowupStatus = "PENDING" | "COMPLETED" | "MISSED";

export interface IFollowup extends Document {
  lead_id: Types.ObjectId;
  date: Date;
  note: string;
  status: FollowupStatus;
  created_at: Date;
  updated_at: Date;
}

const FollowupSchema = new Schema<IFollowup>(
  {
    lead_id: { type: Schema.Types.ObjectId, ref: "Lead", required: true, index: true },
    date: { type: Date, required: true, index: true },
    note: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ["PENDING", "COMPLETED", "MISSED"],
      default: "PENDING",
      index: true
    }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    },
    collection: "follow_ups"
  }
);

export const FollowupModel = model<IFollowup>("Followup", FollowupSchema);
