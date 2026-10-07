# Industrial Equipment Inspection System

A resilient, offline-tolerant inspection reporting system built with **React**, **TypeScript**, and **Express**. Designed for warehouse inspectors operating on unreliable Wi-Fi networks to ensure **zero lost drafts** and **zero duplicate submissions**.

---

## 🚀 How to Run the Project

Run the backend and frontend in two terminal windows:

### 1. Start Mock Server (Port 3000)
```bash
cd backend
npm install
npm run dev
```

### 2. Start Frontend App (Port 5173)
```bash
cd frontend
npm install
npm run dev
```

Open your browser at: **`http://localhost:5173`**

---

## 🛡️ Architecture & Key Problem Solving

### 1. Drafts That Survive
- **Continuous Auto-Save:** Every field change is immediately synced to browser `localStorage` keyed by the form schema ID (`inspection_draft_forklift-check`).
- **Resilience:** If the inspector accidentally closes the browser tab, refreshes, or loses internet connection, the draft is instantly restored on next visit.
- **Safe Clearance Guarantee:** The draft is **only cleared after** the server explicitly returns a successful HTTP response (`201 Created` or `200 OK`). In case of network errors, timeouts, or 500 server crashes, the draft remains intact so inspectors never lose work.

### 2. Safe Submit (Guaranteed Idempotency)
- **Unique Idempotency Key:** When a draft session begins, a unique UUID (`X-Idempotency-Key`) is generated and persisted in `localStorage`.
- **Multiple Submissions Handled Gracefully:** The button is intentionally not disabled on the client, allowing inspectors to press submit repeatedly or retry freely—the server idempotency key guarantees that duplicate reports are never created.
- **Retry Safety (Preventing Duplicates):** On unreliable Wi-Fi or server timeouts (including the simulated ~15% failure that occurs *after* persistence), re-submitting sends the exact same `X-Idempotency-Key`.
- **Backend Deduplication:** The backend tracks processed keys using an in-memory set (`processedKeys`). If a request arrives with an already-processed key, the backend returns the existing saved report (`200 OK`) without creating a duplicate record.
- **Key Rotation:** Only after a verified successful submission is a new idempotency key generated for the next inspection.

### 3. Dynamic JSON Form Engine & Validation
- **Schema-Driven UI:** The form is 100% rendered from the JSON definition (`data/form-schema.json`).
- **Supported Fields:** `text`, `number` (with min/max bounds), `select`, `textarea`, and `date`.
- **Conditional Visibility (`showIf`):** Fields like `damageNotes` only render when their condition matches (`condition === "damaged"`).
- **Sanitized Submission:** Hidden fields do not block validation and are stripped from the payload prior to submission (`sanitizeSubmissionPayload`).
- **Bilingual & RTL:** Instant toggle between English (LTR) and Arabic (RTL) with localized field labels and validation error messages.

---

## 🔮 Future Work (With More Time)

1. **Main Feature: Visual Form Builder / Operations Dashboard**
   - Build an intuitive, user-friendly admin dashboard allowing the warehouse operations team to dynamically create, edit, and reorder inspection forms and questions without touching raw JSON files or deploying new code.
   - Support adding custom validation rules (regex, ranges, required toggles) and conditional `showIf` branching via a drag-and-drop interface.

2. **TTL for Idempotency Keys (Distributed Cache)**
   - Replace the in-memory JavaScript `Set` with Redis using a Time-To-Live (TTL, e.g., 24 hours). This prevents memory accumulation over time and supports horizontal scaling across multiple server instances.

4. **Persistent Database**
   - Migrate in-memory storage to a production database (PostgreSQL or MongoDB).

---

## 🤖 AI Tools Disclosure

- **Tools Used:** Antigravity AI (powered by Google DeepMind / Claude / Gemini).
- **Purpose:** Used as an intelligent pair-programming assistant for:
  - Scaffolding project setup, initial Express routes, and Tailwind CSS utility classes.
  - Generating bilingual translation strings (English / Arabic) for UI components.
  - Testing edge cases for idempotency headers and failure simulation logic.
- **Verification:** All core architecture—including the JSON form engine, visibility logic, idempotency key lifecycle, local storage persistence, and mock failure modes—was designed, verified, and can be walked through line-by-line during the technical review.
