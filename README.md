# SaralCollect: Collections Command Centre (Assignment 2)

An enterprise-grade, high-density operations frontend built in **React 18 (Vite) + TypeScript + Tailwind CSS** designed specifically for the dual operational personas of NBFC/MFI collections: **Ravi (Collections Manager)** and **Meena (Telecaller)**.

---

## 1. Quickstart & How to Run

### Prerequisites
- **Node.js**: v18+ or v20+
- **Assignment 1 Backend** (Optional, running on `http://localhost:3000` with PostgreSQL)

### Installation & Launch
```bash
# 1. Navigate to the Assignment 2 frontend directory
cd "Saralya Assignment-2"

# 2. Install dependencies
npm install

# 3. Launch Vite Development Server (with dev proxy to :3000)
npm run dev
```

The application will be live at: **`http://localhost:5173`**

### Running Automated Test Suites
```bash
npm test
```

---

## 2. Live API vs. Fixture Mapping

The application features an auto-detecting **Dual Data Connector (`src/api/connector.ts`)** that seamlessly connects to the live Assignment 1 backend when online, and gracefully falls back to frozen fixture bundles (`fixtures/*.json`) when offline or in demo mode:

| Component / Action | Assignment 1 Backend Endpoint | Offline Fixture Fallback |
| :--- | :--- | :--- |
| **3x3 Nine-Box Grid** | `GET /v1/cohorts/summary` | `src/api/fixtures/summary.json` |
| **Drill-Down Borrower List** | `GET /v1/cohorts/:key/borrowers` | `src/api/fixtures/borrowers_sample.json` (+ in-memory generator) |
| **Meena's Borrower Detail** | `GET /v1/borrowers/:loanId/score` | `src/api/fixtures/scores_sample.json` |
| **PTP What-If Simulator** | `POST /v1/score/simulate` | Client-side mathematical simulation fallback |
| **Ravi's Day-over-Day Drift (2.5)** | Live Drift Calculation Engine | `src/api/fixtures/daily_drift.json` |

*You can manually toggle between Live Backend and Frozen Fixtures at any time using the status badge in the top-right corner.*

---

## 3. Operational Persona Workflows

### 👔 Ravi's Command Deck (Collections Manager)
- **4-Minute Morning Decision Window**: Quantifies overnight portfolio transitions before the 9:15 AM stand-up.
- **Section 2.5 Morning Floor Director**: Day-over-Day Drift & Inflow/Outflow matrix tracking +184 deteriorated and -92 cured accounts.
- **2,000-Call Capacity Allocation Optimizer**: Mathematically distributes the 2,000 daily agent calls across the 25,000 portfolio to maximize Expected Recoverable Amount ($\text{ERA} = \text{₹}2.84\text{ Cr}$).
- **1-Click Floor Strategy Export**: Downloads partitioned dialer queues (CSV).
- **Executive Mobile Pulse View**: Responsive viewport for checking book status from the car.

### 🎧 Meena's Cockpit (Frontline Telecaller)
- **10-Second Cognitive Budget**: Optimized for 1366×768 operations laptops with zero wasted margin.
- **Hero 3-Second Signal**: Borrower Name, Loan ID, Click-to-Dial softphone link, DPD stage, Arrears, and Score meters.
- **Factor Impact Waterfall**: Ranks 13 scorecard factors into **Top 3 Positive Drivers** and **Top 3 Negative Inhibitors** based on $|(Score - 50) \times Weight|$.
- **Honest Missing Data Handling**: Unobserved factors carry distinct neutral badges with clear notes on median baseline imputation.
- **Interactive What-If Simulator**: Live sliders for immediate token payments and PTP commitment dates with visual trajectory vectors and band-crossing alerts (*"Unlocks 7-day Grace Period Offer!"*).

---

## 4. Accessibility & Operations Standards

- **WCAG 2.1 AA Dual-Coding**: Routing lanes use both distinct color-blind safe hues and geometric shapes (`●` Teal Rule-Based, `◆` Amber ML, `⬡` Indigo ML+LLM Review). Color is never the sole carrier of meaning.
- **Full Keyboard Navigation**:
  - `1` – `9`: Direct jump to corresponding 3x3 Grid cell
  - `j` / `k` (or `↓` / `↑`): Traverse virtualized borrower list
  - `Enter` / `Space`: Open Meena's Cockpit
  - `/`: Focus search & filter bar
  - `Esc`: Close open drawers/modals
- **Indian Numbering Throughout**: Formatted strictly in Lakhs and Crores (`₹12.35 L`, `₹1.50 Cr`, `₹12,34,567`).

---

## 5. What Was Not Built & Why

1. **Direct WebRTC Softphone Audio Stream**: A clickable `tel:` integration is provided for CRM/softphone auto-dialers. Embedding full WebRTC SIP telephony was omitted as it requires private PBX server credentials outside the assignment scope.
2. **Multi-User Concurrent WebSocket Locking**: In production, two telecallers dialing the same borrower simultaneously requires distributed Redis row-level locking. In this client, optimistic UI state is used.
