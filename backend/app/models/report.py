from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.sql import func

from app.database import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    patient_name = Column(String(100), nullable=True)
    age = Column(String(20), nullable=True)
    gender = Column(String(20), nullable=True)
    report_type = Column(String(150), nullable=True)

    summary = Column(Text, nullable=True)

    # Stores the complete Gemini analysis as JSON text
    analysis_result = Column(Text, nullable=False)

    created_at = Column(
        DateTime,
        server_default=func.now(),
        nullable=False
    )