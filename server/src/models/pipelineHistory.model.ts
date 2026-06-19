import { Schema, model, Document, Types } from 'mongoose';

export interface IPipelineHistory extends Document {
  lead_id: Types.ObjectId;
  from_stage: string;
  to_stage: string;
  changed_by: string;
  changed_at: Date;
}

const PipelineHistorySchema = new Schema<IPipelineHistory>(
  {
    lead_id: { type: Schema.Types.ObjectId, ref: 'Lead', required: true, index: true },
    from_stage: { type: String, required: true },
    to_stage: { type: String, required: true },
    changed_by: { type: String, required: true },
    changed_at: { type: Date, required: true, default: Date.now, index: true },
  },
  {
    collection: 'pipeline_history',
    timestamps: false,
  }
);

export const PipelineHistoryModel = model<IPipelineHistory>('PipelineHistory', PipelineHistorySchema);
export const PipelineHistory = PipelineHistoryModel;
export default PipelineHistoryModel;
