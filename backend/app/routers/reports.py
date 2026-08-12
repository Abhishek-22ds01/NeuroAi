from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.report import Report
from app.models.user import User
from app.security import get_current_user


router = APIRouter(
    prefix="/reports",
    tags=["Reports"],
)


@router.get("/")
def get_reports(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    reports = (
        db.query(Report)
        .filter(Report.user_id == current_user.id)
        .order_by(Report.created_at.desc())
        .all()
    )

    return reports


@router.get("/{report_id}")
def get_report(
    report_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    report = (
        db.query(Report)
        .filter(
            Report.id == report_id,
            Report.user_id == current_user.id,
        )
        .first()
    )

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Report not found",
        )

    return report

@router.delete("/{report_id}")
def delete_report(
    report_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    report = (
        db.query(Report)
        .filter(
            Report.id == report_id,
            Report.user_id == current_user.id,
        )
        .first()
    )

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Report not found",
        )

    db.delete(report)
    db.commit()

    return {
        "success": True,
        "message": "Report deleted successfully",
    }