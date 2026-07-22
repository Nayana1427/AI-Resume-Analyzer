from pydantic import BaseModel, Field
from typing import List


class ResumeData(BaseModel):
    

    # =========================================================
    # BASIC / CONTACT INFORMATION
    # =========================================================

    name: str = ""
    email: str = ""
    phone: str = ""
    linkedin: str = ""
    github: str = ""

    # =========================================================
    # PROFESSIONAL SUMMARY
    # =========================================================

    professional_summary: str = ""

    # =========================================================
    # SKILLS
    # =========================================================

    skills: List[str] = Field(
        default_factory=list
    )

    # =========================================================
    # EDUCATION
    # =========================================================

    education: List[str] = Field(
        default_factory=list
    )

    # =========================================================
    # EXPERIENCE
    # =========================================================

    experience: List[str] = Field(
        default_factory=list
    )

    # =========================================================
    # PROJECTS
    # =========================================================

    projects: List[str] = Field(
        default_factory=list
    )

    # =========================================================
    # CERTIFICATIONS
    # =========================================================

    certifications: List[str] = Field(
        default_factory=list
    )

    # =========================================================
    # COMPLETE RESUME TEXT
    # =========================================================

    resume_text: str = ""