import { useEffect, useState } from "react";
import { FaBrain, FaCheckCircle, FaSpinner, FaCircle } from "react-icons/fa";

function Loader() {
  const steps = [
    "Reading uploaded PDF",
    "Extracting medical data",
    "Detecting abnormal values",
    "Generating AI summary",
    "Preparing recommendations",
  ];

  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;

        return prev + 1;
      });
    }, 120);

    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }

        return prev;
      });
    }, 1200);

    return () => {
      clearInterval(progressTimer);
      clearInterval(stepTimer);
    };
  }, []);

  return (
    <div className="loader-overlay">
      <div className="loader-card">
        <FaBrain className="brain-icon" />

        <h2>Analyzing Medical Report...</h2>

        <p>Please wait while NeuroAI analyzes your report.</p>

        <div className="loader-steps">
          {steps.map((step, index) => (
            <div key={index} className="loader-step">
              {index < currentStep ? (
                <FaCheckCircle className="done" />
              ) : index === currentStep ? (
                <FaSpinner className="loading" />
              ) : (
                <FaCircle className="pending" />
              )}

              <span>{step}</span>
            </div>
          ))}
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${progress}%`,
            }}
          ></div>
        </div>

        <h3>{progress}% Complete</h3>

        <p
          style={{
            fontSize: "14px",
            color: "#6b7280",
            marginTop: "10px",
          }}
        >
          Please don't close this page...
        </p>
      </div>
    </div>
  );
}

export default Loader;
