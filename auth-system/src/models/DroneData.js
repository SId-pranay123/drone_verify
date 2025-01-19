// import mongoose from 'mongoose';

// const droneDataSchema = new mongoose.Schema({
//     droneId: {
//         type: String,
//         required: true,
//         index: true
//     },
//     userId: {
//         type: String,
//         required: true
//     },
//     serialNumber: String,
//     deviceLocation: {
//         type: {
//             type: String,
//             default: 'Point'
//         },
//         coordinates: [Number] // [longitude, latitude]
//     },
//     remoteData: mongoose.Schema.Types.Mixed,
//     verificationStatus: {
//         tier1: Boolean,
//         tier2: Boolean,
//         tier3: Boolean,
//         timestamp: Date
//     }
// }, {
//     timestamps: true
// });

// droneDataSchema.index({ deviceLocation: '2dsphere' });
// export const DroneData = mongoose.model('DroneData', droneDataSchema);






import mongoose from 'mongoose';

const DroneSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    required: true
  },
  remoteData: {
    selfId: { type: String, default: null },
    basicIDs: [
      {
        uasId: { type: String, default: null },
        idType: { type: String },
        uaType: { type: String },
        serialNumber: { type: String }
      }
    ]
  },
  deviceLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere' // Enable geospatial indexing
    }
  },
  // You can store additional metadata needed for Tier-1, Tier-2, Tier-3 verification
  tier1Verified: { type: Boolean, default: false },
  tier2Verified: { type: Boolean, default: false },
  tier3Verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Drone', DroneSchema);
