import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
    FaArrowLeft,
    FaUser,
    FaBirthdayCake,
    FaVenusMars,
    FaFileMedical,
    FaBrain,
    FaExclamationTriangle,
    FaLightbulb,
} from "react-icons/fa";

import "./ReportDetails.css";


function ReportDetails() {

    const { report_id } = useParams();

    const navigate = useNavigate();

    const [report, setReport] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    useEffect(() => {

        fetchReport();

    }, [report_id]);


    async function fetchReport() {

        try {

            const token =
                localStorage.getItem("access_token");


            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/reports/${report_id}`,
                {
                    method: "GET",

                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Failed to load report."
                );

            }


            const data = await response.json();

            setReport(data);


        } catch (error) {

            console.error(error);

            setError(
                "Unable to load this report."
            );


        } finally {

            setLoading(false);

        }

    }


    /* Loading */

    if (loading) {

        return (

            <div className="report-details-message">

                Loading report...

            </div>

        );

    }


    /* Error */

    if (error) {

        return (

            <div className="report-details-message error">

                {error}

            </div>

        );

    }


    /* Report not found */

    if (!report) {

        return (

            <div className="report-details-message">

                Report not found.

            </div>

        );

    }


    /*
     * analysis_result is stored as JSON text
     * in the database, so convert it back
     * into an object.
     */

    let analysis = {};


    try {

        analysis =
            typeof report.analysis_result === "string"
                ? JSON.parse(report.analysis_result)
                : report.analysis_result || {};


    } catch (error) {

        console.error(
            "Unable to parse analysis result:",
            error
        );

        analysis = {};

    }


    /*
     * Test results are stored inside analysis.tests
     */

    const tests = analysis.tests || [];


    /*
     * Get abnormal parameters directly
     * from the saved test results.
     *
     * Anything whose status is not "normal"
     * is considered abnormal.
     */

    const abnormalParameters = tests.filter(

        (test) =>

            test.status &&

            test.status.toLowerCase() !== "normal"

    );


    /*
     * AI recommendations
     */

    const recommendations =
        analysis.recommendations || [];


    return (

        <div className="report-details-page">


            {/* Header */}

            <div className="report-details-header">

                <button
                    className="back-btn"
                    onClick={() => navigate("/reports")}
                >

                    <FaArrowLeft />

                    Back to My Reports

                </button>


                <h1>

                    <FaFileMedical />

                    Medical Report

                </h1>


                <p>

                    Detailed AI analysis of the medical report

                </p>

            </div>



            {/* Patient Information */}

            <div className="details-card">

                <h2>

                    <FaUser />

                    Patient Information

                </h2>


                <div className="patient-grid">


                    <div className="patient-item">

                        <span>

                            Name

                        </span>


                        <strong>

                            {report.patient_name || "N/A"}

                        </strong>

                    </div>



                    <div className="patient-item">

                        <span>

                            <FaBirthdayCake />

                            Age

                        </span>


                        <strong>

                            {report.age || "N/A"}

                        </strong>

                    </div>



                    <div className="patient-item">

                        <span>

                            <FaVenusMars />

                            Gender

                        </span>


                        <strong>

                            {report.gender || "N/A"}

                        </strong>

                    </div>



                    <div className="patient-item">

                        <span>

                            <FaFileMedical />

                            Report Type

                        </span>


                        <strong>

                            {report.report_type ||
                                "Medical Report"}

                        </strong>

                    </div>


                </div>

            </div>



            {/* AI Summary */}

            <div className="details-card">

                <h2>

                    <FaBrain />

                    AI Summary

                </h2>


                <div className="summary-box">

                    {analysis.summary ||

                        report.summary ||

                        "No summary available."}

                </div>

            </div>



            {/* Test Results */}

            <div className="details-card">

                <h2>

                    <FaFileMedical />

                    Test Results

                </h2>


                {tests.length === 0 ? (

                    <div className="empty-box">

                        No test results available.

                    </div>

                ) : (

                    <div className="table-container">

                        <table>

                            <thead>

                                <tr>

                                    <th>
                                        Test
                                    </th>

                                    <th>
                                        Value
                                    </th>

                                    <th>
                                        Unit
                                    </th>

                                    <th>
                                        Reference Range
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {tests.map(
                                    (test, index) => (

                                        <tr key={index}>

                                            <td>

                                                {test.name}

                                            </td>


                                            <td>

                                                {test.value}

                                            </td>


                                            <td>

                                                {test.unit || "-"}

                                            </td>


                                            <td>

                                                {test.reference_range ||
                                                    "-"}

                                            </td>


                                            <td>

                                                <span
                                                    className={`status ${(
                                                        test.status ||
                                                        "Unknown"
                                                    ).toLowerCase()}`}
                                                >

                                                    {test.status ||
                                                        "Unknown"}

                                                </span>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>



            {/* Abnormal Parameters */}

            <div className="details-card">

                <h2>

                    <FaExclamationTriangle />

                    Abnormal Parameters

                </h2>


                {abnormalParameters.length === 0 ? (

                    <div className="normal-box">

                        🎉 No abnormal parameters found.

                    </div>

                ) : (

                    <div className="abnormal-grid">

                        {abnormalParameters.map(
                            (item, index) => (

                                <div
                                    className="abnormal-card"
                                    key={index}
                                >


                                    <h3>

                                        {item.name ||
                                            "Unknown"}

                                    </h3>


                                    <p>

                                        <strong>
                                            Value:
                                        </strong>{" "}

                                        {item.value || "-"}

                                        {item.unit
                                            ? ` ${item.unit}`
                                            : ""}

                                    </p>


                                    <p>

                                        <strong>
                                            Normal Range:
                                        </strong>{" "}

                                        {item.reference_range ||
                                            "-"}

                                    </p>


                                    <span className="abnormal-status">

                                        {item.status ||
                                            "Abnormal"}

                                    </span>


                                </div>

                            )
                        )}

                    </div>

                )}

            </div>



            {/* AI Recommendations */}

            <div className="details-card">

                <h2>

                    <FaLightbulb />

                    AI Recommendations

                </h2>


                {recommendations.length === 0 ? (

                    <div className="empty-box">

                        No recommendations available.

                    </div>

                ) : (

                    <div className="recommendations">

                        {recommendations.map(
                            (recommendation, index) => (

                                <div
                                    className="recommendation"
                                    key={index}
                                >

                                    💡

                                    <span>

                                        {recommendation}

                                    </span>

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>


        </div>

    );

}


export default ReportDetails;