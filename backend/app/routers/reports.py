from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.services.compare_service import compare_reports
from app.database import get_db
from app.models.report import Report
from app.models.user import User
from app.security import get_current_user


router = APIRouter(
    prefix="/reports",
    tags=["Reports"],
)

@router.get("/compare")
def compare_medical_reports(
    report_ids: list[int] = Query(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if len(report_ids) < 2:
        raise HTTPException(
            status_code=400,
            detail="At least 2 reports are required for comparison",
        )

    reports = (
        db.query(Report)
        .filter(
            Report.id.in_(report_ids),
            Report.user_id == current_user.id,
        )
        .order_by(Report.created_at.asc())
        .all()
    )

    if len(reports) != len(set(report_ids)):
        raise HTTPException(
            status_code=404,
            detail="One or more reports were not found",
        )

    comparison = compare_reports(reports)

    return {
        "success": True,
        "reports": [
            {
                "id": report.id,
                "date": (
                    report.created_at.isoformat()
                    if report.created_at
                    else None
                ),
                "patient_name": report.patient_name,
                "report_type": report.report_type,
            }
            for report in reports
        ],
        "comparison": comparison,
    }
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