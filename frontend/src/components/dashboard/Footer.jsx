import { motion } from "framer-motion";

import {
  BrainCircuit,
  ShieldCheck,
  Sparkles,
  Code2,
} from "lucide-react";

function Footer() {
  const currentYear =
    new Date().getFullYear();

  return (
    <motion.footer
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 0.5,
      }}
      className="
        mt-12
        border-t
        border-slate-200
        bg-white

        dark:border-slate-800
        dark:bg-slate-950
      "
    >
      <div
        className="
          mx-auto
          max-w-7xl
          px-4
          py-8

          sm:px-6
          lg:px-8
        "
      >
        <div
          className="
            flex
            flex-col
            gap-6

            md:flex-row
            md:items-center
            md:justify-between
          "
        >
          {/* =========================
              BRAND
          ========================== */}

          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-br
                from-blue-600
                via-indigo-600
                to-cyan-500
                shadow-md
                shadow-blue-500/20
              "
            >
              <BrainCircuit
                size={23}
                className="text-white"
              />
            </div>

            <div>

              <h3
                className="
                  font-extrabold
                  text-slate-900

                  dark:text-white
                "
              >
                ResumeIQ AI
              </h3>

              <p
                className="
                  mt-0.5
                  text-xs
                  text-slate-500

                  dark:text-slate-400
                "
              >
                Smarter resumes. Better
                opportunities.
              </p>

            </div>

          </div>

          {/* =========================
              FEATURES
          ========================== */}

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-x-5
              gap-y-3
              text-xs
              font-semibold
              text-slate-500

              dark:text-slate-400
            "
          >

            <span
              className="
                flex
                items-center
                gap-1.5
              "
            >
              <ShieldCheck
                size={15}
                className="
                  text-green-600
                  dark:text-green-400
                "
              />

              ATS Analysis
            </span>

            <span
              className="
                flex
                items-center
                gap-1.5
              "
            >
              <Sparkles
                size={15}
                className="
                  text-indigo-600
                  dark:text-indigo-400
                "
              />

              AI Insights
            </span>

            <span
              className="
                flex
                items-center
                gap-1.5
              "
            >
              <Code2
                size={15}
                className="
                text-slate-600
                dark:text-slate-300
              "
              />

              Built with React + FastAPI
            </span>

          </div>

        </div>

        {/* =========================
            DIVIDER
        ========================== */}

        <div
          className="
            my-6
            h-px
            bg-slate-100

            dark:bg-slate-800
          "
        />

        {/* =========================
            BOTTOM
        ========================== */}

        <div
          className="
            flex
            flex-col
            gap-2
            text-xs
            text-slate-400

            sm:flex-row
            sm:items-center
            sm:justify-between

            dark:text-slate-500
          "
        >

          <p>
            © {currentYear} ResumeIQ AI.
            All rights reserved.
          </p>

          <p>
            AI-powered resume intelligence
            for smarter career decisions.
          </p>

        </div>

      </div>
    </motion.footer>
  );
}

export default Footer;