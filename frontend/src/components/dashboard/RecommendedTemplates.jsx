import { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  Download,
  Eye,
  GraduationCap,
  Loader2,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  Target,
  X,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL;

/* =========================================================
   MAIN COMPONENT
========================================================= */

function RecommendedTemplates({ result }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");

  const ats = result?.ats_score || {};

  const resume =
    result?.data ||
    result?.resume_data ||
    result?.resume ||
    {};

  const jobMatch = result?.job_match || {};

  const resumeId =
    cleanString(result?.resume_id) ||
    cleanString(resume?.resume_id);

  /* =======================================================
     ATS SCORE
  ======================================================= */

  const rawScore = ats?.overall_score;

  let score = 0;

  if (typeof rawScore === "number") {
    score = clamp(rawScore, 0, 100);
  } else if (typeof rawScore === "string") {
    score = clamp(Number(rawScore) || 0, 0, 100);
  } else if (rawScore && typeof rawScore === "object") {
    score = clamp(
      Number(
        rawScore?.overall_score ??
          rawScore?.score ??
          rawScore?.value ??
          0
      ) || 0,
      0,
      100
    );
  }

  /* =======================================================
     RESUME DATA
  ======================================================= */

  const name =
    cleanString(resume?.name) ||
    "Candidate Name";

  const email = cleanString(resume?.email);
  const phone = cleanString(resume?.phone);

  const linkedin =
    cleanString(resume?.linkedin) ||
    cleanString(resume?.linkedin_url) ||
    extractLinkedIn(resume?.resume_text);

  const github =
    cleanString(resume?.github) ||
    cleanString(resume?.github_url) ||
    extractGitHub(resume?.resume_text);

  const professionalSummary =
    cleanString(resume?.professional_summary) ||
    cleanString(resume?.summary);

  const skills = normalizeArray(resume?.skills);
  const education = normalizeArray(resume?.education);
  const experience = normalizeArray(resume?.experience);
  const projects = normalizeArray(resume?.projects);

  /*
    IMPORTANT:
    Remove LinkedIn/GitHub URLs from certifications.
  */

  const certifications = normalizeArray(
    resume?.certifications
  ).filter((item) => {
    const value = item.toLowerCase();

    return (
      !value.includes("github.com") &&
      !value.includes("linkedin.com") &&
      !value.includes("github:") &&
      !value.includes("linkedin:")
    );
  });

  const resumeText = cleanString(resume?.resume_text);

  /* =======================================================
     BEST ROLE
  ======================================================= */

  const recommendedRoles = Array.isArray(
    jobMatch?.recommended_roles
  )
    ? jobMatch.recommended_roles
    : [];

  const firstRole = recommendedRoles[0] || {};

  const bestRole =
    cleanString(jobMatch?.best_role) ||
    cleanString(jobMatch?.best_match?.role) ||
    cleanString(firstRole?.role) ||
    cleanString(firstRole?.title) ||
    "Target Role";

  /* =======================================================
     PROFILE CLASSIFICATION
  ======================================================= */

  const profile = useMemo(
    () =>
      classifyCandidate({
        resumeText,
        skills,
        education,
        experience,
        projects,
        certifications,
        bestRole,
      }),
    [
      resumeText,
      skills,
      education,
      experience,
      projects,
      certifications,
      bestRole,
    ]
  );

  /* =======================================================
     TEMPLATE LIST
  ======================================================= */

  const templates = [
    {
      id: "classic",
      name: "Classic ATS",
      subtitle: "Simple & Universal",
      description:
        "A clean single-column resume designed for straightforward ATS parsing.",
      icon: ShieldCheck,
    },

    {
      id: "modern",
      name: "Modern Professional",
      subtitle: "Skills & Career Focused",
      description:
        "A modern layout emphasizing technical skills, projects and career alignment.",
      icon: Target,
    },

    {
      id: "student",
      name: "Fresher / Student",
      subtitle: "Projects & Education Focused",
      description:
        "Designed for students and freshers whose skills, projects and education are their strongest sections.",
      icon: GraduationCap,
    },

    {
      id: "professional",
      name: "Experienced Professional",
      subtitle: "Experience Focused",
      description:
        "Designed for experienced candidates with stronger professional work history.",
      icon: BriefcaseBusiness,
    },
  ];

  const recommendedTemplate = profile.template;

  const recommendedTemplateData =
    templates.find(
      (template) =>
        template.id === recommendedTemplate
    ) || templates[0];

  /* =======================================================
     PREVIEW DATA
  ======================================================= */

  const previewData = {
    name,
    email,
    phone,
    linkedin,
    github,
    professionalSummary,
    skills,
    education,
    experience,
    projects,
    certifications,
    bestRole,
  };

  /* =======================================================
     PREVIEW FUNCTIONS
  ======================================================= */

  const openPreview = (template) => {
    setGenerationError("");
    setSelectedTemplate(template);
  };

  const closePreview = () => {
    if (isGenerating) return;

    setGenerationError("");
    setSelectedTemplate(null);
  };

  const switchTemplate = (direction) => {
    if (!selectedTemplate || isGenerating) return;

    const index = templates.findIndex(
      (template) =>
        template.id === selectedTemplate.id
    );

    let nextIndex = index + direction;

    if (nextIndex < 0) {
      nextIndex = templates.length - 1;
    }

    if (nextIndex >= templates.length) {
      nextIndex = 0;
    }

    setGenerationError("");
    setSelectedTemplate(templates[nextIndex]);
  };

  /* =======================================================
     ESC KEY
  ======================================================= */

  useEffect(() => {
    if (!selectedTemplate) return;

    const handleEscape = (event) => {
      if (
        event.key === "Escape" &&
        !isGenerating
      ) {
        setSelectedTemplate(null);
      }
    };

    document.body.style.overflow = "hidden";

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.body.style.overflow = "";

      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [selectedTemplate, isGenerating]);

  /* =======================================================
     GENERATE PDF
  ======================================================= */

  const generateResume = async () => {
    if (!selectedTemplate) {
      setGenerationError(
        "Please select a resume template."
      );

      return;
    }

    if (!resumeId) {
      setGenerationError(
        "Resume ID is missing. Please upload and analyze the resume again."
      );

      return;
    }

    try {
      setIsGenerating(true);
      setGenerationError("");

      const templateId = selectedTemplate.id;

      const response = await fetch(
        `${API_BASE_URL}/api/generate-resume/${encodeURIComponent(
          resumeId
        )}/${encodeURIComponent(templateId)}`
      );

      if (!response.ok) {
        let message =
          "Unable to generate resume.";

        try {
          const errorData =
            await response.json();

          message =
            errorData?.detail ||
            errorData?.message ||
            message;
        } catch {
          // Ignore non-JSON response
        }

        throw new Error(message);
      }

      const blob = await response.blob();

      if (!blob || blob.size === 0) {
        throw new Error(
          "Generated PDF is empty."
        );
      }

      const pdfUrl =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      const safeName =
        name
          .replace(
            /[^a-zA-Z0-9_-]/g,
            "_"
          )
          .replace(/_+/g, "_")
          .replace(/^_+|_+$/g, "") ||
        "resume";

      link.href = pdfUrl;

      link.download =
        `${safeName}_${templateId}_resume.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.setTimeout(() => {
        window.URL.revokeObjectURL(pdfUrl);
      }, 1500);
    } catch (error) {
      console.error(
        "Resume generation error:",
        error
      );

      setGenerationError(
        error?.message ||
          "Something went wrong while generating the resume."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <>
      <section
        className="
          overflow-hidden
          rounded-3xl
          border
          border-slate-200
          bg-white
          shadow-sm
          dark:border-slate-800
          dark:bg-slate-900
        "
      >
        {/* HEADER */}

        <div
          className="
            border-b
            border-slate-100
            px-6
            py-6
            dark:border-slate-800
            sm:px-8
          "
        >
          <div
            className="
              flex
              flex-col
              gap-5
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            <div>
              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  text-xs
                  font-black
                  uppercase
                  tracking-[0.18em]
                  text-violet-600
                "
              >
                <Sparkles size={15} />

                Smart Template Recommendation
              </div>

              <h2
                className="
                  mt-2
                  text-2xl
                  font-black
                  tracking-tight
                  text-slate-950
                  dark:text-white
                "
              >
                Find the Right Resume Template
              </h2>

              <p
                className="
                  mt-2
                  max-w-2xl
                  text-sm
                  leading-6
                  text-slate-500
                  dark:text-slate-400
                "
              >
                ResumeIQ evaluates your career
                stage, skills, projects and
                experience to recommend the most
                suitable resume layout.
              </p>
            </div>

            <div
              className="
                min-w-[210px]
                rounded-2xl
                border
                border-violet-100
                bg-violet-50
                px-4
                py-3
                dark:border-violet-900
                dark:bg-violet-950/30
              "
            >
              <p
                className="
                  text-[10px]
                  font-black
                  uppercase
                  tracking-wider
                  text-violet-500
                "
              >
                Detected Profile
              </p>

              <p
                className="
                  mt-1
                  text-base
                  font-black
                  text-violet-800
                  dark:text-violet-300
                "
              >
                {profile.label}
              </p>
            </div>
          </div>
        </div>

        {/* SIGNALS */}

        <div
          className="
            grid
            gap-3
            border-b
            border-slate-100
            bg-slate-50/60
            px-6
            py-4
            sm:grid-cols-2
            sm:px-8
            lg:grid-cols-4
          "
        >
          <ProfileSignal
            label="Skills"
            value={skills.length}
          />

          <ProfileSignal
            label="Projects"
            value={countProjects(projects)}
          />

          <ProfileSignal
            label="Experience"
            value={profile.experienceLevel}
          />

          <ProfileSignal
            label="ATS Score"
            value={`${score}/100`}
          />
        </div>

        {/* CARDS */}

        <div className="p-6 sm:p-8">
          <div
            className="
              grid
              gap-4
              md:grid-cols-2
              xl:grid-cols-4
            "
          >
            {templates.map((template) => {
              const Icon = template.icon;

              const recommended =
                template.id ===
                recommendedTemplate;

              return (
                <article
                  key={template.id}
                  className={`
                    relative
                    overflow-hidden
                    rounded-2xl
                    border
                    p-4
                    transition-all
                    duration-200

                    ${
                      recommended
                        ? `
                          border-violet-400
                          bg-violet-50/40
                          ring-2
                          ring-violet-100
                          shadow-md
                        `
                        : `
                          border-slate-200
                          bg-white
                          hover:-translate-y-1
                          hover:shadow-lg
                          dark:border-slate-800
                          dark:bg-slate-900
                        `
                    }
                  `}
                >
                  {recommended && (
                    <div
                      className="
                        absolute
                        right-3
                        top-3
                        z-10
                        inline-flex
                        items-center
                        gap-1
                        rounded-full
                        bg-violet-600
                        px-2.5
                        py-1
                        text-[10px]
                        font-black
                        uppercase
                        text-white
                      "
                    >
                      <Sparkles size={11} />

                      Best Fit
                    </div>
                  )}

                  <TemplatePreview
                    type={template.id}
                  />

                  <div
                    className="
                      mt-4
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-xl
                      bg-slate-100
                    "
                  >
                    <Icon size={18} />
                  </div>

                  <h3
                    className="
                      mt-3
                      text-base
                      font-black
                      text-slate-950
                      dark:text-white
                    "
                  >
                    {template.name}
                  </h3>

                  <p
                    className="
                      mt-1
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-wide
                      text-violet-500
                    "
                  >
                    {template.subtitle}
                  </p>

                  <p
                    className="
                      mt-2
                      min-h-[76px]
                      text-xs
                      leading-5
                      text-slate-500
                    "
                  >
                    {template.description}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      openPreview(template)
                    }
                    className={`
                      mt-4
                      flex
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      px-4
                      py-2.5
                      text-sm
                      font-bold

                      ${
                        recommended
                          ? `
                            bg-violet-600
                            text-white
                            hover:bg-violet-700
                          `
                          : `
                            bg-slate-100
                            text-slate-700
                            hover:bg-slate-200
                          `
                      }
                    `}
                  >
                    <Eye size={16} />

                    Preview
                  </button>
                </article>
              );
            })}
          </div>

          {/* RECOMMENDATION */}

          <div
            className="
              mt-7
              rounded-2xl
              border
              border-violet-200
              bg-violet-50/60
              p-5
            "
          >
            <div className="flex gap-4">
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-white
                  shadow-sm
                "
              >
                <Check
                  size={19}
                  className="text-violet-600"
                />
              </div>

              <div>
                <p
                  className="
                    text-xs
                    font-black
                    uppercase
                    tracking-[0.15em]
                    text-violet-500
                  "
                >
                  Recommended For Your Profile
                </p>

                <h3
                  className="
                    mt-1
                    text-lg
                    font-black
                    text-slate-950
                  "
                >
                  {recommendedTemplateData.name}
                </h3>

                <p
                  className="
                    mt-2
                    text-sm
                    leading-6
                    text-slate-600
                  "
                >
                  {profile.reason}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          PREVIEW MODAL
      ====================================================== */}

      {selectedTemplate && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            flex-col
            bg-slate-950/80
            backdrop-blur-sm
          "
        >
          {/* HEADER */}

          <div
            className="
              flex
              shrink-0
              items-center
              justify-between
              gap-4
              border-b
              border-slate-700
              bg-slate-900
              px-4
              py-3
              text-white
              sm:px-6
            "
          >
            <div>
              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-violet-400
                "
              >
                Resume Preview
              </p>

              <h3 className="text-lg font-black">
                {selectedTemplate.name}
              </h3>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  switchTemplate(-1)
                }
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-slate-800
                "
              >
                <ArrowLeft size={18} />
              </button>

              <button
                type="button"
                onClick={() =>
                  switchTemplate(1)
                }
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-slate-800
                "
              >
                <ArrowRight size={18} />
              </button>

              <button
                type="button"
                onClick={closePreview}
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-red-500/10
                  text-red-400
                "
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* RESUME */}

          <div
            className="
              flex-1
              overflow-y-auto
              bg-slate-200
              px-3
              py-8
              sm:px-6
            "
          >
            <div
              className="
                mx-auto
                w-full
                max-w-[900px]
              "
            >
              <FullResumePreview
                type={selectedTemplate.id}
                data={previewData}
              />
            </div>
          </div>

          {/* FOOTER */}

          <div
            className="
              shrink-0
              border-t
              border-slate-700
              bg-slate-900
              px-4
              py-3
              sm:px-6
            "
          >
            <div
              className="
                flex
                flex-col
                gap-3
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div>
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-xs
                    text-slate-400
                  "
                >
                  <CheckCircle2
                    size={15}
                    className="text-green-400"
                  />

                  Resume preview ready
                </div>

                {generationError && (
                  <p
                    className="
                      mt-2
                      text-xs
                      font-semibold
                      text-red-400
                    "
                  >
                    {generationError}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={generateResume}
                disabled={isGenerating}
                className="
                  inline-flex
                  min-w-[210px]
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-violet-600
                  px-5
                  py-3
                  text-sm
                  font-black
                  text-white
                  hover:bg-violet-500
                  disabled:opacity-60
                "
              >
                {isGenerating ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />

                    Generating...
                  </>
                ) : (
                  <>
                    <Download size={17} />

                    Generate & Download
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* =========================================================
   PROFILE
========================================================= */

/* =========================================================
   PROFILE
========================================================= */

function classifyCandidate({
  resumeText = "",
  skills = [],
  education = [],
  experience = [],
  projects = [],
  certifications = [],
  bestRole = "Target Role",
}) {
  const fullText = [
    resumeText,
    ...education,
    ...experience,
    ...projects,
    ...certifications,
  ]
    .join(" ")
    .toLowerCase();

  const experienceText = experience
    .join(" ")
    .toLowerCase();

  /* =====================================================
     1. EXPLICIT YEARS OF EXPERIENCE
  ===================================================== */

  const explicitYears =
    extractYearsOfExperience(fullText);

  /* =====================================================
     2. ESTIMATE YEARS FROM EXPERIENCE DATES
  ===================================================== */

  const estimatedYears =
    estimateExperienceYears(experienceText);

  const years = Math.max(
    explicitYears,
    estimatedYears
  );

  /* =====================================================
     3. PROFESSIONAL ROLE DETECTION
  ===================================================== */

  const professionalRoles = [
    "software developer",
    "software engineer",
    "senior software engineer",
    "data analyst",
    "data scientist",
    "machine learning engineer",
    "ml engineer",
    "ai engineer",
    "backend developer",
    "back-end developer",
    "frontend developer",
    "front-end developer",
    "full stack developer",
    "full-stack developer",
    "web developer",
    "application developer",
    "systems engineer",
    "system engineer",
    "devops engineer",
    "cloud engineer",
    "database administrator",
    "business analyst",
    "technical analyst",
    "associate engineer",
    "consultant",
    "manager",
    "team lead",
    "project manager",
  ];

  const hasProfessionalRole =
    professionalRoles.some((role) =>
      experienceText.includes(role)
    );

  /* =====================================================
     4. INTERNSHIP DETECTION
  ===================================================== */

  const internshipSignal =
    /\b(intern|internship|trainee)\b/i.test(
      experienceText
    );

  /* =====================================================
     5. STRONG PROFESSIONAL EXPERIENCE

     IMPORTANT:
     Education words DO NOT affect this.
  ===================================================== */

  const hasProfessionalExperience =
    hasProfessionalRole &&
    !isInternshipOnly(experienceText);

  /* =====================================================
     6. STUDENT SIGNAL

     DO NOT ADD:
     b.tech
     bachelor
     university
     college
     cgpa

     Experienced professionals also have education.
  ===================================================== */

  const studentKeywords = [
    "currently pursuing",
    "currently studying",
    "final year student",
    "pre-final year student",
    "undergraduate student",
    "engineering student",
    "computer science student",
    "fresher",
    "seeking internship",
    "looking for internship",
    "seeking an internship",
    "looking for an internship",
  ];

  const studentSignal =
    studentKeywords.some((keyword) =>
      fullText.includes(keyword)
    );

  /* =====================================================
     DECISION 1
     EXPERIENCED PROFESSIONAL

     THIS HAS HIGHEST PRIORITY
  ===================================================== */

  if (
    years >= 2 ||
    (
      hasProfessionalExperience &&
      estimatedYears >= 1
    )
  ) {
    return {
      label: "Experienced Professional",

      template: "professional",

      experienceLevel:
        years >= 1
          ? `${formatYears(years)}+ years`
          : "Professional",

      reason:
        "Your professional work experience is one of the strongest parts of your profile. The Experienced Professional template prioritizes your work history, responsibilities, achievements and technical impact.",
    };
  }

  /* =====================================================
     DECISION 2
     STUDENT / FRESHER
  ===================================================== */

  if (
    studentSignal ||
    (
      internshipSignal &&
      !hasProfessionalExperience
    )
  ) {
    return {
      label: "Student / Fresher",

      template: "student",

      experienceLevel:
        internshipSignal
          ? "Internship"
          : "Entry Level",

      reason:
        "Your skills, projects and education are currently stronger than your full-time professional work history. The Fresher / Student template gives these sections greater visibility.",
    };
  }

  /* =====================================================
     DECISION 3
     PROFESSIONAL ROLE WITHOUT 2 YEARS
  ===================================================== */

  if (hasProfessionalExperience) {
    return {
      label: "Technical / Early Career",

      template: "modern",

      experienceLevel:
        years > 0
          ? `${formatYears(years)} years`
          : "Early Career",

      reason:
        `You have professional exposure along with technical skills relevant to ${bestRole}. The Modern Professional template provides a balanced presentation of your experience, skills and projects.`,
    };
  }

  /* =====================================================
     DECISION 4
     STRONG TECHNICAL / PROJECT PROFILE
  ===================================================== */

  if (
    skills.length >= 6 ||
    projects.length > 0
  ) {
    return {
      label: "Technical / Early Career",

      template: "modern",

      experienceLevel: internshipSignal
        ? "Internship"
        : "Early Career",

      reason:
        `Your technical skills and project experience align well with ${bestRole}. The Modern Professional template gives your technical capabilities and projects stronger visibility.`,
    };
  }

  /* =====================================================
     DECISION 5
     DEFAULT CLASSIC ATS
  ===================================================== */

  return {
    label: "General Professional",

    template: "classic",

    experienceLevel: "General",

    reason:
      "A clean ATS-first layout provides a balanced presentation of your skills, education and professional profile.",
  };
}


/* =========================================================
   EXTRACT EXPLICIT YEARS
========================================================= */

function extractYearsOfExperience(text) {
  if (!text) {
    return 0;
  }

  const patterns = [
    /(\d+(?:\.\d+)?)\+?\s*years?\s+(?:of\s+)?experience/i,

    /(\d+(?:\.\d+)?)\+?\s*years?\s+(?:of\s+)?professional\s+experience/i,

    /experience\s+(?:of\s+)?(\d+(?:\.\d+)?)\+?\s*years?/i,

    /(\d+(?:\.\d+)?)\+?\s*yrs?\s+(?:of\s+)?experience/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);

    if (match) {
      const value = Number(match[1]);

      if (!Number.isNaN(value)) {
        return value;
      }
    }
  }

  return 0;
}


/* =========================================================
   ESTIMATE EXPERIENCE FROM DATE RANGES
========================================================= */

function estimateExperienceYears(text) {
  if (!text) {
    return 0;
  }

  const monthMap = {
    jan: 0,
    january: 0,

    feb: 1,
    february: 1,

    mar: 2,
    march: 2,

    apr: 3,
    april: 3,

    may: 4,

    jun: 5,
    june: 5,

    jul: 6,
    july: 6,

    aug: 7,
    august: 7,

    sep: 8,
    sept: 8,
    september: 8,

    oct: 9,
    october: 9,

    nov: 10,
    november: 10,

    dec: 11,
    december: 11,
  };

  const pattern =
    /\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)?\s*(20\d{2})\s*(?:-|–|—|to)\s*(?:(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)?\s*(20\d{2})|present|current|now)\b/gi;

  let totalMonths = 0;

  let match;

  while (
    (match = pattern.exec(text)) !== null
  ) {
    const startMonthText =
      match[1]?.toLowerCase();

    const startYear =
      Number(match[2]);

    const endMonthText =
      match[3]?.toLowerCase();

    const endYearText =
      match[4];

    const startMonth =
      startMonthText
        ? monthMap[startMonthText] ?? 0
        : 0;

    let endYear;
    let endMonth;

    if (endYearText) {
      endYear = Number(endYearText);

      endMonth =
        endMonthText
          ? monthMap[endMonthText] ?? 11
          : 11;
    } else {
      const now = new Date();

      endYear =
        now.getFullYear();

      endMonth =
        now.getMonth();
    }

    const startValue =
      startYear * 12 +
      startMonth;

    const endValue =
      endYear * 12 +
      endMonth;

    const months =
      endValue - startValue;

    if (
      months > 0 &&
      months < 600
    ) {
      totalMonths += months;
    }
  }

  if (totalMonths <= 0) {
    return 0;
  }

  return Number(
    (totalMonths / 12).toFixed(1)
  );
}


/* =========================================================
   CHECK WHETHER EXPERIENCE IS ONLY INTERNSHIP
========================================================= */

function isInternshipOnly(text) {
  if (!text) {
    return false;
  }

  const internshipWords =
    /\b(intern|internship|trainee)\b/i;

  const professionalWords =
    /\b(software developer|software engineer|data analyst|data scientist|machine learning engineer|ml engineer|ai engineer|backend developer|frontend developer|full stack developer|web developer|application developer|systems engineer|devops engineer|cloud engineer|business analyst|consultant|manager|team lead)\b/i;

  const hasInternship =
    internshipWords.test(text);

  const hasProfessional =
    professionalWords.test(text);

  return (
    hasInternship &&
    !hasProfessional
  );
}


/* =========================================================
   FORMAT YEARS
========================================================= */

function formatYears(years) {
  const value =
    Number(years) || 0;

  if (
    Number.isInteger(value)
  ) {
    return value;
  }

  return value.toFixed(1);
}
/* =========================================================
   SIGNAL
========================================================= */

function ProfileSignal({
  label,
  value,
}) {
  return (
    <div
      className="
        rounded-xl
        border
        border-slate-200
        bg-white
        px-4
        py-3
      "
    >
      <p
        className="
          text-[10px]
          font-black
          uppercase
          tracking-wider
          text-slate-400
        "
      >
        {label}
      </p>

      <p
        className="
          mt-1
          text-sm
          font-black
          text-slate-900
        "
      >
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   FULL RESUME PREVIEW
========================================================= */

function FullResumePreview({
  type,
  data,
}) {
  if (type === "student") {
    return (
      <StudentResume data={data} />
    );
  }

  if (type === "modern") {
    return (
      <ModernResume data={data} />
    );
  }

  if (type === "professional") {
    return (
      <ProfessionalResume
        data={data}
      />
    );
  }

  return (
    <ClassicResume data={data} />
  );
}

/* =========================================================
   STUDENT
========================================================= */

function StudentResume({ data }) {
  return (
    <ResumePaper>
      <ResumeHeader
        data={data}
        accent="cyan"
        centered
      />

      <ResumeSection
        title="Professional Summary"
        accent="cyan"
      >
        <SummaryText data={data} />
      </ResumeSection>

      <ResumeSection
        title="Technical Skills"
        accent="cyan"
      >
        <CategorizedSkills
          skills={data.skills}
        />
      </ResumeSection>

      {data.experience.length > 0 && (
        <ResumeSection
          title="Experience"
          accent="cyan"
        >
          <ExperienceBlocks
            items={data.experience}
          />
        </ResumeSection>
      )}

      {data.projects.length > 0 && (
        <ResumeSection
          title="Projects"
          accent="cyan"
        >
          <ProjectBlocks
            items={data.projects}
          />
        </ResumeSection>
      )}

      <ResumeSection
        title="Education"
        accent="cyan"
      >
        <EducationBlocks
          items={data.education}
        />
      </ResumeSection>

      {data.certifications.length > 0 && (
        <ResumeSection
          title="Certifications"
          accent="cyan"
        >
          <CertificationList
            items={data.certifications}
          />
        </ResumeSection>
      )}
    </ResumePaper>
  );
}

/* =========================================================
   CLASSIC
========================================================= */

function ClassicResume({ data }) {
  return (
    <ResumePaper>
      <ResumeHeader
        data={data}
        accent="slate"
        centered
      />

      <ResumeSection
        title="Professional Summary"
        accent="slate"
      >
        <SummaryText data={data} />
      </ResumeSection>

      <ResumeSection
        title="Technical Skills"
        accent="slate"
      >
        <CategorizedSkills
          skills={data.skills}
        />
      </ResumeSection>

      <ResumeSection
        title="Experience"
        accent="slate"
      >
        <ExperienceBlocks
          items={data.experience}
        />
      </ResumeSection>

      <ResumeSection
        title="Projects"
        accent="slate"
      >
        <ProjectBlocks
          items={data.projects}
        />
      </ResumeSection>

      <ResumeSection
        title="Education"
        accent="slate"
      >
        <EducationBlocks
          items={data.education}
        />
      </ResumeSection>

      <ResumeSection
        title="Certifications"
        accent="slate"
      >
        <CertificationList
          items={data.certifications}
        />
      </ResumeSection>
    </ResumePaper>
  );
}

/* =========================================================
   MODERN
========================================================= */

function ModernResume({ data }) {
  return (
    <ResumePaper>
      <ResumeHeader
        data={data}
        accent="violet"
      />

      <ResumeSection
        title="Professional Profile"
        accent="violet"
      >
        <SummaryText data={data} />
      </ResumeSection>

      <ResumeSection
        title="Core Technical Skills"
        accent="violet"
      >
        <CategorizedSkills
          skills={data.skills}
        />
      </ResumeSection>

      <ResumeSection
        title="Professional Experience"
        accent="violet"
      >
        <ExperienceBlocks
          items={data.experience}
        />
      </ResumeSection>

      <ResumeSection
        title="Selected Projects"
        accent="violet"
      >
        <ProjectBlocks
          items={data.projects}
        />
      </ResumeSection>

      <ResumeSection
        title="Education"
        accent="violet"
      >
        <EducationBlocks
          items={data.education}
        />
      </ResumeSection>

      <ResumeSection
        title="Certifications"
        accent="violet"
      >
        <CertificationList
          items={data.certifications}
        />
      </ResumeSection>
    </ResumePaper>
  );
}

/* =========================================================
   PROFESSIONAL
========================================================= */

function ProfessionalResume({
  data,
}) {
  return (
    <ResumePaper>
      <ResumeHeader
        data={data}
        accent="emerald"
      />

      <ResumeSection
        title="Professional Profile"
        accent="emerald"
      >
        <SummaryText data={data} />
      </ResumeSection>

      <ResumeSection
        title="Professional Experience"
        accent="emerald"
      >
        <ExperienceBlocks
          items={data.experience}
        />
      </ResumeSection>

      <ResumeSection
        title="Core Expertise"
        accent="emerald"
      >
        <CategorizedSkills
          skills={data.skills}
        />
      </ResumeSection>

      <ResumeSection
        title="Selected Projects"
        accent="emerald"
      >
        <ProjectBlocks
          items={data.projects}
        />
      </ResumeSection>

      <ResumeSection
        title="Education"
        accent="emerald"
      >
        <EducationBlocks
          items={data.education}
        />
      </ResumeSection>

      <ResumeSection
        title="Professional Certifications"
        accent="emerald"
      >
        <CertificationList
          items={data.certifications}
        />
      </ResumeSection>
    </ResumePaper>
  );
}

/* =========================================================
   PAPER

   MORE SPACING ADDED HERE
========================================================= */

function ResumePaper({ children }) {
  return (
    <div
      className="
        min-h-[1120px]
        w-full
        overflow-hidden
        bg-white
        px-[62px]
        py-[54px]
        text-slate-900
        shadow-2xl
        sm:px-[68px]
        sm:py-[58px]
      "
    >
      {children}
    </div>
  );
}

/* =========================================================
   HEADER
========================================================= */

function ResumeHeader({
  data,
  accent = "slate",
  centered = false,
}) {
  const accents = {
    slate:
      "border-slate-700",
    cyan:
      "border-cyan-600",
    violet:
      "border-violet-600",
    emerald:
      "border-emerald-600",
  };

  return (
    <header
      className={`
        border-b-2
        pb-[18px]
        ${accents[accent]}
        ${
          centered
            ? "text-center"
            : "text-left"
        }
      `}
    >
      <h1
        className="
          text-[31px]
          font-black
          uppercase
          leading-none
          tracking-[0.05em]
          text-slate-950
        "
      >
        {data.name}
      </h1>

      <ContactLine
        data={data}
        align={
          centered
            ? "center"
            : "left"
        }
      />
    </header>
  );
}

/* =========================================================
   CONTACT
========================================================= */

function ContactLine({
  data,
  align = "center",
}) {
  const contacts = [];

  if (data.email) {
    contacts.push({
      icon: Mail,
      value: data.email,
      href: `mailto:${data.email}`,
    });
  }

  if (data.phone) {
    contacts.push({
      icon: Phone,
      value: data.phone,
      href: `tel:${data.phone}`,
    });
  }

  if (data.linkedin) {
    contacts.push({
      value: "LinkedIn",
      href: normalizeUrl(
        data.linkedin
      ),
    });
  }

  if (data.github) {
    contacts.push({
      value: "GitHub",
      href: normalizeUrl(
        data.github
      ),
    });
  }

  if (!contacts.length) {
    return null;
  }

  return (
    <div
      className={`
        mt-[12px]
        flex
        flex-wrap
        items-center
        gap-x-[18px]
        gap-y-[7px]
        text-[11px]
        text-slate-600

        ${
          align === "center"
            ? "justify-center"
            : "justify-start"
        }
      `}
    >
      {contacts.map(
        (item, index) => {
          const Icon = item.icon;

          return (
            <a
              key={index}
              href={item.href}
              target={
                item.href?.startsWith(
                  "http"
                )
                  ? "_blank"
                  : undefined
              }
              rel="noreferrer"
              className="
                inline-flex
                items-center
                gap-1.5
                no-underline
              "
            >
              {Icon && (
                <Icon size={11} />
              )}

              {item.value}
            </a>
          );
        }
      )}
    </div>
  );
}

/* =========================================================
   SECTION

   MAIN SECTION SPACING
========================================================= */

function ResumeSection({
  title,
  children,
  accent = "slate",
}) {
  const colors = {
    slate:
      "border-slate-700 text-slate-900",

    cyan:
      "border-cyan-600 text-cyan-800",

    violet:
      "border-violet-600 text-violet-800",

    emerald:
      "border-emerald-600 text-emerald-800",
  };

  return (
    <section className="mt-[26px]">
      <h2
        className={`
          border-b
          pb-[6px]
          text-[13px]
          font-black
          uppercase
          tracking-[0.08em]

          ${colors[accent]}
        `}
      >
        {title}
      </h2>

      <div className="mt-[12px]">
        {children}
      </div>
    </section>
  );
}

/* =========================================================
   SUMMARY
========================================================= */

function SummaryText({ data }) {
  return (
    <p
      className="
        text-[12px]
        leading-[1.65]
        text-slate-700
      "
    >
      {data.professionalSummary ||
        `Candidate targeting ${data.bestRole} opportunities with relevant technical skills, project experience and professional capabilities.`}
    </p>
  );
}

/* =========================================================
   SKILLS
========================================================= */

function CategorizedSkills({
  skills,
}) {
  if (!skills?.length) {
    return (
      <EmptyText text="No skills detected." />
    );
  }

  const groups =
    categorizeSkills(skills);

  return (
    <div className="space-y-[7px]">
      {groups.map((group) => (
        <div
          key={group.label}
          className="
            grid
            grid-cols-[165px_1fr]
            gap-[18px]
            text-[11.5px]
            leading-[1.55]
          "
        >
          <span
            className="
              font-bold
              text-slate-900
            "
          >
            {group.label}
          </span>

          <span className="text-slate-700">
            {group.items.join(" • ")}
          </span>
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   EXPERIENCE
========================================================= */

function ExperienceBlocks({
  items,
}) {
  const entries =
    parseExperience(items);

  if (!entries.length) {
    return (
      <EmptyText text="No professional experience detected." />
    );
  }

  return (
    <div className="space-y-[20px]">
      {entries.map(
        (entry, index) => (
          <article key={index}>
            <div
              className="
                flex
                items-start
                justify-between
                gap-[28px]
              "
            >
              <div>
                <h3
                  className="
                    text-[12.5px]
                    font-extrabold
                    leading-[1.45]
                    text-slate-950
                  "
                >
                  {entry.role ||
                    entry.company}
                </h3>

                {entry.company &&
                  entry.company !==
                    entry.role && (
                    <p
                      className="
                        mt-[4px]
                        text-[11.5px]
                        font-medium
                        text-slate-600
                      "
                    >
                      {entry.company}
                    </p>
                  )}
              </div>

              {entry.date && (
                <p
                  className="
                    shrink-0
                    text-[11px]
                    font-bold
                    text-slate-600
                  "
                >
                  {entry.date}
                </p>
              )}
            </div>

            <BulletList
              items={entry.bullets}
              className="mt-[8px]"
            />
          </article>
        )
      )}
    </div>
  );
}

/* =========================================================
   PROJECTS
========================================================= */

function ProjectBlocks({ items }) {
  const projects =
    parseProjects(items);

  if (!projects.length) {
    return (
      <EmptyText text="No projects detected." />
    );
  }

  return (
    <div className="space-y-[20px]">
      {projects.map(
        (project, index) => (
          <article key={index}>
            <h3
              className="
                text-[12.5px]
                font-extrabold
                leading-[1.45]
                text-slate-950
              "
            >
              {project.title}
            </h3>

            {project.technologies && (
              <p
                className="
                  mt-[4px]
                  text-[10.5px]
                  font-semibold
                  italic
                  text-slate-500
                "
              >
                {project.technologies}
              </p>
            )}

            <BulletList
              items={project.bullets}
              className="mt-[8px]"
            />
          </article>
        )
      )}
    </div>
  );
}

/* =========================================================
   EDUCATION
========================================================= */

function EducationBlocks({
  items,
}) {
  const entries =
    parseEducation(items);

  if (!entries.length) {
    return (
      <EmptyText text="No education information detected." />
    );
  }

  return (
    <div className="space-y-[18px]">
      {entries.map(
        (entry, index) => (
          <article key={index}>
            <div
              className="
                flex
                items-start
                justify-between
                gap-[28px]
              "
            >
              <div>
                {entry.institution && (
                  <h3
                    className="
                      text-[12.5px]
                      font-extrabold
                      leading-[1.45]
                      text-slate-950
                    "
                  >
                    {entry.institution}
                  </h3>
                )}

                {entry.degree && (
                  <p
                    className="
                      mt-[4px]
                      text-[11.5px]
                      text-slate-700
                    "
                  >
                    {entry.degree}
                  </p>
                )}

                {entry.score && (
                  <p
                    className="
                      mt-[4px]
                      text-[11.5px]
                      text-slate-700
                    "
                  >
                    {entry.score}
                  </p>
                )}

                {entry.extra.length >
                  0 && (
                  <p
                    className="
                      mt-[4px]
                      text-[11px]
                      text-slate-600
                    "
                  >
                    {entry.extra.join(
                      " • "
                    )}
                  </p>
                )}
              </div>

              {entry.date && (
                <p
                  className="
                    shrink-0
                    text-[11px]
                    font-bold
                    text-slate-600
                  "
                >
                  {entry.date}
                </p>
              )}
            </div>
          </article>
        )
      )}
    </div>
  );
}

/* =========================================================
   CERTIFICATIONS
========================================================= */

function CertificationList({
  items,
}) {
  const cleaned =
    joinWrappedLines(items).filter(
      (item) => {
        const value =
          item.toLowerCase();

        return (
          !value.includes(
            "github.com"
          ) &&
          !value.includes(
            "linkedin.com"
          ) &&
          !value.includes(
            "github:"
          ) &&
          !value.includes(
            "linkedin:"
          )
        );
      }
    );

  if (!cleaned.length) {
    return (
      <EmptyText text="No certifications detected." />
    );
  }

  return (
    <BulletList items={cleaned} />
  );
}

/* =========================================================
   BULLETS

   MORE BULLET SPACING
========================================================= */

function BulletList({
  items,
  className = "",
}) {
  if (!items?.length) {
    return null;
  }

  return (
    <ul
      className={`
        space-y-[5px]
        ${className}
      `}
    >
      {items.map(
        (item, index) => (
          <li
            key={index}
            className="
              flex
              items-start
              gap-[9px]
              text-[11.5px]
              leading-[1.55]
              text-slate-700
            "
          >
            <span
              className="
                mt-[7px]
                h-[4px]
                w-[4px]
                shrink-0
                rounded-full
                bg-slate-600
              "
            />

            <span>
              {stripBullet(item)}
            </span>
          </li>
        )
      )}
    </ul>
  );
}

/* =========================================================
   EXPERIENCE PARSER
========================================================= */

function parseExperience(items) {
  const lines =
    joinWrappedLines(items);

  if (!lines.length) return [];

  const entries = [];

  let current = null;

  const push = () => {
    if (!current) return;

    if (
      current.role ||
      current.company ||
      current.bullets.length
    ) {
      entries.push(current);
    }

    current = null;
  };

  for (const line of lines) {
    if (isBullet(line)) {
      if (!current) {
        current = {
          role: "",
          company: "",
          date: "",
          bullets: [],
        };
      }

      current.bullets.push(
        stripBullet(line)
      );

      continue;
    }

    if (isDateLine(line)) {
      if (!current) {
        current = {
          role: "",
          company: "",
          date: "",
          bullets: [],
        };
      }

      current.date = line;

      continue;
    }

    if (!current) {
      current = {
        role: line,
        company: "",
        date: "",
        bullets: [],
      };

      continue;
    }

    if (
      current.bullets.length > 0
    ) {
      push();

      current = {
        role: line,
        company: "",
        date: "",
        bullets: [],
      };

      continue;
    }

    if (!current.company) {
      current.company = line;
    } else {
      current.bullets.push(line);
    }
  }

  push();

  return entries;
}

/* =========================================================
   PROJECT PARSER
========================================================= */

function parseProjects(items) {
  const lines =
    joinWrappedLines(items);

  if (!lines.length) return [];

  const projects = [];

  let current = null;

  const push = () => {
    if (!current) return;

    if (
      current.title ||
      current.bullets.length
    ) {
      projects.push(current);
    }

    current = null;
  };

  for (const line of lines) {
    if (isBullet(line)) {
      if (!current) {
        current = {
          title: "Project",
          technologies: "",
          bullets: [],
        };
      }

      current.bullets.push(
        stripBullet(line)
      );

      continue;
    }

    if (!current) {
      current = {
        title: line,
        technologies: "",
        bullets: [],
      };

      continue;
    }

    if (
      !current.technologies &&
      looksLikeTechnologyLine(line)
    ) {
      current.technologies =
        line;

      continue;
    }

    if (
      current.bullets.length > 0
    ) {
      push();

      current = {
        title: line,
        technologies: "",
        bullets: [],
      };

      continue;
    }

    current.bullets.push(line);
  }

  push();

  return projects;
}

/* =========================================================
   EDUCATION PARSER
========================================================= */

function parseEducation(items) {
  const lines =
    joinWrappedLines(items);

  if (!lines.length) return [];

  const entries = [];

  let current =
    createEducationEntry();

  const push = () => {
    if (
      current.institution ||
      current.degree ||
      current.date ||
      current.score ||
      current.extra.length
    ) {
      entries.push(current);
    }

    current =
      createEducationEntry();
  };

  for (const line of lines) {
    if (isScoreLine(line)) {
      current.score = line;
      continue;
    }

    if (isDateLine(line)) {
      current.date = line;
      continue;
    }

    if (isDegreeLine(line)) {
      current.degree = line;
      continue;
    }

    if (
      looksLikeInstitution(line)
    ) {
      if (
        current.institution &&
        (current.degree ||
          current.date)
      ) {
        push();
      }

      current.institution =
        line;

      continue;
    }

    current.extra.push(line);
  }

  push();

  return entries;
}

function createEducationEntry() {
  return {
    institution: "",
    degree: "",
    date: "",
    score: "",
    extra: [],
  };
}

/* =========================================================
   SKILL CATEGORIES
========================================================= */

function categorizeSkills(skills) {
  const categories = {
    "Programming Languages": [],
    "Web & Frameworks": [],
    "Data & AI": [],
    Databases: [],
    "Tools & Platforms": [],
    "Core CS": [],
    "Other Technical Skills": [],
  };

  const languages = new Set([
    "python",
    "java",
    "javascript",
    "typescript",
    "c",
    "c++",
    "c#",
    "go",
    "rust",
    "kotlin",
    "swift",
    "php",
    "ruby",
    "r",
  ]);

  const web = [
    "react",
    "html",
    "css",
    "fastapi",
    "django",
    "flask",
    "node",
    "express",
    "angular",
    "vue",
    "bootstrap",
    "tailwind",
  ];

  const data = [
    "machine learning",
    "artificial intelligence",
    "deep learning",
    "data analysis",
    "data visualization",
    "nlp",
    "power bi",
    "tableau",
    "pandas",
    "numpy",
    "scikit",
    "tensorflow",
    "pytorch",
  ];

  const databases = [
    "sql",
    "mysql",
    "mongodb",
    "postgres",
    "oracle",
    "sqlite",
    "firebase",
    "redis",
  ];

  const tools = [
    "git",
    "github",
    "aws",
    "azure",
    "docker",
    "kubernetes",
    "jupyter",
    "linux",
  ];

  const core = [
    "data structures",
    "algorithms",
    "operating systems",
    "computer networks",
    "networking",
    "dbms",
    "oop",
    "object oriented",
  ];

  for (const skill of skills) {
    const value =
      cleanString(skill);

    const lower =
      value.toLowerCase();

    if (!value) continue;

    if (languages.has(lower)) {
      categories[
        "Programming Languages"
      ].push(value);
    } else if (
      web.some((word) =>
        lower.includes(word)
      )
    ) {
      categories[
        "Web & Frameworks"
      ].push(value);
    } else if (
      data.some((word) =>
        lower.includes(word)
      )
    ) {
      categories[
        "Data & AI"
      ].push(value);
    } else if (
      databases.some((word) =>
        lower.includes(word)
      )
    ) {
      categories.Databases.push(
        value
      );
    } else if (
      tools.some((word) =>
        lower.includes(word)
      )
    ) {
      categories[
        "Tools & Platforms"
      ].push(value);
    } else if (
      core.some((word) =>
        lower.includes(word)
      )
    ) {
      categories[
        "Core CS"
      ].push(value);
    } else {
      categories[
        "Other Technical Skills"
      ].push(value);
    }
  }

  return Object.entries(categories)
    .filter(
      ([, values]) =>
        values.length > 0
    )
    .map(([label, values]) => ({
      label,
      items: uniqueStrings(values),
    }));
}

/* =========================================================
   CLEAN LINES
========================================================= */

function joinWrappedLines(items) {
  return normalizeArray(items)
    .map(cleanBrokenText)
    .filter(Boolean);
}

function cleanBrokenText(value) {
  return cleanString(value)
    .replace(
      /-\s+([a-z])/g,
      "$1"
    )
    .replace(/\s+/g, " ")
    .trim();
}

/* =========================================================
   DETECTORS
========================================================= */

function isBullet(value) {
  return /^[•●▪◦\-–—]\s*/.test(
    cleanString(value)
  );
}

function stripBullet(value) {
  return cleanString(value)
    .replace(
      /^[•●▪◦\-–—]+\s*/,
      ""
    )
    .trim();
}

function isDateLine(value) {
  const text =
    cleanString(value);

  return (
    /\b(?:19|20)\d{2}\b/.test(
      text
    ) && text.length <= 50
  );
}

function isScoreLine(value) {
  return /^(cgpa|gpa|marks?|percentage|score)\s*:/i.test(
    cleanString(value)
  );
}

function isDegreeLine(value) {
  return /\b(bachelor|b\.?\s?tech|btech|b\.?\s?e\.?|master|m\.?\s?tech|mtech|mca|bca|b\.?\s?sc|m\.?\s?sc|diploma|puc|pre-university|computer science|engineering)\b/i.test(
    cleanString(value)
  );
}

function looksLikeInstitution(
  value
) {
  return /\b(university|college|institute|school|academy|foundation|vidyanikethana)\b/i.test(
    cleanString(value)
  );
}

function looksLikeTechnologyLine(
  value
) {
  const text =
    cleanString(value);

  const words = [
    "python",
    "java",
    "javascript",
    "sql",
    "react",
    "fastapi",
    "machine learning",
    "power bi",
    "mongodb",
    "mysql",
    "html",
    "css",
  ];

  return words.some((word) =>
    text
      .toLowerCase()
      .includes(word)
  );
}

/* =========================================================
   SOCIAL EXTRACTION
========================================================= */

function extractLinkedIn(text) {
  const value =
    cleanString(text);

  if (!value) return "";

  const match = value.match(
    /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[A-Za-z0-9._%-]+\/?/i
  );

  return match
    ? match[0]
    : "";
}

function extractGitHub(text) {
  const value =
    cleanString(text);

  if (!value) return "";

  const match = value.match(
    /(?:https?:\/\/)?(?:www\.)?github\.com\/[A-Za-z0-9_.-]+\/?/i
  );

  return match
    ? match[0]
    : "";
}

/* =========================================================
   MINI TEMPLATE
========================================================= */

function TemplatePreview({ type }) {
  const accent =
    type === "student"
      ? "bg-cyan-500"
      : type === "modern"
      ? "bg-violet-500"
      : type === "professional"
      ? "bg-emerald-500"
      : "bg-slate-700";

  return (
    <div
      className="
        h-44
        overflow-hidden
        rounded-xl
        border
        border-slate-200
        bg-white
        p-3
      "
    >
      <div
        className={`
          mx-auto
          h-4
          w-24
          rounded
          ${accent}
        `}
      />

      <div
        className="
          mx-auto
          mt-2
          h-1.5
          w-32
          rounded
          bg-slate-200
        "
      />

      {[1, 2, 3].map(
        (section) => (
          <div
            key={section}
            className="mt-4"
          >
            <div
              className={`
                h-1.5
                w-14
                rounded
                ${accent}
              `}
            />

            <div
              className="
                mt-2
                h-1
                w-full
                rounded
                bg-slate-200
              "
            />

            <div
              className="
                mt-1.5
                h-1
                w-5/6
                rounded
                bg-slate-200
              "
            />
          </div>
        )
      )}
    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function normalizeArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map(toDisplayText)
    .filter(Boolean);
}

function cleanString(value) {
  if (
    typeof value !== "string"
  ) {
    return "";
  }

  return value.trim();
}

function toDisplayText(value) {
  if (
    typeof value === "string"
  ) {
    return value.trim();
  }

  if (
    typeof value === "number"
  ) {
    return String(value);
  }

  if (
    value &&
    typeof value === "object"
  ) {
    return cleanString(
      value?.name ??
        value?.title ??
        value?.role ??
        value?.description ??
        value?.text ??
        ""
    );
  }

  return "";
}

function normalizeUrl(value) {
  const url =
    cleanString(value);

  if (!url) return "";

  if (
    /^https?:\/\//i.test(url)
  ) {
    return url;
  }

  return `https://${url}`;
}

function uniqueStrings(items) {
  const seen = new Set();

  return items.filter((item) => {
    const key =
      cleanString(item)
        .toLowerCase();

    if (
      !key ||
      seen.has(key)
    ) {
      return false;
    }

    seen.add(key);

    return true;
  });
}

function countProjects(items) {
  return parseProjects(items).length;
}

function clamp(
  value,
  min,
  max
) {
  return Math.min(
    Math.max(value, min),
    max
  );
}

function EmptyText({ text }) {
  return (
    <p
      className="
        text-[11.5px]
        italic
        text-slate-400
      "
    >
      {text}
    </p>
  );
}

export default RecommendedTemplates;