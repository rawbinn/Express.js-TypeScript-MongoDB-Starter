import mongoose from 'mongoose';
import 'dotenv/config';

const connectToDatabase = async (): Promise<void> => {
    const { MONGO_PATH, NODE_ENV } = process.env;

    //if NODE_ENV is not set, it will default to 'development'
    const environment = NODE_ENV || 'development';
    const isProduction = environment === 'production';


    if (!MONGO_PATH) {
        throw new Error('Missing MongoDB environment variables');
    }

    mongoose.set('strictQuery', true);

    const maxRetries = 5;
    let retries = 0;

    const connectWithRetry = async () => {
        try {
            await mongoose.connect(MONGO_PATH);
            if(!isProduction) {
                console.log('MongoDB database connection established successfully');
            }
        } catch (error) {
            if (retries < maxRetries) {
                retries += 1;
                if(!isProduction) {
                    console.error(`Database connection failed, retrying in 5 seconds... (${retries}/${maxRetries})`);
                }
                setTimeout(connectWithRetry, 5000); // Retry connection after 5 seconds
            } else {
                if(!isProduction) {
                    console.error('Max retries reached. Could not connect to the database.');
                }
                process.exit(1); // Exit the process if the connection fails
            }
        }
    };

    // @event connected: Emitted when this connection successfully connects to the db.
    mongoose.connection.on('connected', () => {
        if (!isProduction) {
            console.log('MongoDB database connection established successfully');
        }
    });

    // @event disconnected: Emitted when this connection is disconnected.
    mongoose.connection.on('reconnected', () => {
        if (!isProduction) {
            console.log('Mongo Connection Reestablished');
        }
    });
    
    // @event error: Emitted when an error occurs on this connection.
    mongoose.connection.on('error', (error: Error) => {
        if (!isProduction) {
            console.log('MongoDB connection error. Please make sure MongoDB is running: ');
            console.log(`Mongo Connection ERROR: ${error}`);
        }
    });
    
    // @event disconnected: Emitted when this connection is disconnected.
    mongoose.connection.on('close', () => {
        if (!isProduction) {
            console.log('Mongo Connection Closed...');
        }
    });

    // @event disconnected: Emitted when this connection is disconnected.
    mongoose.connection.on('disconnected', () => {
        if (!isProduction) {
            console.log('MongoDB database connection is disconnected...');
            console.log('Trying to reconnect to Mongo ...');
        }

        connectWithRetry();
    });

    await connectWithRetry();
};

export default connectToDatabase;
