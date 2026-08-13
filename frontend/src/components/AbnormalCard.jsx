import { FaExclamationTriangle } from "react-icons/fa";

function AbnormalCard({ abnormalParameters }) {
    if (!abnormalParameters || abnormalParameters.length === 0) {
        return (
            <div className="card">
                <h2>
                    <FaExclamationTriangle
                        style={{ marginRight: "10px" }}
                    />
                    Abnormal Parameters
                </h2>

                <div className="normal-box">
                    🎉 No abnormal parameters found.
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <h2>
                <FaExclamationTriangle
                    style={{ marginRight: "10px" }}
                />
                Abnormal Parameters
            </h2>

            <div className="abnormal-grid">
                {abnormalParameters.map((item, index) => {

                    // Handle old Gemini response:
                    // ["Creatinine", "Urea", "Potassium"]
                    if (typeof item === "string") {
                        return (
                            <div
                                key={index}
                                className="abnormal-item"
                            >
                                <h3>{item}</h3>

                                <p>
                                    <strong>Value:</strong> N/A
                                </p>

                                <p>
                                    <strong>Normal Range:</strong> N/A
                                </p>

                                <span className="status-badge">
                                    Abnormal
                                </span>
                            </div>
                        );
                    }

                    // Handle correct object response
                    return (
                        <div
                            key={index}
                            className="abnormal-item"
                        >
                            <h3>
                                {item.parameter || item.name || "Unknown"}
                            </h3>

                            <p>
                                <strong>Value:</strong>{" "}
                                {item.value || "N/A"}
                            </p>

                            <p>
                                <strong>Normal Range:</strong>{" "}
                                {item.normal_range ||
                                    item.reference_range ||
                                    "N/A"}
                            </p>

                            <span className="status-badge">
                                {item.status || "Abnormal"}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default AbnormalCard;