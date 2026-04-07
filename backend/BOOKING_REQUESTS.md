# Booking API - Requests Reference

**Base URL**: `http://localhost:8080`

## Prerequisites
1. Backend running (`mvn spring-boot:run`)
2. Database initialized with buses, routes, schedules
3. User registered (userId available)

---

## 1. Create Booking
```
POST /api/bookings
Content-Type: application/json

Request:
{
  "userId": 1,
  "scheduleId": 1,
  "numberOfSeats": 2,
  "seatNumbers": "1,2"
}

Response (201 Created):
{
  "id": 1,
  "userId": 1,
  "userName": "John Doe",
  "scheduleId": 1,
  "busNumber": "BUS001",
  "source": "New York",
  "destination": "Boston",
  "travelDate": "2025-12-25",
  "numberOfSeats": 2,
  "seatNumbers": "1,2",
  "totalFare": 600.00,
  "status": "CONFIRMED",
  "createdAt": "2025-04-07T10:30:00",
  "cancelledAt": null
}
```

---

## 2. Get User Bookings
```
GET /api/bookings/my?userId=1

Response (200 OK):
[
  { booking1 },
  { booking2 },
  ...
]
```

---

## 3. Get Booking Details
```
GET /api/bookings/1

Response (200 OK):
{
  "id": 1,
  "userId": 1,
  "userName": "John Doe",
  "scheduleId": 1,
  "busNumber": "BUS001",
  "numberOfSeats": 2,
  "seatNumbers": "1,2",
  "totalFare": 600.00,
  "status": "CONFIRMED",
  "createdAt": "2025-04-07T10:30:00",
  "cancelledAt": null
}
```

---

## 4. Cancel Booking
```
DELETE /api/bookings/1/cancel

Response (200 OK):
{
  "id": 1,
  "status": "CANCELLED",
  "cancelledAt": "2025-04-07T11:45:00",
  ... other fields ...
}
```

---

## Error Responses
| Status | Message |
|--------|---------|
| 400 | User not found |
| 400 | Schedule not found |
| 400 | Number of seats does not match |
| 400 | Not enough available seats |
| 400 | Seat X is already booked |
| 400 | Booking already cancelled |
| 400 | Cannot cancel completed booking |
| 404 | Booking not found |
| 422 | Validation error |

---

## End-to-End Test Workflow

```bash
# 1. Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"pass123"}'
# Save userId

# 2. Search
curl "http://localhost:8080/api/buses/search?source=NewYork&destination=Boston&date=2025-12-25"
# Save scheduleId

# 3. Create Booking
curl -X POST http://localhost:8080/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"scheduleId":1,"numberOfSeats":2,"seatNumbers":"1,2"}'
# Save bookingId

# 4. View Bookings
curl "http://localhost:8080/api/bookings/my?userId=1"

# 5. View Details
curl "http://localhost:8080/api/bookings/1"

# 6. Cancel
curl -X DELETE http://localhost:8080/api/bookings/1/cancel

# 7. Verify Cancellation
curl "http://localhost:8080/api/bookings/my?userId=1"
```

---

## Booking Rules
- User must exist
- Schedule must exist and have available seats
- NumberOfSeats must match seatNumbers count
- All seat numbers within capacity (1-totalSeats)
- No duplicate seat bookings
- Cannot cancel already cancelled/completed bookings
- Fare calculated automatically (fare × numberOfSeats)
- Seats refunded on cancellation
