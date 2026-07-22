from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.upload import router as upload_router
from app.routes.analyze import router as analyze_router
from app.routes.generate_resume import router as generate_resume_router


# =========================================================
# APP
# =========================================================

app = FastAPI(
    title="AI Resume Analyzer",
    version="1.0.0",
    description="AI Resume Analyzer Backend API",
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "https://ai-resume-analyzer-uao9.vercel.app",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# ROUTERS
# =========================================================

app.include_router(upload_router)
app.include_router(analyze_router)
app.include_router(generate_resume_router)


# =========================================================
# HOME
# =========================================================

@app.get("/")
def home():
    return {
        "message": "AI Resume Analyzer Backend Running 🚀"
    }


# =========================================================
# HEALTH
# =========================================================

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "AI Resume Analyzer API",
    }