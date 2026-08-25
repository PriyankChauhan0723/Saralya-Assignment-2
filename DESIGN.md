# Design & Architectural Defense: The Collections Command Centre

This document outlines the architectural decisions, operational trade-offs, UX rationale, and mathematical formulations behind **SaralCollect Assignment 2**.

---

## 1. Dual-Persona Architecture: Ravi vs. Meena

In frontline credit operations, managers and agents operate under fundamentally different cognitive constraints and decision horizons:

| Dimension | Ravi (Collections Manager, Ahmedabad) | Meena (Frontline Telecaller) |
| :--- | :--- | :--- |
| **Time Horizon** | 4-minute decision window (09:15 AM stand-up) | <10 seconds per connected phone call |
| **Scale of View** | Macro portfolio (25,000 overdue loans, ₹63.35 Cr) | Micro individual (1 borrower on active line) |
| **Hardware Constraint**| Laptop at desk or smartphone in car | 1366×768 laptop with 11 other browser tabs open |
| **Core Question** | *"Where do I point the 2,000-call floor today, and what changed since yesterday?"* | *"Who is this, why are they in this cohort, what can I offer them, and what if they commit ₹5,000?"* |

### How Our Layout Answers Both Personas

1. **Ravi's Layout (Macro Command Deck)**:
   - Placed at the top of the portal when the **Ravi (Floor Lead)** persona is selected.
   - Summarizes total book risk (₹63.35 Cr), overnight net deterioration (+184 accounts), and optimal call distribution in a high-contrast executive banner.
   - Features a **1-Click Strategy Deployer (CSV)** and an **Executive Mobile Pulse Drawer** specifically styled for triage from the car.

2. **Meena's Layout (10-Second Frontline Cockpit)**:
   - Triggered instantly when clicking any borrower row or pressing `Enter`.
   - Uses a **3-Second Hero Snapshot** containing Name, DPD, Principal Arrears, and Score meters.
   - Replaces the 13-factor data dump with a **Factor Impact Waterfall** isolating the top 3 drivers (why they can pay) and top 3 inhibitors (what is blocking them).
   - Features an interactive **What-If Score Simulator** with live visual trajectory feedback on a mini 3x3 grid.

---

## 2. Mathematical Defense of the Default Calling Order: Recovery Velocity Priority ($RVP$)

The brief asks:
> *"Whatever ordering you present this list in IS the calling order for the day. Decide what that default ordering should be and defend it. 'Whatever the API returned' is an answer, but it is a bad one."*

### Why Naive Sorting Fails in Collections Operations
- **Sorting Purely by Outstanding Principal (Balance DESC)**: Telecallers spend their limited morning minutes calling massive, uncollectable "Lost Causes" (e.g. 150+ DPD fraud cases) who never convert, resulting in near-zero recovery yield.
- **Sorting Purely by Intent (Intent DESC)**: Telecallers call high-intent borrowers (e.g. *Oops* accounts) who were already going to pay through automated WhatsApp reminders, burning expensive agent capacity.

### Our Strategy: Recovery Velocity Priority ($RVP$)
We engineered **Recovery Velocity Priority ($RVP$)** to maximize expected cash recovery per telecaller minute:

$$RVP_i = \text{Outstanding}_i \times \text{ConversionProbability}(I_i, A_i) \times \text{BoundaryTippingFactor}(I_i) \times \text{Contactability}_i \times \text{UrgencyDecay}(\text{DPD}_i)$$

Where:
1. **$\text{ConversionProbability}(I_i, A_i)$**: A sigmoid response function weighted 60% towards Intent and 40% towards Ability:
   $$P(\text{Conversion}) = \frac{1}{1 + e^{-6 \times (0.6 I_{\text{norm}} + 0.4 A_{\text{norm}} - 0.5)}}$$
2. **$\text{BoundaryTippingFactor}(I_i)$**: Accounts within $\pm 5$ points of band thresholds ($35-44$ and $65-74$) receive a **$1.4\times$ multiplier**. A single telecaller nudge on a fence-sitter produces the highest marginal conversion yield.
3. **$\text{Contactability}_i$**: Valid primary mobile numbers receive a $1.0\times$ weight; invalid numbers are penalized with $0.4\times$ to avoid floor idle time.
4. **$\text{UrgencyDecay}(\text{DPD}_i)$**: Loans in the 1–30 DPD bucket receive a $1.3\times$ multiplier to prevent roll rates from escalating into deep non-performing assets (NPAs).

---

## 3. Section 2.5: The Unspecified "Morning Floor Director"

The brief states:
> *"Ravi's four-minute morning question - 'what changed since yesterday, and where do I point the floor' - is not answered by anything in 2.1 to 2.4. Design and build your answer to it."*

