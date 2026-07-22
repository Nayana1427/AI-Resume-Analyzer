import json
import re
from pathlib import Path


class SkillExtractor:

    def __init__(self):

        # Get backend/app directory safely
        app_dir = Path(__file__).resolve().parent.parent

        skills_file = app_dir / "data" / "skills.json"

        if not skills_file.exists():
            raise FileNotFoundError(
                f"Skills database not found: {skills_file}"
            )

        with open(skills_file, "r", encoding="utf-8") as f:
            self.skills = json.load(f)

    @staticmethod
    def normalize_text(text: str):
        """
        Normalize resume text while keeping important
        programming symbols such as +, # and .
        """

        text = text.lower()

        text = text.replace("\n", " ")
        text = text.replace("\t", " ")

        text = re.sub(r"\s+", " ", text)

        return text

    @staticmethod
    def skill_exists(skill: str, text: str):

        skill_lower = skill.lower().strip()

        # Escape special characters:
        # C++, C#, .NET, Node.js etc.
        escaped_skill = re.escape(skill_lower)

        pattern = rf"(?<![a-zA-Z0-9]){escaped_skill}(?![a-zA-Z0-9])"

        return bool(
            re.search(
                pattern,
                text,
                flags=re.IGNORECASE
            )
        )

    def extract(self, text: str):

        if not text:
            return []

        text = self.normalize_text(text)

        found_skills = []

        for skill in self.skills:

            if self.skill_exists(skill, text):
                found_skills.append(skill)

        # Remove duplicates while preserving names
        unique_skills = {}

        for skill in found_skills:

            key = skill.lower()

            if key not in unique_skills:
                unique_skills[key] = skill

        return sorted(
            unique_skills.values(),
            key=str.lower
        )