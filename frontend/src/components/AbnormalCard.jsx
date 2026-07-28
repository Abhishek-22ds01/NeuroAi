function AbnormalCard({ abnormalParameters }) {
  return (
    <div className="card">
      <h2>Abnormal Parameters</h2>

      <ul>
        {abnormalParameters?.map((item, index) => (
          <li key={index}>🔴 {item}</li>
        ))}
      </ul>
    </div>
  );
}

export default AbnormalCard;