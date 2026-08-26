# Scientific Inquiry Platform (Gamified Inquiry Platform)

Cultivating Original & Creative Scientific Thinking in the Era of AI.

The **Scientific Inquiry Platform** is a full-stack web application designed to empower STEM students to move from passive reading toward active, hypothesis-driven inquiry. Students interact with scientific learning content (text, formulas, and diagrams), attach questions directly to selected context, receive instant AI-powered quality evaluations (1–10 score, tier, and pedagogical micro-explanation), and track their personal cognitive progress on the Individual Curiosity Dashboard.

---

## 🌟 Core Features

1. **Contextual Question Capture**:
   - Highlight text passages directly from scientific articles.
   - Select LaTeX equations/formulas (e.g. Vibronic Hamiltonian, Kinetic Isotope Effects).
   - Click scientific diagrams (e.g. Chlorophyll Coherence Pathways, Active Site Distance Compression).
2. **Instant AI Micro-Explanations**:
   - Scores questions on a 1–10 scale across **Originality**, **Mechanistic Depth**, and **Reasoning Rigor**.
   - Generates 1–2 sentence pedagogical micro-explanations illuminating the intellectual significance of each question.
3. **Strict Score-to-Tier Framework**:
   - **1–4 — Good**: Fact-seeking & Recall (Baseline definitions and direct mechanisms).
   - **5–7 — Excellent**: System Dynamics (Cause-and-effect and variable relationships).
   - **8–9 — Genius**: Edge Cases & Anomalies (Boundary conditions and non-obvious trade-offs).
   - **10 — Einstein**: First-Principles Synthesis (Cross-domain bridging and novel thought experiments).
4. **Individual Curiosity Dashboard**:
   - Visual breakdown of Tier Distributions (Good through Einstein).
   - Average Originality metric tracking over time.
   - Inquiry Trends across scientific disciplines.
   - Gamified progression, milestones, and active streak mechanics (including the **"Einstein Streak"** badge for consistent high-order inquiries).
5. **Database-Ready Repository Architecture**:
   - Built using a clean repository pattern (`InquiryRepository` interface) backed by an in-memory session store.
   - **No real database** is currently configured (per requirement #2). Future ORM/database integration requires zero UI or business logic modifications.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Installation
```bash
# 1. Install dependencies
npm install
```

### Environment Variables (Optional)
Copy `.env.example` to `.env`:
```env
PORT=3001
GEMINI_API_KEY=your_gemini_api_key_here
EINSTEIN_STREAK_MIN_SCORE=8
EINSTEIN_STREAK_COUNT=3
```
*Note: If `GEMINI_API_KEY` is omitted, the platform automatically switches to a built-in intelligent heuristic evaluator so all features work out-of-the-box for testing and demonstration.*

### Running the Application
To launch both the **Express Backend (Port 3001)** and **Vite Frontend (Port 5173)** simultaneously:
```bash
npm run dev
```

Open your browser at: **`http://localhost:5173`**

---

## 🏗 System Architecture

```
project1/
├── server/                          # Express Backend Layer
│   ├── config/env.js                # Environment configuration
│   ├── repository/                  # Data access interface & in-memory store
│   │   └── inquiryRepository.js     # InquiryRepository interface + InMemory implementation
│   ├── services/                    # Core business logic
│   │   ├── aiEvaluationService.js   # LLM API adapter + score normalizer + fallback
│   │   ├── gamificationService.js   # Streaks, Einstein Streak badge, milestones
│   │   └── contentService.js        # STEM articles, formulas, and diagrams
│   ├── routes/api.js                # REST API endpoints
│   └── index.js                     # Express server entry point
├── src/                             # React Frontend Layer (Vite)
│   ├── components/
│   │   ├── Navbar.jsx               # Navigation bar & streak widget
│   │   ├── ContentReader.jsx        # Article reader with text/formula/diagram capture
│   │   ├── ContextCard.jsx          # Active attached context preview card
│   │   ├── QuestionForm.jsx         # Question input, validation, and inspiration chips
│   │   ├── EvaluationResult.jsx     # AI 1-10 score gauge, tier badge, micro-explanation
│   │   ├── InquiryWorkspace.jsx     # Workspace container
│   │   ├── CuriosityDashboard.jsx   # Analytics dashboard with charts & milestone timeline
│   │   └── Toast.jsx                # Friendly error notifications
│   ├── services/apiClient.js        # Centralized HTTP API client
│   ├── App.jsx                      # Main application shell
│   └── index.css                    # Modern slate UI styles & tier themes
├── package.json
└── vite.config.js                   # Proxy /api -> http://localhost:3001
```

---

## 📡 API Contract Specification

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Backend status check |
| `GET` | `/api/content` | List available scientific topics |
| `GET` | `/api/content/:id` | Fetch specific topic with formulas & diagrams |
| `POST` | `/api/evaluate` | Submit context + question -> Return validated 1–10 score, tier, micro-explanation, and streak state |
| `GET` | `/api/dashboard` | Return session inquiry summary, tier distributions, discipline trends, milestones, and streak data |
| `POST` | `/api/reset` | Reset current session inquiry data |

---

## 🧪 Verification & Testing Checklist

- [x] **Text Context Capture**: Select text in article -> ContextCard displays snippet -> Submit question -> Backend evaluates.
- [x] **Formula Context Capture**: Click LaTeX equation -> ContextCard displays equation -> Submit question -> Backend evaluates.
- [x] **Diagram Context Capture**: Click visual diagram -> ContextCard displays diagram -> Submit question -> Backend evaluates.
- [x] **Score & Tier Mapping**: Enforces 1–4 (Good), 5–7 (Excellent), 8–9 (Genius), 10 (Einstein).
- [x] **Micro-explanation Display**: Verified 1–2 sentence pedagogical explanation displayed on result card.
- [x] **Curiosity Dashboard**: Switch to Dashboard -> Verify KPI cards, Tier Distribution bar chart, Discipline Trends, Milestones, and Einstein Streak badge.
- [x] **Validation & Error Handling**: Test empty question, missing context, and rapid double-submit prevention.
