# 🚀 AI Resume Analyzer

An **AI-powered full-stack Resume Analysis and Resume Generation Platform** that helps job seekers evaluate their resumes, improve ATS compatibility, identify skill strengths and gaps, discover suitable career paths, and generate professionally structured resumes.

The platform combines **resume parsing, ATS analysis, career matching, intelligent recommendations, and AI-powered insights** into a single application.

---

## ✨ Key Features

### 📄 Intelligent Resume Analysis

Upload a resume in **PDF or DOCX format** and automatically extract important candidate information.

The system identifies:

* 👤 Name and contact information
* 🎓 Education
* 💼 Work experience and internships
* 🛠️ Technical skills
* 🚀 Projects
* 🏆 Certifications

The extracted information is converted into structured data for further analysis.

---

### 🎯 ATS Resume Scoring

Evaluate how well a resume is optimized for **Applicant Tracking Systems (ATS)**.

The ATS engine:

* Generates an overall **ATS score**
* Evaluates resume structure and completeness
* Identifies strengths
* Detects missing or weak sections
* Provides actionable improvement suggestions
* Helps improve resume readability and effectiveness

---

### 🧠 AI-Powered Recommendations

The platform integrates the **Google Gemini API** to provide intelligent resume improvement recommendations.

AI-powered analysis helps users:

* Identify areas that need improvement
* Improve professional presentation
* Strengthen resume content
* Receive personalized suggestions based on their profile

---

### 🛠️ Skill Analysis

Automatically identify technical skills from uploaded resumes.

The system:

* Detects programming languages
* Identifies frameworks and technologies
* Recognizes technical tools
* Organizes skills into structured information
* Uses detected skills for career matching

---

### 💼 Career Role Matching

The application analyzes the candidate's skills and profile to recommend suitable career opportunities.

Each recommended role includes a **career match percentage**, helping users understand how closely their current profile aligns with different career paths.

Example recommendations may include:

* Software Developer
* Frontend Developer
* Backend Developer
* Full Stack Developer
* Data Analyst
* Data Scientist
* Machine Learning Engineer
* AI/ML Developer

---

### 📊 Career Match Percentage

Career compatibility is calculated by comparing detected resume skills with predefined skill requirements for different roles.

This helps users understand:

> **“Which career roles currently match my skills?”**

and

> **“Which skills should I learn to improve my career opportunities?”**

---

### 🎨 Smart Resume Template Recommendation

Instead of forcing users to manually choose a template, the application analyzes their profile and recommends an appropriate resume format.

Available templates include:

| Candidate Profile                   | Recommended Template     |
| ----------------------------------- | ------------------------ |
| 🎓 Student / Fresher                | Fresher / Student        |
| 💻 Technical Early-Career Candidate | Modern Professional      |
| 💼 Experienced Candidate            | Experienced Professional |
| 📄 General Profile                  | Classic ATS              |

Template recommendations consider:

* Professional experience
* Internships
* Technical skills
* Projects
* Education
* Overall candidate profile

Professional experience is given higher priority when identifying experienced candidates.

---

### 👀 Resume Preview

Before generating the final resume, users can preview the professionally structured version.

The preview organizes:

* Professional Summary
* Technical Skills
* Education
* Work Experience
* Projects
* Certifications
* LinkedIn
* GitHub
* Contact Information

---

### 📥 Professional Resume Generation

Users can generate a professionally formatted resume based on the structured information extracted from their original resume.

Generated resumes include:

* Clean professional layout
* Structured sections
* ATS-friendly formatting
* Organized skills
* Professional experience formatting
* Project descriptions
* Education details
* Certification information
* LinkedIn and GitHub links

The final resume can be generated as a **PDF document**.

---

# 🏗️ System Architecture

The application follows a full-stack architecture:

