import mongoose from 'mongoose';
import 'dotenv/config';

const connectToDatabase = async (): Promise<void> => {
    try {
        const { MONGO_PATH } = process.env;

        if (!MONGO_PATH) {
            throw new Error('Missing MongoDB environment variables');
        }

        mongoose.set('strictQuery', true);
        await mongoose.connect(MONGO_PATH);

        console.log('Database connection established');
    } catch (error) {
        console.error('Database connection failed');
        process.exit(1); // Exit the process if the connection fails
    }
};

export default connectToDatabase;
