import { motion } from "framer-motion";

import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowUpRight,
  MessageSquareText,
  Trophy,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

function AIRecommendations({ result }) {
  // ==========================================
  // EMPTY STATE
  // ==========================================

  if (!result) {
    return (
      <Card
        className="
          rounded-3xl
          border border-slate-200
          bg-white
          shadow-xl

          dark:border-slate-800
          dark:bg-slate-900
          dark:shadow-none
        "
      >
        <CardContent
          className="
            flex min-h-[360px]
            flex-col
            items-center
            justify-center
            p-8
            text-center
          "
        >
          <div
            className="
              flex h-16 w-16
              items-center
              justify-center
              rounded-2xl
              bg-indigo-50

              dark:bg-indigo-950/40
            "
          >
            <Sparkles
              size={30}
              className="
                text-indigo-600
                dark:text-indigo-400
              "
            />
          </div>

          <h3
            className="
              mt-5
              text-xl
              font-bold
              text-slate-900

              dark:text-white
            "
          >
            Personalized Feedback
          </h3>

          <p
            className="
              mt-2
              max-w-md
              text-sm
              leading-6
              text-slate-500

              dark:text-slate-400
            "
          >
            Analyze your resume to receive
            strengths, improvement areas and
            personalized recommendations.
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

  const jobMatch =
    result?.job_match || {};

  const overallScore =
    Number(ats?.overall_score) || 0;

  const grade =
    ats?.grade || "—";

  const rating =
    ats?.rating || "Not Rated";

  const bestRole =
    jobMatch?.best_role ||
    "No role identified";

  const matchPercentage =
    Number(
      jobMatch?.match_percentage
    ) || 0;

  const matchedSkills =
    Array.isArray(
      jobMatch?.matched_skills
    )
      ? jobMatch.matched_skills
      : [];

  const missingSkills =
    Array.isArray(
      jobMatch?.missing_skills
    )
      ? jobMatch.missing_skills
      : [];

  // Support multiple backend names
  const backendRecommendations =
    Array.isArray(
      result?.recommendations
    )
      ? result.recommendations
      : Array.isArray(
          result?.ai_recommendations
        )
      ? result.ai_recommendations
      : [];

  // ==========================================
  // ATS BREAKDOWN
  // ==========================================

  const breakdown =
    ats?.breakdown || {};

  const getPercentage = (
    section
  ) => {
    if (
      section &&
      typeof section === "object"
    ) {
      const score =
        Number(section.score) || 0;

      const max =
        Number(
          section.max_score
        ) || 0;

      if (!max) {
        return 0;
      }

      return Math.round(
        (score / max) * 100
      );
    }

    if (
      typeof section === "number"
    ) {
      return section;
    }

    return 0;
  };

  const sections = [
    {
      name: "Contact Information",
      score: getPercentage(
        breakdown.contact
      ),
    },
    {
      name: "Skills",
      score: getPercentage(
        breakdown.skills
      ),
    },
    {
      name: "Education",
      score: getPercentage(
        breakdown.education
      ),
    },
    {
      name: "Experience",
      score: getPercentage(
        breakdown.experience
      ),
    },
    {
      name: "Projects",
      score: getPercentage(
        breakdown.projects
      ),
    },
    {
      name: "Certifications",
      score: getPercentage(
        breakdown.certifications
      ),
    },
    {
      name: "Resume Length",
      score: getPercentage(
        breakdown.length
      ),
    },
  ];

  // ==========================================
  // STRENGTHS
  // ==========================================

  const strengths = [];

  sections.forEach(
    (section) => {
      if (section.score >= 80) {
        strengths.push(
          `${section.name} is well optimized (${section.score}%).`
        );
      }
    }
  );

  if (
    matchedSkills.length >= 5
  ) {
    strengths.push(
      `Strong skill alignment with ${bestRole}.`
    );
  }

  if (
    matchPercentage >= 75
  ) {
    strengths.push(
      `${matchPercentage}% compatibility with your strongest career match.`
    );
  }

  if (overallScore >= 80) {
    strengths.push(
      "Your resume has strong overall ATS compatibility."
    );
  }

  // ==========================================
  // IMPROVEMENT AREAS
  // ==========================================

  const improvements = [];

  sections.forEach(
    (section) => {
      if (
        section.score > 0 &&
        section.score < 70
      ) {
        improvements.push(
          `Improve ${section.name.toLowerCase()} — current section score is ${section.score}%.`
        );
      }
    }
  );

  if (
    missingSkills.length > 0
  ) {
    improvements.push(
      `Develop or demonstrate skills such as ${missingSkills
        .slice(0, 5)
        .join(", ")}.`
    );
  }

  if (overallScore < 70) {
    improvements.push(
      "Strengthen resume structure, keywords and measurable achievements."
    );
  }

  // ==========================================
  // FALLBACK RECOMMENDATIONS
  // ==========================================

  const fallbackRecommendations =
    [];

  if (
    missingSkills.length > 0
  ) {
    fallbackRecommendations.push(
      `Build projects or gain practical experience using ${missingSkills
        .slice(0, 3)
        .join(", ")}.`
    );
  }

  if (
    getPercentage(
      breakdown.experience
    ) < 80
  ) {
    fallbackRecommendations.push(
      "Strengthen your experience section with action verbs and measurable results."
    );
  }

  if (
    getPercentage(
      breakdown.projects
    ) < 80
  ) {
    fallbackRecommendations.push(
      "Add strong projects with technologies used, your contribution and measurable outcomes."
    );
  }

  if (
    getPercentage(
      breakdown.skills
    ) < 80
  ) {
    fallbackRecommendations.push(
      "Add relevant technical skills that you can confidently demonstrate in interviews."
    );
  }

  fallbackRecommendations.push(
    `Tailor your resume toward ${bestRole} and similar high-match roles.`
  );

  const recommendations =
    backendRecommendations.length
      ? backendRecommendations
      : fallbackRecommendations;

  // ==========================================
  // FINAL FEEDBACK
  // ==========================================

  const getFeedback = () => {
    if (
      overallScore >= 90
    ) {
      return `Your resume is highly ATS-ready with a score of ${overallScore}/100 and grade ${grade}. Your profile shows strong potential for ${bestRole}. Focus on the remaining skill gaps and continue adding measurable achievements to make the resume even stronger.`;
    }

    if (
      overallScore >= 80
    ) {
      return `Your resume is strong and competitive. You currently score ${overallScore}/100 with grade ${grade}. Your strongest career direction is ${bestRole}. A few targeted improvements can increase your job readiness further.`;
    }

    if (
      overallScore >= 70
    ) {
      return `Your resume has a solid foundation, but there is room for improvement. Focus on weaker sections, stronger achievements and skills relevant to ${bestRole}.`;
    }

    if (
      overallScore >= 60
    ) {
      return `Your resume has moderate ATS readiness. Improve weak sections and strengthen relevant skills before targeting competitive ${bestRole} opportunities.`;
    }

    return `Your resume needs further optimization before applying widely. Strengthen the content, skills, projects and achievements, then tailor the resume toward suitable roles such as ${bestRole}.`;
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
    >
      <Card
        className="
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

          <div
            className="
              flex
              items-start
              justify-between
              gap-4
            "
          >
            <div
              className="
                flex
                items-start
                gap-3
              "
            >
              <div
                className="
                  flex h-12 w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  bg-indigo-50

                  dark:bg-indigo-950/40
                "
              >
                <Sparkles
                  size={24}
                  className="
                    text-indigo-600
                    dark:text-indigo-400
                  "
                />
              </div>

              <div>

                <p
                  className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-indigo-600

                    dark:text-indigo-400
                  "
                >
                  Personalized Analysis
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
                  Resume Insights & Feedback
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
                  Understand what's working,
                  what needs improvement and
                  what you should do next.
                </p>

              </div>
            </div>

            <div
              className="
                hidden
                rounded-full
                bg-indigo-50
                px-3 py-1.5
                text-xs
                font-bold
                text-indigo-700

                dark:bg-indigo-950/40
                dark:text-indigo-300
                sm:block
              "
            >
              {rating}
            </div>
          </div>

          {/* ==================================
              STRENGTHS + IMPROVEMENTS
          ================================== */}

          <div
            className="
              mt-8
              grid
              gap-6
              lg:grid-cols-2
            "
          >

            {/* WHAT'S GOOD */}

            <div
              className="
                rounded-2xl
                border
                border-green-100
                bg-green-50/60
                p-6

                dark:border-green-900/50
                dark:bg-green-950/20
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <div
                  className="
                    flex h-10 w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-green-100

                    dark:bg-green-950/60
                  "
                >
                  <Trophy
                    size={20}
                    className="
                      text-green-600
                      dark:text-green-400
                    "
                  />
                </div>

                <div>

                  <h3
                    className="
                      text-lg
                      font-extrabold
                      text-slate-900

                      dark:text-white
                    "
                  >
                    What's Good
                  </h3>

                  <p
                    className="
                      text-xs
                      text-slate-500

                      dark:text-slate-400
                    "
                  >
                    Strong areas in your resume
                  </p>

                </div>
              </div>

              <div className="mt-5 space-y-3">

                {strengths.length ? (
                  strengths.map(
                    (
                      item,
                      index
                    ) => (
                      <motion.div
                        key={index}
                        initial={{
                          opacity: 0,
                          x: -10,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        transition={{
                          delay:
                            index *
                            0.04,
                        }}
                        className="
                          flex
                          items-start
                          gap-3
                        "
                      >
                        <CheckCircle2
                          size={18}
                          className="
                            mt-0.5
                            shrink-0
                            text-green-600

                            dark:text-green-400
                          "
                        />

                        <p
                          className="
                            text-sm
                            leading-6
                            text-slate-700

                            dark:text-slate-300
                          "
                        >
                          {item}
                        </p>
                      </motion.div>
                    )
                  )
                ) : (
                  <p
                    className="
                      text-sm
                      leading-6
                      text-slate-500

                      dark:text-slate-400
                    "
                  >
                    Continue improving your
                    resume to build stronger
                    ATS-ready sections.
                  </p>
                )}

              </div>
            </div>

            {/* WHAT NEEDS IMPROVEMENT */}

            <div
              className="
                rounded-2xl
                border
                border-orange-100
                bg-orange-50/60
                p-6

                dark:border-orange-900/50
                dark:bg-orange-950/20
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <div
                  className="
                    flex h-10 w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-orange-100

                    dark:bg-orange-950/60
                  "
                >
                  <AlertTriangle
                    size={20}
                    className="
                      text-orange-600
                      dark:text-orange-400
                    "
                  />
                </div>

                <div>

                  <h3
                    className="
                      text-lg
                      font-extrabold
                      text-slate-900

                      dark:text-white
                    "
                  >
                    What Can Improve
                  </h3>

                  <p
                    className="
                      text-xs
                      text-slate-500

                      dark:text-slate-400
                    "
                  >
                    Areas worth strengthening
                  </p>

                </div>
              </div>

              <div className="mt-5 space-y-3">

                {improvements.length ? (
                  improvements.map(
                    (
                      item,
                      index
                    ) => (
                      <motion.div
                        key={index}
                        initial={{
                          opacity: 0,
                          x: 10,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        transition={{
                          delay:
                            index *
                            0.04,
                        }}
                        className="
                          flex
                          items-start
                          gap-3
                        "
                      >
                        <ArrowUpRight
                          size={18}
                          className="
                            mt-0.5
                            shrink-0
                            text-orange-600

                            dark:text-orange-400
                          "
                        />

                        <p
                          className="
                            text-sm
                            leading-6
                            text-slate-700

                            dark:text-slate-300
                          "
                        >
                          {item}
                        </p>
                      </motion.div>
                    )
                  )
                ) : (
                  <div
                    className="
                      flex
                      items-start
                      gap-3
                    "
                  >
                    <CheckCircle2
                      size={18}
                      className="
                        mt-0.5
                        text-green-600
                      "
                    />

                    <p
                      className="
                        text-sm
                        leading-6
                        text-slate-600

                        dark:text-slate-300
                      "
                    >
                      No major weaknesses were
                      detected in the current
                      analysis.
                    </p>
                  </div>
                )}

              </div>
            </div>

          </div>

          {/* ==================================
              ACTION PLAN
          ================================== */}

          <div className="mt-8">

            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <Lightbulb
                size={21}
                className="
                  text-amber-500
                "
              />

              <div>

                <h3
                  className="
                    text-lg
                    font-extrabold
                    text-slate-900

                    dark:text-white
                  "
                >
                  Recommended Next Steps
                </h3>

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-500

                    dark:text-slate-400
                  "
                >
                  Practical actions to strengthen
                  your resume and job readiness.
                </p>

              </div>
            </div>

            <div
              className="
                mt-5
                grid
                gap-4
                md:grid-cols-2
              "
            >

              {recommendations.map(
                (
                  recommendation,
                  index
                ) => (
                  <motion.div
                    key={index}
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay:
                        index *
                        0.05,
                    }}
                    className="
                      flex
                      items-start
                      gap-4
                      rounded-2xl
                      border
                      border-slate-200
                      bg-slate-50/60
                      p-5

                      dark:border-slate-700
                      dark:bg-slate-800/40
                    "
                  >
                    <div
                      className="
                        flex h-9 w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-indigo-100
                        text-sm
                        font-black
                        text-indigo-700

                        dark:bg-indigo-950/60
                        dark:text-indigo-300
                      "
                    >
                      {index + 1}
                    </div>

                    <p
                      className="
                        text-sm
                        leading-6
                        text-slate-700

                        dark:text-slate-300
                      "
                    >
                      {typeof recommendation ===
                      "string"
                        ? recommendation
                        : recommendation?.message ||
                          recommendation?.text ||
                          recommendation?.recommendation ||
                          "Review this recommendation."}
                    </p>

                  </motion.div>
                )
              )}

            </div>
          </div>

          {/* ==================================
              FINAL FEEDBACK
          ================================== */}

          <div
            className="
              mt-8
              overflow-hidden
              rounded-3xl
              bg-gradient-to-r
              from-blue-600
              via-indigo-600
              to-cyan-500
              p-[1px]
            "
          >
            <div
              className="
                rounded-[23px]
                bg-white
                p-6

                dark:bg-slate-900
                md:p-7
              "
            >

              <div
                className="
                  flex
                  items-start
                  gap-4
                "
              >
                <div
                  className="
                    flex h-12 w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    bg-indigo-50

                    dark:bg-indigo-950/40
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

                <div className="flex-1">

                  <p
                    className="
                      text-xs
                      font-bold
                      uppercase
                      tracking-[0.18em]
                      text-indigo-600

                      dark:text-indigo-400
                    "
                  >
                    Final Feedback
                  </p>

                  <h3
                    className="
                      mt-1
                      text-xl
                      font-extrabold
                      text-slate-900

                      dark:text-white
                    "
                  >
                    Your Resume Assessment
                  </h3>

                  <p
                    className="
                      mt-3
                      text-sm
                      leading-7
                      text-slate-600

                      dark:text-slate-300
                    "
                  >
                    {getFeedback()}
                  </p>

                  <div
                    className="
                      mt-5
                      flex
                      flex-wrap
                      gap-3
                    "
                  >
                    <span
                      className="
                        rounded-full
                        bg-blue-50
                        px-3 py-1.5
                        text-xs
                        font-bold
                        text-blue-700

                        dark:bg-blue-950/40
                        dark:text-blue-300
                      "
                    >
                      ATS: {overallScore}/100
                    </span>

                    <span
                      className="
                        rounded-full
                        bg-violet-50
                        px-3 py-1.5
                        text-xs
                        font-bold
                        text-violet-700

                        dark:bg-violet-950/40
                        dark:text-violet-300
                      "
                    >
                      Grade: {grade}
                    </span>

                    <span
                      className="
                        rounded-full
                        bg-cyan-50
                        px-3 py-1.5
                        text-xs
                        font-bold
                        text-cyan-700

                        dark:bg-cyan-950/40
                        dark:text-cyan-300
                      "
                    >
                      Best Match:{" "}
                      {matchPercentage}%
                    </span>

                  </div>

                </div>

              </div>

            </div>
          </div>

        </CardContent>
      </Card>
    </motion.div>
  );
}

export default AIRecommendations;