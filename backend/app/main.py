from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import time
from app.services.gemini_service import analyze_medical_report
from app.services.pdf_service import extract_text_from_pdf
from app.database import engine
from app.models.user import User
from app.routers import auth
from app.database import Base
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="NeuroAI",
    description="AI Medical Report Analyzer",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router)

# Upload Folder
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.get("/")
def home():
    return {
        "message": "Welcome to NeuroAI!",
        "status": "Backend is running successfully."
    }


@app.post("/upload-report")
async def upload_report(file: UploadFile = File(...)):
    try:

        # Check file type
        if not file.filename.lower().endswith(".pdf"):
            return {
                "success": False,
                "message": "Only PDF files are supported."
            }

        # Save uploaded PDF
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Try normal PDF text extraction
        # Measure PDF extraction time
        start = time.time()

        extracted_text = extract_text_from_pdf(file_path)

        print(f"PDF Extraction Time: {time.time() - start:.2f} seconds")

        # Check if any text was extracted
        if len(extracted_text.strip()) == 0:
            return {
                "success": False,
                "message": "No text could be extracted from the uploaded PDF."
            }

        # Send extracted text to Gemini
        gemini_start = time.time()

        ai_response = analyze_medical_report(extracted_text)

        print(f"Gemini Time: {time.time() - gemini_start:.2f} seconds")

        return ai_response

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }


@app.get("/test-gemini")
def test_llm():
    return {
        "response": "Gemini connection successful."
    }

