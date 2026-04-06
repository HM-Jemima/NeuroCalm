# 🚀 NeuroCalm Free Deployment Guide

> Verified against official pricing/docs on **April 6, 2026**.  
> Free-plan limits can change, so re-check the linked official pages before production deployment.

---

## ✅ Best Free Hosting Stack For This Project

For the current NeuroCalm codebase, the best free deployment setup is:

1. **Frontend:** Vercel Hobby
2. **Backend:** Render Free Web Service
3. **Database:** Neon Free Postgres

### Why this stack?

- **Vercel** is the easiest free option for the React + Vite frontend.
- **Render** is a practical free option for a Python/FastAPI backend.
- **Neon** is the best free PostgreSQL option here because it does **not** expire after 30 days.

### Why not use Vercel for the backend?

This backend is better suited to Render because it:

- runs FastAPI as a long-lived web service
- stores uploads locally
- loads TensorFlow + scaler + model metadata
- benefits from a normal server process more than a serverless function model

### Why not use Render Free Postgres?

Because Render's free Postgres has a **30-day expiry**, then only a **14-day grace period** before deletion. For anything beyond quick testing, Neon is the safer free database choice.

---

## 📊 Free Plan Snapshot

### 1. Vercel Hobby

Official source: [Vercel Hobby Plan](https://vercel.com/docs/plans/hobby)

What matters for this frontend:

- Free tier for **personal, non-commercial use only**
- No billing cycle; in most cases if you exceed limits, you wait until **30 days** have passed
- Up to **200 projects**
- Up to **100 deployments per day**
- Up to **6,000 build execution minutes**
- Up to **1,000,000 edge requests**
- Function max duration on Hobby: **10s default**, configurable up to **60s**
- Runtime logs: **1 hour** and up to **4000 rows**

Why it fits NeuroCalm frontend:

- This frontend is a Vite SPA
- Static hosting on Vercel is straightforward
- These Hobby limits are usually enough for personal/demo usage

### 2. Render Free Web Service

Official sources:

- [Render Free Services](https://render.com/docs/free)
- [Deploy a FastAPI App on Render](https://render.com/docs/deploy-fastapi)

What matters for this backend:

- Free web services spin down after **15 minutes** of no inbound traffic
- Spin-up after idle takes about **1 minute**
- Local filesystem is **ephemeral**
- Free web services get **750 instance hours per workspace per calendar month**
- Usage resets at the **start of each month**

Important limitation for this project:

- Your backend currently stores uploaded files in `uploads/`
- On Render free, those uploaded files are lost when the service redeploys, restarts, or spins down

### 3. Neon Free Postgres

Official sources:

- [Neon Pricing](https://neon.com/pricing)
- [Connect Neon](https://neon.com/docs/get-started/connect-neon)

What matters for this database:

- **$0** with **no time limits**
- Up to **100 projects**
- **100 CU-hours monthly per project**
- **0.5 GB storage per project**
- Up to **10 branches per project**
- Autosuspends after **5 minutes** when inactive
- **6-hour** time travel / restore window
- **1 day** metrics/logs retention in the UI

Why it fits NeuroCalm:

- The app needs PostgreSQL, not SQLite
- Neon gives a real free Postgres without 30-day expiry
- The model/admin/demo data usage here is small enough for the free tier

### 4. Render Free Postgres

Official source: [Render Free Services](https://render.com/docs/free)

This is **not recommended** for NeuroCalm except short demos:

- Only **1 free Postgres DB** per workspace
- **1 GB** storage
- Expires **30 days after creation**
- After that, only **14 days grace period**
- No backups on the free plan

---

## 🧠 Recommended Final Choice

For **this exact repository**, use:

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** Neon

That gives you:

- a free frontend with good DX
- a free Python backend host
- a free Postgres database that does not auto-expire after 30 days

---

## 🗂️ What You Are Deploying

This repo is split like this:

- `neurocalm-frontend` → React + Vite frontend
- `neurocalm-backend` → FastAPI backend
- `model` → deployed model artifacts

Current model artifacts in `model/`:

- `SALIENT_model.h5`
- `SALIENT_scaler.pkl`
- `deploy_metadata.json`
- `results_30sec_150ts.pkl`

These files are small enough to stay in the repo for free-hosting deployment.

---

## 1️⃣ Before You Deploy

Push your full repository to GitHub first.

Make sure these directories are included:

- `neurocalm-frontend`
- `neurocalm-backend`
- `model`

Also make sure you do **not** push secrets like:

- `.env`
- OAuth secrets
- production database passwords

---

## 2️⃣ Create the Database on Neon

### Steps

1. Go to [Neon Pricing](https://neon.com/pricing)
2. Create a free Neon account/project
3. Open your project dashboard
4. Click **Connect**
5. Copy the connection string

Example from Neon docs:

```text
postgresql://user:password@host/dbname?sslmode=require
```

### Important for this backend

Your backend uses SQLAlchemy asyncpg, so convert:

```text
postgresql://
```

to:

```text
postgresql+asyncpg://
```

So your final `DATABASE_URL` should look like:

```text
postgresql+asyncpg://user:password@host/dbname?sslmode=require
```

---

## 3️⃣ Deploy the Backend on Render

### Create the service

1. Go to Render
2. Click **New**
3. Choose **Web Service**
4. Connect your GitHub repo

### Render service settings

Use:

- **Root Directory:** `neurocalm-backend`
- **Runtime:** Python 3
- **Build Command:** `pip install -r requirements-ml.txt`
- **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Instance Type:** `Free`

### Why `requirements-ml.txt`?

Because it installs:

- base backend dependencies
- TensorFlow CPU

If TensorFlow deployment becomes too heavy on free hosting, you can temporarily run the backend in simulation mode by clearing the model paths.

---

## 4️⃣ Add Backend Environment Variables in Render

Use the variable names from [neurocalm-backend/.env.example](C:/Users/BS01685.BS-01685/NeuroCalm/neurocalm-backend/.env.example).

### Required backend env vars

```env
DATABASE_URL=postgresql+asyncpg://...your-neon-url...?sslmode=require
SECRET_KEY=your-long-random-secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
UPLOAD_DIR=uploads
MAX_UPLOAD_SIZE_MB=50
FRONTEND_URL=https://your-frontend.vercel.app
CORS_ORIGINS=https://your-frontend.vercel.app,http://localhost:5173
MODEL_PATH=../model/SALIENT_model.h5
MODEL_TYPE=SALIENT
SCALER_PATH=../model/SALIENT_scaler.pkl
MODEL_METADATA_PATH=../model/deploy_metadata.json
WINDOW_SIZE=150
WINDOW_STRIDE=3
N_CLASSES=4
FNIRS_FEATURES=AB_I_O,AB_PHI_O,AB_I_DO,AB_PHI_DO,CD_I_O,CD_PHI_O,CD_I_DO,CD_PHI_DO
```

### Optional OAuth env vars

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
MICROSOFT_CLIENT_ID=
MICROSOFT_CLIENT_SECRET=
MICROSOFT_TENANT_ID=common
```

---

## 5️⃣ Deploy the Frontend on Vercel

### Create the project

1. Go to Vercel
2. Click **Add New Project**
3. Import the same GitHub repository

### Vercel project settings

Use:

- **Root Directory:** `neurocalm-frontend`
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### Frontend env vars

```env
VITE_API_URL=https://your-backend.onrender.com/api/v1
VITE_APP_NAME=NeuroCalm
```

---

## 6️⃣ Important Vercel SPA Routing Note

This frontend uses React Router.

That means deep URLs like:

- `/dashboard`
- `/history`
- `/admin/model`

may fail on hard refresh unless you add a Vercel rewrite rule.

### Recommended `vercel.json`

Create this file inside `neurocalm-frontend/` before deploying:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This helps Vercel serve the SPA correctly for client-side routes.

---

## 7️⃣ Seed the Production Database

After backend deploy succeeds, seed the Neon database once from your local machine.

From `neurocalm-backend`:

```powershell
cd C:\Users\BS01685.BS-01685\NeuroCalm\neurocalm-backend
.\.venv\Scripts\Activate.ps1
$env:DATABASE_URL="postgresql+asyncpg://...your-neon-url...?sslmode=require"
python seed.py
```

This populates demo/admin data for the hosted database.

---

## 8️⃣ Update OAuth Callback URLs

If you use Google, GitHub, or Microsoft login, update the provider dashboards with the production backend callback URLs.

### Production backend callbacks

- `https://your-backend.onrender.com/api/v1/auth/oauth/google/callback`
- `https://your-backend.onrender.com/api/v1/auth/oauth/github/callback`
- `https://your-backend.onrender.com/api/v1/auth/oauth/microsoft/callback`

### Production frontend URL

- `https://your-frontend.vercel.app`

Also keep these backend env values aligned:

```env
FRONTEND_URL=https://your-frontend.vercel.app
CORS_ORIGINS=https://your-frontend.vercel.app,http://localhost:5173
```

---

## 9️⃣ Test the Production Deployment

After both deployments are live:

1. Open the frontend URL
2. Register or log in
3. Upload a file
4. Open history and reports
5. Open admin pages
6. Check backend docs:

```text
https://your-backend.onrender.com/docs
```

---

## ⚠️ Real Limitations You Should Know

### Render free backend limitations

- Sleeps after 15 minutes idle
- First request after idle may take about 1 minute
- Uploaded files stored locally are not durable
- No persistent disk on free web services

### Neon free limitations

- 0.5 GB per project
- 100 CU-hours per month per project
- 6-hour restore window
- 1-day metrics/logs retention

### Vercel Hobby limitations

- Personal / non-commercial use only
- Most limits effectively reset after 30 days
- If you exceed usage, you may need to wait before using the feature again

---

## 🧭 Best Practical Recommendation

If you want a **fully free public demo**, this setup is good enough.

If you want something more reliable later:

1. Keep **Vercel** for frontend
2. Move backend from **Render Free** to a paid service or always-on host
3. Keep **Neon** until your DB usage grows
4. Move file uploads to cloud object storage instead of local disk

---

## 🔗 Official References

- [Vercel Hobby Plan](https://vercel.com/docs/plans/hobby)
- [Render Free Services](https://render.com/docs/free)
- [Render FastAPI Deployment Guide](https://render.com/docs/deploy-fastapi)
- [Neon Pricing](https://neon.com/pricing)
- [Neon Connection Guide](https://neon.com/docs/get-started/connect-neon)
- [SQLAlchemy asyncpg PostgreSQL URL format](https://docs.sqlalchemy.org/en/21/dialects/postgresql.html)
