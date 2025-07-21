import { Schema, model, Document } from 'mongoose';

export interface IAlert extends Document {
  package_id: string;
  message: string;
  createdAt: Date;
}

const alertSchema = new Schema<IAlert>({
  package_id: { type: String, required: true, index: true, unique: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '1d' }, // Auto-remove alert after 1 day
});

export const AlertModel = model<IAlert>('Alert', alertSchema);