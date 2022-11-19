import { Schema, model, Document } from 'mongoose';

export interface IShiftQuery extends Document {
  start_hour: Number,
  end_hour: Number,
}

const ShiftSchema: Schema = new Schema({
  start_hour: {
    type: Number,
    required: true,
  },
  end_hour: {
    type: Number,
    required: true,
  },
});

export default model<IShiftQuery>("shifts", ShiftSchema);