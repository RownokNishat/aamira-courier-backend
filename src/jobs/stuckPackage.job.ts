import cron from 'node-cron';
import { PackageModel } from '../models/Package.model';
import { AlertModel } from '../models/Alert.model';
import { getSocket } from '../utils/socket';

export const checkStuckPackages = async () => {
  console.log('Running stuck package check...');
  try {
    // --- THIS IS THE KEY CHANGE ---
    // Create a date object for 30 minutes ago in a reliable way
    const thirtyMinutesAgo = new Date();
    thirtyMinutesAgo.setMinutes(thirtyMinutesAgo.getMinutes() - 30);

    const potentiallyStuckPackages = await PackageModel.find({
      status: { $nin: ['DELIVERED', 'CANCELLED'] },
      received_at: { $lt: thirtyMinutesAgo }, // Use the new date object here
    });

    // This log is crucial for debugging. Let's see what the query finds.
    console.log(`Found ${potentiallyStuckPackages.length} potentially stuck packages.`);

    for (const pkg of potentiallyStuckPackages) {
      const existingAlert = await AlertModel.findOne({ package_id: pkg.package_id });

      if (!existingAlert) {
        const message = `Package ${pkg.package_id} has been in status '${pkg.status}' for over 30 minutes.`;
        const newAlert = await AlertModel.create({
          package_id: pkg.package_id,
          message: message,
        });

        console.log(`Alert CREATED for package: ${pkg.package_id}`);
        getSocket().emit('new_alert', newAlert);
      } else {
        // Add this log to know if we are skipping an alert
        console.log(`Alert already exists for package: ${pkg.package_id}. Skipping.`);
      }
    }
  } catch (error) {
    console.error('Error checking for stuck packages:', error);
  }
};

// Schedule the job to run every 5 minutes
export const startStuckPackageJob = () => {
  cron.schedule('*/5 * * * *', checkStuckPackages);
  console.log('Stuck package detection job scheduled to run every 5 minutes.');
};