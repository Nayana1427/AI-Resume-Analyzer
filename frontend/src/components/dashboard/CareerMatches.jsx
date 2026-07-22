import { motion } from "framer-motion";

import {
  BriefcaseBusiness,
  Trophy,
  CheckCircle2,
  AlertTriangle,
  Target,
  TrendingUp,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

function CareerMatches({ result }) {
  // ==========================================
  // DATA
  // ==========================================

  const jobMatch =
    result?.job_match || {};

  const recommendedRoles =
    Array.isArray(
      jobMatch?.recommended_roles
    )
      ? jobMatch.recommended_roles
      : [];

  const bestRole =
    jobMatch?.best_role ||
    recommendedRoles?.[0]?.role ||
    "No role identified";

  const bestPercentage =
    Number(
      jobMatch?.match_percentage ??
        recommendedRoles?.[0]
          ?.match_percentage
    ) || 0;

  // Sort highest match first
  const roles = [
    ...recommendedRoles,
  ].sort(
    (a, b) =>
      (Number(
        b?.match_percentage
      ) || 0) -
      (Number(
        a?.match_percentage
      ) || 0)
  );

  // ==========================================
  // MATCH STATUS
  // ==========================================

  const getMatchStatus = (
    percentage
  ) => {
    if (percentage >= 80) {
      return {
        label: "Excellent Match",

        text:
          "text-green-700 dark:text-green-400",

        badge:
          "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/40",

        progress:
          "bg-green-500",
      };
    }

    if (percentage >= 65) {
      return {
        label: "Strong Match",

        text:
          "text-blue-700 dark:text-blue-400",

        badge:
          "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/40",

        progress:
          "bg-blue-500",
      };
    }

    if (percentage >= 50) {
      return {
        label: "Good Potential",

        text:
          "text-indigo-700 dark:text-indigo-400",

        badge:
          "border-indigo-200 bg-indigo-50 dark:border-indigo-900 dark:bg-indigo-950/40",

        progress:
          "bg-indigo-500",
      };
    }

    return {
      label: "Skills Gap",

      text:
        "text-orange-700 dark:text-orange-400",

      badge:
        "border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/40",

      progress:
        "bg-orange-500",
    };
  };

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
            flex min-h-[380px]
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
              bg-cyan-50

              dark:bg-cyan-950/40
            "
          >
            <BriefcaseBusiness
              size={31}
              className="
                text-cyan-600
                dark:text-cyan-400
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
            Career Matches
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
            Analyze your resume to discover
            career roles that match your
            current skills.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!roles.length) {
    return (
      <Card
        className="
          rounded-3xl
          border border-slate-200
          bg-white
          shadow-xl

          dark:border-slate-800
          dark:bg-slate-900
        "
      >
        <CardContent className="p-8 text-center">

          <BriefcaseBusiness
            size={42}
            className="
              mx-auto
              text-slate-400
            "
          />

          <h3
            className="
              mt-4
              text-xl
              font-bold
              text-slate-900

              dark:text-white
            "
          >
            No Career Matches Found
          </h3>

          <p
            className="
              mt-2
              text-sm
              text-slate-500

              dark:text-slate-400
            "
          >
            We couldn't identify enough
            information to recommend roles.
          </p>

        </CardContent>
      </Card>
    );
  }

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
          overflow-hidden
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
            <div className="flex items-start gap-3">

              <div
                className="
                  flex h-12 w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  bg-cyan-50

                  dark:bg-cyan-950/40
                "
              >
                <BriefcaseBusiness
                  size={24}
                  className="
                    text-cyan-600
                    dark:text-cyan-400
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
                    text-cyan-600

                    dark:text-cyan-400
                  "
                >
                  Career Intelligence
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
                  Career Matches
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
                  Career opportunities ranked
                  using the skills detected in
                  your resume.
                </p>

              </div>

            </div>

            <div
              className="
                hidden
                rounded-full
                bg-cyan-50
                px-3 py-1.5
                text-xs
                font-bold
                text-cyan-700

                dark:bg-cyan-950/40
                dark:text-cyan-300
                sm:block
              "
            >
              {roles.length} Roles
            </div>

          </div>

          {/* ==================================
              BEST ROLE
          ================================== */}

          <div
            className="
              mt-7
              rounded-3xl
              border
              border-blue-100
              bg-gradient-to-r
              from-blue-50
              via-indigo-50
              to-cyan-50
              p-6

              dark:border-blue-900/50
              dark:from-blue-950/40
              dark:via-indigo-950/30
              dark:to-cyan-950/30
            "
          >

            <div
              className="
                flex
                flex-col
                justify-between
                gap-5

                sm:flex-row
                sm:items-center
              "
            >

              <div className="flex items-start gap-4">

                <div
                  className="
                    flex h-13 w-13
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    bg-white
                    p-3
                    shadow-sm

                    dark:bg-slate-800
                  "
                >
                  <Trophy
                    size={25}
                    className="
                      text-amber-500
                    "
                  />
                </div>

                <div>

                  <p
                    className="
                      text-xs
                      font-bold
                      uppercase
                      tracking-[0.16em]
                      text-blue-600

                      dark:text-blue-400
                    "
                  >
                    #1 Best Career Match
                  </p>

                  <h3
                    className="
                      mt-2
                      text-xl
                      font-extrabold
                      text-slate-900

                      dark:text-white
                      md:text-2xl
                    "
                  >
                    {bestRole}
                  </h3>

                  <p
                    className="
                      mt-2
                      text-sm
                      text-slate-500

                      dark:text-slate-400
                    "
                  >
                    Highest compatibility
                    based on your current
                    resume skills.
                  </p>

                </div>

              </div>

              <div
                className="
                  shrink-0
                  sm:text-right
                "
              >
                <p
                  className="
                    text-4xl
                    font-black
                    text-blue-600

                    dark:text-blue-400
                  "
                >
                  {bestPercentage}%
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    font-bold
                    uppercase
                    tracking-wider
                    text-slate-400
                  "
                >
                  Match
                </p>
              </div>

            </div>

            <div
              className="
                mt-5
                h-2.5
                overflow-hidden
                rounded-full
                bg-white

                dark:bg-slate-800
              "
            >
              <motion.div
                initial={{
                  width: 0,
                }}
                animate={{
                  width: `${Math.min(
                    bestPercentage,
                    100
                  )}%`,
                }}
                transition={{
                  duration: 0.9,
                }}
                className="
                  h-full
                  rounded-full
                  bg-gradient-to-r
                  from-blue-600
                  to-cyan-500
                "
              />
            </div>

          </div>

          {/* ==================================
              ROLE LIST
          ================================== */}

          <div className="mt-8">

            <div
              className="
                mb-5
                flex
                items-center
                justify-between
              "
            >

              <div>

                <h3
                  className="
                    text-lg
                    font-extrabold
                    text-slate-900

                    dark:text-white
                  "
                >
                  Recommended Job Roles
                </h3>

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-500

                    dark:text-slate-400
                  "
                >
                  Ranked from highest to
                  lowest skill compatibility.
                </p>

              </div>

              <Target
                size={22}
                className="
                  text-cyan-600
                  dark:text-cyan-400
                "
              />

            </div>

            <div
              className="
                grid
                gap-4
                lg:grid-cols-2
              "
            >

              {roles.map(
                (role, index) => {

                  const percentage =
                    Number(
                      role?.match_percentage
                    ) || 0;

                  const matched =
                    Array.isArray(
                      role?.matched_skills
                    )
                      ? role.matched_skills
                      : [];

                  const missing =
                    Array.isArray(
                      role?.missing_skills
                    )
                      ? role.missing_skills
                      : [];

                  const status =
                    getMatchStatus(
                      percentage
                    );

                  return (
                    <motion.div
                      key={`${
                        role?.role ||
                        "role"
                      }-${index}`}
                      initial={{
                        opacity: 0,
                        y: 12,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay:
                          index * 0.05,
                      }}
                      whileHover={{
                        y: -3,
                      }}
                      className="
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-5
                        transition-all
                        duration-300

                        hover:border-cyan-200
                        hover:shadow-lg

                        dark:border-slate-700
                        dark:bg-slate-800/40
                        dark:hover:border-cyan-900
                      "
                    >

                      {/* ROLE HEADER */}

                      <div
                        className="
                          flex
                          items-start
                          justify-between
                          gap-4
                        "
                      >

                        <div className="min-w-0">

                          <div
                            className="
                              flex
                              items-center
                              gap-2
                            "
                          >

                            <span
                              className="
                                flex
                                h-7 w-7
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                bg-slate-100
                                text-xs
                                font-black
                                text-slate-600

                                dark:bg-slate-700
                                dark:text-slate-300
                              "
                            >
                              {index + 1}
                            </span>

                            {role?.category && (
                              <span
                                className="
                                  truncate
                                  text-[11px]
                                  font-bold
                                  uppercase
                                  tracking-wider
                                  text-slate-400
                                "
                              >
                                {role.category}
                              </span>
                            )}

                          </div>

                          <h4
                            className="
                              mt-3
                              text-lg
                              font-extrabold
                              leading-6
                              text-slate-900

                              dark:text-white
                            "
                          >
                            {role?.role ||
                              "Career Role"}
                          </h4>

                        </div>

                        <div className="shrink-0 text-right">

                          <p
                            className={`
                              text-2xl
                              font-black
                              ${status.text}
                            `}
                          >
                            {percentage}%
                          </p>

                          <p
                            className="
                              text-[10px]
                              font-bold
                              uppercase
                              text-slate-400
                            "
                          >
                            Match
                          </p>

                        </div>

                      </div>

                      {/* STATUS */}

                      <div className="mt-4">

                        <span
                          className={`
                            inline-flex
                            rounded-full
                            border
                            px-3 py-1
                            text-xs
                            font-bold
                            ${status.badge}
                            ${status.text}
                          `}
                        >
                          {status.label}
                        </span>

                      </div>

                      {/* PROGRESS */}

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
                              percentage,
                              100
                            )}%`,
                          }}
                          transition={{
                            duration: 0.7,
                            delay:
                              index *
                              0.04,
                          }}
                          className={`
                            h-full
                            rounded-full
                            ${status.progress}
                          `}
                        />
                      </div>

                      {/* MATCHED */}

                      <div className="mt-5">

                        <div
                          className="
                            flex
                            items-center
                            gap-2
                          "
                        >
                          <CheckCircle2
                            size={15}
                            className="
                              text-green-600
                              dark:text-green-400
                            "
                          />

                          <p
                            className="
                              text-xs
                              font-bold
                              uppercase
                              tracking-wide
                              text-green-700

                              dark:text-green-400
                            "
                          >
                            Matching Skills
                          </p>
                        </div>

                        <div
                          className="
                            mt-3
                            flex
                            flex-wrap
                            gap-2
                          "
                        >

                          {matched.length >
                          0 ? (
                            matched
                              .slice(0, 6)
                              .map(
                                (
                                  skill,
                                  skillIndex
                                ) => (
                                  <span
                                    key={`${skill}-${skillIndex}`}
                                    className="
                                      rounded-full
                                      border
                                      border-green-200
                                      bg-green-50
                                      px-2.5 py-1
                                      text-xs
                                      font-semibold
                                      text-green-700

                                      dark:border-green-900
                                      dark:bg-green-950/40
                                      dark:text-green-300
                                    "
                                  >
                                    {skill}
                                  </span>
                                )
                              )
                          ) : (
                            <span
                              className="
                                text-xs
                                text-slate-400
                              "
                            >
                              No matching
                              skills listed.
                            </span>
                          )}

                        </div>

                      </div>

                      {/* MISSING */}

                      {missing.length > 0 && (
                        <div className="mt-5">

                          <div
                            className="
                              flex
                              items-center
                              gap-2
                            "
                          >
                            <AlertTriangle
                              size={15}
                              className="
                                text-orange-500
                                dark:text-orange-400
                              "
                            />

                            <p
                              className="
                                text-xs
                                font-bold
                                uppercase
                                tracking-wide
                                text-orange-600

                                dark:text-orange-400
                              "
                            >
                              Skills To Learn
                            </p>

                          </div>

                          <div
                            className="
                              mt-3
                              flex
                              flex-wrap
                              gap-2
                            "
                          >

                            {missing
                              .slice(0, 5)
                              .map(
                                (
                                  skill,
                                  skillIndex
                                ) => (
                                  <span
                                    key={`${skill}-${skillIndex}`}
                                    className="
                                      rounded-full
                                      border
                                      border-orange-200
                                      bg-orange-50
                                      px-2.5 py-1
                                      text-xs
                                      font-semibold
                                      text-orange-700

                                      dark:border-orange-900
                                      dark:bg-orange-950/40
                                      dark:text-orange-300
                                    "
                                  >
                                    {skill}
                                  </span>
                                )
                              )}

                          </div>

                        </div>
                      )}

                    </motion.div>
                  );
                }
              )}

            </div>

          </div>

          {/* ==================================
              CAREER GUIDANCE
          ================================== */}

          <div
            className="
              mt-8
              rounded-2xl
              border
              border-indigo-100
              bg-indigo-50/70
              p-5

              dark:border-indigo-900/50
              dark:bg-indigo-950/30
            "
          >

            <div
              className="
                flex
                items-start
                gap-3
              "
            >

              <TrendingUp
                size={20}
                className="
                  mt-0.5
                  shrink-0
                  text-indigo-600

                  dark:text-indigo-400
                "
              />

              <div>

                <h3
                  className="
                    font-extrabold
                    text-slate-900

                    dark:text-white
                  "
                >
                  Career Guidance
                </h3>

                <p
                  className="
                    mt-2
                    text-sm
                    leading-6
                    text-slate-600

                    dark:text-slate-300
                  "
                >
                  Start with roles that have
                  the highest match percentage.
                  For lower-scoring roles,
                  review the missing skills
                  and use them as a learning
                  roadmap before applying.
                </p>

              </div>

            </div>

          </div>

        </CardContent>
      </Card>
    </motion.div>
  );
}

export default CareerMatches;