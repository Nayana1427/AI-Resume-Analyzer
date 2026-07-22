import re


class CertificationExtractor:

    # =========================================================
    # CERTIFICATION SECTION HEADINGS
    # =========================================================

    CERTIFICATION_HEADINGS = {
        "certifications",
        "certification",
        "certificates",
        "certificate",
        "licenses & certifications",
        "licenses and certifications",
        "courses & certifications",
        "courses and certifications",
        "professional certifications",
    }

    # =========================================================
    # HEADINGS THAT END CERTIFICATION SECTION
    # =========================================================

    STOP_HEADINGS = {
        "education",
        "academic background",
        "academic qualifications",
        "experience",
        "work experience",
        "professional experience",
        "internship",
        "internships",
        "skills",
        "technical skills",
        "projects",
        "project",
        "academic projects",
        "personal projects",
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
    # FALLBACK KEYWORDS
    # Only used if no Certifications section is found
    # =========================================================

    CERTIFICATION_KEYWORDS = [
        "certified",
        "certificate",
        "certification",
        "coursera",
        "udemy",
        "nptel",
        "infosys springboard",
        "great learning",
        "simplilearn",
        "linkedin learning",
        "google cloud",
        "google professional",
        "microsoft certified",
        "aws certified",
        "oracle certified",
        "ibm",
        "cisco",
        "hackerrank",
    ]

    # =========================================================
    # NORMALIZE HEADING
    # =========================================================

    @staticmethod
    def _normalize_heading(line: str) -> str:

        if not line:
            return ""

        line = line.strip().lower()

        # Remove trailing colon
        line = line.rstrip(":")

        # Remove bullets / decorations
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

        # Normalize spaces
        line = re.sub(
            r"\s+",
            " ",
            line
        )

        return line.strip()

    # =========================================================
    # CHECK CERTIFICATION HEADING
    # =========================================================

    @staticmethod
    def _is_certification_heading(line: str) -> bool:

        normalized = (
            CertificationExtractor._normalize_heading(
                line
            )
        )

        return (
            normalized
            in CertificationExtractor.CERTIFICATION_HEADINGS
        )

    # =========================================================
    # CHECK STOP HEADING
    # =========================================================

    @staticmethod
    def _is_stop_heading(line: str) -> bool:

        normalized = (
            CertificationExtractor._normalize_heading(
                line
            )
        )

        return (
            normalized
            in CertificationExtractor.STOP_HEADINGS
        )

    # =========================================================
    # CLEAN CERTIFICATION LINES
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

            # Remove bullet characters
            line = re.sub(
                r"^[•●▪◦\-–—]+\s*",
                "",
                line
            ).strip()

            if len(line) < 2:
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

        certifications = []

        for line in lines:

            lower_line = line.lower()

            keyword_found = any(
                keyword in lower_line
                for keyword
                in CertificationExtractor.CERTIFICATION_KEYWORDS
            )

            if not keyword_found:
                continue

            # Avoid accidentally treating a section heading
            # as an actual certification
            if CertificationExtractor._is_certification_heading(
                line
            ):
                continue

            certifications.append(
                line
            )

        return CertificationExtractor._clean_lines(
            certifications
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

        certification_start = None

        # =====================================================
        # FIND CERTIFICATIONS SECTION
        # =====================================================

        for index, line in enumerate(lines):

            if CertificationExtractor._is_certification_heading(
                line
            ):

                certification_start = (
                    index + 1
                )

                break

        # =====================================================
        # EXTRACT COMPLETE CERTIFICATION SECTION
        # =====================================================

        if certification_start is not None:

            certification_lines = []

            for line in lines[
                certification_start:
            ]:

                # Stop when next major section begins
                if CertificationExtractor._is_stop_heading(
                    line
                ):
                    break

                certification_lines.append(
                    line
                )

            certification_lines = (
                CertificationExtractor._clean_lines(
                    certification_lines
                )
            )

            if certification_lines:
                return certification_lines

        # =====================================================
        # FALLBACK
        # =====================================================

        return CertificationExtractor._fallback_extract(
            lines
        )