function PatientCard({ result }) {
  return (
    <div className="card">
      <h2>Patient Information</h2>

      <p><strong>Name:</strong> {result.patient_name}</p>

      <p><strong>Age:</strong> {result.age}</p>

      <p><strong>Gender:</strong> {result.gender}</p>

      <p><strong>Report Type:</strong> {result.report_type}</p>
    </div>
  );
}

export default PatientCard;