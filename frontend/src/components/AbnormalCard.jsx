import { FaExclamationTriangle } from "react-icons/fa";

function AbnormalCard({ abnormalParameters }) {

    if (
        !abnormalParameters ||
        abnormalParameters.length === 0
    ) {
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

                {abnormalParameters.map((item, index) => (

                    <div
                        key={index}
                        className="abnormal-item"
                    >

                        <h3>{item.parameter}</h3>

                        <p>
                            <strong>Value:</strong> {item.value}
                        </p>

                        <p>
                            <strong>Normal Range:</strong>{" "}
                            {item.normal_range}
                        </p>

                        <span className="status-badge">
                            {item.status}
                        </span>

                    </div>

                ))}

            </div>

        </div>

    );

}

export default AbnormalCard;