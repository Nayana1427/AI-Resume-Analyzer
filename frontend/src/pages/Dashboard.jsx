import { useState } from "react";

import Navbar from "../components/dashboard/Navbar";
import StatsCards from "../components/dashboard/StatsCards";
import UploadCard from "../components/dashboard/UploadCard";
import ATSCard from "../components/dashboard/ATSCard";
import ResumeCard from "../components/dashboard/ResumeCard";
import SkillsCard from "../components/dashboard/SkillsCard";
import CareerMatches from "../components/dashboard/CareerMatches";
import AIRecommendations from "../components/dashboard/AIRecommendations";
import RecommendedTemplates from "../components/dashboard/RecommendedTemplates";
import Footer from "../components/dashboard/Footer";

import {
  Sparkles,
  ShieldCheck,
  Brain,
  Target,
  FileText,
  BriefcaseBusiness,
  Lightbulb,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  MessageSquareText,
} from "lucide-react";

function Dashboard() {
  const [result, setResult] = useState(null);

  const [expanded, setExpanded] = useState({
    resume: false,
    skills: false,
    career: false,
    recommendations: false,
  });

  // =====================================================
  // TOGGLE SECTIONS
  // =====================================================

  const toggleSection = (section) => {
    setExpanded((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // =====================================================
  // ANALYZE NEW RESUME
  // =====================================================

  const analyzeNewResume = () => {
    setResult(null);

    setExpanded({
      resume: false,
      skills: false,
      career: false,
      recommendations: false,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className="
        min-h-screen
        bg-slate-50
        text-slate-900
        dark:bg-slate-950
        dark:text-white
      "
    >
      <Navbar />

      <main
        className="
          mx-auto
          w-full
          max-w-7xl
          px-4
          py-6
          sm:px-6
          lg:px-8
        "
      >
        {/* =================================================
            BEFORE ANALYSIS
        ================================================== */}

        {!result && (
          <div className="mx-auto max-w-5xl">
            {/* HERO */}

            <section
              className="
                rounded-3xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm
                dark:border-slate-800
                dark:bg-slate-900
                sm:p-8
              "
            >
              <div
                className="
                  grid
                  gap-8
                  lg:grid-cols-[1fr_360px]
                  lg:items-center
                "
              >
                {/* LEFT */}

                <div>
                  <div
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-full
                      bg-blue-50
                      px-3
                      py-1.5
                      text-xs
                      font-bold
                      text-blue-600
                      dark:bg-blue-950/30
                      dark:text-blue-400
                    "
                  >
                    <Sparkles size={14} />
                    Intelligent Resume Analysis
                  </div>

                  <h1
                    className="
                      mt-4
                      max-w-2xl
                      text-3xl
                      font-black
                      leading-tight
                      tracking-tight
                      text-slate-950
                      dark:text-white
                      sm:text-4xl
                    "
                  >
                    See How Strong Your Resume{" "}
                    <span className="text-blue-600">
                      Really Is.
                    </span>
                  </h1>

                  <p
                    className="
                      mt-4
                      max-w-2xl
                      text-sm
                      leading-6
                      text-slate-500
                      dark:text-slate-400
                      sm:text-base
                      sm:leading-7
                    "
                  >
                    Upload your resume and get an instant
                    breakdown of ATS readiness, skills,
                    improvement areas and career opportunities
                    that match your profile.
                  </p>

                  <div
                    className="
                      mt-5
                      flex
                      flex-wrap
                      gap-x-5
                      gap-y-3
                    "
                  >
                    <HeroBenefit text="ATS Readiness" />
                    <HeroBenefit text="Skill Insights" />
                    <HeroBenefit text="Career Matching" />
                  </div>
                </div>

                {/* RIGHT */}

                <div className="grid grid-cols-3 gap-3">
                  <HeroFeature
                    icon={ShieldCheck}
                    title="ATS"
                    text="Readiness"
                    iconClass="text-blue-600"
                    bg="bg-blue-50 dark:bg-blue-950/30"
                  />

                  <HeroFeature
                    icon={Brain}
                    title="Skills"
                    text="Analysis"
                    iconClass="text-violet-600"
                    bg="bg-violet-50 dark:bg-violet-950/30"
                  />

                  <HeroFeature
                    icon={Target}
                    title="Career"
                    text="Matches"
                    iconClass="text-cyan-600"
                    bg="bg-cyan-50 dark:bg-cyan-950/30"
                  />
                </div>
              </div>
            </section>

            {/* UPLOAD */}

            <section className="mt-5">
              <UploadCard setResult={setResult} />
            </section>
          </div>
        )}

        {/* =================================================
            AFTER ANALYSIS
        ================================================== */}

        {result && (
          <div className="space-y-5">
            {/* =================================================
                REPORT HEADER
            ================================================== */}

            <section
              className="
                flex
                flex-col
                gap-4
                rounded-2xl
                border
                border-slate-200
                bg-white
                px-5
                py-4
                shadow-sm
                dark:border-slate-800
                dark:bg-slate-900
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-green-50
                    dark:bg-green-950/30
                  "
                >
                  <CheckCircle2
                    size={20}
                    className="text-green-600"
                  />
                </div>

                <div>
                  <h1
                    className="
                      text-lg
                      font-black
                      text-slate-950
                      dark:text-white
                    "
                  >
                    Your Resume Report
                  </h1>

                  <p
                    className="
                      mt-0.5
                      text-sm
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    Your personalized resume analysis is ready.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={analyzeNewResume}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  py-2.5
                  text-sm
                  font-bold
                  text-slate-700
                  transition
                  hover:border-blue-300
                  hover:bg-blue-50
                  hover:text-blue-600
                  dark:border-slate-700
                  dark:bg-slate-900
                  dark:text-slate-300
                  dark:hover:bg-slate-800
                "
              >
                <RotateCcw size={16} />
                Analyze New Resume
              </button>
            </section>

            {/* =================================================
                ATS PERFORMANCE
            ================================================== */}

            <ATSCard result={result} />

            {/* =================================================
                QUICK STATS
            ================================================== */}

            <StatsCards result={result} />

            {/* =================================================
                MAIN ANALYSIS
            ================================================== */}

            <section
              className="
                grid
                grid-cols-1
                gap-5
                lg:grid-cols-2
                lg:items-start
              "
            >
              {/* ================================
                  LEFT COLUMN
              ================================= */}

              <div className="flex min-w-0 flex-col gap-5">
                <ResultBox
                  icon={FileText}
                  iconClass="text-blue-600"
                  iconBg="bg-blue-50 dark:bg-blue-950/30"
                  title="Resume Breakdown"
                  description="Check the quality of each important resume section."
                  buttonText="View Resume Breakdown"
                  expanded={expanded.resume}
                  onClick={() =>
                    toggleSection("resume")
                  }
                >
                  <ResumeCard result={result} />
                </ResultBox>

                <ResultBox
                  icon={BriefcaseBusiness}
                  iconClass="text-cyan-600"
                  iconBg="bg-cyan-50 dark:bg-cyan-950/30"
                  title="Career Matches"
                  description="Explore roles that align with the skills in your resume."
                  buttonText="View Career Matches"
                  expanded={expanded.career}
                  onClick={() =>
                    toggleSection("career")
                  }
                >
                  <CareerMatches result={result} />
                </ResultBox>
              </div>

              {/* ================================
                  RIGHT COLUMN
              ================================= */}

              <div className="flex min-w-0 flex-col gap-5">
                <ResultBox
                  icon={Brain}
                  iconClass="text-violet-600"
                  iconBg="bg-violet-50 dark:bg-violet-950/30"
                  title="Skills Analysis"
                  description="Understand your strongest skills and areas to develop."
                  buttonText="View Skills Analysis"
                  expanded={expanded.skills}
                  onClick={() =>
                    toggleSection("skills")
                  }
                >
                  <SkillsCard result={result} />
                </ResultBox>

                <ResultBox
                  icon={Lightbulb}
                  iconClass="text-amber-600"
                  iconBg="bg-amber-50 dark:bg-amber-950/30"
                  title="Improvement Plan"
                  description="Get practical suggestions to strengthen your resume."
                  buttonText="View Improvement Plan"
                  expanded={expanded.recommendations}
                  onClick={() =>
                    toggleSection("recommendations")
                  }
                >
                  <AIRecommendations result={result} />
                </ResultBox>
              </div>
            </section>

            {/* =================================================
                FINAL FEEDBACK
            ================================================== */}

            <FinalFeedback result={result} />

            {/* =================================================
                RECOMMENDED TEMPLATES
                FINAL FEATURE
            ================================================== */}

            <RecommendedTemplates result={result} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

/* =========================================================
   FINAL FEEDBACK
========================================================= */

function FinalFeedback({ result }) {
  const ats = result?.ats_score || {};
  const job = result?.job_match || {};

  // =====================================================
  // SCORE
  // =====================================================

  const rawScore = ats?.overall_score;

  let score = 0;

  if (typeof rawScore === "number") {
    score = rawScore;
  } else if (typeof rawScore === "string") {
    score = Number(rawScore) || 0;
  } else if (
    rawScore &&
    typeof rawScore === "object"
  ) {
    score =
      Number(
        rawScore?.overall_score ??
          rawScore?.score ??
          rawScore?.value
      ) || 0;
  }

  score = Math.min(
    Math.max(score, 0),
    100
  );

  // =====================================================
  // GRADE
  // =====================================================

  let grade =
    typeof ats?.grade === "string"
      ? ats.grade
      : "";

  if (!grade) {
    if (score >= 90) {
      grade = "A+";
    } else if (score >= 80) {
      grade = "A";
    } else if (score >= 70) {
      grade = "B";
    } else if (score >= 60) {
      grade = "C";
    } else {
      grade = "D";
    }
  }

  // =====================================================
  // RATING
  // =====================================================

  let rating =
    typeof ats?.rating === "string"
      ? ats.rating
      : "";

  if (!rating) {
    if (score >= 90) {
      rating = "Excellent";
    } else if (score >= 80) {
      rating = "Very Good";
    } else if (score >= 70) {
      rating = "Good";
    } else if (score >= 60) {
      rating = "Average";
    } else {
      rating = "Needs Improvement";
    }
  }

  // =====================================================
  // CAREER MATCH
  // =====================================================

  const roles = Array.isArray(
    job?.recommended_roles
  )
    ? job.recommended_roles
    : [];

  const firstRole =
    roles[0] || {};

  let bestRole =
    job?.best_role ??
    job?.best_match?.role ??
    firstRole?.role ??
    firstRole?.title ??
    "";

  if (
    typeof bestRole !== "string" ||
    !bestRole.trim()
  ) {
    bestRole = "No role identified";
  }

  const rawMatch =
    job?.match_percentage ??
    job?.best_match?.match_percentage ??
    job?.best_match?.score ??
    firstRole?.match_percentage ??
    firstRole?.score ??
    0;

  let matchScore = 0;

  if (typeof rawMatch === "number") {
    matchScore = rawMatch;
  } else if (
    typeof rawMatch === "string"
  ) {
    matchScore =
      Number(
        rawMatch.replace("%", "")
      ) || 0;
  } else if (
    rawMatch &&
    typeof rawMatch === "object"
  ) {
    matchScore =
      Number(
        rawMatch?.match_percentage ??
          rawMatch?.score ??
          rawMatch?.value
      ) || 0;
  }

  matchScore = Math.min(
    Math.max(matchScore, 0),
    100
  );

  // =====================================================
  // FEEDBACK TEXT
  // =====================================================

  const getAssessment = () => {
    if (score >= 90) {
      return `Your resume demonstrates excellent overall readiness with strong content, relevant skills and well-developed sections. You are well positioned for ${bestRole} and similar opportunities. Continue tailoring keywords and measurable achievements for each application.`;
    }

    if (score >= 80) {
      return `Your resume is strong and professionally structured. A few targeted improvements to weaker sections, measurable achievements and role-specific keywords can make it even more competitive for ${bestRole}.`;
    }

    if (score >= 70) {
      return `Your resume has a solid foundation and shows good potential. Focus on weaker sections, stronger measurable achievements and skills relevant to ${bestRole} to make your profile more competitive.`;
    }

    if (score >= 60) {
      return `Your resume shows potential, but several areas can be strengthened. Improve weaker sections, add measurable achievements and develop skills relevant to ${bestRole}.`;
    }

    if (score >= 40) {
      return `Your resume contains useful information, but important areas still need improvement. Strengthen your skills, projects, experience descriptions and measurable achievements before applying to competitive roles.`;
    }

    return `Your resume needs significant improvement before it is ready for competitive applications. Strengthen missing or weak sections, add relevant skills and practical experience, improve project descriptions and use measurable achievements wherever possible.`;
  };

  return (
    <section
      className="
        overflow-hidden
        rounded-3xl
        border
        border-blue-200
        bg-white
        shadow-sm
        dark:border-blue-900/60
        dark:bg-slate-900
      "
    >
      <div
        className="
          grid
          gap-6
          p-6
          md:p-7
          lg:grid-cols-[1fr_460px]
          lg:items-center
          lg:p-8
        "
      >
        {/* LEFT */}

        <div
          className="
            flex
            min-w-0
            items-start
            gap-4
          "
        >
          <div
            className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-indigo-50
              dark:bg-indigo-950/30
            "
          >
            <MessageSquareText
              size={23}
              className="
                text-indigo-600
                dark:text-indigo-400
              "
            />
          </div>

          <div className="min-w-0">
            <p
              className="
                text-xs
                font-black
                uppercase
                tracking-[0.2em]
                text-indigo-600
                dark:text-indigo-400
              "
            >
              Final Feedback
            </p>

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
              Your Resume Assessment
            </h2>

            <p
              className="
                mt-3
                max-w-3xl
                text-sm
                leading-7
                text-slate-600
                dark:text-slate-400
                sm:text-base
              "
            >
              {getAssessment()}
            </p>

            {/* CAREER */}

            <div
              className="
                mt-4
                flex
                flex-wrap
                items-center
                gap-2
              "
            >
              <Target
                size={16}
                className="text-cyan-600"
              />

              <span
                className="
                  text-sm
                  font-semibold
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Strongest career alignment:
              </span>

              <span
                className="
                  text-sm
                  font-black
                  text-slate-900
                  dark:text-white
                "
              >
                {bestRole}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT */}

        <div
          className="
            grid
            grid-cols-1
            gap-3
            sm:grid-cols-3
          "
        >
          <FeedbackStat
            label="ATS Score"
            value={`${score}/100`}
            secondary={rating}
            className="
              bg-blue-50
              text-blue-700
              dark:bg-blue-950/30
              dark:text-blue-300
            "
          />

          <FeedbackStat
            label="Grade"
            value={grade}
            secondary="Resume Grade"
            className="
              bg-violet-50
              text-violet-700
              dark:bg-violet-950/30
              dark:text-violet-300
            "
          />

          <FeedbackStat
            label="Best Match"
            value={`${matchScore}%`}
            secondary={bestRole}
            className="
              bg-cyan-50
              text-cyan-700
              dark:bg-cyan-950/30
              dark:text-cyan-300
            "
          />
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   FEEDBACK STAT
========================================================= */

function FeedbackStat({
  label,
  value,
  secondary,
  className,
}) {
  return (
    <div
      className={`
        min-w-0
        rounded-2xl
        px-4
        py-5
        ${className}
      `}
    >
      <p
        className="
          text-[11px]
          font-black
          uppercase
          tracking-wide
          opacity-70
        "
      >
        {label}
      </p>

      <p
        className="
          mt-2
          break-words
          text-2xl
          font-black
        "
      >
        {value}
      </p>

      {secondary && (
        <p
          className="
            mt-1
            truncate
            text-[11px]
            font-semibold
            opacity-70
          "
        >
          {secondary}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   HERO BENEFIT
========================================================= */

function HeroBenefit({ text }) {
  return (
    <div
      className="
        flex
        items-center
        gap-2
        text-sm
        font-semibold
        text-slate-600
        dark:text-slate-300
      "
    >
      <CheckCircle2
        size={16}
        className="text-green-500"
      />

      {text}
    </div>
  );
}

/* =========================================================
   HERO FEATURE
========================================================= */

function HeroFeature({
  icon: Icon,
  title,
  text,
  iconClass,
  bg,
}) {
  return (
    <div
      className={`
        min-w-0
        rounded-2xl
        p-4
        ${bg}
      `}
    >
      <div
        className="
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-xl
          bg-white/70
          dark:bg-slate-900/50
        "
      >
        <Icon
          size={18}
          className={iconClass}
        />
      </div>

      <p
        className="
          mt-3
          text-sm
          font-black
          text-slate-900
          dark:text-white
        "
      >
        {title}
      </p>

      <p
        className="
          mt-1
          text-[11px]
          text-slate-500
          dark:text-slate-400
        "
      >
        {text}
      </p>
    </div>
  );
}

/* =========================================================
   RESULT BOX
========================================================= */

function ResultBox({
  icon: Icon,
  iconClass,
  iconBg,
  title,
  description,
  buttonText,
  expanded,
  onClick,
  children,
}) {
  return (
    <article
      className="
        w-full
        min-w-0
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
        dark:border-slate-800
        dark:bg-slate-900
      "
    >
      <div className="p-5">
        <div className="flex items-start gap-3">
          <div
            className={`
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-xl
              ${iconBg}
            `}
          >
            <Icon
              size={20}
              className={iconClass}
            />
          </div>

          <div className="min-w-0">
            <h2
              className="
                text-lg
                font-black
                text-slate-950
                dark:text-white
              "
            >
              {title}
            </h2>

            <p
              className="
                mt-1
                text-sm
                leading-5
                text-slate-500
                dark:text-slate-400
              "
            >
              {description}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClick}
          className="
            mt-4
            flex
            w-full
            items-center
            justify-between
            rounded-xl
            bg-slate-50
            px-4
            py-3
            text-sm
            font-bold
            text-slate-700
            transition
            hover:bg-blue-50
            hover:text-blue-600
            dark:bg-slate-800
            dark:text-slate-200
            dark:hover:bg-slate-700
          "
        >
          <span>
            {expanded
              ? "Hide Details"
              : buttonText}
          </span>

          {expanded ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </button>
      </div>

      {/* EXPANDED CONTENT */}

      {expanded && (
        <div
          className="
            min-w-0
            overflow-hidden
            border-t
            border-slate-100
            bg-slate-50/40
            p-2
            dark:border-slate-800
            dark:bg-slate-950/20
          "
        >
          {children}
        </div>
      )}
    </article>
  );
}

export default Dashboard;