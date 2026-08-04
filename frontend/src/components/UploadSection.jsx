import { FaCloudUploadAlt, FaFilePdf } from "react-icons/fa";

function UploadSection({ file, setFile, uploadFile, loading }) {

    function handleFileChange(e) {

        if (e.target.files.length > 0) {

            setFile(e.target.files[0]);

        }

    }

    return (

        <div className="upload-card">

            <FaCloudUploadAlt
                className="upload-icon"
            />

            <h2>Upload Medical Report</h2>

            <p>
                Drag & Drop or Browse your PDF report
            </p>

            <label className="custom-file-btn">

                Browse PDF

                <input
                    type="file"
                    accept=".pdf"
                    hidden
                    onChange={handleFileChange}
                />

            </label>

            {file && (

                <div className="selected-file">

                    <FaFilePdf className="pdf-icon" />

                    <div>

                        <h4>{file.name}</h4>

                        <p>

                            {(file.size / 1024).toFixed(2)} KB

                        </p>

                    </div>

                    <span className="ready-badge">

                        Ready

                    </span>

                </div>

            )}

            <button
                className="upload-btn"
                onClick={uploadFile}
                disabled={!file || loading}
            >

                {loading
                    ? "Analyzing..."
                    : "🧠 Analyze Report"}

            </button>

        </div>

    );

}

export default UploadSection;