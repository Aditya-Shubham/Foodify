import Restaurant from "../models/Restaurant.js";
import { getCurrentRecommendationContext } from "../utils/recommendationEngine.js";

export const generateRecommendations = async () => {
  const context = getCurrentRecommendationContext();

  // Fetch only approved & open restaurants
  const restaurants = await Restaurant.find({
    approved: true,
    isOpen: true,
  }).lean();

  const recommendations = [];

  for (const restaurant of restaurants) {
    for (const item of restaurant.menu) {
      let score = 0;

      // ==========================
      // 40% Time Match
      // ==========================
      if (
        item.suitableTime &&
        item.suitableTime.includes(context.meal)
      ) {
        score += 40;
      }

      // ==========================
      // 30% Season Match
      // ==========================
      if (
        item.suitableSeason &&
        item.suitableSeason.includes(context.season)
      ) {
        score += 30;
      }

      // ==========================
      // 20% Popularity
      // (Future)
      // ==========================
      score += 0;

      // ==========================
      // 10% User Preference
      // (Future)
      // ==========================
   score += 0;

// Only recommend matching foods
if (score > 0) {
  recommendations.push({
    score,

    restaurantId: restaurant._id,
    restaurantName: restaurant.name,

    foodName: item.name,
    price: item.price,
    image: item.image,
    type: item.type,
    category: item.category,

    suitableTime: item.suitableTime,
    suitableSeason: item.suitableSeason,
  });
}
  }
  }
  recommendations.sort((a, b) => b.score - a.score);

  return {
    greeting: context.greeting,
    meal: context.meal,
    season: context.season,
    hour: context.hour,
    month: context.month,

    recommendations: recommendations.slice(0, 10),
  };
};