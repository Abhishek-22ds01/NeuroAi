EXTRACTION_PROMPT = """
You are an expert medical report analyzer.

Analyze the following medical report carefully.

The report may be ANY type of medical report such as:

- CBC
- Lipid Profile
- Heart Health
- Liver Function Test
- Kidney Function Test
- Thyroid
- Vitamin
- Urine Test
- ECG
- Any pathology report

Return ONLY valid JSON.

{{
    "patient_name": "",
    "age": "",
    "gender": "",

    "report_type": "",

    "tests": [
        {{
            "name": "",
            "value": "",
            "unit": "",
            "reference_range": "",
            "status": ""
        }}
    ],

    "summary": "",

    "abnormal_parameters": [],

    "recommendations": []
}}

Rules:

1. Extract EVERY test found in the report.

2. Do NOT invent tests.

3. If age or gender is missing, return "".

4. Status must be one of:

- Low
- Normal
- High
- Borderline
- Critical
- Unknown

5. Return ONLY JSON.

Medical Report:

{report}
"""