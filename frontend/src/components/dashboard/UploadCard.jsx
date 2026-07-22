import { useState } from "react";
import { motion } from "framer-motion";
import api from "../../services/api";

import {
  UploadCloud,
  FileText,
  Loader2,
  CheckCircle2,
  Sparkles,
  X,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function UploadCard({ setResult }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // SELECT FILE
  // ==========================================

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    const extension =
      "." + selectedFile.name.split(".").pop().toLowerCase();

    const allowedExtensions = [".pdf", ".docx"];

    if (!allowedExtensions.includes(extension)) {
      alert("Please upload only a PDF or DOCX resume.");
      event.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  // ==========================================
  // REMOVE FILE
  // ==========================================

  const removeFile = () => {
    if (loading) return;

    setFile(null);
  };

  // ==========================================
  // UPLOAD + ANALYZE
  // ==========================================

  const uploadResume = async () => {
    if (!file) {
      alert("Please select your resume first.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("resume", file);

      // Upload resume
      const uploadResponse = await api.post(
        "/upload",
        formData
      );

      const resumeId =
        uploadResponse?.data?.resume_id;

      if (!resumeId) {
        throw new Error(
          "Resume ID was not returned."
        );
      }

      // Analyze resume
      const analysisResponse = await api.get(
        `/analyze/${resumeId}`
      );

      setResult(analysisResponse.data);
    } catch (error) {
      console.error(
        "Resume analysis failed:",
        error
      );

      const detail =
        error?.response?.data?.detail;

      let message =
        "Resume analysis failed. Please try again.";

      if (typeof detail === "string") {
        message = detail;
      }

      alert(message);
    } finally {
      setLoading(false);
    }
  };

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
          border
          border-slate-200
          bg-white
          shadow-xl
          shadow-slate-200/60
          transition-colors
          duration-300

          dark:border-slate-800
          dark:bg-slate-900
          dark:shadow-black/20
        "
      >
        <CardContent className="p-6 md:p-8">

          {/* ==================================
              HEADER
          ================================== */}

          <div className="mb-6 flex items-center justify-between gap-4">

            <div className="flex items-center gap-3">

              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-50

                  dark:bg-blue-950/60
                "
              >
                <UploadCloud
                  size={22}
                  className="text-blue-600 dark:text-blue-400"
                />
              </div>

              <div>
                <h2
                  className="
                    text-lg
                    font-bold
                    text-slate-900

                    dark:text-white
                  "
                >
                  Upload Resume
                </h2>

                <p
                  className="
                    text-sm
                    text-slate-500

                    dark:text-slate-400
                  "
                >
                  PDF or DOCX
                </p>
              </div>

            </div>

            <div
              className="
                hidden
                items-center
                gap-2
                text-xs
                font-semibold
                text-slate-400

                dark:text-slate-500

                sm:flex
              "
            >
              <ShieldCheck
                size={15}
                className="text-green-600 dark:text-green-400"
              />

              Secure analysis
            </div>

          </div>

          {/* ==================================
              DROP AREA
          ================================== */}

          <label
            className={`
              group
              flex
              min-h-[190px]
              cursor-pointer
              flex-col
              items-center
              justify-center
              rounded-2xl
              border-2
              border-dashed
              px-6
              text-center
              transition-all
              duration-300

              ${
                file
                  ? `
                    border-green-300
                    bg-green-50/60

                    dark:border-green-800
                    dark:bg-green-950/20
                  `
                  : `
                    border-slate-300
                    bg-slate-50/70
                    hover:border-blue-400
                    hover:bg-blue-50/50

                    dark:border-slate-700
                    dark:bg-slate-950/50
                    dark:hover:border-blue-500
                    dark:hover:bg-blue-950/20
                  `
              }
            `}
          >
            {file ? (
              <>
                <div
                  className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-full
                    bg-green-100

                    dark:bg-green-950/60
                  "
                >
                  <CheckCircle2
                    size={28}
                    className="text-green-600 dark:text-green-400"
                  />
                </div>

                <h3
                  className="
                    mt-4
                    text-lg
                    font-bold
                    text-slate-900

                    dark:text-white
                  "
                >
                  Resume Selected
                </h3>

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-500

                    dark:text-slate-400
                  "
                >
                  Ready for analysis
                </p>
              </>
            ) : (
              <>
                <motion.div
                  whileHover={{
                    y: -3,
                    scale: 1.03,
                  }}
                  className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-blue-100

                    dark:bg-blue-950/70
                  "
                >
                  <UploadCloud
                    size={29}
                    className="text-blue-600 dark:text-blue-400"
                  />
                </motion.div>

                <h3
                  className="
                    mt-4
                    text-lg
                    font-bold
                    text-slate-900

                    dark:text-white
                  "
                >
                  Drop your resume here
                </h3>

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-500

                    dark:text-slate-400
                  "
                >
                  or click to browse your files
                </p>

                <div className="mt-4 flex items-center gap-2">

                  <span
                    className="
                      rounded-full
                      border
                      border-blue-100
                      bg-white
                      px-3
                      py-1
                      text-xs
                      font-bold
                      text-blue-600
                      shadow-sm

                      dark:border-blue-900
                      dark:bg-slate-800
                      dark:text-blue-400
                    "
                  >
                    PDF
                  </span>

                  <span
                    className="
                      rounded-full
                      border
                      border-indigo-100
                      bg-white
                      px-3
                      py-1
                      text-xs
                      font-bold
                      text-indigo-600
                      shadow-sm

                      dark:border-indigo-900
                      dark:bg-slate-800
                      dark:text-indigo-400
                    "
                  >
                    DOCX
                  </span>

                </div>
              </>
            )}

            <input
              type="file"
              accept=".pdf,.docx"
              disabled={loading}
              onChange={handleFileChange}
              className="hidden"
            />

          </label>

          {/* ==================================
              SELECTED FILE
          ================================== */}

          {file && (
            <motion.div
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="
                mt-4
                flex
                items-center
                justify-between
                gap-3
                rounded-xl
                border
                border-slate-200
                bg-white
                p-3
                transition-colors

                dark:border-slate-700
                dark:bg-slate-800/70
              "
            >
              <div className="flex min-w-0 items-center gap-3">

                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-blue-50

                    dark:bg-blue-950/60
                  "
                >
                  <FileText
                    size={20}
                    className="text-blue-600 dark:text-blue-400"
                  />
                </div>

                <div className="min-w-0">

                  <p
                    className="
                      truncate
                      text-sm
                      font-bold
                      text-slate-800

                      dark:text-slate-100
                    "
                  >
                    {file.name}
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-xs
                      text-slate-400

                      dark:text-slate-500
                    "
                  >
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                    {" • "}
                    Ready to analyze
                  </p>

                </div>

              </div>

              <button
                type="button"
                disabled={loading}
                onClick={(event) => {
                  event.preventDefault();
                  removeFile();
                }}
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  text-slate-400
                  transition

                  hover:bg-red-50
                  hover:text-red-500

                  dark:hover:bg-red-950/40
                  dark:hover:text-red-400
                "
                aria-label="Remove resume"
              >
                <X size={18} />
              </button>

            </motion.div>
          )}

          {/* ==================================
              ANALYZE BUTTON
          ================================== */}

          <Button
            type="button"
            onClick={uploadResume}
            disabled={loading || !file}
            className="
              mt-5
              h-14
              w-full
              rounded-xl
              bg-gradient-to-r
              from-blue-600
              via-indigo-600
              to-cyan-500
              text-base
              font-bold
              text-white
              shadow-lg
              shadow-blue-500/20
              transition-all

              hover:-translate-y-0.5
              hover:shadow-xl

              disabled:translate-y-0
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {loading ? (
              <>
                <Loader2
                  size={20}
                  className="mr-2 animate-spin"
                />

                Analyzing Resume...
              </>
            ) : (
              <>
                <Sparkles
                  size={19}
                  className="mr-2"
                />

                Analyze My Resume
              </>
            )}
          </Button>

          {/* ==================================
              PRIVACY MESSAGE
          ================================== */}

          <div
            className="
              mt-5
              flex
              items-center
              justify-center
              gap-2
              text-center
              text-xs
              text-slate-400

              dark:text-slate-500
            "
          >
            <ShieldCheck
              size={14}
              className="text-green-600 dark:text-green-400"
            />

            Your resume is used only for analysis.
          </div>

        </CardContent>
      </Card>
    </motion.div>
  );
}

export default UploadCard;