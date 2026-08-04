import { FaLightbulb } from "react-icons/fa";

function RecommendationCard({ recommendations }) {

    return (

        <div className="card">

            <h2>
                <FaLightbulb
                    style={{ marginRight: "10px", color: "#f59e0b" }}
                />
                AI Recommendations
            </h2>

            <div className="recommendation-list">

                {recommendations && recommendations.length > 0 ? (

                    recommendations.map((item, index) => (

                        <div
                            key={index}
                            className="recommendation-item"
                        >

                            <span className="recommendation-icon">
                                💡
                            </span>

                            <span>
                                {item}
                            </span>

                        </div>

                    ))

                ) : (

                    <div className="normal-box">
                        No recommendations available.
                    </div>

                )}

            </div>

        </div>

    );

}

export default RecommendationCard;