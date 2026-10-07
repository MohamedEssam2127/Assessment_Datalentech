import { Router } from "express";
import { createReport, getReports } from "../controllers/reportController.js";

const router = Router();

// POST /reports — submit a new inspection report
router.post("/", createReport);

// GET /reports — list all saved reports
router.get("/", getReports);

export default router;
