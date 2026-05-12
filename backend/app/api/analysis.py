from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List, Optional
import io, csv
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.analysis import Analysis, WordAnalysis, SavedReport
from app.schemas.schemas import AnalyzeRequest, AnalysisResult, AnalysisOut, DashboardStats
from app.services.nlp_service import analyze_text

router = APIRouter(prefix="/analysis", tags=["Analysis"])

@router.post("/analyze", response_model=AnalysisResult)
def analyze(req: AnalyzeRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    result = analyze_text(req.text)
    analysis = Analysis(
        user_id=current_user.id,
        input_text=req.text,
        detected_language=result["detected_language"],
        sentiment=result["sentiment"],
        toxicity_score=result["toxicity_score"]
    )
    db.add(analysis)
    db.flush()
    for wa in result["word_analysis"]:
        db.add(WordAnalysis(analysis_id=analysis.id, word=wa["word"], language=wa["language"]))
    db.commit()
    return result

@router.get("/history", response_model=List[AnalysisOut])
def get_history(
    skip: int = 0, limit: int = 20,
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    q = db.query(Analysis).filter(Analysis.user_id == current_user.id)
    if search:
        q = q.filter(Analysis.input_text.contains(search))
    return q.order_by(desc(Analysis.created_at)).offset(skip).limit(limit).all()

@router.get("/dashboard", response_model=DashboardStats)
def get_dashboard(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    analyses = db.query(Analysis).filter(Analysis.user_id == current_user.id).all()
    total = len(analyses)
    if total == 0:
        return DashboardStats(
            total_analyses=0, most_used_language="N/A", avg_toxicity=0.0,
            sentiment_breakdown={}, language_breakdown={}, recent_analyses=[]
        )
    lang_counts: dict = {}
    sentiment_counts: dict = {}
    total_toxicity = 0.0
    for a in analyses:
        lang_counts[a.detected_language] = lang_counts.get(a.detected_language, 0) + 1
        sentiment_counts[a.sentiment] = sentiment_counts.get(a.sentiment, 0) + 1
        total_toxicity += a.toxicity_score or 0
    most_used = max(lang_counts, key=lang_counts.get)
    recent = db.query(Analysis).filter(Analysis.user_id == current_user.id).order_by(desc(Analysis.created_at)).limit(5).all()
    return DashboardStats(
        total_analyses=total,
        most_used_language=most_used,
        avg_toxicity=round(total_toxicity / total, 2),
        sentiment_breakdown=sentiment_counts,
        language_breakdown=lang_counts,
        recent_analyses=recent
    )

@router.delete("/history/{analysis_id}")
def delete_analysis(analysis_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    a = db.query(Analysis).filter(Analysis.id == analysis_id, Analysis.user_id == current_user.id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(a)
    db.commit()
    return {"message": "Deleted"}

@router.get("/export/csv")
def export_csv(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    analyses = db.query(Analysis).filter(Analysis.user_id == current_user.id).order_by(desc(Analysis.created_at)).all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Text", "Language", "Sentiment", "Toxicity Score", "Date"])
    for a in analyses:
        writer.writerow([a.id, a.input_text[:100], a.detected_language, a.sentiment, a.toxicity_score, a.created_at])
    output.seek(0)
    return StreamingResponse(io.BytesIO(output.getvalue().encode()), media_type="text/csv",
                             headers={"Content-Disposition": "attachment; filename=linguasense_history.csv"})
