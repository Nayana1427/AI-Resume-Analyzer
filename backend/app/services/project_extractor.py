import re


class ProjectExtractor:

    # =========================================================
    # PROJECT SECTION HEADINGS
    # =========================================================

    PROJECT_HEADINGS = {
        "projects",
        "project",
        "academic projects",
        "personal projects",
        "technical projects",
        "key projects",
        "major projects",
        "project experience",
        "selected projects",
    }

    # =========================================================
    # HEADINGS THAT END THE PROJECT SECTION
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
    # NORMALIZE HEADING
    # =========================================================

    @staticmethod
    def _normalize_heading(line: str) -> str:

        if not line:
            return ""

        line = line.strip().lower()

        # Remove colon
        line = line.rstrip(":")

        # Remove bullets / decoration
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

        # Remove extra spaces
        line = re.sub(
            r"\s+",
            " ",
            line
        )

        return line.strip()

    # =========================================================
    # CHECK PROJECT HEADING
    # =========================================================

    @staticmethod
    def _is_project_heading(line: str) -> bool:

        normalized = (
            ProjectExtractor._normalize_heading(
                line
            )
        )

        return (
            normalized
            in ProjectExtractor.PROJECT_HEADINGS
        )

    # =========================================================
    # CHECK STOP HEADING
    # =========================================================

    @staticmethod
    def _is_stop_heading(line: str) -> bool:

        normalized = (
            ProjectExtractor._normalize_heading(
                line
            )
        )

        return (
            normalized
            in ProjectExtractor.STOP_HEADINGS
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
    # FALLBACK PROJECT DETECTION
    # =========================================================

    @staticmethod
    def _fallback_extract(lines):

        projects = []

        project_keywords = [
            "developed",
            "built",
            "created",
            "implemented",
            "designed",
            "machine learning",
            "deep learning",
            "web application",
            "web app",
            "prediction",
            "classification",
            "dashboard",
            "model",
            "github",
        ]

        for index, line in enumerate(lines):

            lower_line = line.lower()

            keyword_found = any(
                keyword in lower_line
                for keyword in project_keywords
            )

            if not keyword_found:
                continue

            start = max(
                0,
                index - 1
            )

            end = min(
                len(lines),
                index + 4
            )

            for nearby_line in lines[start:end]:

                nearby_line = nearby_line.strip()

                if not nearby_line:
                    continue

                if ProjectExtractor._is_stop_heading(
                    nearby_line
                ):
                    continue

                projects.append(
                    nearby_line
                )

        return ProjectExtractor._clean_lines(
            projects
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

        project_start = None

        # =====================================================
        # FIND PROJECT SECTION
        # =====================================================

        for index, line in enumerate(lines):

            if ProjectExtractor._is_project_heading(
                line
            ):

                project_start = (
                    index + 1
                )

                break

        # =====================================================
        # EXTRACT COMPLETE PROJECT SECTION
        # =====================================================

        if project_start is not None:

            project_lines = []

            for line in lines[
                project_start:
            ]:

                # Stop at next major resume section
                if ProjectExtractor._is_stop_heading(
                    line
                ):
                    break

                project_lines.append(
                    line
                )

            project_lines = (
                ProjectExtractor._clean_lines(
                    project_lines
                )
            )

            if project_lines:
                return project_lines

        # =====================================================
        # FALLBACK
        # =====================================================

        return ProjectExtractor._fallback_extract(
            lines
        )