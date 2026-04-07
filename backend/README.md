# Bus Booking Backend

## Project Overview
Spring Boot REST API for a bus booking system with user authentication, bus/schedule search, and booking management.

---

## Technology Stack
- **Framework**: Spring Boot 3.3.5
- **Language**: Java 17
- **Database**: MySQL 8.0
- **Build Tool**: Maven
- **ORM**: JPA/Hibernate
- **Security**: Spring Security (Password Crypto)
- **Validation**: Jakarta Validation

---

## Project Structure

```
src/main/java/com/busbooking/
├── entity/
│   ├── User.java
│   ├── Bus.java
│   ├── Route.java
│   ├── Schedule.java
│   ├── Booking.java              [Member 2]
│   └── enums/
│       ├── Role.java
│       ├── BusType.java
│       └── BookingStatus.java     [Member 2]
│
├── controller/
│   ├── AuthController.java
│   ├── BusController.java
│   ├── ScheduleController.java
│   └── BookingController.java     [Member 2]
│
├── service/
│   ├── AuthService.java
│   ├── BusService.java
│   └── BookingService.java        [Member 2]
│
├── repository/
│   ├── UserRepository.java
│   ├── BusRepository.java
│   ├── RouteRepository.java
│   ├── ScheduleRepository.java
│   └── BookingRepository.java     [Member 2]
│
├── dto/
│   ├── request/
│   │   ├── LoginRequest.java
│   │   ├── RegisterRequest.java
│   │   ├── BookingRequest.java    [Member 2]
│   │   └── BookingCancelRequest.java [Member 2]
│   └── response/
│       ├── AuthResponse.java
│       ├── UserResponse.java
│       ├── BusDetailsResponse.java
│       ├── BusSearchResponse.java
│       ├── ScheduleSeatAvailabilityResponse.java
│       └── BookingResponse.java   [Member 2]
│
├── exception/
│   ├── GlobalExceptionHandler.java
│   ├── ResourceNotFoundException.java
│   ├── BadRequestException.java
│   └── InvalidCredentialsException.java
│
└── config/
    ├── PasswordConfig.java
    └── DataInitializer.java
```

---

## Setup Instructions

### Prerequisites
- Java 17+
- Maven 3.6+
- MySQL 8.0+

### Run Application

```bash
cd backend
mvn clean spring-boot:run
```

Application starts on `http://localhost:8080`

### Build
```bash
mvn clean compile
```

---

## API Endpoints

### Authentication (Member 1)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |

### Bus & Schedule (Member 1)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/buses/search` | Search buses by route & date |
| GET | `/api/buses/{id}` | Get bus details |
| GET | `/api/schedules/{id}/seats` | Get seat availability |

### Booking (Member 2) ⭐
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create new booking |
| GET | `/api/bookings/my?userId={id}` | Get user's bookings |
| GET | `/api/bookings/{id}` | Get booking details |
| DELETE | `/api/bookings/{id}/cancel` | Cancel booking |

---

## Member 2: Booking Module

### Overview
Complete booking management system with:
- ✅ Booking creation with validation
- ✅ Seat selection and conflict prevention  
- ✅ Automatic fare calculation
- ✅ Booking history retrieval
- ✅ Cancellation with seat refunds
- ✅ Comprehensive error handling

### Features

#### 1. Create Booking
- Validate user exists
- Validate schedule exists
- Check seat availability
- Prevent duplicate seat bookings
- Calculate total fare automatically
- Update available seats
- Transaction-safe operation

**Request:**
```json
{
  "userId": 1,
  "scheduleId": 1,
  "numberOfSeats": 2,
  "seatNumbers": "1,2"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "userId": 1,
  "userName": "John Doe",
  "scheduleId": 1,
  "busNumber": "BUS001",
  "busName": "Express Travels",
  "source": "New York",
  "destination": "Boston",
  "travelDate": "2025-12-25",
  "departureTime": "10:00",
  "arrivalTime": "14:30",
  "numberOfSeats": 2,
  "seatNumbers": "1,2",
  "totalFare": 600.00,
  "farePerSeat": 300.00,
  "status": "CONFIRMED",
  "createdAt": "2025-04-07T10:30:00",
  "cancelledAt": null
}
```

