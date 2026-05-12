@echo off
echo ============================================
echo   LinguaSense AI - Starting Development
echo ============================================

echo.
echo [1/2] Starting Backend (FastAPI)...
start "LinguaSense Backend" cmd /k "cd /d %~dp0backend && venv\Scripts\activate && uvicorn app.main:app --reload --port 8000"

timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend (React + Vite)...
start "LinguaSense Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ============================================
echo   Services starting...
echo   Backend:  http://localhost:8000
echo   Frontend: http://localhost:5173
echo   API Docs: http://localhost:8000/docs
echo ============================================
