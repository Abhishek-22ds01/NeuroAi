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
    FaDownload,
} from "react-icons/fa";

import jsPDF from "jspdf";

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


    /*
     * DOWNLOAD REPORT AS PDF
     */

    function downloadPDF() {

        const doc = new jsPDF();

        const pageWidth =
            doc.internal.pageSize.getWidth();

        let y = 20;


        /*
         * Helper: Add wrapped text
         */

        function addText(
            text,
            x,
            yPosition,
            size = 11
        ) {

            doc.setFontSize(size);

            const lines =
                doc.splitTextToSize(
                    String(text),
                    pageWidth - 30
                );

            doc.text(
                lines,
                x,
                yPosition
            );

            return (
                yPosition +
                lines.length * 6
            );

        }


        /*
         * Helper: Check page space
         */

        function checkPageSpace(
            requiredSpace = 20
        ) {

            if (
                y + requiredSpace >
                280
            ) {

                doc.addPage();

                y = 20;

            }

        }


        /*
         * -----------------------------------------
         * HEADER
         * -----------------------------------------
         */

        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.setFontSize(22);

        doc.text(
            "NeuroAI",
            15,
            y
        );

        y += 10;


        doc.setFontSize(16);

        doc.text(
            "Medical Report",
            15,
            y
        );

        y += 10;


        doc.setDrawColor(
            37,
            99,
            235
        );

        doc.line(
            15,
            y,
            pageWidth - 15,
            y
        );

        y += 12;


        /*
         * -----------------------------------------
         * PATIENT INFORMATION
         * -----------------------------------------
         */

        checkPageSpace(50);


        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.setFontSize(14);

        doc.text(
            "Patient Information",
            15,
            y
        );

        y += 9;


        doc.setFont(
            "helvetica",
            "normal"
        );


        y = addText(
            `Name: ${
                report.patient_name ||
                "N/A"
            }`,
            15,
            y
        );


        y = addText(
            `Age: ${
                report.age ||
                "N/A"
            }`,
            15,
            y
        );


        y = addText(
            `Gender: ${
                report.gender ||
                "N/A"
            }`,
            15,
            y
        );


        y = addText(
            `Report Type: ${
                report.report_type ||
                "Medical Report"
            }`,
            15,
            y
        );


        if (report.created_at) {

            y = addText(
                `Report Date: ${
                    new Date(
                        report.created_at
                    ).toLocaleDateString(
                        "en-IN"
                    )
                }`,
                15,
                y
            );

        }


        y += 7;


        /*
         * -----------------------------------------
         * AI SUMMARY
         * -----------------------------------------
         */

        checkPageSpace(50);


        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.setFontSize(14);

        doc.text(
            "AI Summary",
            15,
            y
        );

        y += 8;


        doc.setFont(
            "helvetica",
            "normal"
        );


        y = addText(
            analysis.summary ||
                report.summary ||
                "No summary available.",
            15,
            y
        );


        y += 8;


        /*
         * -----------------------------------------
         * TEST RESULTS
         * -----------------------------------------
         */

        checkPageSpace(60);


        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.setFontSize(14);

        doc.text(
            "Test Results",
            15,
            y
        );

        y += 9;


        doc.setFontSize(9);

        doc.setFont(
            "helvetica",
            "bold"
        );


        doc.text(
            "Test",
            15,
            y
        );


        doc.text(
            "Value",
            60,
            y
        );


        doc.text(
            "Unit",
            95,
            y
        );


        doc.text(
            "Reference Range",
            125,
            y
        );


        doc.text(
            "Status",
            175,
            y
        );


        y += 6;


        doc.setFont(
            "helvetica",
            "normal"
        );


        tests.forEach(
            (test) => {

                checkPageSpace(15);


                doc.text(
                    String(
                        test.name ||
                        "-"
                    ),
                    15,
                    y
                );


                doc.text(
                    String(
                        test.value ||
                        "-"
                    ),
                    60,
                    y
                );


                doc.text(
                    String(
                        test.unit ||
                        "-"
                    ),
                    95,
                    y
                );


                doc.text(
                    String(
                        test.reference_range ||
                        "-"
                    ),
                    125,
                    y
                );


                doc.text(
                    String(
                        test.status ||
                        "Unknown"
                    ),
                    175,
                    y
                );


                y += 7;

            }
        );


        y += 8;


        /*
         * -----------------------------------------
         * ABNORMAL PARAMETERS
         * -----------------------------------------
         */

        checkPageSpace(50);


        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.setFontSize(14);

        doc.text(
            "Abnormal Parameters",
            15,
            y
        );

        y += 9;


        doc.setFont(
            "helvetica",
            "normal"
        );


        if (
            abnormalParameters.length === 0
        ) {

            y = addText(
                "No abnormal parameters found.",
                15,
                y
            );

        } else {

            abnormalParameters.forEach(
                (item) => {

                    checkPageSpace(30);


                    doc.setFont(
                        "helvetica",
                        "bold"
                    );

                    y = addText(
                        `Parameter: ${
                            item.name ||
                            "Unknown"
                        }`,
                        15,
                        y
                    );


                    doc.setFont(
                        "helvetica",
                        "normal"
                    );


                    y = addText(
                        `Value: ${
                            item.value ||
                            "-"
                        }${
                            item.unit
                                ? ` ${item.unit}`
                                : ""
                        }`,
                        15,
                        y
                    );


                    y = addText(
                        `Normal Range: ${
                            item.reference_range ||
                            "-"
                        }`,
                        15,
                        y
                    );


                    y = addText(
                        `Status: ${
                            item.status ||
                            "Abnormal"
                        }`,
                        15,
                        y
                    );


                    y += 5;

                }
            );

        }


        /*
         * -----------------------------------------
         * AI RECOMMENDATIONS
         * -----------------------------------------
         */

        checkPageSpace(50);


        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.setFontSize(14);

        doc.text(
            "AI Recommendations",
            15,
            y
        );

        y += 9;


        doc.setFont(
            "helvetica",
            "normal"
        );


        if (
            recommendations.length === 0
        ) {

            y = addText(
                "No recommendations available.",
                15,
                y
            );

        } else {

            recommendations.forEach(
                (
                    recommendation,
                    index
                ) => {

                    checkPageSpace(20);


                    y = addText(
                        `${index + 1}. ${
                            recommendation
                        }`,
                        15,
                        y
                    );


                    y += 2;

                }
            );

        }


        /*
         * -----------------------------------------
         * FOOTER
         * -----------------------------------------
         */

        const pageCount =
            doc.internal.getNumberOfPages();


        for (
            let page = 1;
            page <= pageCount;
            page++
        ) {

            doc.setPage(page);


            doc.setFont(
                "helvetica",
                "normal"
            );

            doc.setFontSize(8);


            doc.text(
                "Generated by NeuroAI",
                15,
                290
            );


            doc.text(
                `Page ${page} of ${pageCount}`,
                pageWidth - 40,
                290
            );

        }


        /*
         * -----------------------------------------
         * DOWNLOAD FILE
         * -----------------------------------------
         */

        const patientName =
            report.patient_name ||
            "Patient";


        const safeName =
            patientName
                .replace(
                    /[^a-z0-9]/gi,
                    "_"
                )
                .replace(
                    /_+/g,
                    "_"
                );


        doc.save(
            `NeuroAI_${safeName}_Report.pdf`
        );

    }


    /*
     * -----------------------------------------
     * LOADING
     * -----------------------------------------
     */

    if (loading) {

        return (

            <div className="report-details-message">

                Loading report...

            </div>

        );

    }


    /*
     * -----------------------------------------
     * ERROR
     * -----------------------------------------
     */

    if (error) {

        return (

            <div className="report-details-message error">

                {error}

            </div>

        );

    }


    /*
     * -----------------------------------------
     * REPORT NOT FOUND
     * -----------------------------------------
     */

    if (!report) {

        return (

            <div className="report-details-message">

                Report not found.

            </div>

        );

    }


    /*
     * -----------------------------------------
     * PARSE ANALYSIS RESULT
     * -----------------------------------------
     */

    let analysis = {};


    try {

        analysis =
            typeof report.analysis_result ===
            "string"

                ? JSON.parse(
                    report.analysis_result
                )

                : report.analysis_result ||
                  {};


    } catch (error) {

        console.error(
            "Unable to parse analysis result:",
            error
        );


        analysis = {};

    }


    /*
     * -----------------------------------------
     * TEST RESULTS
     * -----------------------------------------
     */

    const tests =
        analysis.tests || [];


    /*
     * -----------------------------------------
     * ABNORMAL PARAMETERS
     * -----------------------------------------
     */

    const abnormalParameters =
        tests.filter(

            (test) =>

                test.status &&

                test.status.toLowerCase() !==
                "normal"

        );


    /*
     * -----------------------------------------
     * RECOMMENDATIONS
     * -----------------------------------------
     */

    const recommendations =
        analysis.recommendations || [];


    return (

        <div className="report-details-page">


            {/* Header */}

            <div className="report-details-header">


                <button
                    className="back-btn"
                    onClick={() =>
                        navigate("/reports")
                    }
                >

                    <FaArrowLeft />

                    Back to My Reports

                </button>


                <h1>

                    <FaFileMedical />

                    Medical Report

                </h1>


                <p>

                    Detailed AI analysis of the
                    medical report

                </p>


                {/* Download PDF */}

                <button
                    className="download-report-btn"
                    onClick={downloadPDF}
                >

                    <FaDownload />

                    Download Report

                </button>


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

                            {report.patient_name ||
                                "N/A"}

                        </strong>

                    </div>



                    <div className="patient-item">

                        <span>

                            <FaBirthdayCake />

                            Age

                        </span>


                        <strong>

                            {report.age ||
                                "N/A"}

                        </strong>

                    </div>



                    <div className="patient-item">

                        <span>

                            <FaVenusMars />

                            Gender

                        </span>


                        <strong>

                            {report.gender ||
                                "N/A"}

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

                                        <tr
                                            key={index}
                                        >

                                            <td>

                                                {test.name}

                                            </td>


                                            <td>

                                                {test.value}

                                            </td>


                                            <td>

                                                {test.unit ||
                                                    "-"}

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

                                        {item.value ||
                                            "-"}

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
                            (
                                recommendation,
                                index
                            ) => (

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