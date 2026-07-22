import { motion } from "framer-motion";

import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

function ResumeCard({ result }) {
  // ==========================================
  // EMPTY STATE
  // ==========================================

  if (!result) {
    return (
      <Card
        className="
          h-full
          rounded-3xl
          border border-slate-200
          bg-white
          shadow-xl

          dark:border-slate-800
          dark:bg-slate-900
        "
      >
        <CardContent className="flex min-h-[450px] flex-col items-center justify-center p-8 text-center">

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/40">
            <FileText
              size={30}
              className="text-blue-600 dark:text-blue-400"
            />
          </div>

          <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
            Resume Breakdown
          </h3>

          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
            Analyze your resume to view the
            quality of each important resume
            section.
          </p>

        </CardContent>
      </Card>
    );
  }

  // ==========================================
  // BACKEND DATA
  // ==========================================

  const ats =
    result?.ats_score || {};

  const breakdown =
    ats?.breakdown || {};

  const overallScore =
    Number(ats?.overall_score) || 0;

  // ==========================================
  // NORMALIZE SCORE OBJECT
  // ==========================================

  const getSectionData = (section) => {
    if (
      section &&
      typeof section === "object"
    ) {
      const score =
        Number(section.score) || 0;

      const maxScore =
        Number(section.max_score) || 0;

      const percentage =
        maxScore > 0
          ? Math.round(
              (score / maxScore) * 100
            )
          : 0;

      return {
        score,
        maxScore,
        percentage,
      };
    }

    // Support old numeric format too

    if (
      typeof section === "number"
    ) {
      return {
        score: section,
        maxScore: 100,
        percentage: section,
      };
    }

    return {
      score: 0,
      maxScore: 0,
      percentage: 0,
    };
  };

  // ==========================================
  // SECTIONS
  // ==========================================

  const rows = [
    {
      title: "Contact Information",
      description:
        "Name, email and phone details",
      value: breakdown.contact,
    },

    {
      title: "Skills",
      description:
        "Relevant technical and professional skills",
      value: breakdown.skills,
    },

    {
      title: "Education",
      description:
        "Academic background and qualifications",
      value: breakdown.education,
    },

    {
      title: "Experience",
      description:
        "Internships and professional experience",
      value: breakdown.experience,
    },

    {
      title: "Projects",
      description:
        "Practical work and project experience",
      value: breakdown.projects,
    },

    {
      title: "Certifications",
      description:
        "Courses and professional certifications",
      value: breakdown.certifications,
    },

    {
      title: "Resume Length",
      description:
        "Resume content length and completeness",
      value: breakdown.length,
    },
  ];

  // ==========================================
  // STATUS
  // ==========================================

  const getStatus = (percentage) => {
    if (percentage >= 80) {
      return {
        icon: CheckCircle2,

        text:
          "Excellent",

        textColor:
          "text-green-600 dark:text-green-400",

        bg:
          "bg-green-50 dark:bg-green-950/30",

        border:
          "border-green-100 dark:border-green-900/50",

        progress:
          "bg-green-500",
      };
    }

    if (percentage >= 60) {
      return {
        icon: AlertTriangle,

        text:
          "Good",

        textColor:
          "text-amber-600 dark:text-amber-400",

        bg:
          "bg-amber-50 dark:bg-amber-950/30",

        border:
          "border-amber-100 dark:border-amber-900/50",

        progress:
          "bg-amber-500",
      };
    }

    return {
      icon: XCircle,

      text:
        "Needs Improvement",

      textColor:
        "text-red-600 dark:text-red-400",

      bg:
        "bg-red-50 dark:bg-red-950/30",

      border:
        "border-red-100 dark:border-red-900/50",

      progress:
        "bg-red-500",
    };
  };

  // ==========================================
  // QUALITY SUMMARY
  // ==========================================

  const getQualitySummary = () => {
    if (overallScore >= 90) {
      return (
        "Your resume is highly optimized and " +
        "shows excellent ATS readiness. Focus " +
        "on small refinements to make it even " +
        "more competitive."
      );
    }

    if (overallScore >= 80) {
      return (
        "Your resume is strong overall. A few " +
        "targeted improvements can increase its " +
        "impact and recruiter visibility."
      );
    }

    if (overallScore >= 70) {
      return (
        "Your resume has a good foundation. " +
        "Strengthening weaker sections and " +
        "adding measurable achievements can " +
        "improve your score."
      );
    }

    if (overallScore >= 60) {
      return (
        "Your resume is moderately optimized. " +
        "Several sections should be improved " +
        "before applying for competitive roles."
      );
    }

    return (
      "Your resume needs improvement. Focus " +
      "on complete sections, relevant skills, " +
      "projects, achievements and clear " +
      "ATS-friendly content."
    );
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
      }}
      className="h-full"
    >

      <Card
        className="
          h-full
          rounded-3xl
          border border-slate-200
          bg-white
          shadow-xl

          dark:border-slate-800
          dark:bg-slate-900
          dark:shadow-none
        "
      >

        <CardContent className="p-6 md:p-8">

          {/* HEADER */}

          <div className="flex items-start gap-3">

            <div
              className="
                flex h-12 w-12
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-blue-50

                dark:bg-blue-950/40
              "
            >

              <FileText
                size={24}
                className="text-blue-600 dark:text-blue-400"
              />

            </div>

            <div>

              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-blue-600

                  dark:text-blue-400
                "
              >
                Resume Quality
              </p>

              <h2
                className="
                  mt-1
                  text-2xl
                  font-extrabold
                  tracking-tight
                  text-slate-900

                  dark:text-white
                  md:text-3xl
                "
              >
                Resume Breakdown
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  leading-6
                  text-slate-500

                  dark:text-slate-400
                "
              >
                See how each section contributes
                to your overall ATS score.
              </p>

            </div>

          </div>

          {/* ==================================
              SECTION LIST
          ================================== */}

          <div className="mt-8 space-y-4">

            {rows.map(
              (item, index) => {

                const data =
                  getSectionData(
                    item.value
                  );

                const status =
                  getStatus(
                    data.percentage
                  );

                const Icon =
                  status.icon;

                return (
                  <motion.div
                    key={item.title}
                    initial={{
                      opacity: 0,
                      x: -15,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      duration: 0.35,
                      delay:
                        index * 0.05,
                    }}
                    className={`
                      rounded-2xl
                      border
                      p-5
                      transition-all
                      duration-300
                      hover:shadow-md

                      ${status.border}

                      dark:bg-slate-800/30
                    `}
                  >

                    {/* TOP */}

                    <div
                      className="
                        flex
                        items-start
                        justify-between
                        gap-4
                      "
                    >

                      <div className="min-w-0">

                        <h3
                          className="
                            font-bold
                            text-slate-900

                            dark:text-white
                          "
                        >
                          {item.title}
                        </h3>

                        <p
                          className="
                            mt-1
                            text-xs
                            leading-5
                            text-slate-500

                            dark:text-slate-400
                          "
                        >
                          {item.description}
                        </p>

                        <div
                          className="
                            mt-2
                            flex
                            items-center
                            gap-2
                          "
                        >

                          <Icon
                            size={15}
                            className={
                              status.textColor
                            }
                          />

                          <span
                            className={`
                              text-xs
                              font-bold
                              ${status.textColor}
                            `}
                          >
                            {status.text}
                          </span>

                        </div>

                      </div>

                      {/* SCORE */}

                      <div
                        className="
                          shrink-0
                          text-right
                        "
                      >

                        <p
                          className={`
                            text-2xl
                            font-extrabold
                            ${status.textColor}
                          `}
                        >
                          {data.percentage}%
                        </p>

                        {data.maxScore >
                          0 && (
                          <p
                            className="
                              mt-1
                              text-xs
                              font-medium
                              text-slate-400

                              dark:text-slate-500
                            "
                          >
                            {data.score} /{" "}
                            {data.maxScore} pts
                          </p>
                        )}

                      </div>

                    </div>

                    {/* PROGRESS BAR */}

                    <div
                      className="
                        mt-4
                        h-2
                        overflow-hidden
                        rounded-full
                        bg-slate-100

                        dark:bg-slate-700
                      "
                    >

                      <motion.div
                        initial={{
                          width: 0,
                        }}
                        animate={{
                          width: `${Math.min(
                            Math.max(
                              data.percentage,
                              0
                            ),
                            100
                          )}%`,
                        }}
                        transition={{
                          duration: 0.7,
                          delay:
                            index * 0.05,
                        }}
                        className={`
                          h-full
                          rounded-full
                          ${status.progress}
                        `}
                      />

                    </div>

                  </motion.div>
                );
              }
            )}

          </div>

          {/* ==================================
              QUALITY SUMMARY
          ================================== */}

          <div
            className="
              mt-8
              rounded-2xl
              border
              border-blue-100
              bg-blue-50
              p-5

              dark:border-blue-900/50
              dark:bg-blue-950/30
            "
          >

            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <Sparkles
                size={19}
                className="text-blue-600 dark:text-blue-400"
              />

              <h3
                className="
                  font-extrabold
                  text-slate-900

                  dark:text-white
                "
              >
                Resume Quality Summary
              </h3>

            </div>

            <p
              className="
                mt-3
                text-sm
                leading-7
                text-slate-600

                dark:text-slate-300
              "
            >
              {getQualitySummary()}
            </p>

          </div>

          {/* WORD COUNT */}

          {ats?.word_count !== undefined && (
            <div
              className="
                mt-4
                flex
                items-center
                justify-between
                rounded-xl
                bg-slate-50
                px-4
                py-3

                dark:bg-slate-800
              "
            >

              <span
                className="
                  text-sm
                  font-medium
                  text-slate-500

                  dark:text-slate-400
                "
              >
                Resume Word Count
              </span>

              <span
                className="
                  text-sm
                  font-extrabold
                  text-slate-900

                  dark:text-white
                "
              >
                {ats.word_count} words
              </span>

            </div>
          )}

        </CardContent>

      </Card>

    </motion.div>
  );
}

export default ResumeCard;