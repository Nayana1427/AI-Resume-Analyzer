import json
from pathlib import Path


class ATSEngine:

    def __init__(self):

        base_dir = Path(__file__).resolve().parent.parent
        roles_file = base_dir / "data" / "job_roles.json"

        if not roles_file.exists():
            raise FileNotFoundError(
                f"Job roles database not found: {roles_file}"
            )

        with open(roles_file, "r", encoding="utf-8") as file:
            self.roles = json.load(file)

    @staticmethod
    def normalize(skill):
        return str(skill).strip().lower()

    def evaluate(self, resume_skills, job_role="", job_description=""):

        if not resume_skills:
            return {
                "best_role": None,
                "match_percentage": 0,
                "matched_skills": [],
                "missing_skills": [],
                "recommended_roles": [],
                "detected_skills": [],
                "message": "No skills detected in resume."
            }

        # Clean resume skills
        detected_skills = []
        seen = set()

        for skill in resume_skills:

            if not skill:
                continue

            skill = str(skill).strip()
            normalized = self.normalize(skill)

            if normalized and normalized not in seen:
                seen.add(normalized)
                detected_skills.append(skill)

        resume_skill_set = {
            self.normalize(skill)
            for skill in detected_skills
        }

        recommendations = []

        # Compare resume against EVERY role
        for role_name, role_data in self.roles.items():

            required_skills = role_data.get("skills", [])

            if not required_skills:
                continue

            matched_skills = []
            missing_skills = []

            for skill in required_skills:

                if self.normalize(skill) in resume_skill_set:
                    matched_skills.append(skill)
                else:
                    missing_skills.append(skill)

            match_percentage = round(
                (
                    len(matched_skills)
                    / len(required_skills)
                ) * 100
            )

            recommendations.append({
                "role": role_name,
                "match_percentage": match_percentage,
                "matched_skills": matched_skills,
                "missing_skills": missing_skills,
                "required_skills": required_skills,
                "category": role_data.get(
                    "category",
                    "Technology"
                )
            })

        # Highest match first
        recommendations.sort(
            key=lambda role: (
                role["match_percentage"],
                len(role["matched_skills"])
            ),
            reverse=True
        )

        # Top 10 roles
        top_roles = recommendations[:10]

        if not top_roles:
            return {
                "best_role": None,
                "match_percentage": 0,
                "matched_skills": [],
                "missing_skills": [],
                "recommended_roles": [],
                "detected_skills": detected_skills,
                "message": "No suitable roles found."
            }

        best = top_roles[0]

        return {
            "best_role": best["role"],
            "match_percentage": best["match_percentage"],
            "matched_skills": best["matched_skills"],
            "missing_skills": best["missing_skills"],
            "required_skills": best["required_skills"],
            "detected_skills": detected_skills,
            "recommended_roles": top_roles,
            "message": "Career role analysis completed successfully."
        }