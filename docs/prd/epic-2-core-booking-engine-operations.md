# Epic 2: Core Booking Engine & Operations

**Epic Goal:** To allow customers to complete a booking from start to finish and to provide providers and staff with the tools to manage incoming appointments and their schedules.

*   **Story 2.1: Customer Booking Flow**
    *   **As a** customer, **I want to** pick an available time slot and receive an instant confirmation, **so that** I know my appointment is successfully recorded.
    *   **Acceptance Criteria:**
        1.  An endpoint can calculate and return available time slots based on a provider's hours and capacity.
        2.  A customer can submit a booking request for an available slot.
        3.  A new record is created in the `service_bookings` table with a "booked" status.
        4.  An email/push notification is successfully queued for the customer.
*   **Story 2.2: Provider Booking Management**
    *   **As a** provider, **I want to** receive real-time notifications of new bookings and view them on a dashboard, **so that** I can prepare my resources.
    *   **Acceptance Criteria:**
        1.  A new booking triggers a notification to the provider/owner.
        2.  An endpoint exists for a provider to view all bookings associated with their profile.
        3.  The provider can change the status of a booking (e.g., from "booked" to "confirmed").
*   **Story 2.3: Staff Assignment and Scheduling**
    *   **As a** provider, **I want to** assign employees to specific services, **so that** only qualified staff are booked and receive notifications.
    *   **As an** employee, **I want to** view my upcoming schedule, **so that** I can manage my workload.
    *   **Acceptance Criteria:**
        1.  Provider can create associations between employees and services in the `service_catalogue_employees` table.
        2.  When a booking for an assigned service is confirmed, a notification is sent to the assigned employee(s).
        3.  An endpoint exists for an employee to view all confirmed bookings assigned to them.
