function RecommendationCard({ recommendations }) {
  return (
    <div className="card">
      <h2>Recommendations</h2>

      <ul>
        {recommendations?.map((item, index) => (
          <li key={index}>✅ {item}</li>
        ))}
      </ul>
    </div>
  );
}

export default RecommendationCard;