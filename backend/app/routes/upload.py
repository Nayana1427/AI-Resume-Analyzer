from fastapi import APIRouter, UploadFile, File, HTTPException
from pathlib import Path
from app.services.parser import ResumeParser
import shutil
import uuid

router = APIRouter(
    prefix="/api",
    tags=["Resume Upload"]
)

UPLOAD_DIR = Path("app/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_EXTENSIONS = {".pdf", ".docx"}


@router.post("/upload")
async def upload_resume(
    resume: UploadFile = File(...)
):

    if not resume.filename:
        raise HTTPException(
            status_code=400,
            detail="No file selected."
        )

    extension = Path(resume.filename).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are allowed."
        )

    resume_id = str(uuid.uuid4())

    filename = f"{resume_id}{extension}"

    file_path = UPLOAD_DIR / filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(resume.file, buffer)

    ResumeParser.extract_text(str(file_path))

    return {
        "success": True,
        "resume_id": resume_id,
        "message": "Resume uploaded successfully."
    }