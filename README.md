# Bus-Booking

Bus Booking Application project with a Spring Boot backend under `backend/`.

## Current Scope

This repository currently contains the Member 1 backend implementation:

- Spring Boot 3 backend setup with Java 17 and Maven
- MySQL configuration with `ddl-auto=update`
- Layered architecture: controller, service, repository, entity, dto, exception, config
- User registration and login APIs
- Bus search API by source, destination, and travel date
- Bus details API
- Schedule seat availability API
- Global exception handling
- Basic SLF4J logging
- Sample seed data for buses, routes, and schedules

## Tech Stack

- Java 17
- Spring Boot 3
- Spring Web
- Spring Data JPA
- MySQL
- Lombok
- Maven

## Project Structure

```text
backend/
  pom.xml
  POSTMAN_REQUESTS.md
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
```

## Implemented APIs

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/buses/search?source=&destination=&date=`
- `GET /api/buses/{id}`
- `GET /api/schedules/{id}/seats`

Sample request collection is available in `backend/POSTMAN_REQUESTS.md`.

## Local Setup

1. Create a MySQL database or let Spring create it automatically.
2. Update database credentials in `backend/src/main/resources/application.properties`.
3. Open the `backend` folder in your IDE.
4. Install Maven if it is not already installed on your system.
5. Run the Spring Boot application.

## Default Database Config

The current backend uses:

- Database: `bus_booking_db`
- Username: `root`
- Password: `root`

Change these values before running if your local MySQL setup is different.

## Seeded Test Data

The backend inserts sample buses, routes, and schedules on first run, including:

- `Chennai -> Bengaluru`
- `Bengaluru -> Hyderabad`

## Team Split

Member 1 owns:

- project setup
- auth module
- bus, route, and schedule modules
- search and read APIs

Member 2 will add:

- booking entity and repository
- booking, cancellation, and booking history APIs
- seat allocation logic tied to bookings

## Notes

- Authentication is intentionally simple for now and does not use JWT.
- The current `/api/schedules/{id}/seats` endpoint returns seat counts, not a seat-by-seat map.
