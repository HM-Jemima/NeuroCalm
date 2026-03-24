import json
import os
from datetime import datetime, timedelta, timezone

from sqlalchemy import select, func, desc, and_, cast, Date
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.config import get_settings
from app.models.user import User
from app.models.analysis import Analysis
from app.models.system_setting import SystemSettings

_settings = get_settings()


async def get_system_stats(db: AsyncSession) -> dict:
    user_count = await db.execute(select(func.count(User.id)))
    analysis_count = await db.execute(select(func.count(Analysis.id)))

    # Read real accuracy from model metadata if available
    model_info = get_model_info()
    accuracy = model_info.get("accuracy", "N/A")

    return {
        "total_users": f"{user_count.scalar() or 0:,}",
        "total_analyses": f"{analysis_count.scalar() or 0:,}",
        "avg_processing_time": "12.4s",
        "model_accuracy": accuracy,
    }


async def get_all_users(
    db: AsyncSession, page: int = 1, page_size: int = 20
) -> tuple[list[dict], int]:
    # Count total
    total_result = await db.execute(select(func.count(User.id)))
    total = total_result.scalar() or 0

    # Fetch users with analysis count
    query = (
        select(
            User,
            func.count(Analysis.id).label("analyses_count"),
        )
        .outerjoin(Analysis, Analysis.user_id == User.id)
        .group_by(User.id)
        .order_by(desc(User.created_at))
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    result = await db.execute(query)
    rows = result.all()

    users = []
    for row in rows:
        user = row[0]
        count = row[1]
        users.append({
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "is_active": user.is_active,
            "created_at": user.created_at,
            "analyses_count": count,
        })

    return users, total


async def update_user(
    db: AsyncSession, user_id: str, data: dict
) -> dict | None:
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if user is None:
        return None

    for key, value in data.items():
        if value is not None and hasattr(user, key):
            setattr(user, key, value)

    await db.commit()
    await db.refresh(user)

    # Get analysis count
    count_result = await db.execute(
        select(func.count(Analysis.id)).where(Analysis.user_id == user.id)
    )

    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
        "is_active": user.is_active,
        "created_at": user.created_at,
        "analyses_count": count_result.scalar() or 0,
    }


async def delete_user(db: AsyncSession, user_id: str) -> bool:
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if user is None:
        return False

    await db.delete(user)
    await db.commit()
    return True


def get_model_info() -> dict:
    """Read model metadata from a JSON file if available, otherwise return defaults."""
    meta_path = _settings.MODEL_METADATA_PATH
    if meta_path and os.path.exists(meta_path):
        try:
            with open(meta_path) as f:
                return json.load(f)
        except Exception:
            pass

    # Defaults matching the notebook models
    return {
        "model_type": _settings.MODEL_TYPE,
        "version": "v1.0.0",
        "accuracy": "—" if not _settings.MODEL_PATH else "See metadata",
        "features": "1,200 (8 fNIRS channels x 150 timesteps)",
        "training_data": "Tufts fNIRS2MW — 10 subjects, LOSO CV",
        "last_updated": "2026-03-20",
    }


# --- Admin Analyses ---

async def get_all_analyses(
    db: AsyncSession, page: int = 1, page_size: int = 20, search: str = ""
) -> tuple[list[dict], int]:
    base = select(Analysis).options(joinedload(Analysis.user))

    if search:
        pattern = f"%{search}%"
        base = base.where(
            Analysis.filename.ilike(pattern)
            | Analysis.user.has(User.full_name.ilike(pattern))
            | Analysis.user.has(User.email.ilike(pattern))
        )

    # Count total
    count_q = select(func.count(Analysis.id))
    if search:
        pattern = f"%{search}%"
        count_q = count_q.where(
            Analysis.filename.ilike(pattern)
            | Analysis.user_id.in_(
                select(User.id).where(
                    User.full_name.ilike(pattern) | User.email.ilike(pattern)
                )
            )
        )
    total_result = await db.execute(count_q)
    total = total_result.scalar() or 0

    # Fetch page
    query = (
        base.order_by(desc(Analysis.created_at))
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    result = await db.execute(query)
    rows = result.scalars().all()

    def stress_label(score):
        if score <= 40:
            return "Relaxed"
        if score <= 60:
            return "Moderate"
        return "Stressed"

    items = []
    for a in rows:
        items.append({
            "id": a.id,
            "user": a.user.full_name,
            "file": a.filename,
            "result": stress_label(a.stress_score),
            "confidence": f"{a.confidence}%",
            "date": a.created_at.strftime("%Y-%m-%d"),
            "status": "completed",
        })

    return items, total


# --- Analytics ---

async def get_analytics(db: AsyncSession) -> dict:
    now = datetime.now(timezone.utc)

    # Daily analyses for the past 7 days
    day_names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    daily = []
    for i in range(6, -1, -1):
        day = now - timedelta(days=i)
        day_start = day.replace(hour=0, minute=0, second=0, microsecond=0)
        day_end = day_start + timedelta(days=1)

        count_result = await db.execute(
            select(func.count(Analysis.id)).where(
                and_(
                    Analysis.created_at >= day_start,
                    Analysis.created_at < day_end,
                )
            )
        )
        count = count_result.scalar() or 0
        daily.append({
            "name": day_names[day.weekday()],
            "analyses": count,
        })

    # Stress score distribution
    ranges = [
        ("0-20", 0, 20),
        ("21-40", 21, 40),
        ("41-60", 41, 60),
        ("61-80", 61, 80),
        ("81-100", 81, 100),
    ]
    distribution = []
    for label, low, high in ranges:
        count_result = await db.execute(
            select(func.count(Analysis.id)).where(
                and_(
                    Analysis.stress_score >= low,
                    Analysis.stress_score <= high,
                )
            )
        )
        distribution.append({
            "range": label,
            "count": count_result.scalar() or 0,
        })

    # Week total
    week_start = now - timedelta(days=7)
    week_result = await db.execute(
        select(func.count(Analysis.id)).where(Analysis.created_at >= week_start)
    )
    total_this_week = week_result.scalar() or 0

    # Month total
    month_start = now - timedelta(days=30)
    month_result = await db.execute(
        select(func.count(Analysis.id)).where(Analysis.created_at >= month_start)
    )
    total_this_month = month_result.scalar() or 0

    # Average stress score
    avg_result = await db.execute(select(func.avg(Analysis.stress_score)))
    avg_stress = avg_result.scalar() or 0.0

    return {
        "daily": daily,
        "distribution": distribution,
        "total_this_week": total_this_week,
        "total_this_month": total_this_month,
        "avg_stress_score": round(float(avg_stress), 1),
    }


# --- System Settings ---

async def get_system_settings(db: AsyncSession) -> SystemSettings:
    result = await db.execute(select(SystemSettings).limit(1))
    settings = result.scalar_one_or_none()

    if settings is None:
        # Create default settings on first access
        settings = SystemSettings(
            maintenance_mode=False,
            allow_registration=True,
            max_upload_size_mb=50,
            rate_limit_per_minute=60,
            storage_backend="local",
            auto_delete_days=90,
        )
        db.add(settings)
        await db.commit()
        await db.refresh(settings)

    return settings


async def update_system_settings(db: AsyncSession, data: dict) -> SystemSettings:
    settings = await get_system_settings(db)

    for key, value in data.items():
        if value is not None and hasattr(settings, key):
            setattr(settings, key, value)

    await db.commit()
    await db.refresh(settings)
    return settings
