# Industrial Equipment Inspection System

A resilient, offline-tolerant inspection reporting system built with **React**, **TypeScript**, and **Express**. Designed for warehouse inspectors operating on unreliable Wi-Fi networks, with local draft recovery and idempotent report submission.

---

## 🚀 How to Run the Project

Run the backend and frontend in two terminal windows:

### 1. Start Mock Server (Port 3000)
```bash
cd "mock backend"
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
- **Continuous Auto-Save:** Every field change is synced to browser `localStorage` keyed by the form schema ID (`inspection_draft_forklift-check`).
- **Resilience:** If the inspector accidentally closes the browser tab, refreshes, or loses internet connection, the draft is instantly restored on next visit.
- **Clear After Confirmation:** The draft is cleared only after the server returns a successful HTTP response (`201 Created` or `200 OK`). On network errors, timeouts, or server errors, the draft remains available for retry. Draft recovery depends on browser `localStorage` remaining available and intact.

### 2. Safe Submit (Guaranteed Idempotency)
- **Unique Idempotency Key:** When a draft session begins, a unique UUID (`X-Idempotency-Key`) is generated and persisted in `localStorage`.
- **Multiple Submissions Handled Gracefully:** The button is intentionally not disabled on the client, allowing inspectors to press submit repeatedly or retry freely—the server idempotency key guarantees that duplicate reports are never created.
- **Retry Safety (Preventing Duplicates):** On unreliable Wi-Fi or server timeouts (including the simulated ~15% failure that occurs *after* persistence), re-submitting sends the exact same `X-Idempotency-Key`.
- **Backend Deduplication:** The mock backend tracks processed keys in memory (`processedKeys`). If a request arrives with an already-processed key, it returns the existing report (`200 OK`) rather than creating another. Because this storage is in memory, idempotency records do not survive a backend restart.
- **Key Rotation:** Only after a verified successful submission is a new idempotency key generated for the next inspection.

### 3. Dynamic JSON Form Engine & Validation
- **Schema-Driven UI:** The form is rendered from the JSON definition (`frontend/src/data/form-schema.json`).
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

3. **Persistent Database**
   - Migrate in-memory storage to a production database (PostgreSQL or MongoDB).

---

## 🤖 AI Tools Disclosure

- **Claude:** Used for assistance with application logic.
- **Gemini and Stitch:** Used for UI design and direction.
- **Gemini Flash 3.8:** Used to apply the UI in the frontend.
- **Review:** AI-assisted contributions and the resulting implementation are available for review during the technical walkthrough.
