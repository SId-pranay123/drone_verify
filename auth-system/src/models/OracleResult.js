import mongoose from 'mongoose';

const OracleResultSchema = new mongoose.Schema({
  dataId: {
    type: String,
    required: true
  },
  oracleName: {
    type: String,
    required: true
  },
  verificationResult: {
    type: Boolean,
    required: true
  },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('OracleResult', OracleResultSchema);
