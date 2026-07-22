import re


class ResumeStructurer:
    """
    Converts extracted resume data into structured sections
    that can be rendered cleanly by ResumeGenerator.
    """

    # =========================================================
    # SKILL CATEGORIES
    # =========================================================

    SKILL_GROUPS = {
        "Programming Languages": {
            "python",
            "java",
            "javascript",
            "typescript",
            "c",
            "c++",
            "c#",
            "r",
            "go",
            "golang",
            "kotlin",
            "swift",
            "php",
            "ruby",
        },

        "Web & Frameworks": {
            "html",
            "css",
            "react",
            "react.js",
            "reactjs",
            "angular",
            "vue",
            "vue.js",
            "django",
            "flask",
            "fastapi",
            "node.js",
            "nodejs",
            "express",
            "express.js",
            "bootstrap",
            "tailwind",
            "tailwind css",
            "redux",
            "rest api",
            "restful api",
        },

        "Data & AI": {
            "artificial intelligence",
            "ai",
            "machine learning",
            "deep learning",
            "data science",
            "data analysis",
            "data analytics",
            "data visualization",
            "nlp",
            "natural language processing",
            "computer vision",
            "tensorflow",
            "pytorch",
            "scikit-learn",
            "sklearn",
            "pandas",
            "numpy",
            "power bi",
            "tableau",
            "excel",
        },

        "Databases": {
            "sql",
            "mysql",
            "postgresql",
            "postgres",
            "mongodb",
            "sqlite",
            "oracle",
            "firebase",
            "redis",
        },

        "Tools & Platforms": {
            "git",
            "github",
            "gitlab",
            "docker",
            "kubernetes",
            "aws",
            "azure",
            "gcp",
            "google cloud",
            "linux",
            "postman",
            "jira",
            "figma",
            "vscode",
            "visual studio code",
        },

        "Core CS": {
            "data structures",
            "algorithms",
            "dsa",
            "oop",
            "object oriented programming",
            "operating systems",
            "computer networks",
            "networking",
            "dbms",
            "database management systems",
            "software engineering",
        },
    }

    # =========================================================
    # GENERAL HELPERS
    # =========================================================

    @staticmethod
    def _clean(value):
        """
        Clean a single extracted line.
        """

        if value is None:
            return ""

        value = str(value)

        value = re.sub(
            r"^[\s•●▪◦\-–—]+",
            "",
            value,
        )

        value = re.sub(
            r"\s+",
            " ",
            value,
        )

        return value.strip()

    @classmethod
    def _clean_list(cls, values):
        """
        Clean list values and remove duplicates.
        """

        if values is None:
            return []

        if isinstance(values, str):
            values = [values]

        cleaned = []
        seen = set()

        for value in values:

            value = cls._clean(value)

            if not value:
                continue

            key = value.lower()

            if key in seen:
                continue

            seen.add(key)
            cleaned.append(value)

        return cleaned

    @staticmethod
    def _is_date(line):
        """
        Detect common resume date formats.
        """

        if not line:
            return False

        patterns = [
            r"\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+\d{4}\b",
            r"\b\d{4}\s*[-–—]\s*\d{4}\b",
            r"\b\d{4}\s*[-–—]\s*present\b",
            r"\b\d{4}\s*[-–—]\s*current\b",
            r"\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+\d{4}\s*[-–—]\s*(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+\d{4}\b",
            r"\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+\d{4}\s*[-–—]\s*(?:present|current)\b",
        ]

        return any(
            re.search(
                pattern,
                line,
                re.IGNORECASE,
            )
            for pattern in patterns
        )

    @staticmethod
    def _is_score(line):
        """
        Detect CGPA / GPA / percentage / marks.
        """

        if not line:
            return False

        patterns = [
            r"\bcgpa\b",
            r"\bgpa\b",
            r"\bmarks?\b",
            r"\bpercentage\b",
            r"\b\d+(?:\.\d+)?\s*%",
            r"\b\d+(?:\.\d+)?\s*/\s*10\b",
        ]

        return any(
            re.search(
                pattern,
                line,
                re.IGNORECASE,
            )
            for pattern in patterns
        )

    @staticmethod
    def _looks_like_bullet(line):
        """
        Determine whether a line resembles an achievement /
        responsibility description.
        """

        if not line:
            return False

        action_words = [
            "built",
            "developed",
            "created",
            "implemented",
            "designed",
            "worked",
            "used",
            "applied",
            "improved",
            "achieved",
            "completed",
            "managed",
            "led",
            "performed",
            "analyzed",
            "analysed",
            "integrated",
            "trained",
            "tested",
            "optimized",
            "optimised",
            "collaborated",
            "assisted",
            "conducted",
            "generated",
            "automated",
            "deployed",
        ]

        lower = line.lower()

        return any(
            lower.startswith(word)
            for word in action_words
        )

    # =========================================================
    # MAIN ENTRY POINT
    # =========================================================

    @classmethod
    def structure(cls, resume_data):
        """
        Main method called by ResumeGenerator.
        """

        if hasattr(resume_data, "model_dump"):

            raw_data = resume_data.model_dump()

        elif isinstance(resume_data, dict):

            raw_data = resume_data

        else:

            raw_data = {
                "skills": getattr(
                    resume_data,
                    "skills",
                    [],
                ),

                "experience": getattr(
                    resume_data,
                    "experience",
                    [],
                ),

                "projects": getattr(
                    resume_data,
                    "projects",
                    [],
                ),

                "education": getattr(
                    resume_data,
                    "education",
                    [],
                ),

                "certifications": getattr(
                    resume_data,
                    "certifications",
                    [],
                ),
            }

        return {
            "structured_skills":
                cls.structure_skills(
                    raw_data.get(
                        "skills",
                        [],
                    )
                ),

            "structured_experience":
                cls.structure_experience(
                    raw_data.get(
                        "experience",
                        [],
                    )
                ),

            "structured_projects":
                cls.structure_projects(
                    raw_data.get(
                        "projects",
                        [],
                    )
                ),

            "structured_education":
                cls.structure_education(
                    raw_data.get(
                        "education",
                        [],
                    )
                ),

            "structured_certifications":
                cls.structure_certifications(
                    raw_data.get(
                        "certifications",
                        [],
                    )
                ),
        }

    # =========================================================
    # SKILLS
    # =========================================================

    @classmethod
    def structure_skills(cls, skills):

        skills = cls._clean_list(skills)

        if not skills:
            return {}

        grouped = {}

        assigned = set()

        for category, known_skills in cls.SKILL_GROUPS.items():

            category_skills = []

            for skill in skills:

                lower = skill.lower()

                if lower in known_skills:

                    category_skills.append(
                        skill
                    )

                    assigned.add(
                        lower
                    )

            if category_skills:

                grouped[
                    category
                ] = category_skills

        # -----------------------------------------------------
        # Skills not present in our predefined categories
        # -----------------------------------------------------

        others = [
            skill
            for skill in skills
            if skill.lower()
            not in assigned
        ]

        if others:

            grouped[
                "Other Technical Skills"
            ] = others

        return grouped

    # =========================================================
    # EXPERIENCE
    # =========================================================

    @classmethod
    def structure_experience(
        cls,
        experience,
    ):

        lines = cls._clean_list(
            experience
        )

        if not lines:
            return []

        # Already structured dictionaries
        if (
            isinstance(experience, list)
            and experience
            and isinstance(
                experience[0],
                dict,
            )
        ):

            result = []

            for item in experience:

                result.append({
                    "role": cls._clean(
                        item.get(
                            "role",
                            item.get(
                                "title",
                                "",
                            ),
                        )
                    ),

                    "company": cls._clean(
                        item.get(
                            "company",
                            item.get(
                                "organization",
                                "",
                            ),
                        )
                    ),

                    "date": cls._clean(
                        item.get(
                            "date",
                            item.get(
                                "duration",
                                "",
                            ),
                        )
                    ),

                    "bullets":
                        cls._clean_list(
                            item.get(
                                "bullets",
                                item.get(
                                    "description",
                                    [],
                                ),
                            )
                        ),
                })

            return result

        entries = []

        current = None

        for line in lines:

            # -------------------------------------------------
            # DATE
            # -------------------------------------------------

            if cls._is_date(line):

                if current is None:

                    current = {
                        "role": "",
                        "company": "",
                        "date": "",
                        "bullets": [],
                    }

                current[
                    "date"
                ] = line

                continue

            # -------------------------------------------------
            # BULLET / RESPONSIBILITY
            # -------------------------------------------------

            if cls._looks_like_bullet(
                line
            ):

                if current is None:

                    current = {
                        "role": "",
                        "company": "",
                        "date": "",
                        "bullets": [],
                    }

                current[
                    "bullets"
                ].append(
                    line
                )

                continue

            # -------------------------------------------------
            # ROLE / COMPANY
            # -------------------------------------------------

            if current is None:

                current = {
                    "role": line,
                    "company": "",
                    "date": "",
                    "bullets": [],
                }

                continue

            if not current[
                "company"
            ]:

                current[
                    "company"
                ] = line

                continue

            # New title encountered after an existing entry
            if current[
                "bullets"
            ]:

                entries.append(
                    current
                )

                current = {
                    "role": line,
                    "company": "",
                    "date": "",
                    "bullets": [],
                }

            else:

                current[
                    "bullets"
                ].append(
                    line
                )

        if current:

            entries.append(
                current
            )

        return entries

    # =========================================================
    # PROJECTS
    # =========================================================

    @classmethod
    def structure_projects(
        cls,
        projects,
    ):

        if not projects:
            return []

        # -----------------------------------------------------
        # Already structured projects
        # -----------------------------------------------------

        if (
            isinstance(projects, list)
            and projects
            and isinstance(
                projects[0],
                dict,
            )
        ):

            result = []

            for project in projects:

                technologies = (
                    project.get(
                        "technologies"
                    )
                    or project.get(
                        "tech_stack"
                    )
                    or project.get(
                        "skills"
                    )
                    or []
                )

                bullets = (
                    project.get(
                        "bullets"
                    )
                    or project.get(
                        "description"
                    )
                    or []
                )

                result.append({
                    "title": cls._clean(
                        project.get(
                            "title",
                            project.get(
                                "name",
                                "",
                            ),
                        )
                    ),

                    "technologies":
                        cls._clean_list(
                            technologies
                        ),

                    "bullets":
                        cls._clean_list(
                            bullets
                        ),
                })

            return result

        lines = cls._clean_list(
            projects
        )

        if not lines:
            return []

        entries = []

        current = None

        for line in lines:

            # -------------------------------------------------
            # Achievement / project description
            # -------------------------------------------------

            if cls._looks_like_bullet(
                line
            ):

                if current is None:

                    current = {
                        "title": "Project",
                        "technologies": [],
                        "bullets": [],
                    }

                current[
                    "bullets"
                ].append(
                    line
                )

                continue

            # -------------------------------------------------
            # Detect technology line
            # -------------------------------------------------

            detected_skills = []

            for category_skills in cls.SKILL_GROUPS.values():

                for skill in category_skills:

                    pattern = (
                        r"(?<![a-zA-Z0-9])"
                        + re.escape(skill)
                        + r"(?![a-zA-Z0-9])"
                    )

                    if re.search(
                        pattern,
                        line,
                        re.IGNORECASE,
                    ):

                        detected_skills.append(
                            skill
                        )

            # If line is mostly a technology stack
            if detected_skills:

                if current is None:

                    current = {
                        "title": "Project",
                        "technologies": [],
                        "bullets": [],
                    }

                # Avoid treating a long descriptive sentence
                # as just technologies.
                if len(
                    line.split()
                ) <= 12:

                    for skill in detected_skills:

                        if (
                            skill.lower()
                            not in [
                                x.lower()
                                for x
                                in current[
                                    "technologies"
                                ]
                            ]
                        ):

                            current[
                                "technologies"
                            ].append(
                                skill
                            )

                    continue

            # -------------------------------------------------
            # Otherwise assume project title
            # -------------------------------------------------

            if current is not None:

                # Only close previous project if it already
                # contains useful content.
                if (
                    current["title"]
                    or current["bullets"]
                    or current["technologies"]
                ):

                    entries.append(
                        current
                    )

            current = {
                "title": line,
                "technologies": [],
                "bullets": [],
            }

        if current:

            entries.append(
                current
            )

        return entries

    # =========================================================
    # EDUCATION
    # =========================================================

    @classmethod
    def structure_education(
        cls,
        education,
    ):

        if not education:
            return []

        # -----------------------------------------------------
        # Already structured education
        # -----------------------------------------------------

        if (
            isinstance(education, list)
            and education
            and isinstance(
                education[0],
                dict,
            )
        ):

            result = []

            for item in education:

                result.append({
                    "institution": cls._clean(
                        item.get(
                            "institution",
                            item.get(
                                "college",
                                item.get(
                                    "university",
                                    "",
                                ),
                            ),
                        )
                    ),

                    "degree": cls._clean(
                        item.get(
                            "degree",
                            item.get(
                                "qualification",
                                "",
                            ),
                        )
                    ),

                    "date": cls._clean(
                        item.get(
                            "date",
                            item.get(
                                "year",
                                "",
                            ),
                        )
                    ),

                    "score": cls._clean(
                        item.get(
                            "score",
                            item.get(
                                "cgpa",
                                item.get(
                                    "percentage",
                                    "",
                                ),
                            ),
                        )
                    ),

                    "details":
                        cls._clean_list(
                            item.get(
                                "details",
                                [],
                            )
                        ),
                })

            return result

        lines = cls._clean_list(
            education
        )

        entries = []

        current = None

        degree_keywords = [
            "bachelor",
            "master",
            "b.tech",
            "btech",
            "b.e",
            "m.tech",
            "mtech",
            "bca",
            "mca",
            "b.sc",
            "bsc",
            "m.sc",
            "msc",
            "diploma",
            "pre-university",
            "pre university",
            "puc",
            "pcmc",
            "12th",
            "10th",
            "sslc",
        ]

        for line in lines:

            lower = line.lower()

            # -------------------------------------------------
            # DATE
            # -------------------------------------------------

            if cls._is_date(line):

                if current is None:

                    current = {
                        "institution": "",
                        "degree": "",
                        "date": "",
                        "score": "",
                        "details": [],
                    }

                current[
                    "date"
                ] = line

                continue

            # -------------------------------------------------
            # SCORE
            # -------------------------------------------------

            if cls._is_score(line):

                if current is None:

                    current = {
                        "institution": "",
                        "degree": "",
                        "date": "",
                        "score": "",
                        "details": [],
                    }

                current[
                    "score"
                ] = line

                continue

            # -------------------------------------------------
            # DEGREE
            # -------------------------------------------------

            if any(
                keyword in lower
                for keyword
                in degree_keywords
            ):

                if current is None:

                    current = {
                        "institution": "",
                        "degree": "",
                        "date": "",
                        "score": "",
                        "details": [],
                    }

                if not current[
                    "degree"
                ]:

                    current[
                        "degree"
                    ] = line

                else:

                    # likely a second education entry
                    entries.append(
                        current
                    )

                    current = {
                        "institution": "",
                        "degree": line,
                        "date": "",
                        "score": "",
                        "details": [],
                    }

                continue

            # -------------------------------------------------
            # INSTITUTION / OTHER DETAIL
            # -------------------------------------------------

            if current is None:

                current = {
                    "institution": line,
                    "degree": "",
                    "date": "",
                    "score": "",
                    "details": [],
                }

                continue

            if not current[
                "institution"
            ]:

                current[
                    "institution"
                ] = line

                continue

            # If existing entry appears complete and another
            # institution-like line appears, start new entry.
            institution_words = [
                "university",
                "college",
                "school",
                "institute",
                "academy",
                "vidyanikethan",
                "vidyaniketan",
            ]

            if (
                any(
                    word in lower
                    for word
                    in institution_words
                )
                and (
                    current["degree"]
                    or current["date"]
                    or current["score"]
                )
            ):

                entries.append(
                    current
                )

                current = {
                    "institution": line,
                    "degree": "",
                    "date": "",
                    "score": "",
                    "details": [],
                }

            else:

                current[
                    "details"
                ].append(
                    line
                )

        if current:

            entries.append(
                current
            )

        return entries

    # =========================================================
    # CERTIFICATIONS
    # =========================================================

    @classmethod
    def structure_certifications(
        cls,
        certifications,
    ):

        certifications = cls._clean_list(
            certifications
        )

        if not certifications:
            return []

        result = []

        for certification in certifications:

            # -------------------------------------------------
            # Sometimes parser returns multiple certifications
            # merged with bullet characters.
            # -------------------------------------------------

            pieces = re.split(
                r"\s+[•●▪◦]\s+",
                certification,
            )

            if len(pieces) == 1:

                pieces = [
                    certification
                ]

            for piece in pieces:

                piece = cls._clean(
                    piece
                )

                if not piece:
                    continue

                if (
                    piece.lower()
                    not in [
                        item.lower()
                        for item in result
                    ]
                ):

                    result.append(
                        piece
                    )

        return result