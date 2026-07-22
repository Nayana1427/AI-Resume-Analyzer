import {
  Award,
  CheckCircle2,
  FileCheck2,
  Target,
  Trophy,
  TrendingUp,
} from "lucide-react";

function ATSCard({ result }) {
  // ==========================================
  // DATA
  // ==========================================

  const ats = result?.ats_score || {};
  const jobMatch = result?.job_match || {};

  const score = Number(ats?.overall_score) || 0;
  const grade = ats?.grade || "—";
  const rating = ats?.rating || "Not Rated";

  const recommendedRoles = Array.isArray(
    jobMatch?.recommended_roles
  )
    ? jobMatch.recommended_roles
    : [];

  const bestRole =
    jobMatch?.best_role ||
    recommendedRoles?.[0]?.role ||
    "No role identified";

  const matchPercentage =
    Number(
      jobMatch?.match_percentage ??
        recommendedRoles?.[0]?.match_percentage
    ) || 0;

  // ==========================================
  // ATS STATUS
  // ==========================================

  const getATSStatus = () => {
    if (score >= 90) {
      return {
        label: "Excellent",
        message:
          "Your resume demonstrates excellent ATS readiness.",
        text: "text-green-600",
        bg: "bg-green-50 dark:bg-green-950/30",
        border:
          "border-green-200 dark:border-green-900/50",
      };
    }

    if (score >= 80) {
      return {
        label: "Very Good",
        message:
          "Your resume is well prepared for applicant tracking systems.",
        text: "text-green-600",
        bg: "bg-green-50 dark:bg-green-950/30",
        border:
          "border-green-200 dark:border-green-900/50",
      };
    }

    if (score >= 70) {
      return {
        label: "Good",
        message:
          "Your resume has good ATS readiness with room for improvement.",
        text: "text-amber-600",
        bg: "bg-amber-50 dark:bg-amber-950/30",
        border:
          "border-amber-200 dark:border-amber-900/50",
      };
    }

    if (score >= 60) {
      return {
        label: "Average",
        message:
          "Several resume areas should be improved for better ATS performance.",
        text: "text-orange-600",
        bg: "bg-orange-50 dark:bg-orange-950/30",
        border:
          "border-orange-200 dark:border-orange-900/50",
      };
    }

    return {
      label: "Needs Improvement",
      message:
        "Your resume needs significant improvement for stronger ATS readiness.",
      text: "text-red-600",
      bg: "bg-red-50 dark:bg-red-950/30",
      border:
        "border-red-200 dark:border-red-900/50",
    };
  };

  // ==========================================
  // CAREER MATCH STATUS
  // ==========================================

  const getMatchStatus = () => {
    if (matchPercentage >= 80) {
      return "Strong Compatibility";
    }

    if (matchPercentage >= 60) {
      return "Good Compatibility";
    }

    if (matchPercentage >= 40) {
      return "Moderate Compatibility";
    }

    return "Skills Gap";
  };

  const status = getATSStatus();

  // Prevent progress widths > 100
  const safeScore = Math.min(
    Math.max(score, 0),
    100
  );

  const safeMatch = Math.min(
    Math.max(matchPercentage, 0),
    100
  );

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
      {/* ======================================
          HEADER
      ======================================= */}

      <div
        className="
          flex
          items-start
          justify-between
          gap-4
          border-b
          border-slate-100
          px-6
          py-5

          dark:border-slate-800

          sm:px-8
        "
      >
        <div className="flex items-start gap-4">
          <div
            className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-blue-50

              dark:bg-blue-950/30
            "
          >
            <Award
              size={24}
              className="text-blue-600"
            />
          </div>

          <div>
            <p
              className="
                text-xs
                font-black
                uppercase
                tracking-[0.2em]
                text-blue-600

                dark:text-blue-400
              "
            >
              Resume Evaluation
            </p>

            <h2
              className="
                mt-1
                text-2xl
                font-black
                tracking-tight
                text-slate-950

                dark:text-white

                sm:text-3xl
              "
            >
              ATS Performance
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-slate-500

                dark:text-slate-400
              "
            >
              Overall resume quality and career
              compatibility at a glance.
            </p>
          </div>
        </div>
      </div>

      {/* ======================================
          TWO-COLUMN CONTENT
      ======================================= */}

      <div
        className="
          grid
          grid-cols-1
          gap-5
          p-5

          sm:p-6

          lg:grid-cols-2

          xl:p-7
        "
      >
        {/* =====================================
            LEFT — ATS SCORE
        ====================================== */}

        <div
          className="
            flex
            min-w-0
            flex-col
            rounded-3xl
            border
            border-slate-200
            bg-slate-50/60
            p-5

            dark:border-slate-800
            dark:bg-slate-950/30

            sm:p-6
          "
        >
          {/* TITLE */}

          <div className="flex items-center gap-2">
            <FileCheck2
              size={19}
              className="text-blue-600"
            />

            <p
              className="
                text-sm
                font-black
                text-slate-900

                dark:text-white
              "
            >
              ATS Resume Score
            </p>
          </div>

          {/* SCORE CONTENT */}

          <div
            className="
              mt-5
              flex
              flex-col
              gap-6

              sm:flex-row
              sm:items-center
            "
          >
            {/* CIRCLE */}

            <div
              className="
                relative
                flex
                h-36
                w-36
                shrink-0
                items-center
                justify-center
              "
            >
              <svg
                viewBox="0 0 120 120"
                className="
                  absolute
                  inset-0
                  h-full
                  w-full
                  -rotate-90
                "
              >
                {/* BACKGROUND */}

                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="9"
                  className="
                    text-slate-200
                    dark:text-slate-700
                  "
                />

                {/* SCORE */}

                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray={`${safeScore * 3.14} 314`}
                  className={status.text}
                />
              </svg>

              <div className="text-center">
                <p
                  className={`
                    text-4xl
                    font-black
                    ${status.text}
                  `}
                >
                  {score}
                </p>

                <p
                  className="
                    mt-0.5
                    text-xs
                    font-semibold
                    text-slate-400
                  "
                >
                  out of 100
                </p>
              </div>
            </div>

            {/* GRADE */}

            <div className="min-w-0 flex-1">
              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-slate-400
                "
              >
                Resume Grade
              </p>

              <div
                className="
                  mt-2
                  flex
                  items-center
                  gap-3
                "
              >
                <Trophy
                  size={24}
                  className={status.text}
                />

                <span
                  className={`
                    text-3xl
                    font-black
                    ${status.text}
                  `}
                >
                  {grade}
                </span>
              </div>

              <p
                className={`
                  mt-1
                  text-lg
                  font-black
                  ${status.text}
                `}
              >
                {rating}
              </p>

              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-slate-500

                  dark:text-slate-400
                "
              >
                Overall resume quality based on
                the information detected.
              </p>
            </div>
          </div>

          {/* ATS PROGRESS */}

          <div className="mt-6">
            <div
              className="
                flex
                items-center
                justify-between
                gap-4
              "
            >
              <span
                className="
                  text-xs
                  font-bold
                  text-slate-500

                  dark:text-slate-400
                "
              >
                Overall readiness
              </span>

              <span
                className={`
                  text-sm
                  font-black
                  ${status.text}
                `}
              >
                {score}%
              </span>
            </div>

            <div
              className="
                mt-2
                h-2.5
                overflow-hidden
                rounded-full
                bg-slate-200

                dark:bg-slate-700
              "
            >
              <div
                className={`
                  h-full
                  rounded-full
                  transition-all
                  duration-700
                  ${
                    score >= 80
                      ? "bg-green-500"
                      : score >= 70
                      ? "bg-amber-500"
                      : score >= 60
                      ? "bg-orange-500"
                      : "bg-red-500"
                  }
                `}
                style={{
                  width: `${safeScore}%`,
                }}
              />
            </div>
          </div>

          {/* ATS STATUS */}

          <div
            className={`
              mt-5
              rounded-2xl
              border
              p-4
              ${status.bg}
              ${status.border}
            `}
          >
            <div className="flex gap-3">
              <CheckCircle2
                size={20}
                className={`
                  mt-0.5
                  shrink-0
                  ${status.text}
                `}
              />

              <div>
                <p
                  className={`
                    text-sm
                    font-black
                    ${status.text}
                  `}
                >
                  ATS Readiness: {status.label}
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    leading-5
                    text-slate-500

                    dark:text-slate-400
                  "
                >
                  {status.message}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================
            RIGHT — CAREER MATCH
        ====================================== */}

        <div
          className="
            flex
            min-w-0
            flex-col
            rounded-3xl
            border
            border-blue-200
            bg-blue-50/50
            p-5

            dark:border-blue-900/50
            dark:bg-blue-950/20

            sm:p-6
          "
        >
          {/* TITLE */}

          <div
            className="
              flex
              items-center
              justify-between
              gap-3
            "
          >
            <div className="flex items-center gap-2">
              <Target
                size={19}
                className="text-blue-600"
              />

              <p
                className="
                  text-sm
                  font-black
                  text-slate-900

                  dark:text-white
                "
              >
                Best Career Match
              </p>
            </div>

            <div
              className="
                rounded-full
                bg-white
                px-3
                py-1
                text-xs
                font-bold
                text-blue-600
                shadow-sm

                dark:bg-slate-900
                dark:text-blue-400
              "
            >
              #{recommendedRoles.length > 0 ? "1" : "—"}
            </div>
          </div>

          {/* MATCH */}

          <div className="mt-6">
            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-wider
                text-blue-500
              "
            >
              Highest Skill Compatibility
            </p>

            <div
              className="
                mt-2
                flex
                flex-wrap
                items-end
                justify-between
                gap-3
              "
            >
              <h3
                className="
                  max-w-md
                  text-2xl
                  font-black
                  leading-tight
                  text-slate-950

                  dark:text-white

                  sm:text-3xl
                "
              >
                {bestRole}
              </h3>

              <p
                className="
                  text-4xl
                  font-black
                  text-blue-600

                  dark:text-blue-400
                "
              >
                {matchPercentage}%
              </p>
            </div>
          </div>

          {/* MATCH PROGRESS */}

          <div className="mt-6">
            <div
              className="
                h-3
                overflow-hidden
                rounded-full
                bg-blue-100

                dark:bg-blue-950
              "
            >
              <div
                className="
                  h-full
                  rounded-full
                  bg-blue-600
                  transition-all
                  duration-700
                "
                style={{
                  width: `${safeMatch}%`,
                }}
              />
            </div>

            <div
              className="
                mt-2
                flex
                items-center
                justify-between
                gap-3
              "
            >
              <span
                className="
                  text-xs
                  font-semibold
                  text-slate-500

                  dark:text-slate-400
                "
              >
                Skill compatibility
              </span>

              <span
                className="
                  text-xs
                  font-black
                  text-blue-600

                  dark:text-blue-400
                "
              >
                {matchPercentage}%
              </span>
            </div>
          </div>

          {/* COMPATIBILITY BOX */}

          <div
            className="
              mt-5
              rounded-2xl
              border
              border-blue-200
              bg-white
              p-4

              dark:border-blue-900/50
              dark:bg-slate-900
            "
          >
            <div className="flex items-start gap-3">
              <TrendingUp
                size={20}
                className="
                  mt-0.5
                  shrink-0
                  text-blue-600
                "
              />

              <div>
                <p
                  className="
                    text-sm
                    font-black
                    text-blue-700

                    dark:text-blue-300
                  "
                >
                  {getMatchStatus()}
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    leading-5
                    text-slate-500

                    dark:text-slate-400
                  "
                >
                  This role currently has the
                  highest compatibility with the
                  skills detected in your resume.
                </p>
              </div>
            </div>
          </div>

          {/* SMALL SUMMARY */}

          <div
            className="
              mt-auto
              pt-5
            "
          >
            <div
              className="
                grid
                grid-cols-2
                gap-3
              "
            >
              <div
                className="
                  rounded-2xl
                  bg-white
                  p-4

                  dark:bg-slate-900
                "
              >
                <p
                  className="
                    text-xs
                    font-semibold
                    text-slate-400
                  "
                >
                  Best Match
                </p>

                <p
                  className="
                    mt-1
                    text-xl
                    font-black
                    text-blue-600
                  "
                >
                  {matchPercentage}%
                </p>
              </div>

              <div
                className="
                  rounded-2xl
                  bg-white
                  p-4

                  dark:bg-slate-900
                "
              >
                <p
                  className="
                    text-xs
                    font-semibold
                    text-slate-400
                  "
                >
                  ATS Grade
                </p>

                <p
                  className="
                    mt-1
                    text-xl
                    font-black
                    text-slate-900

                    dark:text-white
                  "
                >
                  {grade}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ATSCard;