// src/routes/dataRoutes.js
import express from "express";
import { submitData } from "../controllers/dataController.js";

const router = express.Router();

// POST /api/data/submit
router.post("/submit", submitData);

export default router;
