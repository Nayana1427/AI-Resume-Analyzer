import { motion } from "framer-motion";

import {
  ShieldCheck,
  Brain,
  BriefcaseBusiness,
  Sparkles,
} from "lucide-react";

function StatsCards({ result }) {
  const atsScore =
    result?.ats_score?.overall_score ?? null;

  const skills =
    result?.job_match?.detected_skills ||
    result?.data?.skills ||
    [];

  const careerMatches =
    result?.job_match?.recommended_roles || [];

  const improvements =
    result?.ats_score?.improvements || [];

  const cards = [
    {
      title: "ATS Score",
      value:
        atsScore !== null
          ? `${atsScore}/100`
          : "—",
      subtitle: result
        ? result?.ats_score?.rating ||
          "Resume analyzed"
        : "Waiting for analysis",
      icon: ShieldCheck,
      iconBox: "bg-blue-50 dark:bg-blue-950/40",
      iconColor: "text-blue-600 dark:text-blue-400",
      valueColor: "text-blue-600 dark:text-blue-400",
    },

    {
      title: "Skills Detected",
      value: result ? skills.length : "—",
      subtitle: result
        ? "Skills found in your resume"
        : "Waiting for analysis",
      icon: Brain,
      iconBox:
        "bg-violet-50 dark:bg-violet-950/40",
      iconColor:
        "text-violet-600 dark:text-violet-400",
      valueColor:
        "text-violet-600 dark:text-violet-400",
    },

    {
      title: "Career Matches",
      value: result
        ? careerMatches.length
        : "—",
      subtitle: result
        ? "Suitable roles identified"
        : "Waiting for analysis",
      icon: BriefcaseBusiness,
      iconBox: "bg-cyan-50 dark:bg-cyan-950/40",
      iconColor:
        "text-cyan-600 dark:text-cyan-400",
      valueColor:
        "text-cyan-600 dark:text-cyan-400",
    },

    {
      title: "Improvement Tips",
      value: result
        ? improvements.length
        : "—",
      subtitle: result
        ? "Areas you can improve"
        : "Waiting for analysis",
      icon: Sparkles,
      iconBox:
        "bg-amber-50 dark:bg-amber-950/40",
      iconColor:
        "text-amber-600 dark:text-amber-400",
      valueColor:
        "text-amber-600 dark:text-amber-400",
    },
  ];

  return (
    <section className="mb-10">
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
          Resume Overview
        </p>

        <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Your Analysis Summary
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          A quick overview of your resume performance.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, index) => {
          const Icon = card.icon;

          return (
            <motion.div
              key={card.title}
              initial={{
                opacity: 0,
                y: 18,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.35,
                delay: index * 0.06,
              }}
              whileHover={{
                y: -4,
              }}
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
                transition-all
                duration-300
                hover:shadow-lg

                dark:border-slate-800
                dark:bg-slate-900
              "
            >
              <div className="flex items-start justify-between">
                <div
                  className={`
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    ${card.iconBox}
                  `}
                >
                  <Icon
                    size={21}
                    className={card.iconColor}
                  />
                </div>

                {result && (
                  <span className="rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-bold text-green-700 dark:bg-green-950/40 dark:text-green-400">
                    Analyzed
                  </span>
                )}
              </div>

              <div className="mt-5">
                <h3
                  className={`
                    text-3xl
                    font-extrabold
                    tracking-tight
                    ${card.valueColor}
                  `}
                >
                  {card.value}
                </h3>

                <p className="mt-1 text-sm font-bold text-slate-800 dark:text-white">
                  {card.title}
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  {card.subtitle}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

export default StatsCards;