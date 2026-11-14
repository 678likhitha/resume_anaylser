from fastapi import FastAPI, UploadFile, File
from pypdf import PdfReader
from fastapi.middleware.cors import CORSMiddleware
import tempfile

from services.gemini_service import analyze_resume
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","https://resume-anaylser-q5aa.vercel.app/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Resume Analyzer API Running"}

@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
        temp_file.write(await file.read())
        temp_path = temp_file.name

    reader = PdfReader(temp_path)

    text = ""

    for page in reader.pages:
        text += page.extract_text()

    return {
        "filename": file.filename,
        "resume_text": text[:1000]
    }
@app.post("/analyze-resume")
async def analyze(file: UploadFile = File(...)):

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
        temp_file.write(await file.read())
        temp_path = temp_file.name

    reader = PdfReader(temp_path)

    text = ""

    for page in reader.pages:
        page_text = page.extract_text()

        if page_text:
            text += page_text

    result = analyze_resume(text)

    return {
        "analysis": result
    }