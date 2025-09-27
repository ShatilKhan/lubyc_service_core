# Epic 3: Advanced Features & Launch Readiness

**Epic Goal:** To layer on key business logic features such as cancellations and promotions, implement the first version of the AI reminder, and harden the system for its initial launch.

*   **Story 3.1: Cancellation Policy**
    *   **As a** provider, **I want to** configure a cancellation policy (hours & fee), **so that** customer expectations are clear and I am protected from last-minute cancellations.
    *   **As a** customer, **I want to** cancel my booking before the cut-off without penalty, **so that** I can avoid fees if my plans change.
    *   **Acceptance Criteria:**
        1.  Provider can set `cancellation_time` (in minutes) and a late fee flag on their profile.
        2.  A customer can trigger a cancellation endpoint for a booking.
        3.  The system checks if the cancellation is within the allowed time; if so, the booking status is set to "canceled" with no fee.
        4.  (Future) If outside the allowed time, the system applies a fee.
*   **Story 3.2: Promotional Campaigns**
    *   **As a** provider, **I want to** create discount campaigns, **so that** I can attract more clients.
    *   **Acceptance Criteria:**
        1.  Provider can create time-bound, percentage-based discounts.
        2.  When a customer views a service that has an active campaign, the discounted price is shown.
        3.  The discount is automatically applied at checkout.
*   **Story 3.3: AI Re-booking Reminder (v0)**
    *   **As a** customer, **I want** AI suggestions for re-booking at my usual time, **so that** I can easily maintain my routine.
    *   **Acceptance Criteria:**
        1.  A scheduled job (cron) runs periodically to analyze booking history.
        2.  If the system detects a user has booked the same service at a similar day/time at least twice, it enqueues a reminder notification for the next logical cycle (e.g., a week later).
        3.  The system tracks user engagement with these reminders.
*   **Story 3.4: System Hardening**
    *   **As a** system administrator, **I want to** ensure the service is secure and performant, **so that** we can have a successful and stable launch.
    *   **Acceptance Criteria:**
        1.  All dependencies are updated to their latest stable versions.
        2.  The system passes basic security penetration tests.
        3.  Load testing is performed to ensure the system can handle 3x the expected initial traffic.
        4.  A go-live checklist is completed.

