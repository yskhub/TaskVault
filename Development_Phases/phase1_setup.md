# Phase 1: Project Setup & GitHub Integration

## Objective
Initialize project, configure version control, and basic structure.

## Steps

### 1. Initialize GitHub Repository
```bash
git init
git remote add origin <your-repo-url>
git branch -M main
git commit --allow-empty -m "Initial commit"
git push -u origin main
```

### 2. Setup Frontend (Next.js)
```bash
npx create-next-app@latest frontend
cd frontend
git add .
git commit -m "Setup Next.js frontend"
```

### 3. Setup Backend (Python FastAPI + Supabase)
```bash
mkdir backend
cd backend
python -m venv venv
source venv/bin/activate
pip install fastapi uvicorn supabase
```

### 4. Directory Structure
```
project-root/
├── frontend/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── auth.py
│   │   ├── workflows.py
│   │   └── users.py
│   ├── requirements.txt
├── README.md
└── prd.md
```

### 5. Security Setup
- Use `.env` for secrets
- Add `.gitignore` for sensitive files
- HTTPS via Vercel & Supabase

### Deliverables
- GitHub repo initialized
- Project scaffold ready
- Initial commit done