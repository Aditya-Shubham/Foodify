export const getCurrentRecommendationContext = () => {
  const now = new Date();

  const hour = now.getHours();
  const month = now.getMonth() + 1;

  let greeting = "";
  let meal = "";
  let season = "";

  /* ===========================
     Greeting
  =========================== */
  if (hour >= 5 && hour < 12) {
    greeting = "Good Morning ☀️";
  } else if (hour >= 12 && hour < 17) {
    greeting = "Good Afternoon 🌤️";
  } else if (hour >= 17 && hour < 22) {
    greeting = "Good Evening 🌙";
  } else {
    greeting = "Good Night 🌃";
  }

  /* ===========================
     Meal Time
  =========================== */
  if (hour >= 6 && hour < 11) {
    meal = "Breakfast";
  } else if (hour >= 11 && hour < 16) {
    meal = "Lunch";
  } else if (hour >= 16 && hour < 19) {
    meal = "Snacks";
  } else {
    meal = "Dinner";
  }

  /* ===========================
     Season (India)
  =========================== */
  if ([3, 4, 5].includes(month)) {
    season = "Summer";
  } else if ([6, 7, 8, 9].includes(month)) {
    season = "Monsoon";
  } else if ([10, 11].includes(month)) {
    season = "Autumn";
  } else {
    season = "Winter";
  }

  return {
    greeting,
    meal,
    season,
    hour,
    month,
  };
};