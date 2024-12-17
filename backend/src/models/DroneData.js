// src/models/DroneData.js
import mongoose from "mongoose";

const DroneDataSchema = new mongoose.Schema({
  remoteId: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  speed: { type: Number, required: true },
  height: { type: Number, required: true },
  signature: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  blockchainTxHash: { type: String }
});

export default mongoose.model("DroneData", DroneDataSchema);