### What We Built & Why
We designed and implemented **Ravi's 4-Minute Morning Floor Director (`src/components/ravi/`)**, consisting of two core engines:

### A. Day-over-Day Drift & Inflow/Outflow Cohort Migration Matrix
- **The Problem**: Ravi cannot see overnight portfolio decay or roll rates from a static 3x3 grid snapshot.
- **Our Solution**:
  - Compares the today 09:00 snapshot against yesterday's close.
  - Highlights **Net Deteriorated Accounts (+184)** and **Net Cured Accounts (-92)**.
  - Flags **Top Attention Cohorts** (e.g. *Fence-Sitter* gained +90 accounts due to early DPD roll-ins).
  - Explicit Inflow/Outflow tracking per cell.

### B. 2,000-Call Capacity Allocation Optimizer
- **The Problem**: Ravi has 25,000 delinquent accounts but only 2,000 agent-calls of capacity. Assigning calls evenly across 9 cells wastes 60% of agent capacity on automated or legal cohorts.
- **Our Solution**:
  - Linear optimization algorithm allocating the 2,000 calls to maximize Expected Recoverable Amount ($\text{ERA} = \text{₹}2.84\text{ Cr}$).
  - Automatically routes **45% (900 calls)** to *Fence-Sitters*, **25% (500 calls)** to *Cashflow Crunch*, and **20% (400 calls)** to *Procrastinators*.
  - Zeros out agent calls for *Oops* (100% automated WhatsApp links) and *Wilful Defaulters* (Legal Desk), saving thousands of agent minutes daily.
  - Includes a 1-Click **"Deploy Queue to Floor (CSV)"** export button.

---

## 4. Departures from the Brief & Design Rationale

1. **Factor Breakdown: Impact Waterfall vs. Flat Table**:
   - *Brief*: "The factor breakdown is thirteen factors... Dumping all thirteen into a table is technically correct and operationally useless."
   - *Our Departure*: We transformed the 13 factors into a **Top 3 Positive Drivers vs. Top 3 Negative Inhibitors** waterfall ranked by normalized impact $|(Score - 50) \times Weight|$. We segregated unobserved factors into a dedicated "Neutral Baseline" section. The full 13-row table is preserved behind a collapsible drawer for compliance audits.

2. **Color-Blind Dual-Coding for Routing Lanes**:
   - *Brief*: Mentions 1 in 12 Indian men is red-green color-blind and routing lanes were previously teal, amber, red.
   - *Our Departure*: We replaced pure red with **Deep Indigo / Violet** for ML+LLM Review and dual-coded every lane with geometric symbols (`●` Circle for Rule-Based, `◆` Diamond for ML, `⬡` Hexagon for ML+LLM Review). Color is never the sole carrier of meaning.

3. **Sub-10,000 Rupee Precision**:
   - *Our Departure*: Standard compact formatters turn ₹5,400 into "₹5.4 k". For telecallers negotiating small token installments on the phone, exact rupee amounts matter. We tuned the compact formatter so amounts below ₹10,000 display in full Indian numbering (`₹5,400`), while larger balances format in Lakhs and Crores (`₹14.23 L`, `₹1.50 Cr`).

---

## 5. Frontline Usability Protocol: What to Test with Real Telecallers

Before rolling out to 100+ telecallers in Ahmedabad, we would execute the following operational testing protocol:

1. **Sub-10-Second Cognitive Comprehension Test**:
   - *Methodology*: Give 5 telecallers 10 simulated borrower profiles with a 10-second timer per card.
   - *Success Metric*: $\ge 90\%$ accuracy in stating the correct allowed offer (e.g. "Grace Period up to 4 days; no OTS allowed") without scrolling.
2. **What-If Slider Tactile Feedback during Live Audio Calls**:
   - *Methodology*: Observe telecallers using the simulator while actively speaking with a simulated borrower over softphone headsets.
   - *Success Metric*: Agent can adjust the slider to ₹5,000 with one hand and read the resulting cohort unlock message within 2 seconds without pausing their speech.
3. **1366×768 Viewport & Screen Glare Resilience**:
   - *Methodology*: Test the interface on standard low-end 1366×768 TN laptop panels under fluorescent call center lighting.
   - *Success Metric*: Zero horizontal scrollbars; contrast ratios $\ge 4.5:1$ across all text elements.
4. **Keyboard-Only Traversal Speed**:
   - *Methodology*: Measure time taken by experienced telecallers to navigate between 20 accounts using `j`/`k` and `Enter` versus mouse clicking.
   - *Target*: 35% reduction in call logging cycle time.
