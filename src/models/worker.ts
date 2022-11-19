import { Schema, model, Document } from 'mongoose';

export interface IWorkerQuery extends Document {
  name: string,
  email: string,
  phone_number: string,
}

const WorkerSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
  }
});

export default model<IWorkerQuery>("workers", WorkerSchema);