from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Analysis(Base):
    __tablename__ = "analyses"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    input_text = Column(Text, nullable=False)
    detected_language = Column(String(50))
    sentiment = Column(String(20))
    toxicity_score = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="analyses")
    word_analyses = relationship("WordAnalysis", back_populates="analysis", cascade="all, delete-orphan")

class WordAnalysis(Base):
    __tablename__ = "word_analysis"
    id = Column(Integer, primary_key=True, index=True)
    analysis_id = Column(Integer, ForeignKey("analyses.id"), nullable=False)
    word = Column(String(100))
    language = Column(String(50))
    analysis = relationship("Analysis", back_populates="word_analyses")

class SavedReport(Base):
    __tablename__ = "saved_reports"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    report_name = Column(String(200))
    file_path = Column(String(500))
    created_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="saved_reports")
