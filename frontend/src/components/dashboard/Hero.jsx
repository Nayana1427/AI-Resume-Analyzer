import { motion } from "framer-motion";

import {
  Sparkles,
  ShieldCheck,
  Target,
  Brain,
  ArrowDown,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

function Hero() {
  const scrollToAnalyzer = () => {
    document
      .getElementById("analyzer")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 shadow-2xl">

        {/* Decorative background */}

        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />

        <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-purple-400/20 blur-3xl" />

        {/* Content */}

        <div className="relative grid items-center gap-10 px-8 py-10 md:px-12 lg:grid-cols-[1.35fr_0.65fr] lg:px-14 lg:py-12">

          {/* LEFT */}

          <div className="max-w-3xl">

            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md">

              <Sparkles size={16} />

              AI Resume Intelligence

            </div>

            <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight text-white md:text-5xl">

              Know How Strong Your
              Resume Really Is.

            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-blue-50 md:text-lg">

              Upload your resume to discover your ATS
              score, strongest skills, improvement
              areas, and career roles that best match
              your profile.

            </p>

            {/* CTA */}

            <div className="mt-7 flex flex-wrap items-center gap-4">

              <button
                onClick={scrollToAnalyzer}
                className="group flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-blue-700 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              >

                Analyze My Resume

                <ArrowDown
                  size={18}
                  className="transition-transform group-hover:translate-y-1"
                />

              </button>

              <div className="flex items-center gap-2 text-sm font-medium text-blue-50">

                <CheckCircle2 size={17} />

                PDF & DOCX supported

              </div>

            </div>

            {/* Features */}

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-white">

              <div className="flex items-center gap-2">
                <ShieldCheck size={18} />
                ATS Score
              </div>

              <div className="flex items-center gap-2">
                <Brain size={18} />
                Skill Analysis
              </div>

              <div className="flex items-center gap-2">
                <Target size={18} />
                Career Matching
              </div>

              <div className="flex items-center gap-2">
                <TrendingUp size={18} />
                Improvement Tips
              </div>

            </div>

          </div>

          {/* RIGHT SIDE VISUAL */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
              x: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              x: 0,
            }}
            transition={{
              delay: 0.2,
              duration: 0.5,
            }}
            className="hidden lg:block"
          >

            <div className="rounded-[28px] border border-white/20 bg-white/15 p-5 shadow-2xl backdrop-blur-xl">

              {/* Mini header */}

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-100">
                    Resume Intelligence
                  </p>

                  <p className="mt-1 font-bold text-white">
                    Analysis Preview
                  </p>
                </div>

                <div className="rounded-xl bg-white/15 p-2.5">
                  <Sparkles
                    size={20}
                    className="text-white"
                  />
                </div>

              </div>

              {/* Score */}

              <div className="mt-5 rounded-2xl bg-white p-5">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm font-semibold text-slate-500">
                      ATS Readiness
                    </p>

                    <div className="mt-1 flex items-end gap-1">

                      <span className="text-4xl font-extrabold text-slate-900">
                        92
                      </span>

                      <span className="mb-1 text-sm font-semibold text-slate-400">
                        /100
                      </span>

                    </div>

                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
                    A+
                  </div>

                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">

                  <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-blue-600 to-cyan-500" />

                </div>

              </div>

              {/* Career match */}

              <div className="mt-3 rounded-2xl border border-white/15 bg-slate-950/20 p-4">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="rounded-xl bg-white/15 p-2">

                      <Target
                        size={18}
                        className="text-white"
                      />

                    </div>

                    <div>

                      <p className="text-xs text-blue-100">
                        Career Match
                      </p>

                      <p className="text-sm font-bold text-white">
                        Find your best-fit roles
                      </p>

                    </div>

                  </div>

                  <CheckCircle2
                    size={20}
                    className="text-green-300"
                  />

                </div>

              </div>

              {/* Skill analysis */}

              <div className="mt-3 rounded-2xl border border-white/15 bg-slate-950/20 p-4">

                <div className="flex items-center gap-3">

                  <div className="rounded-xl bg-white/15 p-2">

                    <Brain
                      size={18}
                      className="text-white"
                    />

                  </div>

                  <div>

                    <p className="text-xs text-blue-100">
                      Skills Intelligence
                    </p>

                    <p className="text-sm font-bold text-white">
                      Strengths & skill gaps
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </motion.div>

        </div>

      </div>
    </motion.section>
  );
}

export default Hero;