# E-Konek: Hybrid Waste Management Platform
**Strategic & Technical Implementation Plan**

---

## 1. Executive Summary: The Hybrid Model

E-Konek will pivot from a simple tracking app to a **Hybrid Logistics Platform** that serves two distinct functions based on the type of waste service required:

1.  **Public Service Layer (Free):** For standard, scheduled garbage collection provided by the Local Government Unit (LGU). The goal here is **efficiency and transparency**.
2.  **Gig Economy Layer (Monetized):** An "On-Demand" booking service for bulk waste, special pickups, and recyclables. The goal here is **convenience and revenue**.

---

## 2. The Core Distinction: Worker Roles

To support this hybrid model, the system must distinguish between two types of collectors.

### A. Government Workers (LGU / CENRO)
* **Role:** Official city employees.
* **Motivation:** Compliance and salary (Fixed income).
* **Operational Behavior:**
    * Follow strict, pre-defined routes (e.g., "Tuesday: Barangay Poblacion").
    * Do **not** accept individual booking requests (it disrupts their route).
    * **App Function:** Uses the app solely to **Broadcast Location** so residents know when to bring out trash.

### B. Freelancers (Eco-Warriors)
* **Role:** Private individuals with vehicles (Multicabs, Tricycles, Small Trucks) or Junk Shop partners.
* **Motivation:** Income per trip (Gig economy).
* **Operational Behavior:**
    * On standby for specific requests.
    * Accept/Decline jobs based on price and location.
    * **App Function:** Uses the app to **Find Jobs** and earn money.

---

## 3. Operational Flows

### Scenario A: The Regular Tuesday Collection (Government)
1.  **LGU Driver** logs in. The app detects `workerType: 'government'`.
2.  Driver sees a big **"Start Route"** button. No job queue, no earnings panel.
3.  Driver clicks "Start". The app broadcasts their location to the map.
4.  **Residents** get a notification: *"City Truck is entering your street."*
5.  Residents bring out standard waste. **No fee is charged.**

### Scenario B: The "Bulk Waste" Request (Freelancer)
1.  **Resident** has renovation debris or a broken fridge.
2.  Resident selects **"Special Pickup"** in the app.
3.  App estimates fee: **₱200.00**. User confirms.
4.  **Freelancer** (nearby) gets a "Job Offer" notification: *"Bulk Pickup: Earn ₱160"*.
5.  Freelancer accepts, picks up items, and gets paid (Cash or Digital).
6.  **E-Konek** records the transaction for commission.

---

## 4. Monetization Strategy

| Stream | Source | Description |
| :--- | :--- | :--- |
| **Transaction Fees** | **B2C** | 20% commission on every "Special Pickup" booking (Freelancer route). |
| **Junk Shop SaaS** | **B2B** | Monthly subscription for Junk Shops to access "Recyclable Heatmaps" (High-yield route optimization). |
| **LGU Dashboard** | **B2G** | Annual software license for Barangays to use the Admin Dashboard for RA 9003 compliance reporting. |

---

## 5. Technical Implementation Guide

### Phase 1: Database & Auth Updates
**Goal:** Distinguish worker types in the system.

1.  **Update Data Structure (`src/users.json` / Database):**
    * Add `workerType`: `'government'` | `'freelancer'`.
    * Add `vehicleType`: `'truck'`, `'multicab'`, `'tricycle'`.
    * Add `earnings_wallet`: `Float` (for Freelancers).

### Phase 2: Collector Interface Logic (`CollectorPage.jsx`)
**Goal:** Render different UIs based on `workerType`.

* **Logic:**
    ```javascript
    // Conceptual Logic
    if (user.workerType === 'government') {
       return <BroadcastView />; // Only "Start/Stop Tracking" button
    } else {
       return <GigView />; // "Job Queue", "Accept/Decline", "Earnings"
    }
    ```
* **New Components:**
    * `BroadcastPanel`: Simple toggle for LGU drivers.
    * `EarningsCard`: Displays daily income for Freelancers.

### Phase 3: User Request Flow (`UserPage.jsx`)
**Goal:** Handle the payment logic for special requests.

* **Update `WasteTypeSelector`:**
    * Add option: **"Bulk / Special Pickup"**.
* **Update `handleRequestPickup`:**
    * If `Bulk` is selected -> Show **Price Estimate Modal**.
    * If `Standard` is selected -> Check schedule -> Alert user if truck is not active.

### Phase 4: Vetting & Security (`Signup.jsx`)
**Goal:** Prevent unverified freelancers from entering homes.

* **Logic:**
    * Freelancer signup status defaults to `pending`.
    * Admin must approve account after reviewing uploaded ID/License.
    * Add "Upload ID" step to registration form.

---

## 6. Gamification: Barangay Leaderboards
**Goal:** Drive adoption through community pride.

* **Metrics:**
    1.  **Responsiveness:** Average pickup time.
    2.  **Cleanliness:** Fewest uncollected reports.
    3.  **Green Score:** Volume of recyclables diverted.
* **Display:**
    * **Landing Page:** Public ticker ("Top 3 Barangays").
    * **Admin Dashboard:** Detailed breakdown for officials.

---

## 7. Action Items Checklist

- [ ] **Database:** Add `workerType` field to user schema.
- [ ] **Frontend (Collector):** Create `BroadcastView` (Gov) vs `GigView` (Freelancer).
- [ ] **Frontend (User):** Add Pricing Modal for Bulk Requests.
- [ ] **Frontend (Admin):** Add "Approve Freelancer" table in User Management.
- [ ] **Marketing:** Pitch "Income Opportunity" to local tricycle/multicab drivers.