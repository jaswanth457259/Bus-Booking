# Bus-Booking

Bus Booking full-stack application with a Spring Boot backend in `backend/` and a React frontend in `frontend/`.

## Current Project Scope

This repository now contains the combined work of all members across backend and frontend.

Backend highlights:

- Spring Boot 3 setup with Java 17 and Maven
- MySQL configuration with JPA (`ddl-auto=update`)
- Layered architecture (`controller`, `service`, `repository`, `entity`, `dto`, `exception`, `config`)
- Authentication module (register/login)
- Bus search and bus details APIs
- Schedule seat availability API
- Booking creation, cancellation, and booking history APIs
- Admin management APIs (bus/route/schedule operations)
- Global exception handling and SLF4J logging
- Seed data initialization for routes, buses, schedules

Frontend highlights:

- Route-based app with login/register/search/list/seat-selection/confirmation/my-bookings/admin screens
- Shared API layer (`frontend/src/api/api.js`)
- Shared navbar and protected/admin routing
- Dark and light theme toggle (persistent)
- Enhanced UI with visual assets and responsive styles
- Back-button navigation improvements across key pages
- Bus type filter (AC/NON_AC/SLEEPER) in bus listing
- Date/time validations to block past dates and invalid time selections

Build status:

- `frontend`: `npm run build` compiles successfully

## Tech Stack

Backend:

- Java 17
- Spring Boot 3
- Spring Web
- Spring Data JPA
- MySQL
- Lombok
- Maven

Frontend:

- React 18
- React Router
- Axios
- CSS

## Project Structure

```text
backend/
  pom.xml
  src/main/java/com/busbooking/
    config/
    controller/
    dto/
    entity/
    exception/
    repository/
    service/
  src/main/resources/
    application.properties

frontend/
  package.json
  public/
  src/
    api/
    components/
    pages/
    styles/
    utils/
```

## Implemented APIs

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`

Bus & Schedule:

- `GET /api/buses/search?source=&destination=&date=`
- `GET /api/buses/{id}`
- `GET /api/schedules/{id}/seats`

Booking:

- `POST /api/bookings`
- `GET /api/bookings/my?userId={id}`
- `GET /api/bookings/{id}`
- `DELETE /api/bookings/{id}/cancel`

Admin:

- Dashboard and management APIs for bus/route/schedule modules

## Local Setup

### Backend

1. Create MySQL database (or let Spring create it automatically).
2. Update credentials in `backend/src/main/resources/application.properties`.
3. Run:

```bash
cd backend
mvn clean spring-boot:run
```

### Frontend

1. Install dependencies and run:

```bash
cd frontend
npm install
npm start
```

### Build Frontend

```bash
cd frontend
npm run build
```

## Default Database Config

- Database: `bus_booking_db`
- Username: `root`
- Password: `root`

Change values based on your local MySQL setup.

## Seeded Test Data

Inserted on first run:

- `Chennai -> Bengaluru`
- `Bengaluru -> Hyderabad`

## Team Members and Roles

### Member 1 (Backend Core)

- Initial project setup
- Authentication module
- Bus/route/schedule entities and APIs
- Search and read workflows
- Core exception handling and backend structure

### Member 2 (Backend Booking and Admin)

- Booking entity, repository, service, controller
- Booking create/cancel/history flow
- Seat allocation and booking validation logic
- Admin dashboard and master-data management APIs

### Member 3 (Frontend Booking Flow)

- Seat selection page
- Booking confirmation flow
- My bookings page
- Cancel booking UI flow

### Member 4 (Frontend App Integration and UX)

- Login and register pages
- Search and bus list pages
- Routing and protected/admin navigation
- Local storage session handling
- UI enhancements (theme support, visuals, filters, validation improvements)
- Cross-page integration and final UX polish

## Frontend Routes

- `/login`
- `/register`
- `/search`
- `/buses`
- `/seats/:scheduleId`
- `/confirm-booking`
- `/my-bookings`
- `/admin`

## Notes

- Authentication is currently simple and does not use JWT.
- Seat API supports seat availability and seat status used in booking flow.
