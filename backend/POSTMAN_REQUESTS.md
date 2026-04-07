# Bus Booking Backend - Postman Requests

This file contains sample requests for all backend APIs.

**Member 1 Scope**: Authentication, Bus Search, Schedule Management  
**Member 2 Scope**: Booking Management

Base URL:

```text
http://localhost:8080
```

---

## Member 1: Authentication & Search

### 1. Register User

Method: `POST`

URL:

```text
http://localhost:8080/api/auth/register
```

Body:

```json
{
  "name": "Arun Kumar",
  "email": "arun@example.com",
  "password": "password123",
  "role": "USER"
}
```

### 2. Login User

Method: `POST`

URL:

```text
http://localhost:8080/api/auth/login
```

Body:

```json
{
  "email": "arun@example.com",
  "password": "password123"
}
```

### 3. Search Buses

Sample seeded data includes the route `Chennai -> Bengaluru` on `2026-04-10`.

Method: `GET`

URL:

```text
http://localhost:8080/api/buses/search?source=Chennai&destination=Bengaluru&date=2026-04-10
```

### 4. Get Bus Details

Method: `GET`

URL:

```text
http://localhost:8080/api/buses/1
```

### 5. Get Schedule Seat Availability

Method: `GET`

URL:

```text
http://localhost:8080/api/schedules/1/seats
```

### Expected Seeded Routes

- `Chennai -> Bengaluru` on `2026-04-10`
- `Bengaluru -> Hyderabad` on `2026-04-11`

---

## Member 2: Booking Management

### 6. Create Booking

Method: `POST`

URL:

```text
http://localhost:8080/api/bookings
```

Headers:

```text
Content-Type: application/json
```

Body:

```json
{
  "userId": 1,
  "scheduleId": 1,
  "numberOfSeats": 2,
  "seatNumbers": "1,2"
}
```

Response (201 Created):

```json
{
  "id": 1,
  "userId": 1,
  "userName": "Arun Kumar",
  "scheduleId": 1,
  "busNumber": "BUS001",
  "busName": "Express Travels",
  "source": "Chennai",
  "destination": "Bengaluru",
  "travelDate": "2026-04-10",
  "departureTime": "06:00",
  "arrivalTime": "14:30",
  "numberOfSeats": 2,
  "seatNumbers": "1,2",
  "totalFare": 600.00,
  "farePerSeat": 300.00,
  "status": "CONFIRMED",
  "createdAt": "2026-04-07T10:30:00",
  "cancelledAt": null
}
```

### 7. Get User's Bookings

Method: `GET`

URL:

```text
http://localhost:8080/api/bookings/my?userId=1
```

Response:

```json
[
  {
    "id": 1,
    "userId": 1,
    "userName": "Arun Kumar",
    "scheduleId": 1,
    "status": "CONFIRMED",
    "numberOfSeats": 2,
    "totalFare": 600.00,
    "createdAt": "2026-04-07T10:30:00",
    "cancelledAt": null
  }
]
```

### 8. Get Booking Details

Method: `GET`

URL:

```text
http://localhost:8080/api/bookings/1
```

Response:

```json
{
  "id": 1,
  "userId": 1,
  "userName": "Arun Kumar",
  "scheduleId": 1,
  "busNumber": "BUS001",
  "source": "Chennai",
  "destination": "Bengaluru",
  "travelDate": "2026-04-10",
  "numberOfSeats": 2,
  "seatNumbers": "1,2",
  "totalFare": 600.00,
  "status": "CONFIRMED",
  "createdAt": "2026-04-07T10:30:00",
  "cancelledAt": null
}
```

### 9. Cancel Booking

Method: `DELETE`

URL:

```text
http://localhost:8080/api/bookings/1/cancel
```

Response:

```json
{
  "id": 1,
  "userId": 1,
  "userName": "Arun Kumar",
  "scheduleId": 1,
  "status": "CANCELLED",
  "numberOfSeats": 2,
  "totalFare": 600.00,
  "createdAt": "2026-04-07T10:30:00",
  "cancelledAt": "2026-04-07T11:45:00"
}
```

---

## Workflow: End-to-End Test

1. **Register** (Step 6) - Get userId
2. **Login** (Step 2) - Verify credentials
3. **Search** (Step 3) - Get scheduleId
4. **Get Seat Availability** (Step 5) - Verify seats
5. **Create Booking** (Step 6) - Book seats
6. **View Bookings** (Step 7) - Verify creation
7. **Get Booking Details** (Step 8) - View full details
8. **Cancel Booking** (Step 9) - Refund seats
9. **View Bookings Again** (Step 7) - Verify cancellation

---

## Booking Validation Rules

- User must exist
- Schedule must exist and have available seats
- NumberOfSeats must match seatNumbers count
- All seat numbers within capacity
- No duplicate seat bookings
- Cannot cancel already cancelled/completed bookings
