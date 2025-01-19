import mongoose from 'mongoose';
import { CONFIG } from '../config/config.js';

export class DatabaseService {
    static async connect() {
        try {
            console.log('Connecting to MongoDB...', CONFIG.MONGODB_URI);
            await mongoose.connect(CONFIG.MONGODB_URI);
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('MongoDB connection error:', error);
            process.exit(1);
        }
    }

    static async disconnect() {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}