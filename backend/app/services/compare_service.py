import json


def compare_reports(reports):
    """
    Compare test results from multiple medical reports.
    """

    comparison = {}

    for report in reports:

        try:
            analysis = json.loads(report.analysis_result)
        except (json.JSONDecodeError, TypeError):
            continue

        tests = analysis.get("tests", [])

        for test in tests:
            test_name = test.get("name", "").strip()

            if not test_name:
                continue

            value = test.get("value", "")

            try:
                numeric_value = float(value)
            except (ValueError, TypeError):
                continue

            if test_name not in comparison:
                comparison[test_name] = []

            comparison[test_name].append({
                "report_id": report.id,
                "date": (
                    report.created_at.isoformat()
                    if report.created_at
                    else None
                ),
                "value": numeric_value,
                "unit": test.get("unit", ""),
                "reference_range": test.get("reference_range", ""),
                "status": test.get("status", "")
            })

    return comparison