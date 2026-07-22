import { useState } from "react";
import { FaUpload, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion } from "framer-motion";
import api from "../services/api";

function UploadForm() {
  const [file, setFile] = useState(null);
  const [jobRole, setJobRole] = useState("Python Developer");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadResume = async () => {
    if (!file) {
      alert("Please select a resume.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("job_role", jobRole);
    formData.append("job_description", "");

    try {
      setLoading(true);

      const uploadResponse = await api.post("/upload", formData);

      const resumeId = uploadResponse.data.resume_id;

      const analyzeResponse = await api.get(`/analyze/${resumeId}`);

      setResult(analyzeResponse.data);
    } catch (err) {
      console.error(err);

      if (err.response) {
        console.log(err.response.status);
        console.log(err.response.data);
      }

      alert("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="upload-card"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 style={{ marginBottom: 20 }}>📄 Upload Resume</h2>

      <input
        type="file"
        accept=".pdf,.docx"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <select
        value={jobRole}
        onChange={(e) => setJobRole(e.target.value)}
      >
        <option>Python Developer</option>
        <option>Frontend Developer</option>
        <option>Full Stack Developer</option>
        <option>Data Scientist</option>
      </select>

      <button onClick={uploadResume}>
        <FaUpload style={{ marginRight: 10 }} />
        Analyze Resume
      </button>

      {loading && (
        <h3 style={{ marginTop: 25, textAlign: "center" }}>
          ⏳ Analyzing Resume...
        </h3>
      )}

      {result && (
        <>
          <motion.div
            className="score-card"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <div style={{ width: 170, margin: "auto" }}>
              <CircularProgressbar
                value={result.ats_score.overall_score}
                text={`${result.ats_score.overall_score}%`}
                styles={buildStyles({
                  textColor: "#fff",
                  pathColor: "#3b82f6",
                  trailColor: "#222",
                })}
              />
            </div>

            <h2 style={{ marginTop: 20 }}>ATS Score</h2>
          </motion.div>

          <div className="grid">

            <div className="card">

              <h2>✅ Matched Skills</h2>

              {result.job_match.matched_skills.map((skill) => (
                <p key={skill}>
                  <FaCheckCircle color="#22c55e" /> {skill}
                </p>
              ))}

            </div>

            <div className="card">

              <h2>❌ Missing Skills</h2>

              {result.job_match.missing_skills.map((skill) => (
                <p key={skill}>
                  <FaTimesCircle color="#ef4444" /> {skill}
                </p>
              ))}

            </div>

          </div>

          <div className="card">

            <h2>👤 Resume Details</h2>

            <p><b>Name:</b> {result.data.name}</p>
            <p><b>Email:</b> {result.data.email}</p>
            <p><b>Phone:</b> {result.data.phone}</p>

          </div>

        </>
      )}
    </motion.div>
  );
}

export default UploadForm;