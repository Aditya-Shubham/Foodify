import express from "express";
import { getRecommendations } from "../controllers/recommendationController.js";

const router = express.Router();

/* USER → GET RECOMMENDATIONS */
router.get("/", getRecommendations);

export default router;