"""
Seed script to populate the database with initial data.

Run: python seed.py

Creates:
  - Admin user: admin@neurocalm.com / admin123
  - Regular user: user@neurocalm.com / user123
  - Sample analyses for both users
"""

import asyncio
import random
from datetime import datetime, timedelta, timezone

from sqlalchemy import select

from app.database import engine, async_session, Base
from app.models.user import User
from app.models.analysis import Analysis
from app.utils.security import hash_password


async def seed():
    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as db:
        # Check if already seeded
        result = await db.execute(select(User).where(User.email == "admin@neurocalm.com"))
        if result.scalar_one_or_none():
            print("Database already seeded. Skipping.")
            return

        # Create admin user
        admin = User(
            email="hmJemima@gmail.com",
            full_name="HM Jemima",
            password_hash=hash_password("admin123"),
            role="admin",
            is_active=True,
            created_at=datetime(2025, 6, 15, 10, 0, 0, tzinfo=timezone.utc),
        )

        # Create regular user
        user = User(
            email="sazid@gmail.com",
            full_name="Sazid Khan",
            password_hash=hash_password("user123"),
            role="user",
            is_active=True,
            created_at=datetime(2025, 9, 20, 14, 30, 0, tzinfo=timezone.utc),
        )

        # Create additional users
        emily = User(
            email="emily@research.edu",
            full_name="Emily Chen",
            password_hash=hash_password("emily123"),
            role="user",
            is_active=True,
            created_at=datetime(2025, 7, 3, 9, 15, 0, tzinfo=timezone.utc),
        )

        michael = User(
            email="mross@clinic.com",
            full_name="Dr. Michael Ross",
            password_hash=hash_password("michael123"),
            role="user",
            is_active=True,
            created_at=datetime(2025, 8, 12, 16, 45, 0, tzinfo=timezone.utc),
        )

        alex = User(
            email="alex.k@lab.org",
            full_name="Alex Kumar",
            password_hash=hash_password("alex123"),
            role="user",
            is_active=False,
            created_at=datetime(2025, 11, 1, 11, 20, 0, tzinfo=timezone.utc),
        )

        db.add_all([admin, user, emily, michael, alex])
        await db.flush()

        # Create sample analyses
        now = datetime.now(timezone.utc)

        def make_band_powers(stress_score):
            s = stress_score / 100.0
            delta = 35 - 15 * s
            theta = 18 + 8 * s
            alpha = 25 - 14 * s
            beta = 8 + 14 * s
            gamma = 5 + 10 * s
            total = delta + theta + alpha + beta + gamma
            return {
                "delta": round(delta / total * 100, 1),
                "theta": round(theta / total * 100, 1),
                "alpha": round(alpha / total * 100, 1),
                "beta": round(beta / total * 100, 1),
                "gamma": round(gamma / total * 100, 1),
            }

        def make_workload(stress_score):
            if stress_score <= 25:
                wc = 0
            elif stress_score <= 50:
                wc = 1
            elif stress_score <= 75:
                wc = 2
            else:
                wc = 3
            probs = [0.1, 0.1, 0.1, 0.1]
            probs[wc] = 0.55 + random.uniform(0, 0.15)
            remaining = 1.0 - probs[wc]
            for i in range(4):
                if i != wc:
                    probs[i] = round(remaining / 3, 4)
            return wc, probs

        sample_analyses = [
            # Admin analyses
            (admin, "admin_review_batch_01.mat", 52, 93, 2),
            (admin, "clinical_trial_eeg_005.edf", 38, 90, 24),
            (admin, "validation_set_alpha.mat", 67, 88, 72),
            (admin, "model_benchmark_v2.csv", 24, 96, 120),
            (admin, "patient_followup_009.edf", 73, 91, 192),
            (admin, "research_pilot_cohort_a.mat", 31, 94, 288),
            # John Doe analyses
            (user, "eeg_recording_001.mat", 28, 92, 1),
            (user, "morning_session_feb22.edf", 35, 89, 24),
            (user, "baseline_test.csv", 42, 91, 48),
            (user, "post_workout_scan.mat", 19, 95, 72),
            (user, "pre_exam_reading.csv", 71, 86, 120),
            (user, "evening_relaxation.edf", 22, 93, 168),
            (user, "monday_commute_eeg.mat", 58, 87, 240),
            (user, "sleep_study_night_03.edf", 14, 94, 336),
            # Emily analyses
            (emily, "session_morning.edf", 65, 87, 4),
            (emily, "relaxation_study.mat", 22, 94, 48),
            (emily, "focus_task_experiment.csv", 48, 90, 96),
            (emily, "meditation_pre_post.edf", 17, 96, 144),
            (emily, "study_group_control.mat", 55, 88, 216),
            # Michael analyses
            (michael, "post_meditation.mat", 15, 95, 24),
            (michael, "patient_eeg_014.edf", 82, 92, 72),
            (michael, "sleep_onset_eeg.edf", 19, 93, 144),
            (michael, "clinical_assessment_021.mat", 61, 89, 240),
            # Alex analyses
            (alex, "work_stress_sample.edf", 78, 88, 48),
            (alex, "lab_recording_trial_07.csv", 44, 91, 120),
            (alex, "baseline_resting_state.mat", 30, 93, 264),
        ]

        for u, filename, score, conf, hours_ago in sample_analyses:
            wc, probs = make_workload(score)
            analysis = Analysis(
                user_id=u.id,
                filename=filename,
                file_path=f"uploads/seed_{filename}",
                stress_score=score,
                confidence=conf,
                stress_probability=score if score > 50 else 100 - score,
                features_count=1200,
                band_powers=make_band_powers(score),
                workload_class=wc,
                class_probabilities=probs,
                created_at=now - timedelta(hours=hours_ago),
            )
            db.add(analysis)

        await db.commit()
        print("Database seeded successfully!")
        print()
        print("  Admin:  admin@neurocalm.com / admin123")
        print("  User:   user@neurocalm.com  / user123")
        print(f"  Total users: 5")
        print(f"  Total analyses: {len(sample_analyses)}")


if __name__ == "__main__":
    asyncio.run(seed())
