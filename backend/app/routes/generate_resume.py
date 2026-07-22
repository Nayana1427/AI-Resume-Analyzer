from pathlib import Path

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from app.services.parser import ResumeParser
from app.services.information_extractor import InformationExtractor
from app.services.resume_generator import ResumeGenerator


router = APIRouter(
    prefix="/api",
    tags=["Resume Generation"],
)

UPLOAD_DIR = Path("app/uploads")

ALLOWED_TEMPLATES = {
    "classic",
    "modern",
    "student",
    "professional",
}


@router.get("/generate-resume/{resume_id}/{template}")
async def generate_resume(resume_id: str, template: str):

    template = template.lower().strip()

    if template not in ALLOWED_TEMPLATES:
        raise HTTPException(
            status_code=400,
            detail="Invalid resume template.",
        )

    file_path = None

    for extension in [".pdf", ".docx"]:
        candidate = UPLOAD_DIR / f"{resume_id}{extension}"

        if candidate.exists():
            file_path = candidate
            break

    if file_path is None:
        raise HTTPException(
            status_code=404,
            detail="Original resume not found.",
        )

    try:
        resume_text = ResumeParser.extract_text(str(file_path))

        resume_data = InformationExtractor.extract(resume_text)

        generated_path = ResumeGenerator.generate(
            resume_id=resume_id,
            template=template,
            resume_data=resume_data,
        )

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to generate resume: {str(exc)}",
        )

    if not generated_path.exists():
        raise HTTPException(
            status_code=500,
            detail="Resume PDF was not created.",
        )

    template_names = {
        "classic": "Classic_ATS",
        "modern": "Modern_Professional",
        "student": "Fresher_Student",
        "professional": "Experienced_Professional",
    }

    download_name = (
        f"ResumeIQ_{template_names[template]}_Resume.pdf"
    )

    return FileResponse(
        path=str(generated_path),
        media_type="application/pdf",
        filename=download_name,
    )