```text
                        ┌─────────────────────┐
                        │        User         │
                        └──────────┬──────────┘
                                   │
                                   ▼
                        ┌─────────────────────┐
                        │   React Frontend    │
                        │   Vite + Tailwind   │
                        └──────────┬──────────┘
                                   │
                              REST API
                                   │
                                   ▼
                        ┌─────────────────────┐
                        │  FastAPI Backend    │
                        └──────────┬──────────┘
                                   │
                 ┌─────────────────┼─────────────────┐
                 │                 │                 │
                 ▼                 ▼                 ▼
        ┌────────────────┐ ┌──────────────┐ ┌────────────────┐
        │ Resume Parser  │ │  ATS Engine  │ │ Career Matcher │
        └────────┬───────┘ └──────────────┘ └────────────────┘
                 │
                 ▼
        ┌──────────────────────┐
        │ Information Extractor│
        └──────────┬───────────┘
                   │
       ┌───────────┼───────────┬───────────┐
       ▼           ▼           ▼           ▼
    Skills     Education   Experience   Projects
                   │
                   ▼
        ┌─────────────────────┐
        │ Google Gemini API   │
        │ AI Recommendations  │
        └─────────────────────┘
```

---

# 🛠️ Tech Stack

## Frontend

* ⚛️ React
* ⚡ Vite
* 🟨 JavaScript
* 🎨 Tailwind CSS
* 🧩 Lucide React
* 🔗 Axios

## Backend

* 🐍 Python
* ⚡ FastAPI
* 📦 Pydantic
* 📄 PyMuPDF
* 📝 python-docx
* 📑 ReportLab

## Artificial Intelligence

* 🤖 Google Gemini API

## Development Tools

* Git
* GitHub
* VS Code

---

# 📁 Project Structure

```text
AI-Resume-Analyzer/
│
├── backend/
│   ├── app/
│   │   ├── data/
│   │   │   ├── job_roles.json
│   │   │   └── skills.json
│   │   │
│   │   ├── database/
│   │   │   └── db.py
│   │   │
│   │   ├── models/
│   │   │   └── schemas.py
│   │   │
│   │   ├── routes/
│   │   │   ├── analyze.py
│   │   │   ├── generate_resume.py
│   │   │   └── upload.py
│   │   │
│   │   ├── services/
│   │   │   ├── ai_service.py
│   │   │   ├── ats_engine.py
│   │   │   ├── certification_extractor.py
│   │   │   ├── education_extractor.py
│   │   │   ├── experience_extractor.py
│   │   │   ├── information_extractor.py
│   │   │   ├── parser.py
│   │   │   ├── project_extractor.py
│   │   │   ├── resume_generator.py
│   │   │   ├── resume_structurer.py
│   │   │   ├── scoring.py
│   │   │   └── skill_extractor.py
│   │   │
│   │   └── main.py
│   │
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   └── ui/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── .gitignore
└── README.md
```

---

# ⚙️ How It Works

The complete resume analysis pipeline works as follows:

1. 📤 User uploads a **PDF or DOCX resume**
2. 📄 Backend extracts text from the uploaded document
3. 🔍 Candidate information is identified
4. 🧩 Resume information is converted into structured data
5. 🛠️ Technical skills are detected
6. 🎓 Education, experience, projects, and certifications are extracted
7. 🎯 ATS engine evaluates resume quality
8. 💼 Career matching algorithm identifies suitable roles
9. 🤖 Gemini AI generates intelligent improvement recommendations
10. 🎨 Candidate profile is analyzed to recommend a resume template
11. 👀 User previews the structured resume
12. 📥 Professional resume PDF can be generated

---

# 🧩 Resume Processing Modules

The backend uses dedicated modules to keep the resume-processing pipeline modular and maintainable.

| Module                       | Responsibility                                             |
| ---------------------------- | ---------------------------------------------------------- |
| `parser.py`                  | Extracts text from PDF and DOCX resumes                    |
| `information_extractor.py`   | Extracts candidate contact/profile information             |
| `skill_extractor.py`         | Detects technical skills                                   |
| `education_extractor.py`     | Extracts educational qualifications                        |
| `experience_extractor.py`    | Identifies work experience and internships                 |
| `project_extractor.py`       | Extracts candidate projects                                |
| `certification_extractor.py` | Identifies certifications                                  |
| `ats_engine.py`              | Performs ATS analysis                                      |
| `scoring.py`                 | Handles resume scoring logic                               |
| `ai_service.py`              | Integrates Gemini AI recommendations                       |
| `resume_structurer.py`       | Converts extracted information into resume-ready structure |
| `resume_generator.py`        | Generates professional resume PDFs                         |

