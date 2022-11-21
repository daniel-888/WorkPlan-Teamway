import { Schema, model, Document } from 'mongoose';

export interface IShiftQuery extends Document {
  _id: Schema.Types.ObjectId,
  startHour: Number,
  endHour: Number,
  isShiftActive: boolean,
}

const ShiftSchema: Schema = new Schema({
  startHour: {
    type: Number,
    required: true,
  },
  endHour: {
    type: Number,
    required: true,
  },
  isShiftActive: {
    type: Boolean,
    required: true,
  }
});

export default model<IShiftQuery>("shifts", ShiftSchema);