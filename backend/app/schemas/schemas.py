from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime
    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

class WordResult(BaseModel):
    word: str
    language: str

class AnalyzeRequest(BaseModel):
    text: str

class AnalysisResult(BaseModel):
    detected_language: str
    confidence: float
    sentiment: str
    sentiment_score: float
    toxicity_score: float
    toxic_words: List[str]
    word_analysis: List[WordResult]
    language_distribution: dict
    translation_suggestion: Optional[str] = None
    is_code_mixed: bool

class AnalysisOut(BaseModel):
    id: int
    input_text: str
    detected_language: str
    sentiment: str
    toxicity_score: float
    created_at: datetime
    class Config:
        from_attributes = True

class DashboardStats(BaseModel):
    total_analyses: int
    most_used_language: str
    avg_toxicity: float
    sentiment_breakdown: dict
    language_breakdown: dict
    recent_analyses: List[AnalysisOut]
