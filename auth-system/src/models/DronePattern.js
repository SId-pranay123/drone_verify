// import mongoose from 'mongoose';

// const dronePatternSchema = new mongoose.Schema({
//     droneId: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     locationHistory: [{
//         coordinates: {
//             type: [Number],
//             required: true
//         },
//         timestamp: {
//             type: Date,
//             required: true
//         }
//     }],
//     transmissionFrequency: {
//         averageInterval: Number,
//         lastTransmission: Date
//     },
//     lastUpdate: {
//         type: Date,
//         default: Date.now
//     }
// });

// export const DronePattern = mongoose.model('DronePattern', dronePatternSchema);


import mongoose from 'mongoose';

const PatternSchema = new mongoose.Schema({
  machineId: {
    type: String,
    required: true
  },
  // Storing pattern data used for Tier 2 comparisons
  patterns: {
    type: Array,
    default: []
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Pattern', PatternSchema);
