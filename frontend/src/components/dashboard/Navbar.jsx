import { useState } from "react";
import { motion } from "framer-motion";

import {
  BrainCircuit,
  Moon,
  Sun,
  Sparkles,
} from "lucide-react";

function Navbar() {
  // ==========================================
  // INITIAL THEME
  // ==========================================

  const getInitialTheme = () => {
    const savedTheme =
      localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      return true;
    }

    if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
      return false;
    }

    const systemDark =
      window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

    document.documentElement.classList.toggle(
      "dark",
      systemDark
    );

    return systemDark;
  };

  const [darkMode, setDarkMode] =
    useState(getInitialTheme);

  // ==========================================
  // TOGGLE THEME
  // ==========================================

  const toggleTheme = () => {
    const nextTheme = !darkMode;

    setDarkMode(nextTheme);

    document.documentElement.classList.toggle(
      "dark",
      nextTheme
    );

    localStorage.setItem(
      "theme",
      nextTheme ? "dark" : "light"
    );
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <motion.header
      initial={{
        y: -30,
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      transition={{
        duration: 0.4,
      }}
      className="
        sticky
        top-0
        z-50
        border-b
        border-slate-200/80
        bg-white/90
        backdrop-blur-xl

        dark:border-slate-800
        dark:bg-slate-950/90
      "
    >
      <div
        className="
          mx-auto
          flex
          h-20
          max-w-7xl
          items-center
          justify-between
          px-4

          sm:px-6
          lg:px-8
        "
      >
        {/* BRAND */}

        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{
              rotate: 5,
              scale: 1.05,
            }}
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
              shadow-lg
              shadow-blue-500/20
            "
          >
            <BrainCircuit
              size={24}
              className="text-white"
            />
          </motion.div>

          <div>
            <div className="flex items-center gap-2">
              <h1
                className="
                  text-xl
                  font-black
                  tracking-tight
                  text-slate-900

                  dark:text-white
                "
              >
                ResumeIQ
              </h1>

              <span
                className="
                  rounded-md
                  bg-blue-50
                  px-1.5
                  py-0.5
                  text-[10px]
                  font-black
                  uppercase
                  tracking-wider
                  text-blue-600

                  dark:bg-blue-950/50
                  dark:text-blue-400
                "
              >
                AI
              </span>
            </div>

            <p
              className="
                mt-0.5
                hidden
                text-xs
                font-medium
                text-slate-400

                sm:block
                dark:text-slate-500
              "
            >
              Intelligent Resume Analyzer
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div className="flex items-center gap-3">
          <div
            className="
              hidden
              items-center
              gap-2
              rounded-full
              border
              border-blue-100
              bg-blue-50
              px-4
              py-2
              text-xs
              font-bold
              text-blue-700

              md:flex

              dark:border-blue-900/60
              dark:bg-blue-950/40
              dark:text-blue-300
            "
          >
            <Sparkles size={14} />

            ATS • Skills • Career AI
          </div>

          {/* THEME BUTTON */}

          <motion.button
            type="button"
            whileHover={{
              scale: 1.06,
            }}
            whileTap={{
              scale: 0.94,
            }}
            onClick={toggleTheme}
            aria-label={
              darkMode
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            title={
              darkMode
                ? "Light mode"
                : "Dark mode"
            }
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              border
              border-slate-200
              bg-white
              text-slate-700
              shadow-sm
              transition

              hover:bg-slate-50

              dark:border-slate-700
              dark:bg-slate-900
              dark:text-slate-200
              dark:hover:bg-slate-800
            "
          >
            {darkMode ? (
              <Sun
                size={19}
                className="text-amber-400"
              />
            ) : (
              <Moon size={19} />
            )}
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}

export default Navbar;