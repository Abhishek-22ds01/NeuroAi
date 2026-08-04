import { FaBrain } from "react-icons/fa";

function SummaryCard({ summary }) {

    return (

        <div className="card">

            <h2>
                <FaBrain style={{ marginRight: "10px" }} />
                AI Summary
            </h2>

            <div className="summary-box">

                {summary}

            </div>

        </div>

    );

}

export default SummaryCard;