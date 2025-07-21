import { Schema, model, Document } from 'mongoose';

export interface IPackage extends Document {
  package_id: string;
  status: 'CREATED' | 'PICKED_UP' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'EXCEPTION' | 'CANCELLED';
  lat?: number;
  lon?: number;
  event_timestamp: Date;
  received_at: Date;
  note?: string;
  eta?: Date;
}

const packageSchema = new Schema<IPackage>({
  package_id: { type: String, required: true, unique: true, index: true },
  status: { type: String, required: true, enum: ['CREATED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'EXCEPTION', 'CANCELLED'] },
  lat: { type: Number },
  lon: { type: Number },
  event_timestamp: { type: Date, required: true },
  received_at: { type: Date, required: true, default: Date.now },
  note: { type: String },
  eta: { type: Date },
});

export const PackageModel = model<IPackage>('Package', packageSchema);