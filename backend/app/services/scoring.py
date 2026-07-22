import re

from app.models.schemas import ResumeData


class ATSScorer:

    # =========================================================
    # CONFIGURATION
    # =========================================================

    ACTION_VERBS = {
        "developed", "built", "created", "implemented",
        "designed", "improved", "optimized", "managed",
        "led", "automated", "analyzed", "integrated",
        "deployed", "engineered", "collaborated",
        "reduced", "increased", "achieved", "delivered",
        "maintained", "tested", "trained", "resolved",
        "supported", "generated", "configured", "launched",
        "performed", "applied", "worked"
    }

    DEGREE_PATTERN = (
        r"\b("
        r"b\.?\s?tech|btech|"
        r"b\.?\s?e\.?|"
        r"bachelor|"
        r"b\.?\s?sc|bsc|"
        r"m\.?\s?tech|mtech|"
        r"m\.?\s?e\.?|"
        r"master|"
        r"m\.?\s?sc|msc|"
        r"bca|mca|mba|"
        r"ph\.?\s?d|"
        r"diploma|puc"
        r")\b"
    )

    # =========================================================
    # HELPERS
    # =========================================================

    @staticmethod
    def _clean_items(items):
        if not items:
            return []

        cleaned = []
        seen = set()

        for item in items:
            if item is None:
                continue

            value = re.sub(
                r"\s+",
                " ",
                str(item)
            ).strip()

            if len(value) < 2:
                continue

            key = value.lower()

            if key not in seen:
                cleaned.append(value)
                seen.add(key)

        return cleaned

    @staticmethod
    def _combined_text(items):
        return " ".join(
            ATSScorer._clean_items(items)
        )

    @staticmethod
    def _word_count(text):
        return len(
            re.findall(
                r"\b[\w+#.-]+\b",
                text or ""
            )
        )

    @staticmethod
    def _contains_date(text):
        pattern = (
            r"\b(?:19|20)\d{2}\b|"
            r"\b(?:jan(?:uary)?|feb(?:ruary)?|"
            r"mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|"
            r"jul(?:y)?|aug(?:ust)?|sep(?:tember)?|"
            r"oct(?:ober)?|nov(?:ember)?|dec(?:ember)?|"
            r"present|current)\b"
        )

        return bool(
            re.search(
                pattern,
                text or "",
                re.IGNORECASE
            )
        )

    @staticmethod
    def _contains_metric(text):
        """
        Detect actual measurable information rather than
        treating every number/date as an achievement.
        """

        patterns = [
            r"\b\d+(?:\.\d+)?\s*%",
            r"\b\d+(?:\.\d+)?\s*(?:k|m)\+?\b",
            r"\b\d+\+\s*(?:users|clients|customers|records|requests|students)",
            r"\b\d+\s+(?:users|clients|customers|records|requests|students|datasets|models)",
        ]

        return any(
            re.search(
                pattern,
                text or "",
                re.IGNORECASE
            )
            for pattern in patterns
        )

    @staticmethod
    def _action_verb_count(text):
        words = set(
            re.findall(
                r"\b[a-zA-Z]+\b",
                (text or "").lower()
            )
        )

        return len(
            words.intersection(
                ATSScorer.ACTION_VERBS
            )
        )

    @staticmethod
    def _contains_degree(text):
        return bool(
            re.search(
                ATSScorer.DEGREE_PATTERN,
                text or "",
                re.IGNORECASE
            )
        )

    @staticmethod
    def _contains_academic_score(text):
        return bool(
            re.search(
                r"\b(?:cgpa|gpa)\b\s*[:\-]?\s*\d+(?:\.\d+)?"
                r"|\b\d{1,3}(?:\.\d+)?\s*%",
                text or "",
                re.IGNORECASE
            )
        )

    @staticmethod
    def _contains_institution(text):
        return bool(
            re.search(
                r"\b("
                r"university|college|institute|school|"
                r"academy|polytechnic"
                r")\b",
                text or "",
                re.IGNORECASE
            )
        )

    # =========================================================
    # 1. CONTACT — 10
    # =========================================================

    @staticmethod
    def _score_contact(resume, improvements, strengths):

        score = 0
        feedback = []

        if resume.name and len(resume.name.strip()) >= 2:
            score += 2
            feedback.append("Name detected")
        else:
            improvements.append(
                "Add your full name clearly at the top."
            )

        email = (resume.email or "").strip()

        if re.fullmatch(
            r"[^@\s]+@[^@\s]+\.[^@\s]+",
            email
        ):
            score += 4
            feedback.append("Valid email detected")
        else:
            improvements.append(
                "Add a valid professional email address."
            )

        digits = re.sub(
            r"\D",
            "",
            resume.phone or ""
        )

        if 10 <= len(digits) <= 13:
            score += 4
            feedback.append("Phone number detected")
        else:
            improvements.append(
                "Add a complete phone number."
            )

        if score == 10:
            strengths.append(
                "Contact information is complete."
            )

        return score, feedback

    # =========================================================
    # 2. PROFESSIONAL SUMMARY — 10
    # =========================================================

    @staticmethod
    def _score_summary(resume, improvements, strengths):

        summary = (
            resume.professional_summary or ""
        ).strip()

        if not summary:
            improvements.append(
                "Add a concise professional summary tailored to your target role."
            )
            return 0, []

        score = 3
        feedback = ["Professional summary detected"]

        words = ATSScorer._word_count(summary)

        # Good summary length
        if 25 <= words <= 80:
            score += 3
            feedback.append("Summary length is appropriate")

        elif 15 <= words < 25:
            score += 2

        elif 80 < words <= 110:
            score += 2

        else:
            improvements.append(
                "Keep your professional summary concise and focused."
            )

        # Skills/technical content
        technical_terms = [
            "python", "java", "javascript", "react",
            "sql", "machine learning", "data",
            "software", "developer", "engineering",
            "analytics", "artificial intelligence",
            "ai", "cloud", "web"
        ]

        technical_hits = sum(
            1
            for term in technical_terms
            if term in summary.lower()
        )

        if technical_hits >= 3:
            score += 2
            feedback.append(
                "Relevant technical focus detected"
            )
        elif technical_hits >= 1:
            score += 1

        # Career/value language
        value_terms = [
            "experience",
            "skilled",
            "proficient",
            "passionate",
            "focused",
            "specialized",
            "knowledge",
            "expertise"
        ]

        if any(
            term in summary.lower()
            for term in value_terms
        ):
            score += 1

        # Penalize generic summary
        generic_phrases = [
            "hardworking",
            "quick learner",
            "seeking an opportunity",
            "looking for an opportunity"
        ]

        if not any(
            phrase in summary.lower()
            for phrase in generic_phrases
        ):
            score += 1
        else:
            improvements.append(
                "Replace generic summary phrases with specific skills and career strengths."
            )

        score = min(score, 10)

        if score >= 8:
            strengths.append(
                "Professional summary provides a clear profile."
            )

        return score, feedback

    # =========================================================
    # 3. SKILLS — 15
    # =========================================================

    @staticmethod
    def _score_skills(resume, improvements, strengths):

        skills = ATSScorer._clean_items(
            resume.skills
        )

        count = len(skills)

        if count >= 10:
            score = 15
        elif count >= 8:
            score = 13
        elif count >= 6:
            score = 11
        elif count >= 4:
            score = 8
        elif count >= 2:
            score = 5
        elif count == 1:
            score = 2
        else:
            score = 0

        if score >= 13:
            strengths.append(
                "Strong technical skill coverage detected."
            )

        if count < 6:
            improvements.append(
                "Add more relevant technical skills for your target role."
            )

        return score, [
            f"{count} unique skills detected"
        ]

    # =========================================================
    # 4. EDUCATION — 10
    # =========================================================

    @staticmethod
    def _score_education(resume, improvements, strengths):

        education = ATSScorer._clean_items(
            resume.education
        )

        text = ATSScorer._combined_text(
            education
        )

        if not education:
            improvements.append(
                "Add a clearly labelled Education section."
            )
            return 0, []

        score = 2
        feedback = [
            "Education section detected"
        ]

        if ATSScorer._contains_degree(text):
            score += 2
            feedback.append("Degree detected")
        else:
            improvements.append(
                "Clearly state your degree or qualification."
            )

        if ATSScorer._contains_institution(text):
            score += 2
            feedback.append(
                "Institution detected"
            )
        else:
            improvements.append(
                "Clearly mention your university or institution."
            )

        if ATSScorer._contains_date(text):
            score += 2
            feedback.append(
                "Education dates detected"
            )
        else:
            improvements.append(
                "Include graduation year or study dates."
            )

        if ATSScorer._contains_academic_score(text):
            score += 2
            feedback.append(
                "CGPA/GPA/percentage detected"
            )

        score = min(score, 10)

        if score >= 8:
            strengths.append(
                "Education section is detailed and complete."
            )

        return score, feedback

    # =========================================================
    # 5. EXPERIENCE — 20
    # =========================================================

    @staticmethod
    def _score_experience(resume, improvements, strengths):

        experience = ATSScorer._clean_items(
            resume.experience
        )

        text = ATSScorer._combined_text(
            experience
        )

        if not experience:
            improvements.append(
                "Add internships, employment, freelance work or relevant practical experience."
            )
            return 0, []

        score = 5
        feedback = [
            "Experience section detected"
        ]

        words = ATSScorer._word_count(text)

        if words >= 70:
            score += 4
            feedback.append(
                "Detailed experience descriptions detected"
            )
        elif words >= 40:
            score += 3
        elif words >= 20:
            score += 2
        else:
            score += 1
            improvements.append(
                "Add more detail to your experience bullets."
            )

        if ATSScorer._contains_date(text):
            score += 3
            feedback.append(
                "Experience dates detected"
            )
        else:
            improvements.append(
                "Add dates or duration to your experience."
            )

        action_count = (
            ATSScorer._action_verb_count(text)
        )

        if action_count >= 5:
            score += 4
            feedback.append(
                "Strong action-oriented writing detected"
            )
        elif action_count >= 3:
            score += 3
        elif action_count >= 1:
            score += 2
        else:
            improvements.append(
                "Use strong action verbs in experience bullets."
            )

        if ATSScorer._contains_metric(text):
            score += 4

            feedback.append(
                "Measurable achievement detected"
            )

            strengths.append(
                "Experience includes measurable impact."
            )
        else:
            improvements.append(
                "Add measurable results to your experience where possible."
            )

        score = min(score, 20)

        return score, feedback

    # =========================================================
    # 6. PROJECTS — 20
    # =========================================================

    @staticmethod
    def _score_projects(resume, improvements, strengths):

        projects = ATSScorer._clean_items(
            resume.projects
        )

        text = ATSScorer._combined_text(
            projects
        )

        if not projects:
            improvements.append(
                "Add 2–3 relevant technical projects."
            )
            return 0, []

        feedback = [
            "Projects section detected"
        ]

        # IMPORTANT:
        # We DO NOT use len(projects) as project count because
        # each list item may simply be one line from the section.

        score = 5

        words = ATSScorer._word_count(text)

        # Amount of useful project detail
        if words >= 100:
            score += 5
            feedback.append(
                "Detailed project descriptions detected"
            )
        elif words >= 60:
            score += 4
        elif words >= 30:
            score += 3
        elif words >= 15:
            score += 2
        else:
            score += 1
            improvements.append(
                "Add more detail about what you built in your projects."
            )

        # Action-oriented descriptions
        action_count = (
            ATSScorer._action_verb_count(text)
        )

        if action_count >= 5:
            score += 5
            feedback.append(
                "Strong project contribution language detected"
            )
        elif action_count >= 3:
            score += 4
        elif action_count >= 1:
            score += 2
        else:
            improvements.append(
                "Explain your contribution using action verbs such as Developed, Built or Implemented."
            )

        # Results
        if ATSScorer._contains_metric(text):
            score += 5

            feedback.append(
                "Measurable project outcome detected"
            )

            strengths.append(
                "Projects demonstrate measurable results."
            )
        else:
            score += 2

            improvements.append(
                "Add measurable project outcomes where possible."
            )

        score = min(score, 20)

        if score >= 16:
            strengths.append(
                "Projects provide strong practical evidence."
            )

        return score, feedback

    # =========================================================
    # 7. CERTIFICATIONS — 5
    # =========================================================

    @staticmethod
    def _score_certifications(
        resume,
        improvements,
        strengths
    ):

        certifications = ATSScorer._clean_items(
            resume.certifications
        )

        # Because extraction may split one certification across
        # lines, this is treated as section-content strength,
        # not a guaranteed exact certification count.

        count = len(certifications)

        if count >= 3:
            score = 5
        elif count == 2:
            score = 4
        elif count == 1:
            score = 3
        else:
            score = 0

        if score == 5:
            strengths.append(
                "Relevant certification content was detected."
            )

        if score == 0:
            improvements.append(
                "Add relevant certifications if you have completed any."
            )

        return score, [
            f"{count} certification-related entries detected"
        ]

    # =========================================================
    # 8. RESUME CONTENT / LENGTH — 10
    # =========================================================

    @staticmethod
    def _score_length(
        resume,
        improvements,
        strengths
    ):

        count = ATSScorer._word_count(
            resume.resume_text or ""
        )

        if 350 <= count <= 750:
            score = 10
            message = (
                f"{count} words detected; content length is appropriate."
            )

            strengths.append(
                "Resume contains an appropriate amount of content."
            )

        elif 280 <= count < 350:
            score = 8
            message = (
                f"{count} words detected; resume is slightly concise."
            )

        elif 750 < count <= 900:
            score = 8
            message = (
                f"{count} words detected; resume is slightly lengthy."
            )

        elif 200 <= count < 280:
            score = 6
            message = (
                f"{count} words detected; more relevant detail may help."
            )

            improvements.append(
                "Add more relevant detail to experience and projects."
            )

        elif 900 < count <= 1100:
            score = 6
            message = (
                f"{count} words detected; consider making the resume more concise."
            )

            improvements.append(
                "Remove repetitive or less relevant content."
            )

        elif count < 200:
            score = 3
            message = (
                f"Only {count} words were detected."
            )

            improvements.append(
                "The resume appears too short."
            )

        else:
            score = 3
            message = (
                f"{count} words were detected; the resume may be too long."
            )

            improvements.append(
                "Prioritize the most relevant information."
            )

        return score, [message], count

    # =========================================================
    # FINAL CALCULATION
    # =========================================================

    @staticmethod
    def calculate(resume: ResumeData):

        breakdown = {}
        strengths = []
        improvements = []

        # Contact
        score, feedback = ATSScorer._score_contact(
            resume,
            improvements,
            strengths
        )

        breakdown["contact"] = {
            "score": score,
            "max_score": 10,
            "percentage": round(score / 10 * 100),
            "feedback": feedback
        }

        # Summary
        score, feedback = ATSScorer._score_summary(
            resume,
            improvements,
            strengths
        )

        breakdown["professional_summary"] = {
            "score": score,
            "max_score": 10,
            "percentage": round(score / 10 * 100),
            "feedback": feedback
        }

        # Skills
        score, feedback = ATSScorer._score_skills(
            resume,
            improvements,
            strengths
        )

        breakdown["skills"] = {
            "score": score,
            "max_score": 15,
            "percentage": round(score / 15 * 100),
            "feedback": feedback
        }

        # Education
        score, feedback = ATSScorer._score_education(
            resume,
            improvements,
            strengths
        )

        breakdown["education"] = {
            "score": score,
            "max_score": 10,
            "percentage": round(score / 10 * 100),
            "feedback": feedback
        }

        # Experience
        score, feedback = ATSScorer._score_experience(
            resume,
            improvements,
            strengths
        )

        breakdown["experience"] = {
            "score": score,
            "max_score": 20,
            "percentage": round(score / 20 * 100),
            "feedback": feedback
        }

        # Projects
        score, feedback = ATSScorer._score_projects(
            resume,
            improvements,
            strengths
        )

        breakdown["projects"] = {
            "score": score,
            "max_score": 20,
            "percentage": round(score / 20 * 100),
            "feedback": feedback
        }

        # Certifications
        score, feedback = ATSScorer._score_certifications(
            resume,
            improvements,
            strengths
        )

        breakdown["certifications"] = {
            "score": score,
            "max_score": 5,
            "percentage": round(score / 5 * 100),
            "feedback": feedback
        }

        # Length
        score, feedback, word_count = (
            ATSScorer._score_length(
                resume,
                improvements,
                strengths
            )
        )

        breakdown["length"] = {
            "score": score,
            "max_score": 10,
            "percentage": round(score / 10 * 100),
            "feedback": feedback,
            "word_count": word_count
        }

        # =====================================================
        # TOTAL
        # =========================================================

        total_score = sum(
            item["score"]
            for item in breakdown.values()
        )

        total_score = max(
            0,
            min(
                round(total_score),
                100
            )
        )

        # =====================================================
        # GRADE
        # =========================================================

        if total_score >= 90:
            grade = "A+"
            rating = "Excellent"

        elif total_score >= 80:
            grade = "A"
            rating = "Very Good"

        elif total_score >= 70:
            grade = "B"
            rating = "Good"

        elif total_score >= 60:
            grade = "C"
            rating = "Average"

        elif total_score >= 50:
            grade = "D"
            rating = "Below Average"

        else:
            grade = "F"
            rating = "Needs Improvement"

        # Remove duplicate feedback
        strengths = list(
            dict.fromkeys(strengths)
        )

        improvements = list(
            dict.fromkeys(improvements)
        )

        return {
            "overall_score": total_score,
            "grade": grade,
            "rating": rating,
            "breakdown": breakdown,
            "strengths": strengths,
            "improvements": improvements,
            "word_count": word_count
        }