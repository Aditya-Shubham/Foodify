const RecommendationSection = ({ recommendationData }) => {
  if (
    !recommendationData ||
    recommendationData.recommendations.length === 0
  ) {
    return null;
  }

  return (
    <section className="recommendation-section">
      <h2>{recommendationData.greeting}</h2>

      <p>
        Recommended for {recommendationData.meal} • {recommendationData.season}
      </p>

      <div className="recommendation-grid">
        {recommendationData.recommendations.map((food) => (
          <div key={food.foodName} className="recommendation-card">
            <img
              src={`http://localhost:5000/uploads/${food.image}`}
              alt={food.foodName}
            />

            <h3>{food.foodName}</h3>

            <p>{food.restaurantName}</p>

            <h4>₹{food.price}</h4>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecommendationSection;