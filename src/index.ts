import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import api from './api/api.routers';
import errorMiddleware from './middleware/error.middleware';
import connectToDatabase from './config/database';
import 'dotenv/config';

// Initialize the Express app
const app: Application = express();
const port = Number(process.env.PORT) || 3000;

// Connect to the database
const startServer = async () => {
    await connectToDatabase();

    // Middleware
    app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
    app.use(helmet());
    app.use(express.json());

    // Routes
    const apiVersion = Number(process.env.API_VERSION) || 1;
    api.useRoutes(app, apiVersion);

    // Error handling middleware
    app.use(errorMiddleware);

    // Start listening
    app.listen(port, () => {
        console.log(`🚀 App listening on port ${port}`);
    });
};

// Handle global errors
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Promise Rejection:', reason);
    process.exit(1);
});

// Start the app
startServer();
