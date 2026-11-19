# TraceBack

## Phase 3 — Complete UI/UX Specification

This document defines the user experience, screen inventory, component architecture, and design language for the TraceBack MVP. It serves as the blueprint for all frontend React implementation.

### 1. UX Goals
The TraceBack experience is optimized for:
* **Fast Reporting**: Forms must be intuitive, requiring minimal clicks, clear validation, and simple image uploads.
* **Easy Searching**: Powerful filtering capabilities based on category, date, and location.
* **Clear Match Discovery**: Highlighting potential matches vividly to draw user attention immediately.
* **Trust and Verification**: Ensuring the claim process feels secure, formal, and authoritative.
* **Simple Communication**: WhatsApp-style, low-friction chat interface focused strictly on item recovery.
* **Clear Status Tracking**: Visual pipelines (like e-commerce order tracking) for item lifecycle (Report → Match → Chat Verification → Security Review → Ownership Verified → Return Complete).

---

### 2. User Journeys

#### Student Reporting a Lost Item
1. Logs in and clicks "Report Lost Item".
2. Fills out form (Category, Name, Date, Location, Image).
3. Submits form → System immediately shows "Saving..." then runs the Match Engine.
4. Redirected to Dashboard. If a match is found instantly, a notification is generated.

#### Student Discovering a Match
1. Receives notification (in-app or visually on Dashboard).
2. Clicks notification.
3. Opens the Match Details screen, reviews the potential match, and starts Chat Verification.

#### Student Chatting and Claiming
1. In Match Details, clicks "Message Finder".
2. Chat modal/page opens. Asks clarifying questions ("Is there an ID card inside?").
3. Satisfied, the student clicks "Submit Claim".
4. Fills out verification questions and submits. State changes to "Verifying".

#### Security Verifying and Returning an Item
1. Security logs in, sees "Pending Claims" alert on Dashboard.
2. Clicks claim → Reviews student answers vs. physical item.
3. Student arrives at security desk with ID.
4. Security clicks "Approve Claim & Mark Returned". Case closed.

#### Admin Managing the Platform
1. Logs in and views System Statistics.
2. Navigates to User Management to audit accounts.
3. Navigates to Moderation Queue to review and delete inappropriate posts.

---

### 3. Sitemap / Navigation

**Student Navigation**
* Home / Dashboard
* Browse Items (Lost / Found)
* Report Item (Lost / Found)
* My Reports
* My Matches & Claims
* Notifications
* Profile

**Security Navigation**
* Security Dashboard
* Manage Found Items
* Pending Claims / Verifications
* Notifications
* Profile

**Admin Navigation**
* Admin Dashboard
* User Management
* Moderation (All Reports)
* System Statistics
* Profile

---

### 4. Complete Screen Inventory

**Auth**
* Landing / Home
* Login
* Registration

