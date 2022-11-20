import { Schema, model, Document } from 'mongoose';

export interface IWorkerQuery extends Document {
  _id: Schema.Types.ObjectId,
  firstName: string,
  lastName: string,
  email: string,
  createDate: Date,
  isWorkerActive: boolean,
}

const WorkerSchema: Schema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  createDate: {
    type: Date,
    required: true,
  },
  isWorkerActive: {
    type: Boolean,
    required: true,
  },
});

export default model<IWorkerQuery>("workers", WorkerSchema);