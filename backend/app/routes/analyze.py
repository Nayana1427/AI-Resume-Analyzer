from pathlib import Path

from fastapi import APIRouter, HTTPException

from app.services.parser import ResumeParser
from app.services.information_extractor import InformationExtractor
from app.services.ats_engine import ATSEngine
from app.services.scoring import ATSScorer

router = APIRouter(
    prefix="/api",
    tags=["Resume Analysis"]
)

UPLOAD_DIR = Path("app/uploads")


@router.get("/analyze/{resume_id}")
async def analyze_resume(resume_id: str):

    file_path = None

    for ext in [".pdf", ".docx"]:

        temp = UPLOAD_DIR / f"{resume_id}{ext}"

        if temp.exists():
            file_path = temp
            break

    if file_path is None:
        raise HTTPException(
            status_code=404,
            detail="Resume not found."
        )

    resume_text = ResumeParser.extract_text(str(file_path))

    resume_data = InformationExtractor.extract(resume_text)

    ats_score = ATSScorer.calculate(resume_data)

    ats_engine = ATSEngine()

    job_match = ats_engine.evaluate(
        resume_skills=resume_data.skills,
        job_role="",
        job_description=""
    )

    return {
        "success": True,
        "resume_id": resume_id,
        "ats_score": ats_score,
        "job_match": job_match,
        "data": resume_data.model_dump()
    }