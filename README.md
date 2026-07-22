\# AI Resume Analyzer



An intelligent full-stack resume analysis platform that helps users evaluate their resumes, identify strengths and weaknesses, discover suitable career roles, and generate professionally structured resume templates.



The application analyzes uploaded resumes and provides ATS insights, skill analysis, career recommendations, AI-powered suggestions, and personalized resume template recommendations.



\---



\## Features



\### Resume Analysis

\- Upload PDF and DOCX resumes

\- Automatically extract resume content

\- Extract candidate details such as name, email, and phone number

\- Identify education, experience, projects, skills, and certifications

\- Process resume content into structured data



\### ATS Resume Scoring

\- Analyze resumes for ATS compatibility

\- Generate an ATS score

\- Identify resume strengths and improvement areas

\- Provide actionable suggestions to improve resume quality



\### Skill Analysis

\- Automatically detect technical skills

\- Compare detected skills with career requirements

\- Highlight relevant technical capabilities

\- Structure skills for easier resume evaluation



\### Career Matching

\- Analyze candidate skills and resume information

\- Recommend suitable career roles

\- Display career match percentages

\- Help candidates understand which roles best match their profile



\### AI Recommendations

\- Generate intelligent resume improvement suggestions

\- Provide recommendations based on resume content

\- Help improve professional presentation and resume quality



\### Smart Resume Templates

The application dynamically recommends a resume template based on the candidate's profile.



Available templates:



\- Classic ATS

\- Modern Professional

\- Fresher / Student

\- Experienced Professional



The recommendation system considers professional experience, internships, technical skills, projects, and candidate profile information to determine the best-fit template.



\### Resume Preview and Generation

\- Preview recommended resume templates

\- Automatically structure resume sections

\- Clean professional summary formatting

\- Organized technical skills

\- Structured education and work experience

\- Project and certification formatting

\- LinkedIn and GitHub support

\- Generate professional resume PDFs



\---



\## Tech Stack



\### Frontend

\- React

\- Vite

\- JavaScript

\- Tailwind CSS

\- Lucide React

\- Axios



\### Backend

\- Python

\- FastAPI

\- Pydantic

\- PyMuPDF

\- python-docx

\- ReportLab



\### AI

\- Google Gemini API



\### Development Tools

\- Git

\- GitHub

\- VS Code



\---



\## Project Structure



```text

AI-Resume-Analyzer/

│

├── backend/

│   ├── app/

│   │   ├── data/

│   │   │   ├── job\_roles.json

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

│   │   │   ├── generate\_resume.py

│   │   │   └── upload.py

│   │   │

│   │   ├── services/

│   │   │   ├── ai\_service.py

│   │   │   ├── ats\_engine.py

│   │   │   ├── certification\_extractor.py

│   │   │   ├── education\_extractor.py

│   │   │   ├── experience\_extractor.py

│   │   │   ├── information\_extractor.py

│   │   │   ├── parser.py

│   │   │   ├── project\_extractor.py

│   │   │   ├── resume\_generator.py

│   │   │   ├── resume\_structurer.py

│   │   │   ├── scoring.py

│   │   │   └── skill\_extractor.py

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



\---



\## How It Works



1\. The user uploads a resume in PDF or DOCX format.

2\. The backend extracts text from the uploaded document.

3\. Resume information is converted into structured data.

4\. Skills, education, experience, projects, and certifications are detected.

5\. The ATS engine evaluates the resume.

6\. Career matching identifies suitable job roles.

7\. AI-generated recommendations help improve the resume.

8\. The system analyzes the candidate profile and recommends the most appropriate resume template.

9\. The user can preview and generate a professionally formatted resume.



\---



\## Installation



\### 1. Clone the Repository



```bash

git clone <your-repository-url>

cd AI-Resume-Analyzer

```



\### 2. Backend Setup



Navigate to the backend:



```bash

cd backend

```



Create a virtual environment:



```bash

python -m venv venv

```



Activate it on Windows:



```bash

venv\\Scripts\\activate

```



Install dependencies:



```bash

pip install -r requirements.txt

```



Create a `.env` file inside the backend directory:



```env

GEMINI\_API\_KEY=your\_gemini\_api\_key

```



Never commit the `.env` file or your real API key to GitHub.



Start the FastAPI server:



```bash

python -m uvicorn app.main:app --reload

```



The backend will normally run at:



```text

http://127.0.0.1:8000

```



\---



\## Frontend Setup



Open another terminal and navigate to the frontend:



```bash

cd frontend

```



Install dependencies:



```bash

npm install

```



Start the development server:



```bash

npm run dev

```



Open the local address displayed by Vite in your browser.



\---



\## Resume Processing Modules



The backend contains dedicated services for extracting and analyzing different parts of a resume:



\- `parser.py` — extracts text from PDF and DOCX files

\- `information\_extractor.py` — extracts general candidate information

\- `skill\_extractor.py` — identifies technical skills

\- `education\_extractor.py` — extracts educational information

\- `experience\_extractor.py` — extracts professional experience

\- `project\_extractor.py` — extracts projects

\- `certification\_extractor.py` — extracts certifications

\- `ats\_engine.py` — performs ATS analysis

\- `ai\_service.py` — handles AI-powered recommendations

\- `resume\_structurer.py` — structures resume information

\- `resume\_generator.py` — generates professional resumes



\---



\## Smart Template Recommendation



The application includes profile-aware resume template recommendations.



For example:



| Candidate Profile | Recommended Template |

|---|---|

| Student / Fresher | Fresher / Student |

| Technical Early-Career Candidate | Modern Professional |

| Experienced Candidate | Experienced Professional |

| General Profile | Classic ATS |



Professional experience is prioritized when determining whether a candidate should receive an experienced resume format.



\---



\## Security



Sensitive information is excluded from version control.



The project `.gitignore` prevents files such as the following from being uploaded:



```text

.env

venv/

node\_modules/

backend/app/uploads/

backend/app/generated\_resumes/

```



API keys should always be stored using environment variables.



\---



\## Future Improvements



\- Advanced AI-based resume rewriting

\- Job-description-to-resume matching

\- More ATS optimization metrics

\- Additional professional resume templates

\- Resume keyword optimization

\- User authentication

\- Resume history dashboard

\- Cloud deployment

\- Export options for additional document formats



\---



\## Purpose



This project was developed to provide job seekers with a single platform for resume analysis, ATS evaluation, career matching, intelligent recommendations, and professional resume generation.



\---



\## License



This project is intended for educational and portfolio purposes.

