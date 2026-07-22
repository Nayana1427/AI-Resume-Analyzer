import os
import json

from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


class AIService:

    @staticmethod
    def analyze_resume(
        resume_text,
        job_role,
        missing_skills
    ):

        prompt = f"""
You are an ATS Resume Expert.

Analyze this resume for the role of:

{job_role}

Resume:

{resume_text}

Missing Skills:

{', '.join(missing_skills)}

Return ONLY valid JSON in this format:

{{
    "overall_score": 0,
    "professional_summary": "",
    "strengths": [],
    "weaknesses": [],
    "missing_keywords": [],
    "resume_improvements": [],
    "interview_questions": [],
    "learning_roadmap": []
}}

Do not return markdown.
Do not use ```json.
Return only JSON.
"""

        response = client.models.generate_content(
            model="models/gemini-3.5-flash",
            contents=prompt
        )

        return json.loads(response.text)