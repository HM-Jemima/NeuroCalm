**Best Free Setup**

Use this stack for your project:

1. Frontend: Vercel Hobby
2. Backend: Render Free Web Service
3. Database: Neon Free Postgres

Why this stack:
- Vercel Hobby is free for frontend hosting: [Vercel Hobby](https://vercel.com/docs/accounts/plans/hobby)
- Render still supports free Python web services, but free services spin down after 15 minutes idle and local files are ephemeral: [Render free deploy](https://render.com/docs/free), [Render FastAPI deploy](https://render.com/docs/deploy-fastapi)
- Neon has a real free Postgres plan with no time limit, while Render free Postgres expires after 30 days. That recommendation is based on [Neon pricing](https://neon.com/pricing) and [Render free Postgres limits](https://render.com/docs/free)

**Whole Process**

1. Push your full project to GitHub.
   Make sure these folders are in the repo:
   - `neurocalm-frontend`
   - `neurocalm-backend`
   - `model`

2. Create a Neon database.
   - Go to [Neon](https://neon.com/pricing)
   - Create a free project
   - Open `Connect`
   - Copy the Postgres connection string
   - Because your backend uses SQLAlchemy asyncpg, change the prefix from:
     `postgresql://...`
     to:
     `postgresql+asyncpg://...`
   - Keep the SSL query part Neon gives you, like `?sslmode=require`
   Reference: [Neon connect docs](https://neon.com/docs/get-started-with-neon/connect-neon), [SQLAlchemy asyncpg URL format](https://docs.sqlalchemy.org/21/dialects/postgresql.html)

3. Deploy the backend on Render.
   - Go to Render
   - `New` -> `Web Service`
   - Connect your GitHub repo
   - Use these settings:
     - Root Directory: `neurocalm-backend`
     - Runtime: `Python 3`
     - Build Command: `pip install -r requirements-ml.txt`
     - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
     - Instance Type: `Free`

4. Add backend environment variables in Render.
   Use the names from [`.env.example`](C:/Users/BS01685.BS-01685/NeuroCalm/neurocalm-backend/.env.example):
   - `DATABASE_URL=<your neon asyncpg url>`
   - `SECRET_KEY=<long random string>`
   - `ACCESS_TOKEN_EXPIRE_MINUTES=30`
   - `REFRESH_TOKEN_EXPIRE_DAYS=7`
   - `UPLOAD_DIR=uploads`
   - `MAX_UPLOAD_SIZE_MB=50`
   - `FRONTEND_URL=https://your-frontend.vercel.app`
   - `CORS_ORIGINS=https://your-frontend.vercel.app,http://localhost:5173`
   - `MODEL_PATH=../model/SALIENT_model.h5`
   - `MODEL_TYPE=SALIENT`
   - `SCALER_PATH=../model/SALIENT_scaler.pkl`
   - `MODEL_METADATA_PATH=../model/deploy_metadata.json`
   - `WINDOW_SIZE=150`
   - `WINDOW_STRIDE=3`
   - `N_CLASSES=4`
   - `FNIRS_FEATURES=AB_I_O,AB_PHI_O,AB_I_DO,AB_PHI_DO,CD_I_O,CD_PHI_O,CD_I_DO,CD_PHI_DO`

5. Wait for Render deploy to finish.
   Your backend URL will look like:
   `https://your-backend.onrender.com`

6. Seed the production database once.
   Since Render free has no easy one-off shell, do it from your computer against the hosted DB:
   ```powershell
   cd C:\Users\BS01685.BS-01685\NeuroCalm\neurocalm-backend
   .\.venv\Scripts\Activate.ps1
   $env:DATABASE_URL="postgresql+asyncpg://..."
   python seed.py
   ```
   After that, your hosted DB will have admin/demo users.

7. Deploy the frontend on Vercel.
   - Go to Vercel
   - `Add New` -> `Project`
   - Import the same GitHub repo
   - Use these settings:
     - Root Directory: `neurocalm-frontend`
     - Framework Preset: `Vite`
     - Build Command: `npm run build`
     - Output Directory: `dist`

8. Add frontend environment variables in Vercel.
   Use the names from [`.env`](C:/Users/BS01685.BS-01685/NeuroCalm/neurocalm-frontend/.env):
   - `VITE_API_URL=https://your-backend.onrender.com/api/v1`
   - `VITE_APP_NAME=NeuroCalm`

9. Redeploy the frontend.

10. Go back to Render and confirm backend CORS values use the real Vercel URL.
    - `FRONTEND_URL=https://your-frontend.vercel.app`
    - `CORS_ORIGINS=https://your-frontend.vercel.app,http://localhost:5173`
    Then redeploy the backend once.

11. If you use Google/GitHub/Microsoft login, update OAuth callback URLs.
    Backend callback URLs should be:
    - `https://your-backend.onrender.com/api/v1/auth/oauth/google/callback`
    - `https://your-backend.onrender.com/api/v1/auth/oauth/github/callback`
    - `https://your-backend.onrender.com/api/v1/auth/oauth/microsoft/callback`
    Frontend URL should be:
    - `https://your-frontend.vercel.app`

12. Test production:
    - Open frontend
    - Register/login
    - Upload a file
    - Open admin panel
    - Check `/docs` on backend:
      `https://your-backend.onrender.com/docs`

**Important Notes**

- Your current backend stores uploaded files locally in `uploads`. On Render free, local filesystem changes are lost on restart/redeploy/spin-down. So uploads are not durable there. This is straight from Render’s free-service limitations: [Render free deploy](https://render.com/docs/free)
- Your backend includes TensorFlow. It may deploy on Render free, but cold starts can be slow and memory can be tight.
- Your model files must stay inside the GitHub repo, otherwise these paths will fail:
  - `../model/SALIENT_model.h5`
  - `../model/SALIENT_scaler.pkl`
  - `../model/deploy_metadata.json`
- Render free backend sleeps after 15 minutes idle, so the first request can take around a minute to wake up: [Render free deploy](https://render.com/docs/free)

**Recommended Final Choice**

For your current app, I recommend:
- Vercel for frontend
- Render for backend
- Neon for Postgres

If you want, I can do the next step with you and give you the exact Render and Vercel field values one by one while you deploy.