---

# 🚀 Getting Started

## Prerequisites

Make sure you have installed:

* Python 3.10+
* Node.js
* npm
* Git

You will also need a **Google Gemini API key** for AI-powered recommendations.

---

## 1️⃣ Clone the Repository

```bash
git clone <your-repository-url>
cd AI-Resume-Analyzer
```

---

# 🐍 Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a Python virtual environment:

```bash
python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### macOS / Linux

```bash
source venv/bin/activate
```

Install the required dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file inside the `backend` directory:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Start the FastAPI development server:

```bash
python -m uvicorn app.main:app --reload
```

The backend will normally be available at:

```text
http://127.0.0.1:8000
```

FastAPI interactive API documentation will normally be available at:

```text
http://127.0.0.1:8000/docs
```

---

# ⚛️ Frontend Setup

Open a new terminal.

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Open the local URL displayed by Vite in your browser.

---

# 🔐 Environment Variables

The application uses environment variables to protect sensitive configuration.

### Backend

```env
GEMINI_API_KEY=your_gemini_api_key
```

Never hard-code API keys directly into the source code.

Never commit your `.env` file to GitHub.

---

# 🛡️ Security

Sensitive and generated files should be excluded from version control.

Recommended `.gitignore` entries:

```gitignore
# Environment variables
.env
*.env

# Python
venv/
__pycache__/
*.pyc

# Node
node_modules/
dist/

# Uploaded resumes
backend/app/uploads/

# Generated resumes
backend/app/generated_resumes/

# IDE / OS
.vscode/
.DS_Store
```

> ⚠️ **Important:** If an API key has ever been committed to GitHub, removing it from the latest file is not enough. Revoke the exposed key and generate a new one.

---

# 🌐 Deployment

The project is designed to support separate frontend and backend deployments.

A recommended deployment architecture is:

```text
GitHub Repository
       │
       ├───────────────┐
       ▼               ▼
React Frontend      FastAPI Backend
       │               │
       ▼               ▼
    Vercel           Render
       │               │
       └───────┬───────┘
               │
               ▼
        AI Resume Analyzer
```

### Frontend

The React + Vite frontend can be deployed using **Vercel**.

### Backend

The FastAPI backend can be deployed using **Render** or another Python-compatible cloud platform.

Production environment variables such as the Gemini API key should be configured through the hosting provider's environment-variable settings rather than committed to GitHub.

---

# 📡 API Overview

The backend provides REST API routes for the application's main functionality.

```text
Upload Resume
      ↓
Analyze Resume
      ↓
ATS + Skill Analysis
      ↓
Career Matching
      ↓
AI Recommendations
      ↓
Resume Structuring
      ↓
Resume Generation
```

FastAPI also provides interactive API documentation through Swagger UI, making backend endpoints easier to test during development.

---

# 🔮 Future Improvements

Planned enhancements include:

* 🔐 User authentication and authorization
* 📝 Advanced AI-powered resume rewriting
* 🎯 Job-description-to-resume matching
* 📊 Advanced ATS optimization metrics
* 🔑 Resume keyword optimization
* 📈 Skill-gap analysis
* 🎨 Additional professional resume templates
* 📚 Resume history dashboard
* ☁️ Cloud storage integration
* 📤 Additional document export formats
* 💼 Job recommendations
* 📱 Improved mobile responsiveness

---

# 🎯 Project Purpose

The **AI Resume Analyzer** was developed to demonstrate how modern web technologies and artificial intelligence can be combined to solve a practical career-development problem.

The platform brings together:

**Resume Parsing → ATS Analysis → Skill Detection → Career Matching → AI Recommendations → Smart Template Selection → Professional Resume Generation**

into one unified full-stack application.

---

# 📜 License

This project is intended for **educational, academic, and portfolio purposes**.

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.
