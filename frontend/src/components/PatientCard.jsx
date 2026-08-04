import {
    FaUser,
    FaBirthdayCake,
    FaVenusMars,
    FaFileMedical
} from "react-icons/fa";

function PatientCard({ result }) {

    return (

        <div className="card">

            <h2>Patient Information</h2>

            <div className="patient-grid">

                <div className="patient-item">
                    <FaUser className="icon" />
                    <div>
                        <span>Name</span>
                        <h4>{result.patient_name || "N/A"}</h4>
                    </div>
                </div>

                <div className="patient-item">
                    <FaBirthdayCake className="icon" />
                    <div>
                        <span>Age</span>
                        <h4>{result.age || "N/A"}</h4>
                    </div>
                </div>

                <div className="patient-item">
                    <FaVenusMars className="icon" />
                    <div>
                        <span>Gender</span>
                        <h4>{result.gender || "N/A"}</h4>
                    </div>
                </div>

                <div className="patient-item">
                    <FaFileMedical className="icon" />
                    <div>
                        <span>Report Type</span>
                        <h4>{result.report_type || "Medical Report"}</h4>
                    </div>
                </div>

            </div>

        </div>

    );

}

export default PatientCard;