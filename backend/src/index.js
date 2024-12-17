// src/index.js
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dataRoutes from "./routes/dataRoutes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/api/data", dataRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/droneData", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB");
  // Start Server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error("MongoDB Connection Error:", err);
});
