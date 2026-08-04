import { useState } from "react";

import Navbar from "../components/Navbar";
import UploadSection from "../components/UploadSection";
import Loader from "../components/Loader";
import PatientCard from "../components/PatientCard";
import SummaryCard from "../components/SummaryCard";
import AbnormalCard from "../components/AbnormalCard";
import RecommendationCard from "../components/RecommendationCard";
import TestTable from "../components/TestTable";

import "./Dashboard.css";

function Dashboard() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function uploadFile() {
    if (!file) {
      alert("Please select a PDF.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const token = localStorage.getItem("access_token");

      const response = await fetch("http://127.0.0.1:8000/upload-report", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload Failed");
      }

      const data = await response.json();

      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      <div className="dashboard">
        <div className="upload-card">
          <UploadSection
            file={file}
            setFile={setFile}
            uploadFile={uploadFile}
            loading={loading}
          />
        </div>

        {loading && <Loader />}

        {result && (
          <>
            <PatientCard result={result} />

            <SummaryCard summary={result.summary} />

            <AbnormalCard abnormalParameters={result.abnormal_parameters} />

            <RecommendationCard recommendations={result.recommendations} />

            <TestTable tests={result.tests} />
          </>
        )}
      </div>
    </>
  );
}

export default Dashboard;
