import { Request, Response, NextFunction } from 'express';
import config from '../config/index';

export const requireApiKey = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header is missing.' });
  }

  const token = authHeader.split(' ')[1]; // Expecting "Bearer <token>"
  if (token && token === config.apiSecretKey) {
    next();
  } else {
    return res.status(403).json({ message: 'Invalid or missing API key.' });
  }
};