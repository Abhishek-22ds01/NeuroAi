import { useEffect, useState } from "react";
import {
    FaFileMedical,
    FaEye,
    FaTrash,
    FaArrowLeft,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import "./reports.css";


function Reports() {

    const navigate = useNavigate();

    const [reports, setReports] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [deletingId, setDeletingId] = useState(null);


    useEffect(() => {

        fetchReports();

    }, []);


    async function fetchReports() {

        try {

            const token =
                localStorage.getItem("access_token");


            const response = await fetch(
                "http://127.0.0.1:8000/reports/",
                {
                    method: "GET",

                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Failed to fetch reports."
                );

            }


            const data = await response.json();

            setReports(data);

        } catch (error) {

            console.error(error);

            setError(
                "Unable to load your reports."
            );

        } finally {

            setLoading(false);

        }

    }


    async function deleteReport(reportId) {

        const confirmed = window.confirm(
            "Are you sure you want to delete this report?"
        );


        if (!confirmed) {

            return;

        }


        try {

            setDeletingId(reportId);


            const token =
                localStorage.getItem("access_token");


            const response = await fetch(
                `http://127.0.0.1:8000/reports/${reportId}`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Failed to delete report."
                );

            }


            // Remove deleted report
            // from the screen

            setReports((previousReports) =>
                previousReports.filter(
                    (report) =>
                        report.id !== reportId
                )
            );


        } catch (error) {

            console.error(error);

            alert(
                "Unable to delete the report."
            );

        } finally {

            setDeletingId(null);

        }

    }


    return (

        <div className="reports-page">


            {/* Back to Dashboard */}

            <button
                className="back-dashboard-btn"
                onClick={() => navigate("/dashboard")}
            >

                <FaArrowLeft />

                Back to Dashboard

            </button>



            {/* Page Header */}

            <div className="reports-header">

                <div>

                    <h1>

                        <FaFileMedical />

                        My Reports

                    </h1>


                    <p>

                        View your previously analyzed
                        medical reports.

                    </p>

                </div>

            </div>



            {/* Loading */}

            {loading && (

                <div className="reports-message">

                    Loading your reports...

                </div>

            )}



            {/* Error */}

            {!loading && error && (

                <div className="reports-error">

                    {error}

                </div>

            )}



            {/* No Reports */}

            {!loading &&
                !error &&
                reports.length === 0 && (

                    <div className="reports-empty">

                        <FaFileMedical />

                        <h2>
                            No Reports Found
                        </h2>

                        <p>
                            Upload and analyze a medical
                            report to see it here.
                        </p>


                        <button
                            onClick={() =>
                                navigate("/dashboard")
                            }
                        >
                            Analyze a Report
                        </button>

                    </div>

                )}



            {/* Reports */}

            {!loading &&
                !error &&
                reports.length > 0 && (

                    <div className="reports-grid">

                        {reports.map((report) => (

                            <div
                                className="report-card"
                                key={report.id}
                            >


                                {/* Icon */}

                                <div className="report-icon">

                                    <FaFileMedical />

                                </div>



                                {/* Report Information */}

                                <div className="report-info">

                                    <h2>

                                        {report.patient_name ||
                                            "Unknown Patient"}

                                    </h2>


                                    <p className="report-type">

                                        {report.report_type ||
                                            "Medical Report"}

                                    </p>


                                    <div className="report-details">

                                        <span>

                                            Age:{" "}

                                            {report.age ||
                                                "N/A"}

                                        </span>


                                        <span>

                                            Gender:{" "}

                                            {report.gender ||
                                                "N/A"}

                                        </span>

                                    </div>


                                    {report.created_at && (

                                        <p className="report-date">

                                            {new Date(
                                                report.created_at
                                            ).toLocaleDateString(
                                                "en-IN",
                                                {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                }
                                            )}

                                        </p>

                                    )}

                                </div>



                                {/* Buttons */}

                                <div className="report-actions">


                                    {/* View */}

                                    <button
                                        className="view-report-btn"
                                        onClick={() =>
                                            navigate(
                                                `/reports/${report.id}`
                                            )
                                        }
                                    >

                                        <FaEye />

                                        View Report

                                    </button>



                                    {/* Delete */}

                                    <button
                                        className="delete-report-btn"
                                        onClick={() =>
                                            deleteReport(
                                                report.id
                                            )
                                        }
                                        disabled={
                                            deletingId ===
                                            report.id
                                        }
                                    >

                                        <FaTrash />

                                        {deletingId ===
                                        report.id
                                            ? "Deleting..."
                                            : "Delete"}

                                    </button>


                                </div>


                            </div>

                        ))}

                    </div>

                )}

        </div>

    );

}


export default Reports;