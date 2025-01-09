import mongoose from 'mongoose';

const droneDataSchema = new mongoose.Schema({
    droneId: {
        type: String,
        required: true,
        index: true
    },
    userId: {
        type: String,
        required: true
    },
    serialNumber: String,
    deviceLocation: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: [Number] // [longitude, latitude]
    },
    remoteData: mongoose.Schema.Types.Mixed,
    verificationStatus: {
        tier1: Boolean,
        tier2: Boolean,
        tier3: Boolean,
        timestamp: Date
    }
}, {
    timestamps: true
});

droneDataSchema.index({ deviceLocation: '2dsphere' });
export const DroneData = mongoose.model('DroneData', droneDataSchema);