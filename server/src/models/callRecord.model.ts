import { Schema, model, Document, Types } from 'mongoose';

export interface ICallRecord extends Document {
  lead_id: Types.ObjectId;
  duration: number;
  summary: string;
  time: Date;
  created_at: Date;
}

const CallRecordSchema = new Schema<ICallRecord>(
  {
    lead_id: { type: Schema.Types.ObjectId, ref: 'Lead', required: true, index: true },
    duration: { type: Number, required: true },
    summary: { type: String, required: true },
    time: { type: Date, required: true, index: true },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: false,
    },
    collection: 'call_records',
  }
);

export const CallRecordModel = model<ICallRecord>('CallRecord', CallRecordSchema);
export const CallRecord = CallRecordModel;
export default CallRecordModel;
