# Phase 3: Design Review & Feedback

This document reviews the provided Figma UI design (`TraceBack.pdf`) against the locked technical architecture and UX specifications defined in `PHASE3_UIUX.md`, `FIGMA_HANDOFF.md`, and `PHASE2_DESIGN.md`.

## 1. Screens Currently Designed
The following screens have been successfully designed and capture the core student experience:
1. **Landing Page**
2. **Login / Welcome Back**
3. **Registration / Create Account**
4. **Student Dashboard**
5. **Report a Lost Item**
6. **Browse & Search Reports**
7. **Report Details (Item View)**
8. **Match Details (Side-by-Side Comparison)**
9. **Real-Time Chat**
10. **Submit Claim**
11. **Claim Status / Progression**

## 2. Alignment with Approved UX Specification
* **Aesthetics:** Excellent. The design correctly utilizes the "Trust Blue" primary color, modern sans-serif typography, and clean 8pt grid spacing.
* **Golden Path:** The core student journey (`Lost → Match → Chat → Claim → Verify → Return`) is well-represented.
* **Score Threshold:** The UI correctly shows a match score of "92%", which aligns with our `>= 70` threshold rule.

## 3. Missing MVP Screens & States
The Figma design currently only shows the **Student** perspective. To complete Phase 3, the following role-based screens must be designed:

**Security Workflow (Priority 2):**
* Security Dashboard (Focusing on pending verifications)
* Pending Claims List (Data table of claims to review)
* Claim Verification View (Comparing student answers to the physical item)
* Approve / Reject Action Modal (Marking an item as `RETURNED`)

**Admin Workflow (Priority 3):**
* Admin Dashboard (System statistics and platform health)
* User Management (Viewing registered users)
* Moderation Queue (Flagging/deleting inappropriate reports)

**Other Missing States:**
* **Report Found Item Form** (Though likely identical to the Lost form, it should be explicitly mapped).
* Empty states (e.g., Dashboard with zero active reports).

## 4. Visual/UX Inconsistencies
* **Claim Form (Pickup Logistics):** The UI adds a "Preferred Pickup Date" and "Time Slot" selector. This is a great UX addition, but it is **not** currently in our Database ER diagram (`CLAIM` table). We need to clarify if this will be added to the schema or just appended to the `verification_data` text field.
* **Status Tracker Naming:** The visual tracker uses "Claim Desk Approval" and "Verify Ownership". For implementation, we need to map these cleanly to our backend states (`CLAIM_REQUESTED`, `VERIFYING`, `RETURNED`).

## 5. Terminology Conflicts (LOCKED ARCHITECTURE)

> [!WARNING]
> **CRITICAL: Remove AI/Machine Learning Terminology**
> The UI currently uses phrases that imply AI or complex data clustering. TraceBack uses a strict **deterministic, rule-based matching engine** (Category + Location + Date). 

**Required UI Text Corrections:**
* **Landing Page:** Change *"Our automated system continuously compares reports against found assets using smart location clusters."* 
  **→ To:** *"Our automated system compares reports using rule-based matching across categories, locations, and timelines."*
* **Match Details Screen:** Change *"Our automated cluster match has discovered..."* 
  **→ To:** *"Our automated matching engine has discovered..."*
* **Match Indicators:** The UI lists "Key Features" as a match indicator. Our algorithm is strictly locked to `Category (40)`, `Location (30)`, and `Timeline (30)`. Please remove "Key Features" from the match criteria checklist to accurately reflect the backend.

## 6. Features Outside the MVP
* **Landing Page Statistics:** The UI shows "2,847 Items returned" and "94% Recovery rate". Because this is a fresh academic project MVP, these statistics imply a massive active system. 
  * *Correction:* Either remove this statistics banner for a cleaner MVP look, or explicitly label them as "Demo Statistics" in the codebase.

## 7. VIT / Campus Context Updates
To ensure the project feels like a tailored campus solution for VIT (or the target university), make the following copy updates:
* **Registration/Login:** Change generic `student@university.edu` placeholders to `student@vitstudent.ac.in` or `student@vit.ac.in`.
* **Locations:** Change generic placeholders like "Engineering Building", "Library Basement", and "Student Union" to authentic campus landmarks (e.g., `SJT`, `TT`, `PRP`, `Food Court`, `Central Library`).

## 8. Clarifications Required Before Implementation
1. **Pickup Logistics:** Do we update the `CLAIM` database table to store the `pickup_date` and `pickup_time`, or should the React frontend stringify this data into the existing `verification_data` text column? (Stringifying is easier for the MVP).
2. **Security vs Admin Distinction:** Ensure that when designing the missing Security screens, they do *not* have access to User Management, and Admin does *not* have access to Claim Approvals.

---
**Status:** APPROVED AND COMPLETED. All UX decisions, constraints, Security/Admin specifications, and final workflow consistency corrections have been successfully applied to the documentation. Phase 3 is officially signed off.
