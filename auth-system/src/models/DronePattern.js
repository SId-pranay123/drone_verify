import mongoose from 'mongoose';

const dronePatternSchema = new mongoose.Schema({
    droneId: {
        type: String,
        required: true,
        unique: true
    },
    locationHistory: [{
        coordinates: {
            type: [Number],
            required: true
        },
        timestamp: {
            type: Date,
            required: true
        }
    }],
    transmissionFrequency: {
        averageInterval: Number,
        lastTransmission: Date
    },
    lastUpdate: {
        type: Date,
        default: Date.now
    }
});

export const DronePattern = mongoose.model('DronePattern', dronePatternSchema);
