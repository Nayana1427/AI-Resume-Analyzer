import re


class EducationExtractor:

    # =========================================================
    # POSSIBLE EDUCATION SECTION HEADINGS
    # =========================================================

    EDUCATION_HEADINGS = {
        "education",
        "academic background",
        "academic qualifications",
        "educational qualifications",
        "education details",
        "academics",
        "qualification",
        "qualifications",
    }

    # =========================================================
    # HEADINGS THAT CAN END THE EDUCATION SECTION
    # =========================================================

    STOP_HEADINGS = {
        "skills",
        "technical skills",
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
        "professional summary",
        "summary",
        "profile",
        "objective",
    }

    # =========================================================
    # EDUCATION KEYWORDS
    # Used as fallback if no Education heading is found
    # =========================================================

    EDUCATION_KEYWORDS = [
        "b.e",
        "b.e.",
        "be",
        "b.tech",
        "b.tech.",
        "btech",
        "bachelor",
        "m.tech",
        "m.tech.",
        "mtech",
        "m.e",
        "m.e.",
        "master",
        "bca",
        "mca",
        "b.sc",
        "b.sc.",
        "bsc",
        "m.sc",
        "m.sc.",
        "msc",
        "diploma",
        "puc",
        "pre-university",
        "pre university",
        "12th",
        "10th",
        "sslc",
        "degree",
    ]

    # =========================================================
    # NORMALIZE HEADING
    # =========================================================

    @staticmethod
    def _normalize_heading(line: str) -> str:

        line = line.strip().lower()

        # Remove trailing colon
        line = line.rstrip(":")

        # Remove common heading decorations
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

        # Replace repeated spaces
        line = re.sub(
            r"\s+",
            " ",
            line
        )

        return line.strip()

    # =========================================================
    # CHECK IF LINE IS EDUCATION HEADING
    # =========================================================

    @staticmethod
    def _is_education_heading(line: str) -> bool:

        normalized = (
            EducationExtractor._normalize_heading(
                line
            )
        )

        return (
            normalized
            in EducationExtractor.EDUCATION_HEADINGS
        )

    # =========================================================
    # CHECK IF LINE IS ANOTHER SECTION HEADING
    # =========================================================

    @staticmethod
    def _is_stop_heading(line: str) -> bool:

        normalized = (
            EducationExtractor._normalize_heading(
                line
            )
        )

        return (
            normalized
            in EducationExtractor.STOP_HEADINGS
        )

    # =========================================================
    # CLEAN EXTRACTED LINES
    # =========================================================

    @staticmethod
    def _clean_lines(lines):

        cleaned = []

        for line in lines:

            line = re.sub(
                r"\s+",
                " ",
                line
            ).strip()

            if not line:
                continue

            # Avoid duplicates
            if line not in cleaned:
                cleaned.append(line)

        return cleaned

    # =========================================================
    # FALLBACK EDUCATION EXTRACTION
    # =========================================================

    @staticmethod
    def _fallback_extract(lines):

        education = []

        for index, line in enumerate(lines):

            lower_line = line.lower()

            has_keyword = any(
                keyword in lower_line
                for keyword
                in EducationExtractor.EDUCATION_KEYWORDS
            )

            if not has_keyword:
                continue

            # Include nearby lines because university,
            # dates and CGPA are often placed separately.
            start = max(
                0,
                index - 2
            )

            end = min(
                len(lines),
                index + 4
            )

            for nearby_line in lines[start:end]:

                nearby_line = nearby_line.strip()

                if (
                    nearby_line
                    and not EducationExtractor._is_stop_heading(
                        nearby_line
                    )
                ):
                    education.append(
                        nearby_line
                    )

        return EducationExtractor._clean_lines(
            education
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

        education_lines = []

        education_start = None

        # =====================================================
        # FIND EDUCATION HEADING
        # =====================================================

        for index, line in enumerate(lines):

            if EducationExtractor._is_education_heading(
                line
            ):
                education_start = index + 1
                break

        # =====================================================
        # EXTRACT COMPLETE EDUCATION SECTION
        # =====================================================

        if education_start is not None:

            for line in lines[education_start:]:

                # Stop when another major section starts
                if EducationExtractor._is_stop_heading(
                    line
                ):
                    break

                education_lines.append(
                    line
                )

            education_lines = (
                EducationExtractor._clean_lines(
                    education_lines
                )
            )

            if education_lines:
                return education_lines

        # =====================================================
        # FALLBACK
        # =====================================================

        return EducationExtractor._fallback_extract(
            lines
        )