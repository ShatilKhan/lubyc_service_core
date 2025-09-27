# Lubyc Service Booking Module Product Requirements Document (PRD)

## Goals and Background Context

### Goals

*   **Revenue Expansion:** Generate revenue for Lubyc through commissions on paid bookings and the introduction of premium provider tiers.
*   **Create a Stickier Ecosystem:** Increase user retention by providing a single platform that handles learning, events, and personal appointments.
*   **Enable Cross-Module Synergies:** Allow service providers to promote their services in the Social feed, upsell during Events, and communicate with clients via Messaging.
*   **Empower the Local Economy:** Enable micro-entrepreneurs (such as beauticians, tutors, and medics) to monetize their skills instantly within their communities.

### Background Context

Lubyc’s vision is to offer a single digital workspace for all business and community operations. A critical missing piece in this vision is real-time service scheduling. This project will introduce the capability for any Lubyc user to publish their availability, define their services, and accept bookings with integrated payments. This closes a significant gap in the platform, moving Lubyc closer to its goal of being a truly all-in-one solution.

### Change Log

| Date | Version | Description | Author |
| :--- | :--- | :--- | :--- |
| 2025-09-27 | 1.0 | Initial PRD Draft | John (PM) |

## Requirements

### Functional

*   **FR1:** Customers must be able to search for service providers based on the type of service and their geographical location.
*   **FR2:** Customers must be able to view a provider's full service catalogue, including details like price, duration, and descriptions.
*   **FR3:** The system must only show and allow booking of time slots that are within a provider's defined business hours and available capacity.
*   **FR4:** The system must send an instant confirmation (email/push notification) to the customer upon successful booking.
*   **FR5:** The system must send a reminder notification to the customer 24 hours before their scheduled appointment.
*   **FR6:** Customers must be able to cancel a booking before a provider-defined cut-off time without penalty.
*   **FR7:** The system shall provide AI-powered suggestions to customers for re-booking appointments at their habitual times.
*   **FR8:** Service providers must be able to define their weekly business hours and set a global capacity for simultaneous bookings.
*   **FR9:** Service providers must be able to create, update, and manage their service catalogue, including adding unlimited items with price, duration, images, and descriptions.
*   **FR10:** Service providers must be able to assign specific employees to the services they offer.
*   **FR11:** Service providers and assigned staff must receive real-time notifications for new bookings.
*   **FR12:** Service providers must be able to create and manage time-bound percentage-based discount campaigns.
*   **FR13:** Service providers must be able to configure a cancellation policy, including a cut-off time (in hours) and a potential late-cancellation fee.
*   **FR14:** Employees must be able to set their personal availability (e.g., for vacations or shifts) to prevent being booked when they are off.
*   **FR15:** Employees must be able to view their upcoming assigned appointments on a personal dashboard.

### Non-Functional

*   **NFR1:** The system must be scalable to handle a high volume of providers and bookings.
*   **NFR2:** The API response time for public-facing read operations (e.g., fetching a service catalogue) should be under 200ms.
*   **NFR3:** The system must be extensible, allowing for new service industries and features (like "Reviews & Ratings") to be added in the future with minimal architectural changes.
*   **NFR4:** The database schema must be designed with proper indexing to ensure fast query performance for searches and availability checks.
*   **NFR5:** The system must be designed with an "auth-ready" architecture, allowing for JWT-based security to be enabled easily in a future phase.

## User Interface Design Goals

*Not applicable for this project, as it is a backend service/API.*

## Technical Assumptions

*   **Repository Structure:** Monorepo (assumed for ease of potential future integration with other Lubyc services).
*   **Service Architecture:** The module will be built as a self-contained, containerized (Docker) microservice.
*   **Backend Technology:** Node.js with TypeScript, using a modern framework like NestJS or Express.
*   **Database:** PostgreSQL, accessed via the Prisma ORM.
*   **Caching:** Redis will be used for caching frequently accessed data like service pages and templates.
*   **API Style:** A RESTful API will be exposed, with its contract defined by an OpenAPI 3.0 (Swagger) specification.

## Epic List

*   **Epic 1: Provider Onboarding & Service Definition:** Establish the foundational capabilities for a service provider to create a profile, define their business hours and capacity, and build their service catalogue.
*   **Epic 2: Core Booking Engine & Operations:** Implement the end-to-end booking lifecycle for customers and provide the necessary operational tools for providers and their staff to manage those bookings.
*   **Epic 3: Advanced Features & Launch Readiness:** Introduce value-add features like cancellation policies, promotional campaigns, and the initial version of the AI re-booking reminder, followed by system hardening for go-live.

## Epic 1: Provider Onboarding & Service Definition

**Epic Goal:** To enable a new service provider to successfully sign up, create a public-facing profile, define their business hours and capacity, and list their services in a searchable catalogue.

*   **Story 1.1: Provider Profile Creation**
    *   **As a** provider, **I want to** create my service provider profile with my business type and location, **so that** customers can find me.
    *   **Acceptance Criteria:**
        1.  A new record can be created in the `service_providers` table.
        2.  The profile must be linked to a `user_id` and a `service_type_id`.
        3.  The provider can set their location via latitude/longitude.
*   **Story 1.2: Business Hours & Capacity Management**
    *   **As a** provider, **I want to** define my weekly service hours and set a capacity for overlapping bookings, **so that** customers can only book when I’m open and I don’t overbook my resources.
    *   **Acceptance Criteria:**
        1.  Provider can perform CRUD operations on their business hours for each day of the week.
        2.  Provider can set a global integer for `capacity` on their profile.
        3.  The system refuses to show slots as available if they are outside of defined business hours.
*   **Story 1.3: Service Catalogue Management**
    *   **As a** provider, **I want to** add, update, and view services in my catalogue with price, duration, and description, **so that** customers see my accurate offerings.
    *   **Acceptance Criteria:**
        1.  Provider can perform CRUD operations on the `service_catalogue` table, linked to their `service_provider_id`.
        2.  Each service must have a title, price, duration, and duration type.
        3.  Saved services are visible via the public-facing search endpoint.
*   **Story 1.4: Basic Service Search**
    *   **As a** customer, **I want to** search for providers by service type and location, **so that** I can see relevant options near me.
    *   **Acceptance Criteria:**
        1.  An API endpoint exists that accepts `service_type_id` and a location (lat/lng) as parameters.
        2.  The endpoint returns a list of service providers that match the criteria.
        3.  The search results include basic provider and service catalogue information.

## Epic 2: Core Booking Engine & Operations

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

## Epic 3: Advanced Features & Launch Readiness

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

