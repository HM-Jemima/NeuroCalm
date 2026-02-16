# 🧠 NeuroCalm

<div align="center">

![NeuroCalm Banner](https://img.shields.io/badge/NeuroCalm-EEG%20Stress%20Detection-6366f1?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTkuNSAyQTIuNSAyLjUgMCAwIDEgMTIgNC41di4zYTEgMSAwIDAgMCAuNCAxYzEuMy45IDIuMSAyLjQgMi4xIDRhNS41IDUuNSAwIDEgMS0xMSAwYzAtMS42LjgtMy4xIDIuMS00YTEgMSAwIDAgMCAuNC0xdi0uM0EyLjUgMi41IDAgMCAxIDkuNSAyWiIvPjxwYXRoIGQ9Ik04IDIydi0yLjVhMi41IDIuNSAwIDAgMSA1IDBWMjIiLz48L3N2Zz4=)

**AI-Powered EEG Stress Detection Platform**

[![Python](https://img.shields.io/badge/Python-3.11+-3776ab?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109+-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18+-61dafb?style=flat-square&logo=react&logoColor=black)](https://reactjs.org)
[![XGBoost](https://img.shields.io/badge/XGBoost-ML-ff6600?style=flat-square)](https://xgboost.readthedocs.io)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[Live Demo](https://neurocalm.app) • [Documentation](docs/) • [API Reference](https://api.neurocalm.app/docs)

</div>

---

## 📖 Overview

**NeuroCalm** is a full-stack web application that analyzes EEG (electroencephalogram) recordings to detect stress levels using machine learning. Users can upload their EEG files and receive instant, accurate stress analysis with detailed brain wave insights.

### ✨ Key Features

- 🧠 **AI-Powered Analysis** — XGBoost model with 87%+ accuracy trained on SAM40 dataset
- 📤 **Easy File Upload** — Support for .mat, .edf, and .csv EEG formats
- ⚡ **Fast Processing** — Results in under 30 seconds
- 📊 **Detailed Reports** — Band power distribution (Delta, Theta, Alpha, Beta, Gamma)
- 📈 **Analysis History** — Track stress patterns over time
- 🔐 **Secure** — JWT authentication, encrypted data
- 👨‍💼 **Admin Dashboard** — User management, system monitoring

---

## 🖼️ Screenshots

<div align="center">
<table>
<tr>
<td><img src="docs/screenshots/landing.png" alt="Landing Page" width="400"/></td>
<td><img src="docs/screenshots/dashboard.png" alt="Dashboard" width="400"/></td>
</tr>
<tr>
<td align="center"><b>Landing Page</b></td>
<td align="center"><b>User Dashboard</b></td>
</tr>
<tr>
<td><img src="docs/screenshots/analysis.png" alt="Analysis Result" width="400"/></td>
<td><img src="docs/screenshots/admin.png" alt="Admin Dashboard" width="400"/></td>
</tr>
<tr>
<td align="center"><b>Analysis Result</b></td>
<td align="center"><b>Admin Dashboard</b></td>
</tr>
</table>
</div>

---

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  React Frontend │────▶│  FastAPI Backend│────▶│   PostgreSQL    │
│  (Vite + Tailwind)    │  (REST API)     │     │   Database      │
│                 │     │                 │     │                 │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │                 │
                        │  ML Model       │
                        │  (XGBoost)      │
                        │                 │
                        └─────────────────┘
```

### Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite, Tailwind CSS, Zustand, Framer Motion |
| **Backend** | Python 3.11, FastAPI, SQLAlchemy, Alembic |
| **ML Model** | XGBoost, Optuna, scikit-learn, SciPy |
| **Database** | PostgreSQL 15 |
| **Cache** | Redis (optional) |
| **Deployment** | Docker, Docker Compose |

---

## 📁 Project Structure

```
neurocalm/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API service layer
│   │   ├── store/            # Zustand state management
│   │   └── utils/            # Utility functions
│   ├── package.json
│   └── vite.config.js
│
├── backend/                  # FastAPI backend application
│   ├── app/
│   │   ├── api/v1/           # API endpoints
│   │   ├── core/             # Security, config, exceptions
│   │   ├── models/           # SQLAlchemy models
│   │   ├── schemas/          # Pydantic schemas
│   │   ├── services/         # Business logic
│   │   ├── ml/               # ML model & inference
│   │   └── db/               # Database configuration
│   ├── tests/
│   ├── requirements.txt
│   └── Dockerfile
│
├── ml/                       # ML model training
│   ├── notebooks/            # Jupyter notebooks
│   ├── train_model.py        # Training script
│   └── models/               # Trained model files
│
├── docker-compose.yml
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Yarn or npm

### Quick Start with Docker

```bash
# Clone the repository
git clone https://github.com/yourusername/neurocalm.git
cd neurocalm

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/api/docs
```

### Manual Setup

#### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or: venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Run database migrations
alembic upgrade head

# Start the server
uvicorn app.main:app --reload
```

#### Frontend

```bash
cd frontend

# Install dependencies
yarn install

# Configure environment
cp .env.example .env

# Start development server
yarn dev
```

---

## 🔬 ML Model

The stress detection model is trained on the **SAM40 dataset** (40 subjects, 480 EEG recordings) using:

- **Algorithm**: XGBoost with Optuna hyperparameter optimization
- **Features**: 1,222 features extracted from 32-channel EEG
  - Band powers (Delta, Theta, Alpha, Beta, Gamma)
  - Band ratios
  - Coherence features
  - Hjorth parameters
  - Spectral entropy
- **Classification**: Binary (Relaxed vs Stressed)
- **Accuracy**: 87%+ on test set

### Training Your Own Model

```bash
cd ml

# Train the model
python train_model.py --data_path /path/to/eeg/data --output_dir ./models

# The trained model will be saved as stress_detector_model.pkl
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/auth/register` | Register new user |
| `POST` | `/api/v1/auth/login` | Login, get JWT tokens |
| `POST` | `/api/v1/analysis/upload` | Upload EEG file & analyze |
| `GET` | `/api/v1/analysis/{id}` | Get analysis result |
| `GET` | `/api/v1/history` | Get user's analysis history |
| `GET` | `/api/v1/reports/{id}/pdf` | Download PDF report |
| `GET` | `/api/v1/admin/stats` | System statistics (admin) |
| `GET` | `/api/v1/admin/users` | List all users (admin) |

Full API documentation available at `/api/docs` when running the backend.

---

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html
```

### Frontend Tests

```bash
cd frontend

# Run tests
yarn test

# Run with coverage
yarn test:coverage
```

---

## 🐳 Docker Deployment

```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/neurocalm
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: neurocalm
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [SAM40 Dataset](https://www.example.com/sam40) - EEG stress dataset
- [XGBoost](https://xgboost.readthedocs.io/) - ML framework
- [FastAPI](https://fastapi.tiangolo.com/) - Backend framework
- [React](https://reactjs.org/) - Frontend library

---

## 📧 Contact

**Project Maintainer**: Your Name

- Email: your.email@example.com
- Twitter: [@yourhandle](https://twitter.com/yourhandle)
- LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)

---

<div align="center">

**⭐ Star this repo if you find it useful!**

Made with ❤️ for mental wellness

</div>