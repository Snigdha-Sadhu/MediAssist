import express from "express";
const router=express.Router();

import {searchEmergency } from "../Controller/aiController.js";
import {analyzeHealth} from "../Controller/chatController.js"

router.post("/health",analyzeHealth);
router.post("/search",searchEmergency);
export default router;
