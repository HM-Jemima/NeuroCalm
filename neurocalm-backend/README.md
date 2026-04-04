# NeuroCalm Backend

## Local setup

This backend runs against PostgreSQL and can start without a trained ML model.
If the model paths are left empty, the analysis flow stays in simulation mode.

## Recommended Python version

Use Python 3.12 on this machine.
Python 3.14 is installed here too, but it is not a good fit for the optional TensorFlow dependency.

## Windows step by step

1. Create a virtual environment with Python 3.12:

```powershell
py -3.12 -m venv .venv
```

2. Activate it:

```powershell
.\.venv\Scripts\Activate.ps1
```

3. Upgrade pip:

```powershell
python -m pip install --upgrade pip
```

4. Install the base backend dependencies:

```powershell
pip install -r requirements.txt
```

5. Copy the environment template:

```powershell
Copy-Item .env.example .env
```

6. Edit `.env` and set your PostgreSQL values:

```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=neurocalm
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-password
SECRET_KEY=put-a-long-random-secret-here
```

7. Make sure the database exists. Example with `psql`:

```powershell
psql -U postgres -h localhost -p 5432 -c "CREATE DATABASE neurocalm;"
```

Skip that command if your `neurocalm` database already exists.
If `psql` is not on your PATH, create the database from pgAdmin or the PostgreSQL SQL Shell instead.

8. Seed the database with demo users:

```powershell
python seed.py
```

9. Start the API:

```powershell
uvicorn app.main:app --reload
```

10. Open:

- API root: `http://127.0.0.1:8000/`
- Health check: `http://127.0.0.1:8000/health`
- Swagger docs: `http://127.0.0.1:8000/docs`

## Demo users after seeding

- `admin@neurocalm.com` / `admin123`
- `user@neurocalm.com` / `user123`

## Optional: enable real ML inference

Only do this if you have exported model artifacts and want real inference instead of simulation mode.

1. Install the ML dependency:

```powershell
pip install -r requirements-ml.txt
```

2. Fill these values in `.env`:

```env
MODEL_PATH=path\to\model.h5
MODEL_TYPE=SALIENT
SCALER_PATH=path\to\scaler.pkl
MODEL_METADATA_PATH=path\to\model_metadata.json
```

## Notes

- The app currently creates tables automatically on startup and during `seed.py`.
- Alembic is present, but there are no migration files yet.
