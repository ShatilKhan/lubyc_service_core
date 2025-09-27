# Epic 1: Provider Onboarding & Service Definition

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
