<div align="center">

# ⚖️ Apna Lawyer

**AI-Powered Legal Guidance Platform**

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django_REST-092E20?logo=django&logoColor=white)
![React](https://img.shields.io/badge/React_18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?logo=tailwindcss&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)

*Understand Before You Sign* — Democratizing legal guidance through AI and verified lawyers.

[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [API Reference](#-api-reference) · [Deployment](#-deployment)

</div>

---

## 📖 Overview

**Apna Lawyer** bridges the gap between complex legal language and everyday understanding. The platform combines AI-powered document analysis with a curated network of verified legal professionals, enabling users to:

- Get **instant AI analysis** of legal documents — contracts, agreements, notices, and more
- **Connect with qualified lawyers** for personalized consultations
- Access **transparent pricing** and seamless appointment booking
- Upload documents securely with **end-to-end encrypted storage**

---

## ✨ Features

### For Users
| Feature | Description |
|---------|-------------|
| **AI Document Analysis** | Upload legal documents for instant, plain-language explanations |
| **Smart Chat Assistant** | Ask legal questions and get AI-powered guidance 24/7 |
| **Lawyer Marketplace** | Browse verified lawyers by specialization, rating, and price |
| **Secure Document Upload** | OCR support for images and scanned documents |
| **Case History** | Track all interactions, consultations, and documents |

### For Lawyers
| Feature | Description |
|---------|-------------|
| **Professional Dashboard** | Manage clients, cases, and consultations in one place |
| **Calendar Management** | Schedule and track client meetings efficiently |
| **Client Communication** | Built-in messaging and consultation scheduling |
| **Performance Analytics** | Track engagement, ratings, and consultation metrics |
| **Profile Management** | Showcase expertise, certifications, and availability |

---

## 🛠 Tech Stack

### Backend
- **Framework:** Django 5.x + Django REST Framework
- **Database:** PostgreSQL via Supabase
- **Auth:** JWT (SimpleJWT) with access/refresh token rotation
- **AI Engine:** Google Gemini API for document analysis & chat
- **Storage:** Supabase Storage with Row-Level Security
- **Server:** Gunicorn with Docker support

### Frontend
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS with custom design system
- **UI Library:** Radix UI primitives + custom Shadcn/ui components
- **State:** React Hooks + Context API
- **HTTP:** Axios with token interceptors

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ &nbsp;|&nbsp; **Python** 3.12+ &nbsp;|&nbsp; **PostgreSQL** (or Supabase account)

### Backend

```bash
cd backend

# Virtual environment
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate

# Install & configure
pip install -r requirements.txt
cp .env.example .env             # Edit with your credentials

# Database & server
python manage.py migrate
python manage.py runserver 8000
```

### Frontend

```bash
cd frontend

# Install & configure
npm install
echo "VITE_API_URL=http://localhost:8000" > .env

# Start dev server
npm run dev
```

> **Frontend** runs at `http://localhost:3000` &nbsp;|&nbsp; **API** at `http://localhost:8000`

### Environment Variables

| Variable | Purpose |
|----------|---------|
| `SUPABASE_URL` | Database connection URL |
| `SUPABASE_KEY` | Supabase service key |
| `GEMINI_API_KEY` | Google Gemini API key |
| `SECRET_KEY` | Django secret key |
| `ALLOWED_HOSTS` | CORS allowed domains |

---

## 📁 Project Structure

```
apna-lawyer/
├── backend/
│   ├── apna_lawyer/       # Django project settings & config
│   ├── users/             # Authentication, profiles, JWT
│   ├── lawyers/           # Lawyer profiles & listings
│   ├── chats/             # AI chat & document processing
│   ├── db/                # Database utilities
│   ├── tests/             # Test suite
│   ├── Dockerfile         # Container config
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/    # UI components (auth, dashboard, navigation)
│   │   ├── services/      # API clients & auth service
│   │   ├── hooks/         # Custom React hooks (useAuth)
│   │   ├── types/         # TypeScript type definitions
│   │   └── styles/        # Global CSS
│   ├── vite.config.ts
│   └── package.json
│
└── README.md
```

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/signup/` | Public | Register new user |
| `POST` | `/api/login/` | Public | Login & receive JWT tokens |
| `POST` | `/api/logout/` | 🔒 | End session |
| `GET` | `/api/profile/` | 🔒 | Get user profile |
| `PUT` | `/api/profile/` | 🔒 | Update profile |

### Chat & Documents
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/chats/api/` | 🔒 | Send message to AI assistant |
| `GET` | `/chats/chat/history/` | 🔒 | Retrieve chat history |
| `POST` | `/chats/extract-text/` | 🔒 | Extract text from image |
| `POST` | `/api/extract-doc/` | 🔒 | Extract document content |
| `POST` | `/api/ocr-image/` | 🔒 | OCR image processing |

### Lawyers
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/lawyers/` | 🔒 | List all lawyers |

> 🔒 = Requires `Authorization: Bearer <access_token>` header

---

## 🚢 Deployment

### Docker
```bash
docker-compose up -d
```

### Render
```bash
# Configured in render.yaml — push to trigger auto-deploy
git push origin main
```

---

## 🧪 Testing

```bash
# Backend
cd backend
pytest                              # Run all tests
pytest --cov=. --cov-report=html    # With coverage

# Frontend
cd frontend
npm run build                       # Type-check & build validation
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch — `git checkout -b feature/your-feature`
3. Commit changes — `git commit -m 'Add feature'`
4. Push to branch — `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is proprietary and confidential. All rights reserved.

---

