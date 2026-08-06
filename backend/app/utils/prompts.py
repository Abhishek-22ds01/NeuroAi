EXTRACTION_PROMPT = """
You are an expert medical report analyzer.

Analyze the following medical report carefully.

The report may be ANY type of medical report such as:

- CBC
- Lipid Profile
- Heart Health
- Liver Function Test
- Kidney Function Test
- Thyroid Function Test
- Vitamin Test
- Urine Test
- ECG
- Pathology Report
- Any laboratory medical report

Return ONLY valid JSON.

{
    "patient_name": "",
    "age": "",
    "gender": "",
    "report_type": "",

    "tests": [
        {
            "name": "",
            "value": "",
            "unit": "",
            "reference_range": "",
            "status": ""
        }
    ],

    "summary": "",

    "abnormal_parameters": [
        {
            "parameter": "",
            "value": "",
            "normal_range": "",
            "status": ""
        }
    ],

    "recommendations": [
        ""
    ]
}

Rules:

1. Extract the patient's name, age, gender and report type whenever available.

2. Extract EVERY laboratory test exactly as written in the report.

3. Do NOT invent or guess tests that are not present.

4. If patient name, age or gender is missing, return an empty string "".

5. Every test inside "tests" MUST follow this format:

{
    "name": "",
    "value": "",
    "unit": "",
    "reference_range": "",
    "status": ""
}

6. Determine the status using the reference range.

Allowed values are ONLY:

- Low
- Normal
- High
- Borderline
- Critical
- Unknown

7. The "summary" should contain a short medical summary in simple English (3-6 sentences).

8. "abnormal_parameters" must contain ONLY those tests whose status is NOT "Normal".

9. Every abnormal parameter MUST follow EXACTLY this structure:

{
    "parameter": "",
    "value": "",
    "normal_range": "",
    "status": ""
}

Where:

- parameter = test name
- value = observed value (include unit if available)
- normal_range = reference range
- status = Low / High / Borderline / Critical / Unknown

10. If there are NO abnormal parameters, return:

"abnormal_parameters": []

11. Give 3-5 useful health recommendations based ONLY on the abnormalities found.

12. If every test is normal, recommend maintaining a healthy lifestyle instead of inventing diseases.

13. Return ONLY valid JSON.

Do NOT include:

- Markdown
- Triple backticks
- Explanations
- Notes
- Extra text

Medical Report:

{report}
"""