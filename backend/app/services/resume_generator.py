from pathlib import Path
import re

from app.services.resume_structurer import ResumeStructurer

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    KeepTogether,
)


class ResumeGenerator:
    """
    ResumeIQ professional PDF generator.

    Templates:
        student       -> Graduate Pro
        modern        -> Modern Tech
        classic       -> ATS Classic
        professional  -> Experienced Professional
    """

    OUTPUT_DIR = Path("app/generated_resumes")
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # =========================================================
    # PUBLIC GENERATOR
    # =========================================================

    @classmethod
    def generate(cls, resume_id, template, resume_data):

        template = (template or "classic").lower().strip()

        aliases = {
            "student": "student",
            "fresher": "student",
            "graduate": "student",
            "graduate_pro": "student",

            "modern": "modern",
            "modern_tech": "modern",

            "classic": "classic",
            "ats": "classic",
            "ats_classic": "classic",

            "professional": "professional",
            "experienced": "professional",
            "executive": "professional",
        }

        template = aliases.get(template, "classic")

        # -----------------------------------------------------
        # IMPORTANT:
        # Use ResumeStructurer before generating PDF
        # -----------------------------------------------------

        structured = ResumeStructurer.structure(resume_data)

        data = cls._prepare_data(
            resume_data,
            structured,
        )

        output_path = (
            cls.OUTPUT_DIR
            / f"{resume_id}_{template}.pdf"
        )

        if template == "student":
            cls._generate_student(
                output_path,
                data,
            )

        elif template == "modern":
            cls._generate_modern(
                output_path,
                data,
            )

        elif template == "professional":
            cls._generate_professional(
                output_path,
                data,
            )

        else:
            cls._generate_classic(
                output_path,
                data,
            )

        return output_path

    # =========================================================
    # PREPARE DATA
    # =========================================================

    @classmethod
    def _prepare_data(
        cls,
        resume_data,
        structured,
    ):

        def get_value(*names, default=""):

            for name in names:

                if isinstance(resume_data, dict):
                    value = resume_data.get(name)

                else:
                    value = getattr(
                        resume_data,
                        name,
                        None,
                    )

                if value:
                    return value

            return default

        name = get_value(
            "name",
            "full_name",
            default="Candidate",
        )

        email = get_value(
            "email",
            "email_address",
        )

        phone = get_value(
            "phone",
            "phone_number",
        )

        linkedin = get_value(
            "linkedin",
            "linkedin_url",
        )

        github = get_value(
            "github",
            "github_url",
        )

        summary = get_value(
            "summary",
            "professional_summary",
            "profile",
            "objective",
        )

        return {
            "name": cls._clean(name),
            "email": cls._clean(email),
            "phone": cls._clean(phone),
            "linkedin": cls._clean(linkedin),
            "github": cls._clean(github),
            "summary": cls._clean(summary),

            "skills": structured.get(
                "structured_skills",
                {},
            ),

            "experience": structured.get(
                "structured_experience",
                [],
            ),

            "projects": structured.get(
                "structured_projects",
                [],
            ),

            "education": structured.get(
                "structured_education",
                [],
            ),

            "certifications": structured.get(
                "structured_certifications",
                [],
            ),
        }

    # =========================================================
    # CLEANING
    # =========================================================

    @staticmethod
    def _clean(value):

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

    @staticmethod
    def _escape(value):

        if value is None:
            return ""

        value = str(value)

        value = value.replace(
            "&",
            "&amp;",
        )

        value = value.replace(
            "<",
            "&lt;",
        )

        value = value.replace(
            ">",
            "&gt;",
        )

        return value

    # =========================================================
    # DOCUMENT
    # =========================================================

    @classmethod
    def _document(cls, path):

        return SimpleDocTemplate(
            str(path),
            pagesize=A4,

            leftMargin=13 * mm,
            rightMargin=13 * mm,
            topMargin=10 * mm,
            bottomMargin=10 * mm,

            title="ResumeIQ Generated Resume",
            author="ResumeIQ",
        )

    # =========================================================
    # STYLES
    # =========================================================

    @classmethod
    def _styles(
        cls,
        accent,
        compact=True,
    ):

        body_size = (
            8.35
            if compact
            else 9
        )

        body_leading = (
            10.5
            if compact
            else 11.5
        )

        return {

            "name": ParagraphStyle(
                "ResumeName",
                fontName="Helvetica-Bold",
                fontSize=21,
                leading=23,
                alignment=TA_CENTER,
                textColor=colors.HexColor(
                    "#172033"
                ),
                spaceAfter=3,
            ),

            "contact": ParagraphStyle(
                "ResumeContact",
                fontName="Helvetica",
                fontSize=8,
                leading=9.5,
                alignment=TA_CENTER,
                textColor=colors.HexColor(
                    "#56657A"
                ),
                spaceAfter=5,
            ),

            "section": ParagraphStyle(
                "ResumeSection",
                fontName="Helvetica-Bold",
                fontSize=9.5,
                leading=11,
                textColor=accent,
            ),

            "body": ParagraphStyle(
                "ResumeBody",
                fontName="Helvetica",
                fontSize=body_size,
                leading=body_leading,
                textColor=colors.HexColor(
                    "#26354D"
                ),
                spaceAfter=1,
            ),

            "bold": ParagraphStyle(
                "ResumeBold",
                fontName="Helvetica-Bold",
                fontSize=8.7,
                leading=10.5,
                textColor=colors.HexColor(
                    "#172033"
                ),
            ),

            "secondary": ParagraphStyle(
                "ResumeSecondary",
                fontName="Helvetica",
                fontSize=8,
                leading=9.5,
                textColor=colors.HexColor(
                    "#5A687A"
                ),
            ),

            "date": ParagraphStyle(
                "ResumeDate",
                fontName="Helvetica-Bold",
                fontSize=7.8,
                leading=9,
                alignment=TA_RIGHT,
                textColor=colors.HexColor(
                    "#526174"
                ),
            ),

            "bullet": ParagraphStyle(
                "ResumeBullet",
                fontName="Helvetica",
                fontSize=body_size,
                leading=body_leading,
                leftIndent=9,
                firstLineIndent=-5,
                textColor=colors.HexColor(
                    "#26354D"
                ),
                spaceAfter=1,
            ),

            "skill_category": ParagraphStyle(
                "SkillCategory",
                fontName="Helvetica-Bold",
                fontSize=8.2,
                leading=10,
                textColor=colors.HexColor(
                    "#172033"
                ),
            ),

            "skill_values": ParagraphStyle(
                "SkillValues",
                fontName="Helvetica",
                fontSize=8.2,
                leading=10,
                textColor=colors.HexColor(
                    "#26354D"
                ),
            ),

            "certification": ParagraphStyle(
                "Certification",
                fontName="Helvetica",
                fontSize=8.25,
                leading=10.2,
                leftIndent=9,
                firstLineIndent=-5,
                textColor=colors.HexColor(
                    "#26354D"
                ),
                spaceAfter=1.5,
            ),
        }

       # =========================================================
    # HEADER
    # =========================================================

    @classmethod
    def _header(
        cls,
        story,
        data,
        styles,
        accent,
    ):

        # -----------------------------------------------------
        # NAME
        # -----------------------------------------------------

        story.append(
            Paragraph(
                cls._escape(
                    data.get(
                        "name",
                        "Candidate",
                    )
                ).upper(),
                styles["name"],
            )
        )

        # -----------------------------------------------------
        # CONTACT DETAILS
        # -----------------------------------------------------

        contacts = []

        phone = cls._clean(
            data.get(
                "phone",
                ""
            )
        )

        email = cls._clean(
            data.get(
                "email",
                ""
            )
        )

        linkedin = cls._clean(
            data.get(
                "linkedin",
                ""
            )
        )

        github = cls._clean(
            data.get(
                "github",
                ""
            )
        )

        # -----------------------------------------------------
        # PHONE
        # -----------------------------------------------------

        if phone:

            contacts.append(
                cls._escape(
                    phone
                )
            )

        # -----------------------------------------------------
        # EMAIL - CLICKABLE
        # -----------------------------------------------------

        if email:

            safe_email = cls._escape(
                email
            )

            contacts.append(
                f'<link href="mailto:{safe_email}" '
                f'color="#56657A">'
                f'{safe_email}'
                f'</link>'
            )

        # -----------------------------------------------------
        # LINKEDIN - CLICKABLE
        # -----------------------------------------------------

        if linkedin:

            linkedin_url = linkedin.strip()

            # Add https:// if parser returned
            # linkedin.com/in/name
            if not linkedin_url.lower().startswith(
                (
                    "http://",
                    "https://",
                )
            ):
                linkedin_url = (
                    "https://"
                    + linkedin_url
                )

            safe_linkedin_url = (
                cls._escape(
                    linkedin_url
                )
            )

            contacts.append(
                f'<link href="{safe_linkedin_url}" '
                f'color="#56657A">'
                f'LinkedIn'
                f'</link>'
            )

        # -----------------------------------------------------
        # GITHUB - CLICKABLE
        # -----------------------------------------------------

        if github:

            github_url = github.strip()

            if not github_url.lower().startswith(
                (
                    "http://",
                    "https://",
                )
            ):
                github_url = (
                    "https://"
                    + github_url
                )

            safe_github_url = (
                cls._escape(
                    github_url
                )
            )

            contacts.append(
                f'<link href="{safe_github_url}" '
                f'color="#56657A">'
                f'GitHub'
                f'</link>'
            )

        # -----------------------------------------------------
        # DISPLAY CONTACT LINE
        # -----------------------------------------------------

        if contacts:

            contact_line = (
                " &nbsp;&nbsp; | &nbsp;&nbsp; "
            ).join(
                contacts
            )

            story.append(
                Paragraph(
                    contact_line,
                    styles["contact"],
                )
            )

        # -----------------------------------------------------
        # HEADER DIVIDER
        # -----------------------------------------------------

        line = Table(
            [[""]],
            colWidths=[
                184 * mm
            ],
            rowHeights=[
                1.5 * mm
            ],
        )

        line.setStyle(
            TableStyle([
                (
                    "LINEBELOW",
                    (0, 0),
                    (-1, -1),
                    1.1,
                    accent,
                ),
                (
                    "LEFTPADDING",
                    (0, 0),
                    (-1, -1),
                    0,
                ),
                (
                    "RIGHTPADDING",
                    (0, 0),
                    (-1, -1),
                    0,
                ),
            ])
        )

        story.append(
            line
        )

        story.append(
            Spacer(
                1,
                2,
            )
        )
    # =========================================================
    # SECTION TITLE
    # =========================================================

    @classmethod
    def _section_title(
        cls,
        story,
        title,
        styles,
        accent,
    ):

        title_table = Table(
            [[
                Paragraph(
                    title.upper(),
                    styles["section"],
                )
            ]],
            colWidths=[
                184 * mm
            ],
        )

        title_table.setStyle(
            TableStyle([
                (
                    "LINEBELOW",
                    (0, 0),
                    (-1, -1),
                    0.65,
                    accent,
                ),
                (
                    "LEFTPADDING",
                    (0, 0),
                    (-1, -1),
                    0,
                ),
                (
                    "RIGHTPADDING",
                    (0, 0),
                    (-1, -1),
                    0,
                ),
                (
                    "TOPPADDING",
                    (0, 0),
                    (-1, -1),
                    3,
                ),
                (
                    "BOTTOMPADDING",
                    (0, 0),
                    (-1, -1),
                    2,
                ),
            ])
        )

        story.append(title_table)

        story.append(
            Spacer(
                1,
                2,
            )
        )

    # =========================================================
    # SUMMARY
    # =========================================================

    @classmethod
    def _summary(
        cls,
        story,
        data,
        styles,
        accent,
    ):

        summary = data.get(
            "summary"
        )

        if not summary:
            return

        cls._section_title(
            story,
            "Professional Summary",
            styles,
            accent,
        )

        story.append(
            Paragraph(
                cls._escape(summary),
                styles["body"],
            )
        )

    # =========================================================
    # SKILLS
    # =========================================================

    @classmethod
    def _skills(
        cls,
        story,
        data,
        styles,
        accent,
    ):

        skills = data.get(
            "skills",
            {},
        )

        if not skills:
            return

        cls._section_title(
            story,
            "Technical Skills",
            styles,
            accent,
        )

        rows = []

        for category, values in skills.items():

            if not values:
                continue

            if isinstance(
                values,
                str,
            ):
                values = [values]

            values = [
                cls._clean(x)
                for x in values
                if cls._clean(x)
            ]

            if not values:
                continue

            skill_text = (
                "  •  ".join(
                    cls._escape(x)
                    for x in values
                )
            )

            rows.append([
                Paragraph(
                    cls._escape(category),
                    styles[
                        "skill_category"
                    ],
                ),

                Paragraph(
                    skill_text,
                    styles[
                        "skill_values"
                    ],
                ),
            ])

        if not rows:
            return

        table = Table(
            rows,
            colWidths=[
                39 * mm,
                145 * mm,
            ],
        )

        table.setStyle(
            TableStyle([
                (
                    "VALIGN",
                    (0, 0),
                    (-1, -1),
                    "TOP",
                ),
                (
                    "LEFTPADDING",
                    (0, 0),
                    (-1, -1),
                    0,
                ),
                (
                    "RIGHTPADDING",
                    (0, 0),
                    (-1, -1),
                    3,
                ),
                (
                    "TOPPADDING",
                    (0, 0),
                    (-1, -1),
                    1,
                ),
                (
                    "BOTTOMPADDING",
                    (0, 0),
                    (-1, -1),
                    1.5,
                ),
            ])
        )

        story.append(table)

    # =========================================================
    # EXPERIENCE
    # =========================================================

    @classmethod
    def _experience(
        cls,
        story,
        data,
        styles,
        accent,
    ):

        experience = data.get(
            "experience",
            [],
        )

        if not experience:
            return

        cls._section_title(
            story,
            "Experience",
            styles,
            accent,
        )

        for entry in experience:

            if not isinstance(
                entry,
                dict,
            ):
                continue

            role = cls._clean(
                entry.get(
                    "role",
                    ""
                )
            )

            company = cls._clean(
                entry.get(
                    "company",
                    ""
                )
            )

            date = cls._clean(
                entry.get(
                    "date",
                    ""
                )
            )

            bullets = (
                entry.get(
                    "bullets"
                )
                or []
            )

            block = []

            if role or date:

                heading = Table(
                    [[
                        Paragraph(
                            cls._escape(
                                role
                                or company
                            ),
                            styles["bold"],
                        ),

                        Paragraph(
                            cls._escape(date),
                            styles["date"],
                        ),
                    ]],
                    colWidths=[
                        145 * mm,
                        39 * mm,
                    ],
                )

                heading.setStyle(
                    TableStyle([
                        (
                            "VALIGN",
                            (0, 0),
                            (-1, -1),
                            "TOP",
                        ),
                        (
                            "LEFTPADDING",
                            (0, 0),
                            (-1, -1),
                            0,
                        ),
                        (
                            "RIGHTPADDING",
                            (0, 0),
                            (-1, -1),
                            0,
                        ),
                        (
                            "TOPPADDING",
                            (0, 0),
                            (-1, -1),
                            0,
                        ),
                        (
                            "BOTTOMPADDING",
                            (0, 0),
                            (-1, -1),
                            0,
                        ),
                    ])
                )

                block.append(
                    heading
                )

            if (
                company
                and company != role
            ):

                block.append(
                    Paragraph(
                        cls._escape(company),
                        styles["secondary"],
                    )
                )

            for bullet in bullets:

                bullet = cls._clean(
                    bullet
                )

                if not bullet:
                    continue

                block.append(
                    Paragraph(
                        "• "
                        + cls._escape(
                            bullet
                        ),
                        styles["bullet"],
                    )
                )

            if block:

                story.append(
                    KeepTogether(
                        block
                    )
                )

                story.append(
                    Spacer(
                        1,
                        2.5,
                    )
                )

    # =========================================================
    # PROJECTS
    # =========================================================

    @classmethod
    def _projects(
        cls,
        story,
        data,
        styles,
        accent,
    ):

        projects = data.get(
            "projects",
            [],
        )

        if not projects:
            return

        cls._section_title(
            story,
            "Projects",
            styles,
            accent,
        )

        for project in projects:

            if not isinstance(
                project,
                dict,
            ):
                continue

            title = cls._clean(
                project.get(
                    "title",
                    ""
                )
            )

            technologies = (
                project.get(
                    "technologies"
                )
                or []
            )

            bullets = (
                project.get(
                    "bullets"
                )
                or []
            )

            block = []

            if title:

                block.append(
                    Paragraph(
                        cls._escape(title),
                        styles["bold"],
                    )
                )

            if technologies:

                if isinstance(
                    technologies,
                    str,
                ):
                    technologies = [
                        technologies
                    ]

                technologies = [
                    cls._clean(x)
                    for x in technologies
                    if cls._clean(x)
                ]

                if technologies:

                    tech_text = (
                        " • ".join(
                            cls._escape(x)
                            for x
                            in technologies
                        )
                    )

                    block.append(
                        Paragraph(
                            tech_text,
                            styles[
                                "secondary"
                            ],
                        )
                    )

            for bullet in bullets:

                bullet = cls._clean(
                    bullet
                )

                if not bullet:
                    continue

                block.append(
                    Paragraph(
                        "• "
                        + cls._escape(
                            bullet
                        ),
                        styles["bullet"],
                    )
                )

            if block:

                story.append(
                    KeepTogether(
                        block
                    )
                )

                story.append(
                    Spacer(
                        1,
                        3,
                    )
                )

    # =========================================================
    # EDUCATION
    # =========================================================

    @classmethod
    def _education(
        cls,
        story,
        data,
        styles,
        accent,
    ):

        education = data.get(
            "education",
            [],
        )

        if not education:
            return

        cls._section_title(
            story,
            "Education",
            styles,
            accent,
        )

        for entry in education:

            if not isinstance(
                entry,
                dict,
            ):
                continue

            institution = cls._clean(
                entry.get(
                    "institution",
                    ""
                )
            )

            degree = cls._clean(
                entry.get(
                    "degree",
                    ""
                )
            )

            date = cls._clean(
                entry.get(
                    "date",
                    ""
                )
            )

            score = cls._clean(
                entry.get(
                    "score",
                    ""
                )
            )

            details = (
                entry.get(
                    "details"
                )
                or []
            )

            left = []

            if institution:

                left.append(
                    f"<b>{cls._escape(institution)}</b>"
                )

            if degree:

                left.append(
                    cls._escape(degree)
                )

            if score:

                left.append(
                    cls._escape(score)
                )

            for detail in details:

                detail = cls._clean(
                    detail
                )

                if detail:
                    left.append(
                        cls._escape(
                            detail
                        )
                    )

            if not left and not date:
                continue

            row = Table(
                [[
                    Paragraph(
                        "<br/>".join(
                            left
                        ),
                        styles["body"],
                    ),

                    Paragraph(
                        cls._escape(date),
                        styles["date"],
                    ),
                ]],
                colWidths=[
                    145 * mm,
                    39 * mm,
                ],
            )

            row.setStyle(
                TableStyle([
                    (
                        "VALIGN",
                        (0, 0),
                        (-1, -1),
                        "TOP",
                    ),
                    (
                        "LEFTPADDING",
                        (0, 0),
                        (-1, -1),
                        0,
                    ),
                    (
                        "RIGHTPADDING",
                        (0, 0),
                        (-1, -1),
                        0,
                    ),
                    (
                        "TOPPADDING",
                        (0, 0),
                        (-1, -1),
                        0,
                    ),
                    (
                        "BOTTOMPADDING",
                        (0, 0),
                        (-1, -1),
                        3,
                    ),
                ])
            )

            story.append(
                KeepTogether([
                    row
                ])
            )

    # =========================================================
    # CERTIFICATIONS
    # =========================================================

    @classmethod
    def _certifications(
        cls,
        story,
        data,
        styles,
        accent,
    ):

        certifications = data.get(
            "certifications",
            [],
        )

        if not certifications:
            return

        cls._section_title(
            story,
            "Certifications",
            styles,
            accent,
        )

        # -----------------------------------------------------
        # Individual clean points instead of one huge line
        # -----------------------------------------------------

        for certification in certifications:

            certification = cls._clean(
                certification
            )

            if not certification:
                continue

            story.append(
                Paragraph(
                    "• "
                    + cls._escape(
                        certification
                    ),
                    styles[
                        "certification"
                    ],
                )
            )

    # =========================================================
    # STUDENT / GRADUATE PRO
    # =========================================================

    @classmethod
    def _generate_student(
        cls,
        path,
        data,
    ):

        accent = colors.HexColor(
            "#087F9C"
        )

        styles = cls._styles(
            accent,
            compact=True,
        )

        story = []

        cls._header(
            story,
            data,
            styles,
            accent,
        )

        # Best order for student/fresher resumes.

        cls._summary(
            story,
            data,
            styles,
            accent,
        )

        cls._skills(
            story,
            data,
            styles,
            accent,
        )

        cls._experience(
            story,
            data,
            styles,
            accent,
        )

        cls._projects(
            story,
            data,
            styles,
            accent,
        )

        cls._education(
            story,
            data,
            styles,
            accent,
        )

        cls._certifications(
            story,
            data,
            styles,
            accent,
        )

        cls._document(
            path
        ).build(
            story
        )

    # =========================================================
    # MODERN TECH
    # =========================================================

    @classmethod
    def _generate_modern(
        cls,
        path,
        data,
    ):

        accent = colors.HexColor(
            "#5B4AE8"
        )

        styles = cls._styles(
            accent,
            compact=True,
        )

        story = []

        cls._header(
            story,
            data,
            styles,
            accent,
        )

        # Tech-oriented hierarchy.

        cls._summary(
            story,
            data,
            styles,
            accent,
        )

        cls._skills(
            story,
            data,
            styles,
            accent,
        )

        cls._projects(
            story,
            data,
            styles,
            accent,
        )

        cls._experience(
            story,
            data,
            styles,
            accent,
        )

        cls._education(
            story,
            data,
            styles,
            accent,
        )

        cls._certifications(
            story,
            data,
            styles,
            accent,
        )

        cls._document(
            path
        ).build(
            story
        )

    # =========================================================
    # ATS CLASSIC
    # =========================================================

    @classmethod
    def _generate_classic(
        cls,
        path,
        data,
    ):

        accent = colors.HexColor(
            "#27364A"
        )

        styles = cls._styles(
            accent,
            compact=True,
        )

        story = []

        cls._header(
            story,
            data,
            styles,
            accent,
        )

        cls._summary(
            story,
            data,
            styles,
            accent,
        )

        cls._skills(
            story,
            data,
            styles,
            accent,
        )

        cls._experience(
            story,
            data,
            styles,
            accent,
        )

        cls._projects(
            story,
            data,
            styles,
            accent,
        )

        cls._education(
            story,
            data,
            styles,
            accent,
        )

        cls._certifications(
            story,
            data,
            styles,
            accent,
        )

        cls._document(
            path
        ).build(
            story
        )

    # =========================================================
    # EXPERIENCED PROFESSIONAL
    # =========================================================

    @classmethod
    def _generate_professional(
        cls,
        path,
        data,
    ):

        accent = colors.HexColor(
            "#176B63"
        )

        styles = cls._styles(
            accent,
            compact=True,
        )

        story = []

        cls._header(
            story,
            data,
            styles,
            accent,
        )

        # Experience-first hierarchy.

        cls._summary(
            story,
            data,
            styles,
            accent,
        )

        cls._experience(
            story,
            data,
            styles,
            accent,
        )

        cls._skills(
            story,
            data,
            styles,
            accent,
        )

        cls._projects(
            story,
            data,
            styles,
            accent,
        )

        cls._education(
            story,
            data,
            styles,
            accent,
        )

        cls._certifications(
            story,
            data,
            styles,
            accent,
        )

        cls._document(
            path
        ).build(
            story
        )