#### 2. Get User's Bookings
```
GET /api/bookings/my?userId=1
Response: List of all user's bookings (sorted by creation date)
```

#### 3. Get Booking Details
```
GET /api/bookings/1
Response: Single booking with full details
```

#### 4. Cancel Booking
```
DELETE /api/bookings/1/cancel
Response: Updated booking with status=CANCELLED and refunded seats
```

### Booking Status Values
- **CONFIRMED**: Active booking
- **CANCELLED**: Cancelled (seats refunded)
- **COMPLETED**: Journey completed (cannot cancel)

### Validation Rules
```
✓ User must exist
✓ Schedule must exist
✓ numberOfSeats must match seatNumbers count
✓ Schedule must have available seats
✓ All seat numbers within bus capacity (1 to totalSeats)
✓ No duplicate seat bookings for same schedule
✓ Cannot cancel already cancelled booking
✓ Cannot cancel completed booking
```

### Database Schema (Auto-generated)
```sql
CREATE TABLE bookings (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  schedule_id BIGINT NOT NULL,
  number_of_seats INT NOT NULL,
  total_fare DECIMAL(8,2) NOT NULL,
  seat_numbers VARCHAR(500) NOT NULL,
  status VARCHAR(20) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  cancelled_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (schedule_id) REFERENCES schedules(id)
);
```

### Error Responses
| Status | Message | Scenario |
|--------|---------|----------|
| 400 | User not found. | User ID doesn't exist |
| 400 | Schedule not found. | Schedule ID doesn't exist |
| 400 | Number of seats does not match... | Count mismatch |
| 400 | Not enough available seats. | Insufficient capacity |
| 400 | Seat X is already booked. | Duplicate booking |
| 400 | Booking is already cancelled. | Double cancel attempt |
| 400 | Cannot cancel a completed booking. | Journey done |
| 404 | Booking not found. | Invalid booking ID |
| 422 | Validation error | Missing/invalid fields |

---

## Testing Workflow

### Prerequisites
1. Ensure backend is running
2. Database populated with buses, routes, and schedules
3. Have a registered user (userId)

### Test Steps

**Step 1: Search for schedules**
```bash
curl "http://localhost:8080/api/buses/search?source=NewYork&destination=Boston&date=2025-12-25"
# Save scheduleId from response
```

**Step 2: Create booking**
```bash
curl -X POST http://localhost:8080/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "scheduleId": 1,
    "numberOfSeats": 2,
    "seatNumbers": "1,2"
  }'
# Response: 201 Created with bookingId
```

**Step 3: View bookings**
```bash
curl "http://localhost:8080/api/bookings/my?userId=1"
```

**Step 4: Get booking details**
```bash
curl "http://localhost:8080/api/bookings/1"
```

**Step 5: Cancel booking**
```bash
curl -X DELETE http://localhost:8080/api/bookings/1/cancel
# Status should change to CANCELLED
```

**Step 6: Verify refund**
```bash
# Check seats available increased
curl "http://localhost:8080/api/schedules/1/seats"
```

---

## Configuration

### database/application.properties
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/bus_booking_db?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=root
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

---

## Build Status
✅ Compilation: SUCCESS  
✅ Java Files: 39 (all compiled)  
✅ Errors: 0  
✅ Warnings: 0  

---

## Documentation

- **POSTMAN_REQUESTS.md** - API examples for all endpoints
- **BOOKING_REQUESTS.md** - Detailed booking API reference (if available)

---

## Implementation Notes

### Member 1 (Foundation + Auth + Search)
- Authentication APIs
- Bus and Route management
- Schedule and availability
- Data models and repositories

### Member 2 (Booking Module)
- Complete booking lifecycle
- Seat validation and management
- Booking cancellation with refunds
- Rich response DTOs with related entity details
- Comprehensive error handling

---

## Key Technologies Used

| Component | Technology |
|-----------|-----------|
| Web Framework | Spring Boot Web |
| Data Access | Spring Data JPA |
| Database | MySQL |
| Security | Spring Security (Password Crypto) |
| Validation | Jakarta Validation |
| ORM | Hibernate |
| HTTP Methods | RESTful principles |
| Lombok | @RequiredArgsConstructor, @Builder |

---

## Project Status
✅ Complete and ready for integration testing
