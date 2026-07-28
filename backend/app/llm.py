from google import genai
from dotenv import load_dotenv
import os
from app.prompts import EXTRACTION_PROMPT
import json

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

def analyze_medical_report(report_text):

    prompt = EXTRACTION_PROMPT.format(
        report=report_text
    )

    response = client.models.generate_content(
        model="gemini-3.5-flash",
        contents=prompt
    )

    cleaned_response = response.text.strip()

    if cleaned_response.startswith("```json"):
        cleaned_response = cleaned_response.replace("```json", "", 1)

    if cleaned_response.endswith("```"):
        cleaned_response = cleaned_response[:-3]

    cleaned_response = cleaned_response.strip()

    try:
        return json.loads(cleaned_response)

    except json.JSONDecodeError:

        return {
            "success": False,
            "message": "Gemini returned an invalid JSON response.",
            "raw_response": response.text
        }
