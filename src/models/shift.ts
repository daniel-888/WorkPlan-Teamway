import { Schema, model, Document } from 'mongoose';

export interface IShiftQuery extends Document {
  _id: Schema.Types.ObjectId,
  start_hour: Number,
  end_hour: Number,
  isShiftActive: boolean,
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
  isShiftActive: {
    type: Boolean,
    required: true,
  }
});

export default model<IShiftQuery>("shifts", ShiftSchema);