import { Schema, model, Document } from 'mongoose';

export interface IPlanQuery extends Document {
  date: Date,
  work_id: Schema.Types.ObjectId,
  shift_id: Schema.Types.ObjectId,
}

const PlanSchema: Schema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  work_id: {
    type: Schema.Types.ObjectId,
    ref: "workers"
  },
  shift_id: {
    type: Schema.Types.ObjectId,
    ref: "workers"
  },
});

export default model<IPlanQuery>("plans", PlanSchema);