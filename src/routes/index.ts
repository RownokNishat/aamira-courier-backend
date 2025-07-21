import { Router } from 'express';
import { PackageController } from '../controllers/package.controller';
import { requireApiKey } from '../middleware/auth.middleware';

const router = Router();

// Apply API key middleware to all routes
router.use(requireApiKey);

// Package routes
router.post('/updates', PackageController.createPackageUpdate); // F1: Ingest Courier Updates [cite: 48]
router.get('/packages/active', PackageController.getActivePackages); // Part of F3: Dispatcher Dashboard [cite: 66]
router.get('/packages/:package_id', PackageController.getPackageDetails); // Part of F3: Package Detail view [cite: 68]
router.get('/alerts', PackageController.getActiveAlerts); // Part of F4: Display alerts in dashboard 

export default router;