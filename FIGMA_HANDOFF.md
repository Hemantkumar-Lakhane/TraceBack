# TraceBack: Figma Handoff Specification

This document serves as the exact specification for the UI/UX designer to begin creating Low-Fidelity and High-Fidelity designs in Figma. Do not design all screens randomly; follow the priority queue below to build out the core journey first.

## 1. Frame Sizes & Breakpoints

Design every screen for both Desktop and Mobile. Tablet can be derived dynamically unless a specific layout is required.

*   **Desktop**: `1440 x 1024` (Standard Desktop)
*   **Mobile**: `390 x 844` (iPhone 14 / Modern Smartphone)
*   **Grid System**: 8pt grid structure (8, 16, 24, 32px spacing). Use a 12-column grid for Desktop, 4-column grid for Mobile.

## 2. Core Visual Requirement (The Golden Path)

The primary goal of the UI is to make the core lifecycle visually obvious and prominent:
**`Lost → Match → Chat → Claim → Verify → Return`**

*Design Suggestion:* Incorporate a visual pipeline, progress tracker, or explicit visual cues on the Dashboard and Match screens so the user always knows exactly where they are in this flow. Secondary features (like system statistics) should be visually deprioritized.

## 3. Figma Component Library (Design these first)

Before designing full frames, create these reusable Figma components (with auto-layout and variants):

### Foundation
*   **Colors & Typography**: (See `PHASE3_UIUX.md` for Trust Blue, Slate Gray, Emerald Green, Amber, Rose Red).
*   **Buttons**: Primary, Secondary, Outline, Danger (States: Default, Hover, Disabled, Loading).
*   **Inputs**: Text field, Dropdown, Date Picker, File/Image Upload area (States: Default, Active, Error).
*   **Badges**: Status badges (OPEN, MATCHED, VERIFYING, RETURNED).

### Complex Components
*   **ItemCard**: Standard grid card showing image, title, location, date, and status badge.
*   **MatchCard**: Side-by-side comparison card (Lost Item vs. Found Item) with a Match Score indicator (e.g., 85%).
*   **ChatBubble**: Left (Them) and Right (Me) variants, with timestamp.
*   **Navigation**: Desktop Sidebar, Mobile Header + Hamburger Menu.

---

## 4. Screen Design Priority Queue

Design the screens in the exact order below.

### Priority 1: The Core Student Journey (MVP Foundation)
1.  **Landing Page**: Hero section, value proposition, Login/Register call-to-action.
2.  **Login / Register**: Clean authentication forms.
3.  **Student Dashboard**: Must prominently feature the visual pipeline/status of current items and "Action Needed" alerts for matches.
4.  **Report Lost / Found Form**: Clear, stacked inputs with an easy image upload area.
5.  **Browse / Search Reports**: Grid layout with a sidebar (desktop) or sticky header (mobile) for filters.
6.  **Report Details**: Full view of a single item.
7.  **Match Details**: Side-by-side visual comparison allowing the user to "Accept Match".
8.  **Chat (Conversation)**: WebSocket chat interface with status banner.
9.  **Claim Form**: Form to answer verification questions.
10. **Claim Status**: View showing the claim is pending Security review.

### Priority 2: The Security Workflow
11. **Security Dashboard**: Focused heavily on actionable items (Pending verifications).
12. **Pending Claims List**: Data table or list of claims awaiting review.
13. **Claim Verification View**: Side-by-side of Student's claim answers vs. original Found Item details.
14. **Approve / Reject Action Modal**: Final step to mark the item as `RETURNED`.

### Priority 3: Admin Workflow
15. **Admin Dashboard**: System statistics and high-level platform health.
16. **User Management**: Data table of users with roles.
17. **Moderation Queue**: Interface to flag or delete inappropriate posts.

## 5. Handoff Checklist for React Developers
Once the Figma designs are complete, ensure the following are ready for the developers:
*   [ ] Figma link with developer handoff mode enabled.
*   [ ] All icons and specific graphical assets exportable as SVG.
*   [ ] Empty states, loading states (skeletons), and error states designed for the core journey.
*   [ ] Mobile and Desktop variations completed for all Priority 1 screens.
