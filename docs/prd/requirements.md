# Requirements

## Functional

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

## Non-Functional

*   **NFR1:** The system must be scalable to handle a high volume of providers and bookings.
*   **NFR2:** The API response time for public-facing read operations (e.g., fetching a service catalogue) should be under 200ms.
*   **NFR3:** The system must be extensible, allowing for new service industries and features (like "Reviews & Ratings") to be added in the future with minimal architectural changes.
*   **NFR4:** The database schema must be designed with proper indexing to ensure fast query performance for searches and availability checks.
*   **NFR5:** The system must be designed with an "auth-ready" architecture, allowing for JWT-based security to be enabled easily in a future phase.
