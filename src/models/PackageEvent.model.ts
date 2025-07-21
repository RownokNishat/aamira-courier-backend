import { Schema, model, Document } from 'mongoose';
import { IPackage } from './Package.model'; // Reuse the interface

const packageEventSchema = new Schema<IPackage>({
  package_id: { type: String, required: true, index: true },
  status: { type: String, required: true, enum: ['CREATED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'EXCEPTION', 'CANCELLED'] },
  lat: { type: Number },
  lon: { type: Number },
  event_timestamp: { type: Date, required: true },
  received_at: { type: Date, required: true, default: Date.now },
  note: { type: String },
  eta: { type: Date },
});

export const PackageEventModel = model<IPackage>('PackageEvent', packageEventSchema);