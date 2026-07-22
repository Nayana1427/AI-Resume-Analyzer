import re


class ExperienceExtractor:

    # =========================================================
    # EXPERIENCE SECTION HEADINGS
    # =========================================================

    EXPERIENCE_HEADINGS = {
        "experience",
        "work experience",
        "professional experience",
        "employment",
        "employment history",
        "work history",
        "internship",
        "internships",
        "internship experience",
        "professional experience & internships",
    }

    # =========================================================
    # HEADINGS THAT END EXPERIENCE SECTION
    # =========================================================

    STOP_HEADINGS = {
        "education",
        "academic background",
        "academic qualifications",
        "skills",
        "technical skills",
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
        "professional summary",
        "summary",
        "profile",
        "objective",
    }

    # =========================================================
    # FALLBACK EXPERIENCE KEYWORDS
    # =========================================================

    EXPERIENCE_KEYWORDS = [
        "intern",
        "internship",
        "software engineer",
        "software developer",
        "developer",
        "engineer",
        "data analyst",
        "data scientist",
        "machine learning engineer",
        "ai engineer",
        "web developer",
        "frontend developer",
        "backend developer",
        "full stack developer",
        "research assistant",
        "trainee",
        "associate",
        "consultant",
        "freelance",
        "freelancer",
    ]

    # =========================================================
    # NORMALIZE HEADING
    # =========================================================

    @staticmethod
    def _normalize_heading(line: str) -> str:

        if not line:
            return ""

        line = line.strip().lower()

        line = line.rstrip(":")

        line = re.sub(
            r"^[•\-–—|]+",
            "",
            line
        )

        line = re.sub(
            r"[•\-–—|]+$",
            "",
            line
        )

        line = re.sub(
            r"\s+",
            " ",
            line
        )

        return line.strip()

    # =========================================================
    # CHECK EXPERIENCE HEADING
    # =========================================================

    @staticmethod
    def _is_experience_heading(line: str) -> bool:

        normalized = (
            ExperienceExtractor._normalize_heading(
                line
            )
        )

        return (
            normalized
            in ExperienceExtractor.EXPERIENCE_HEADINGS
        )

    # =========================================================
    # CHECK STOP HEADING
    # =========================================================

    @staticmethod
    def _is_stop_heading(line: str) -> bool:

        normalized = (
            ExperienceExtractor._normalize_heading(
                line
            )
        )

        return (
            normalized
            in ExperienceExtractor.STOP_HEADINGS
        )

    # =========================================================
    # CLEAN LINES
    # =========================================================

    @staticmethod
    def _clean_lines(lines):

        cleaned = []

        seen = set()

        for line in lines:

            if not line:
                continue

            line = re.sub(
                r"\s+",
                " ",
                line
            ).strip()

            if not line:
                continue

            normalized = line.lower()

            if normalized not in seen:

                cleaned.append(line)

                seen.add(normalized)

        return cleaned

    # =========================================================
    # FALLBACK EXTRACTION
    # =========================================================

    @staticmethod
    def _fallback_extract(lines):

        experience = []

        for index, line in enumerate(lines):

            lower_line = line.lower()

            keyword_found = any(
                keyword in lower_line
                for keyword
                in ExperienceExtractor.EXPERIENCE_KEYWORDS
            )

            # Also recognize explicit experience duration
            duration_found = bool(
                re.search(
                    r"\b\d+\+?\s*(?:years?|months?)\b",
                    line,
                    re.IGNORECASE
                )
            )

            if not (
                keyword_found
                or duration_found
            ):
                continue

            # -------------------------------------------------
            # Capture surrounding context
            #
            # Previous lines may contain:
            # company name
            #
            # Following lines may contain:
            # dates
            # responsibilities
            # achievements
            # -------------------------------------------------

            start = max(
                0,
                index - 2
            )

            end = min(
                len(lines),
                index + 7
            )

            for nearby_line in lines[start:end]:

                nearby_line = nearby_line.strip()

                if not nearby_line:
                    continue

                if ExperienceExtractor._is_stop_heading(
                    nearby_line
                ):
                    continue

                experience.append(
                    nearby_line
                )

        return ExperienceExtractor._clean_lines(
            experience
        )

    # =========================================================
    # MAIN EXTRACTOR
    # =========================================================

    @staticmethod
    def extract(text: str):

        if not text:
            return []

        lines = [
            line.strip()
            for line in text.splitlines()
            if line.strip()
        ]

        if not lines:
            return []

        experience_start = None

        # =====================================================
        # FIND EXPERIENCE SECTION
        # =====================================================

        for index, line in enumerate(lines):

            if ExperienceExtractor._is_experience_heading(
                line
            ):

                experience_start = (
                    index + 1
                )

                break

        # =====================================================
        # EXTRACT COMPLETE EXPERIENCE SECTION
        # =====================================================

        if experience_start is not None:

            experience_lines = []

            for line in lines[
                experience_start:
            ]:

                # Stop at next resume section
                if ExperienceExtractor._is_stop_heading(
                    line
                ):
                    break

                experience_lines.append(
                    line
                )

            experience_lines = (
                ExperienceExtractor._clean_lines(
                    experience_lines
                )
            )

            if experience_lines:
                return experience_lines

        # =====================================================
        # FALLBACK IF NO EXPERIENCE HEADING FOUND
        # =====================================================

        return ExperienceExtractor._fallback_extract(
            lines
        )