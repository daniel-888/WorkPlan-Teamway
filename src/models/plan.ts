import { Schema, model, Document, PopulatedDoc } from 'mongoose';
import { IWorkerQuery } from "./worker";
import { IShiftQuery } from "./shift";

export interface IPlanQuery extends Document {
  _id: Schema.Types.ObjectId,
  date: Date,
  worker: PopulatedDoc<Document<Schema.Types.ObjectId> & IWorkerQuery>,
  shift: PopulatedDoc<Document<Schema.Types.ObjectId> & IShiftQuery>,
}

const PlanSchema: Schema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  worker: {
    type: Schema.Types.ObjectId,
    ref: "workers"
  },
  shift: {
    type: Schema.Types.ObjectId,
    ref: "shifts"
  },
});

export default model<IPlanQuery>("plans", PlanSchema);