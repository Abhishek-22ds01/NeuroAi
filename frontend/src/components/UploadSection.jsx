function UploadSection({ setFile, uploadFile }) {
  return (
    <div className="card">
      <h2>Upload Medical Report</h2>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br />

      <button onClick={uploadFile}>
        Upload & Analyze
      </button>
    </div>
  );
}

export default UploadSection;