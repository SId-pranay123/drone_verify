export const CONFIG = {
    PEAQ_NODE_URL: "wss://wsspc1-qa.agung.peaq.network",
    BATCH_SIZE: 100,
    BATCH_TIMEOUT: 5000,
    PATTERN_THRESHOLD: 0.85,
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/drone-auth",
    MAX_LOCATION_HISTORY: 100,
    MAX_DISTANCE_KM: 100
};