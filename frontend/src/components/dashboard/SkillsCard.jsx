import { motion } from "framer-motion";
import {
  Brain,
  Layers3,
  CheckCircle2,
  TrendingUp,
  Sparkles,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

function SkillsCard({ result }) {
  // ==========================================
  // DATA
  // ==========================================

  const skills =
    result?.data?.skills || [];

  const matchedSkills =
    result?.job_match?.matched_skills || [];

  const missingSkills =
    result?.job_match?.missing_skills || [];

  const bestRole =
    result?.job_match?.best_role ||
    "Recommended Role";

  // Remove duplicates
  const uniqueSkills = [
    ...new Set(skills),
  ];

  const uniqueMatchedSkills = [
    ...new Set(matchedSkills),
  ];

  const uniqueMissingSkills = [
    ...new Set(missingSkills),
  ];

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
      className="w-full"
    >
      <Card
        className="
          w-full
          overflow-hidden
          rounded-3xl
          border
          border-blue-200
          bg-white
          shadow-lg
          dark:border-slate-800
          dark:bg-slate-900
        "
      >
        <CardContent
          className="
            p-6
            sm:p-7
            lg:p-8
          "
        >
          {/* ==================================
              HEADER
          ================================== */}

          <div className="flex items-start gap-4">
            <div
              className="
                flex
                h-14
                w-14
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-violet-50
                dark:bg-violet-950/40
              "
            >
              <Brain
                size={28}
                className="text-violet-600"
              />
            </div>

            <div>
              <p
                className="
                  text-xs
                  font-extrabold
                  uppercase
                  tracking-[0.22em]
                  text-violet-600
                "
              >
                Skill Intelligence
              </p>

              <h2
                className="
                  mt-1
                  text-3xl
                  font-black
                  tracking-tight
                  text-slate-950
                  dark:text-white
                "
              >
                Skills Analysis
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
                Skills detected from your resume and
                areas that can strengthen your career
                profile.
              </p>
            </div>
          </div>

          {/* ==================================
              STATS
          ================================== */}

          <div
            className="
              mt-7
              grid
              grid-cols-1
              gap-3
              sm:grid-cols-3
            "
          >
            {/* SKILLS DETECTED */}

            <div
              className="
                rounded-2xl
                bg-violet-50
                p-5
                dark:bg-violet-950/30
              "
            >
              <p
                className="
                  text-3xl
                  font-black
                  text-violet-600
                "
              >
                {uniqueSkills.length}
              </p>

              <p
                className="
                  mt-2
                  text-sm
                  font-bold
                  text-slate-700
                  dark:text-slate-300
                "
              >
                Skills Detected
              </p>
            </div>

            {/* ROLE STRENGTHS */}

            <div
              className="
                rounded-2xl
                bg-green-50
                p-5
                dark:bg-green-950/30
              "
            >
              <p
                className="
                  text-3xl
                  font-black
                  text-green-600
                "
              >
                {uniqueMatchedSkills.length}
              </p>

              <p
                className="
                  mt-2
                  text-sm
                  font-bold
                  text-slate-700
                  dark:text-slate-300
                "
              >
                Role Strengths
              </p>
            </div>

            {/* SKILLS TO DEVELOP */}

            <div
              className="
                rounded-2xl
                bg-orange-50
                p-5
                dark:bg-orange-950/30
              "
            >
              <p
                className="
                  text-3xl
                  font-black
                  text-orange-600
                "
              >
                {uniqueMissingSkills.length}
              </p>

              <p
                className="
                  mt-2
                  text-sm
                  font-bold
                  text-slate-700
                  dark:text-slate-300
                "
              >
                Skills To Develop
              </p>
            </div>
          </div>

          {/* ==================================
              SKILLS FOUND
          ================================== */}

          <div className="mt-8">
            <div className="flex items-center gap-2">
              <Layers3
                size={22}
                className="text-violet-600"
              />

              <h3
                className="
                  text-xl
                  font-black
                  text-slate-950
                  dark:text-white
                "
              >
                Skills Found in Your Resume
              </h3>
            </div>

            <p
              className="
                mt-2
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              These skills were identified from your
              resume content.
            </p>

            {uniqueSkills.length > 0 ? (
              <div
                className="
                  mt-5
                  flex
                  flex-wrap
                  gap-2
                "
              >
                {uniqueSkills.map(
                  (skill, index) => (
                    <motion.span
                      key={`${skill}-${index}`}
                      initial={{
                        opacity: 0,
                        scale: 0.95,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      transition={{
                        delay:
                          index * 0.025,
                      }}
                      className="
                        rounded-full
                        border
                        border-violet-200
                        bg-violet-50
                        px-4
                        py-2
                        text-sm
                        font-bold
                        text-violet-700
                        dark:border-violet-800
                        dark:bg-violet-950/30
                        dark:text-violet-300
                      "
                    >
                      {skill}
                    </motion.span>
                  )
                )}
              </div>
            ) : (
              <div
                className="
                  mt-4
                  rounded-2xl
                  bg-slate-50
                  p-4
                  text-sm
                  text-slate-500
                  dark:bg-slate-800/50
                  dark:text-slate-400
                "
              >
                No skills were detected.
              </div>
            )}
          </div>

          {/* ==================================
              MATCHED / STRONG SKILLS
          ================================== */}

          {uniqueMatchedSkills.length > 0 && (
            <div
              className="
                mt-8
                rounded-2xl
                border
                border-green-200
                bg-green-50/70
                p-5
                dark:border-green-900
                dark:bg-green-950/20
              "
            >
              <div className="flex items-start gap-3">
                <CheckCircle2
                  size={22}
                  className="
                    mt-0.5
                    shrink-0
                    text-green-600
                  "
                />

                <div>
                  <h3
                    className="
                      font-black
                      text-slate-950
                      dark:text-white
                    "
                  >
                    Strong Skills for {bestRole}
                  </h3>

                  <p
                    className="
                      mt-2
                      text-sm
                      leading-6
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    These skills contribute directly to
                    your strongest career match.
                  </p>
                </div>
              </div>

              <div
                className="
                  mt-5
                  flex
                  flex-wrap
                  gap-2
                "
              >
                {uniqueMatchedSkills.map(
                  (skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="
                        rounded-full
                        border
                        border-green-200
                        bg-white
                        px-4
                        py-2
                        text-sm
                        font-bold
                        text-green-700
                        dark:border-green-800
                        dark:bg-slate-900
                        dark:text-green-400
                      "
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            </div>
          )}

          {/* ==================================
              SKILLS TO DEVELOP
          ================================== */}

          {uniqueMissingSkills.length > 0 && (
            <div
              className="
                mt-5
                rounded-2xl
                border
                border-orange-200
                bg-orange-50/70
                p-5
                dark:border-orange-900
                dark:bg-orange-950/20
              "
            >
              <div className="flex items-start gap-3">
                <TrendingUp
                  size={22}
                  className="
                    mt-0.5
                    shrink-0
                    text-orange-600
                  "
                />

                <div>
                  <h3
                    className="
                      font-black
                      text-slate-950
                      dark:text-white
                    "
                  >
                    Skills Worth Developing
                  </h3>

                  <p
                    className="
                      mt-2
                      text-sm
                      leading-6
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    Developing these skills can improve
                    your readiness for similar roles.
                  </p>
                </div>
              </div>

              <div
                className="
                  mt-5
                  flex
                  flex-wrap
                  gap-2
                "
              >
                {uniqueMissingSkills.map(
                  (skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="
                        rounded-full
                        border
                        border-orange-200
                        bg-white
                        px-4
                        py-2
                        text-sm
                        font-bold
                        text-orange-700
                        dark:border-orange-800
                        dark:bg-slate-900
                        dark:text-orange-400
                      "
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            </div>
          )}

          {/* ==================================
              EMPTY MATCH DATA
          ================================== */}

          {uniqueMatchedSkills.length === 0 &&
            uniqueMissingSkills.length === 0 && (
              <div
                className="
                  mt-8
                  rounded-2xl
                  border
                  border-blue-200
                  bg-blue-50
                  p-5
                  dark:border-blue-900
                  dark:bg-blue-950/20
                "
              >
                <div className="flex items-start gap-3">
                  <Sparkles
                    size={21}
                    className="
                      mt-0.5
                      shrink-0
                      text-blue-600
                    "
                  />

                  <div>
                    <h3
                      className="
                        font-bold
                        text-slate-900
                        dark:text-white
                      "
                    >
                      Skill Profile Ready
                    </h3>

                    <p
                      className="
                        mt-1
                        text-sm
                        leading-6
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      Your detected skills are shown
                      above. Career-specific strengths
                      and skill gaps will appear when
                      matching information is available.
                    </p>
                  </div>
                </div>
              </div>
            )}

        </CardContent>
      </Card>
    </motion.div>
  );
}

export default SkillsCard;