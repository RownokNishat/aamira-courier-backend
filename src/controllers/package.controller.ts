import { Request, Response } from 'express';
import { AlertModel } from '../models/Alert.model';
import { PackageService } from '../services/package.service';

export class PackageController {
  public static async createPackageUpdate(req: Request, res: Response) {
    try {
      // Basic validation would go here (e.g., using Joi or Zod)
      const updatedPackage = await PackageService.processUpdate(req.body);
      res.status(200).json(updatedPackage);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unknown error occurred.' });
      }
    }
  }

  public static async getActivePackages(req: Request, res: Response) {
    try {
      const packages = await PackageService.getActivePackages();
      res.status(200).json(packages);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve active packages.' });
    }
  }

  public static async getPackageDetails(req: Request, res: Response) {
    try {
      const { package_id } = req.params;
      const history = await PackageService.getPackageHistory(package_id);
      if (!history.length) {
        return res.status(404).json({ message: 'Package not found.' });
      }
      res.status(200).json(history);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve package history.' });
    }
  }
  
  public static async getActiveAlerts(req: Request, res: Response) {
    try {
        const alerts = await AlertModel.find();
        res.status(200).json(alerts);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve alerts." });
    }
  }
}