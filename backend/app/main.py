from fastapi import FastAPI, UploadFile, File, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import shutil
import os
import time
import json

from app.services.gemini_service import analyze_medical_report
from app.services.pdf_service import extract_text_from_pdf

from app.database import engine, Base, get_db

from app.models.user import User
from app.models.report import Report

from app.routers import auth, reports

from app.security import get_current_user


# Create database tables
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="NeuroAI",
    description="AI Medical Report Analyzer",
    version="1.0.0"
)


# -----------------------------
# CORS Configuration
# -----------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# Routers
# -----------------------------

app.include_router(auth.router)
app.include_router(reports.router)


# -----------------------------
# Upload Folder
# -----------------------------

UPLOAD_FOLDER = "uploads"

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)


# -----------------------------
# Home
# -----------------------------

@app.get("/")
def home():

    return {
        "message": "Welcome to NeuroAI!",
        "status": "Backend is running successfully."
    }


# -----------------------------
# Upload Medical Report
# -----------------------------

@app.post("/upload-report")
async def upload_report(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    try:

        # -----------------------------
        # Check file type
        # -----------------------------

        if not file.filename.lower().endswith(".pdf"):

            return {
                "success": False,
                "message": "Only PDF files are supported."
            }


        # -----------------------------
        # Save uploaded PDF
        # -----------------------------

        file_path = os.path.join(
            UPLOAD_FOLDER,
            file.filename
        )

        with open(file_path, "wb") as buffer:

            shutil.copyfileobj(
                file.file,
                buffer
            )


        # -----------------------------
        # Extract PDF text
        # -----------------------------

        start = time.time()

        extracted_text = extract_text_from_pdf(
            file_path
        )

        print(
            f"PDF Extraction Time: "
            f"{time.time() - start:.2f} seconds"
        )


        # -----------------------------
        # Check extracted text
        # -----------------------------

        if len(extracted_text.strip()) == 0:

            return {
                "success": False,
                "message": "No text could be extracted from the uploaded PDF."
            }


        # -----------------------------
        # Send text to Gemini
        # -----------------------------

        gemini_start = time.time()

        ai_response = analyze_medical_report(
            extracted_text
        )

        print(
            f"Gemini Time: "
            f"{time.time() - gemini_start:.2f} seconds"
        )


        # -----------------------------
        # Check Gemini response
        # -----------------------------

        if not ai_response:

            return {
                "success": False,
                "message": "No response received from Gemini."
            }


        # -----------------------------
        # Save report in database
        # -----------------------------

        new_report = Report(

            user_id=current_user.id,

            patient_name=ai_response.get(
                "patient_name",
                ""
            ),

            age=ai_response.get(
                "age",
                ""
            ),

            gender=ai_response.get(
                "gender",
                ""
            ),

            report_type=ai_response.get(
                "report_type",
                ""
            ),

            summary=ai_response.get(
                "summary",
                ""
            ),

            analysis_result=json.dumps(
                ai_response
            )
        )


        db.add(new_report)

        db.commit()

        db.refresh(new_report)


        print(
            f"Report saved successfully. "
            f"Report ID: {new_report.id}"
        )


        # -----------------------------
        # Return AI response
        # -----------------------------

        return ai_response


    except Exception as e:

        db.rollback()

        print(
            f"Upload Report Error: {str(e)}"
        )

        return {
            "success": False,
            "message": str(e)
        }


# -----------------------------
# Test Gemini
# -----------------------------

@app.get("/test-gemini")
def test_llm():

    return {
        "response": "Gemini connection successful."
    }