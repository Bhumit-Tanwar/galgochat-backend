import express from "express";
import Report from "../models/Report.js";
import User from "../models/User.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

/**
 * View reports
 */
router.post("/reports", adminAuth, async (req, res) => {
  const reports = await Report.find().sort({ createdAt: -1 });
  res.json(reports);
});

/**
 * Ban user
 */
router.post("/ban", adminAuth, async (req, res) => {
  const { emailHash } = req.body;

  await User.updateOne({ emailHash }, { banned: true });

  res.json({ message: "User banned" });
});

export default router;
