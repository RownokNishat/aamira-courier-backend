import { PackageModel, IPackage } from '../models/Package.model';
import { PackageEventModel } from '../models/PackageEvent.model';
import { AlertModel } from '../models/Alert.model';
import { getSocket } from '../utils/socket';

type PackageUpdatePayload = Omit<IPackage, 'received_at' | 'save' | '_id' | 'createdAt' | 'updatedAt' | '__v'>;

export class PackageService {
  public static async processUpdate(payload: PackageUpdatePayload): Promise<IPackage> {
    const { package_id, event_timestamp } = payload;

    // 1. Save every event to the history collection 
    await PackageEventModel.create({ ...payload, received_at: new Date() });

    // 2. Check for the current state of the package [cite: 63]
    const currentPackageState = await PackageModel.findOne({ package_id });

    let updatedPackage: IPackage;

    if (!currentPackageState || new Date(event_timestamp) > new Date(currentPackageState.event_timestamp)) {
      // 3. If new or more recent, update the current state (upsert) [cite: 60]
      // This handles out-of-order events by only accepting the latest one.
      // This is idempotent because re-running it with the same data won't change the outcome. [cite: 58]
      updatedPackage = await PackageModel.findOneAndUpdate(
        { package_id },
        { ...payload, received_at: new Date() },
        { new: true, upsert: true }
      );

      // 4. If the package was stuck, clear its alert
      await AlertModel.deleteOne({ package_id });
      getSocket().emit('alert_cleared', { package_id });

    } else {
      // If the event is old, do not update the current state, just return it.
      updatedPackage = currentPackageState;
    }

    // 5. Broadcast the update to all clients [cite: 69]
    getSocket().emit('package_updated', updatedPackage);

    return updatedPackage;
  }

  public static async getActivePackages(): Promise<IPackage[]> {
    return PackageModel.find({ status: { $nin: ['DELIVERED', 'CANCELLED'] } });
  }

  public static async getPackageHistory(package_id: string): Promise<IPackage[]> {
    return PackageEventModel.find({ package_id }).sort({ event_timestamp: 'desc' });
  }
}