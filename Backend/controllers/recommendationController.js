import { generateRecommendations } from "../services/recommendationService.js";

export const getRecommendations = async (req, res) => {
  try {
    const data = await generateRecommendations();

    res.status(200).json({
      success: true,
      ...data,
    });
  } catch (error) {
    console.error("Recommendation error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate recommendations",
    });
  }
};