**Student App**
* Student Dashboard
* Report Item Form (Reusable for both Lost and Found modes)
* Browse/Search Reports
* Report Details (View Single Report)
* My Reports (List of user's own reports)
* Matches (List of potential matches)
* Match Details
* Chat (Conversation Screen)
* Notifications List
* Claim Form
* Claim Status

**Security App**
* Security Dashboard (Focusing on pending verifications)
* Pending Claims List (Data table of claims to review)
* Claim Verification Details (Side-by-side student answers vs. physical item)
* Approve / Reject Action Modal (Mark item as `RETURNED`)

Note: Security must only handle found items, claim verification, and physical return.

**Admin App**
* Admin Dashboard (System statistics and platform health)
* User Management (View and audit accounts)
* Moderation Queue (Review and delete inappropriate posts)

Note: Admin must only handle platform-level management and MUST NOT approve/reject ownership claims.

---

### 5. Wireframe-Level Layouts

#### General Authenticated Layout
```text
┌─────────────────────────────────────────────────────────────┐
│ Logo  TraceBack       [Search Bar]    🔔 (3)   [Avatar]  ▼ │
├────────────┬────────────────────────────────────────────────┤
│            │                                                │
│  Dashboard │  Main Content Area                             │
│  Reports   │                                                │
│  Matches   │  [ Breadcrumbs: Home > Matches > Match #12 ]   │
│  Claims    │                                                │
│            │  ┌──────────────────────────────────────────┐  │
│            │  │ Title / Header Actions (e.g. + Report)   │  │
│            │  └──────────────────────────────────────────┘  │
│            │                                                │
│            │  [ Grid / Table / Form Content ]               │
│            │                                                │
└────────────┴────────────────────────────────────────────────┘
```

#### Landing Page
* **Visuals**: Clean visual representation of the TraceBack workflow or product-value explanation.
* **Constraints**: Do NOT present invented production statistics (e.g., "2,847 returned", "94%").

#### Dashboard (Student)
* **Header**: Welcome message.
* **Main**: 
  * "Action Needed": Highlighted card if a Match is pending review.
  * "Recent Reports": A grid of 3-4 recently reported items on campus (use authentic campus landmarks).
* **Actions**: Prominent primary button for "Report Item".

#### Browse/Search Reports
* **Sidebar/Top Bar**: Filters (Category Dropdown, Date Range Picker, Status Checkboxes).
* **Main Content**: Grid of `ItemCard` components.
* **Empty State**: "No reports found matching your criteria. [Clear Filters]"

#### Chat Screen
* **Header**: "Chatting regarding: Black Wallet" + Match Status Badge.
* **Main**: Scrollable message area. Left/Right aligned message bubbles.
* **Bottom**: Input field with "Send" button.

#### Security Dashboard
* **Header**: "Security Operations" + Quick Stats (Pending Claims, Items Awaiting Verification, Recently Returned).
* **Main**: 
  * "Action Required": List of claims needing immediate verification.
  * "Recent Returns": Log of items successfully returned.
* **Actions**: Button to "Manage Found Items".

#### Pending Claims List (Security)
* **Top Bar**: Search input, Status filter (Pending, Verifying).
* **Main Content**: Data table with columns: `Claimant`, `Item`, `Match Score`, `Submitted Date`, `Claim Status`, `Priority/Action`.
* **Action**: "Review Claim" button on each row.

#### Claim Verification View (Security)
* **Header**: Claim verification for [Item Name].
* **Layout**: Split screen design.
  * **Left Side (Student Claim)**: Student claim info, ownership verification answers, supporting proof.
  * **Right Side (Found Item)**: Found item details, lost item details.
  * **Match Indicators**: Category (✓), Location (✓), Timeline (✓) + Final match score.
* **Bottom**: Security verification checklist.
* **Actions**: "Approve Claim" (Emerald), "Reject Claim" (Rose).

#### Approve / Reject Modal (Security)
* **Approve Modal**: Confirmation dialog. "Marking this as Approved will set the Claim to APPROVED, Found Report to RETURNED, and Match Record to CLOSED."
* **Reject Modal**: Clear warning state. Requires an optional reason text box before rejection.

#### Admin Dashboard
* **Header**: "Platform Overview"
* **Stats Panel**: User count, Active reports, Total matches, Claims, Returned items, Moderation alerts.
* **Main**: Summary feed of recent system activity and alerts.

#### User Management (Admin)
* **Top Bar**: Search users, Role filter (Student / Security / Admin).
* **Main Content**: Table with columns: `Name`, `Email`, `Role`, `Account Status`, `Action`.
* **Action**: "View/Manage Account".

#### Moderation Queue (Admin)
* **Main Content**: List of reported or inappropriate posts.
* **Details**: Item/report details, Reported user, Reason for flag.
* **Actions**: "Remove/Hide Report", "Dismiss".

---

### 6. Design System

TraceBack will use a clean, modern, and trustworthy aesthetic suitable for a university environment.

* **Colors**: 
  * **Primary**: Deep Trust Blue (`#1D4ED8`) - For primary actions and brand identity.
  * **Secondary**: Slate Gray (`#64748B`) - For secondary text and borders.
  * **Background**: Off-white/Light Gray (`#F8FAFC`) - For application background.
  * **Success**: Emerald Green (`#10B981`) - For returned items, matches.
  * **Warning**: Amber (`#F59E0B`) - For pending claims, verifications.
  * **Danger**: Rose Red (`#E11D48`) - For destructive actions, errors.
* **Typography**: `Inter` or `Roboto` (sans-serif) for high legibility.
* **Spacing**: 8pt grid system (8, 16, 24, 32px).
* **Border Radius**: Medium (`8px` or `0.5rem`) for cards, buttons, and inputs to feel friendly but structured.
* **Shadows**: Subtle drop shadows (`box-shadow: sm, md`) on cards to elevate them from the background.
* **Status Indicators**: Pill-shaped badges with explicit background colors (e.g., `[ VERIFYING ]` in Amber).

---

### 7. Responsive Design
* **Mobile (< 768px)**: 
  * Sidebar collapses into a Hamburger Menu.
  * Data tables convert to stacked card lists.
  * Modals become full-screen dialogs.
  * Forms stack vertically (1 column).
* **Tablet (768px - 1024px)**: 
  * Sidebar can be icon-only or collapsible.
  * 2-column grids for items.
* **Desktop (> 1024px)**: 
  * Persistent sidebar.
  * 3-to-4 column grids.
  * Complex tables with horizontal sorting.

---

### 8. Core UX States
* **Loading**: Skeleton loaders for content (preferable to spinners) to reduce perceived wait time.
* **Empty**: Friendly illustration with a clear Call to Action (e.g., "You have no matches yet. Keep an eye on your notifications!").
* **Error**: Inline red text for form errors; Toast notifications for API failures ("Failed to send message. Please try again.").
* **Success**: Green toast notifications ("Report successfully created!").
* **No Match Found**: "No matches found right now. We'll notify you if something turns up."
* **Match Found**: Celebration UI (subtle green highlights around the match card).
* **Pending/Approved/Rejected Claim**: Distinct visual badges and a locked-down form state to prevent duplicate submissions.
* **Offline**: A banner at the top of the chat screen: "⚠️ You are offline. Reconnecting..."

---

### 9. Real-Time Chat UX
* **Conversation Screen**: Uses `{conversationId}` to fetch history and connect via WebSockets.
* **Message Bubbles**: 
  * **"Me" (Sender)**: Right-aligned, solid Primary Blue background, white text.
  * **"Them" (Receiver)**: Left-aligned, light gray background, dark text.
* **Timestamp**: Small, muted text below or inside the bubble (e.g., "12:45 PM").
* **New-Message Indicator**: Red dot on the notification bell and unread bolding on the chat list.
* **Connection Failure**: Disable "Send" button and show offline banner.

---

### 10. Component Architecture
A modular React architecture will be strictly enforced:

* **Layouts**: `AuthLayout`, `DashboardLayout`, `AdminLayout`.
* **UI Primitives**: `Button`, `Input`, `Select`, `Modal`, `Toast`, `Card`, `Badge`, `Spinner`.
* **Domain Components**: 
  * `ItemCard`: Reusable card showing image, name, location, and status.
  * `MatchCard`: Specialized card showing side-by-side comparison of lost vs. found item.
  * `StatusBadge`: Dynamic colored badge based on status enum.
  * `ReportForm`: Reusable form for both Lost and Found reports.
* **Feature Components**: 
  * `ChatWindow`: The WebSocket-connected chat interface.
  * `NotificationDropdown`: The bell icon dropdown list.
  * `VerificationForm`: The specific form security uses to approve/reject claims.

---

### 11. Accessibility
* **Contrast**: All text must pass WCAG AA contrast ratios (especially text on primary buttons and badges).
* **Labels**: All form inputs must have associated `<label>` elements or `aria-label`.
* **Keyboard Navigation**: The entire app must be navigable via the `Tab` key, with clear `:focus` outlines on interactive elements.
* **Semantic HTML**: Use `<main>`, `<nav>`, `<header>`, `<footer>`, `<section>` and appropriate heading hierarchies (`h1` through `h6`).

---

### 12. Design Principles (Fixed)
1. **No Unnecessary Complexity**: Do not add features outside the MVP scope defined in Phase 2.
2. **Prioritize the Core Journey**: The path from `Lost → Match → Chat → Claim → Return` must be the easiest flow in the app.
3. **Consistent Role-Based Experiences**: Ensure Security and Admin users see interfaces tailored to their specific tasks, avoiding clutter from student-centric features.
4. **Component Reusability**: Do not duplicate UI code. If a button looks a certain way, it must use the `Button` component.
5. **Responsive First**: The application will likely be accessed on students' phones while walking around campus. Mobile experience is critical.
