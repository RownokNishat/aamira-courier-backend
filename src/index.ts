import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import cors from 'cors';
import { Server } from 'socket.io';
import config from './config/index';
import apiRoutes from './routes/index';
import { initializeSocket } from './utils/socket';
import { startStuckPackageJob } from './jobs/stuckPackage.job';

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ['GET', 'POST'],
  },
});
initializeSocket(io);

// Middleware
app.use(cors({ origin: "*", }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', apiRoutes);

// Global Error Handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


// Database Connection
mongoose.connect(config.mongoUri)
  .then(() => {
    console.log('MongoDB connected successfully.');
    // Start background job only after DB connection is successful
    startStuckPackageJob();

    server.listen(config.port, () => {
      console.log(`Server running on http://localhost:${config.port}`);
    });
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });