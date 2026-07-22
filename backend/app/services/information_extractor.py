import re

from app.services.skill_extractor import SkillExtractor
from app.models.schemas import ResumeData
from app.services.education_extractor import EducationExtractor
from app.services.experience_extractor import ExperienceExtractor
from app.services.project_extractor import ProjectExtractor
from app.services.certification_extractor import CertificationExtractor


class InformationExtractor:

    # =========================================================
    # SECTION HEADINGS
    # =========================================================

    SECTION_HEADINGS = [
        "skills",
        "technical skills",
        "education",
        "experience",
        "work experience",
        "professional experience",
        "internship",
        "internships",
        "projects",
        "academic projects",
        "personal projects",
        "certifications",
        "certificates",
        "achievements",
        "awards",
        "languages",
        "interests",
        "publications",
        "volunteering",
    ]

    # =========================================================
    # PROFESSIONAL SUMMARY
    # =========================================================

    @staticmethod
    def extract_professional_summary(text: str) -> str:

        if not text:
            return ""

        lines = [
            line.strip()
            for line in text.splitlines()
            if line.strip()
        ]

        summary_headings = {
            "professional summary",
            "summary",
            "profile",
            "professional profile",
            "career summary",
            "career objective",
            "objective",
            "about me",
        }

        start_index = None

        for index, line in enumerate(lines):

            normalized = (
                line.lower()
                .strip()
                .rstrip(":")
            )

            if normalized in summary_headings:
                start_index = index + 1
                break

        if start_index is None:
            return ""

        summary_lines = []

        for line in lines[start_index:]:

            normalized = (
                line.lower()
                .strip()
                .rstrip(":")
            )

            if normalized in InformationExtractor.SECTION_HEADINGS:
                break

            summary_lines.append(line)

        summary = " ".join(summary_lines)

        summary = re.sub(
            r"\s+",
            " ",
            summary,
        ).strip()

        return summary

    # =========================================================
    # NAME
    # =========================================================

    @staticmethod
    def extract_name(text: str) -> str:

        if not text:
            return ""

        lines = [
            line.strip()
            for line in text.splitlines()
            if line.strip()
        ]

        all_headings = (
            InformationExtractor.SECTION_HEADINGS
            + [
                "professional summary",
                "summary",
                "profile",
                "professional profile",
                "career summary",
                "career objective",
                "objective",
                "about me",
            ]
        )

        for line in lines[:10]:

            # Skip email
            if re.search(
                r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}",
                line,
            ):
                continue

            # Skip phone
            if re.search(
                r"(?:\+91[\-\s]?)?[6-9]\d{4}[\s-]?\d{5}",
                line,
            ):
                continue

            # Skip social links / URLs
            if re.search(
                r"https?://|www\.|linkedin|github",
                line,
                re.IGNORECASE,
            ):
                continue

            normalized = (
                line.lower()
                .strip()
                .rstrip(":")
            )

            if normalized in all_headings:
                continue

            words = line.split()

            # Typical candidate name
            if 1 < len(words) <= 6:

                # Avoid ID numbers / years
                if not re.search(
                    r"\d{3,}",
                    line,
                ):
                    return line

        return ""

    # =========================================================
    # LINKEDIN
    # =========================================================

    @staticmethod
    def extract_linkedin(text: str) -> str:

        if not text:
            return ""

        patterns = [
            # https://linkedin.com/in/name
            # https://www.linkedin.com/in/name
            r"https?://(?:www\.)?linkedin\.com/in/[A-Za-z0-9_%./\-]+",

            # www.linkedin.com/in/name
            r"www\.linkedin\.com/in/[A-Za-z0-9_%./\-]+",

            # linkedin.com/in/name
            r"linkedin\.com/in/[A-Za-z0-9_%./\-]+",
        ]

        for pattern in patterns:

            match = re.search(
                pattern,
                text,
                re.IGNORECASE,
            )

            if not match:
                continue

            url = match.group(0).strip()

            # Remove punctuation accidentally captured
            url = url.rstrip(
                ".,;:)]}>"
            )

            if not url.lower().startswith(
                ("http://", "https://")
            ):
                url = "https://" + url

            return url

        return ""

    # =========================================================
    # GITHUB
    # =========================================================

    @staticmethod
    def extract_github(text: str) -> str:

        if not text:
            return ""

        patterns = [
            # https://github.com/name
            r"https?://(?:www\.)?github\.com/[A-Za-z0-9_.\-]+",

            # www.github.com/name
            r"www\.github\.com/[A-Za-z0-9_.\-]+",

            # github.com/name
            r"github\.com/[A-Za-z0-9_.\-]+",
        ]

        for pattern in patterns:

            match = re.search(
                pattern,
                text,
                re.IGNORECASE,
            )

            if not match:
                continue

            url = match.group(0).strip()

            url = url.rstrip(
                ".,;:)]}>"
            )

            if not url.lower().startswith(
                ("http://", "https://")
            ):
                url = "https://" + url

            return url

        return ""

    # =========================================================
    # MAIN EXTRACTION
    # =========================================================

    @staticmethod
    def extract(text: str) -> ResumeData:

        text = text or ""

        data = ResumeData()

        # =====================================================
        # COMPLETE RESUME TEXT
        # =====================================================

        data.resume_text = text

        # =====================================================
        # EMAIL
        # =====================================================

        email = re.search(
            r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}",
            text,
        )

        if email:
            data.email = email.group(0).strip()

        # =====================================================
        # PHONE
        # =====================================================

        phone_patterns = [
            # +91 9876543210
            # +91-9876543210
            # 9876543210
            # +91 98765 43210
            r"(?:\+91[\-\s]?)?[6-9]\d{4}[\s-]?\d{5}",
        ]

        for pattern in phone_patterns:

            phone = re.search(
                pattern,
                text,
            )

            if phone:

                data.phone = (
                    phone.group(0)
                    .strip()
                )

                break

        # =====================================================
        # LINKEDIN
        # =====================================================

        linkedin = (
            InformationExtractor.extract_linkedin(
                text
            )
        )

        if linkedin:

            # Works when ResumeData contains linkedin
            if hasattr(data, "linkedin"):
                data.linkedin = linkedin

        # =====================================================
        # GITHUB
        # =====================================================

        github = (
            InformationExtractor.extract_github(
                text
            )
        )

        if github:

            # Works when ResumeData contains github
            if hasattr(data, "github"):
                data.github = github

        # =====================================================
        # NAME
        # =====================================================

        data.name = (
            InformationExtractor.extract_name(
                text
            )
        )

        # =====================================================
        # PROFESSIONAL SUMMARY
        # =====================================================

        data.professional_summary = (
            InformationExtractor.extract_professional_summary(
                text
            )
        )

        # =====================================================
        # SKILLS
        # =====================================================

        try:

            skill_extractor = SkillExtractor()

            data.skills = (
                skill_extractor.extract(
                    text
                )
                or []
            )

        except Exception as error:

            print(
                "Skill extraction error:",
                error,
            )

            data.skills = []

        # =====================================================
        # EDUCATION
        # =====================================================

        try:

            data.education = (
                EducationExtractor.extract(
                    text
                )
                or []
            )

        except Exception as error:

            print(
                "Education extraction error:",
                error,
            )

            data.education = []

        # =====================================================
        # EXPERIENCE
        # =====================================================

        try:

            data.experience = (
                ExperienceExtractor.extract(
                    text
                )
                or []
            )

        except Exception as error:

            print(
                "Experience extraction error:",
                error,
            )

            data.experience = []

        # =====================================================
        # PROJECTS
        # =====================================================

        try:

            data.projects = (
                ProjectExtractor.extract(
                    text
                )
                or []
            )

        except Exception as error:

            print(
                "Project extraction error:",
                error,
            )

            data.projects = []

        # =====================================================
        # CERTIFICATIONS
        # =====================================================

        try:

            data.certifications = (
                CertificationExtractor.extract(
                    text
                )
                or []
            )

        except Exception as error:

            print(
                "Certification extraction error:",
                error,
            )

            data.certifications = []

        # =====================================================
        # RETURN
        # =====================================================

        return data