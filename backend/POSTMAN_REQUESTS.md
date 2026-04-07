# Member 1 Postman Requests

This file contains sample requests for the Member 1 backend scope:

- user registration
- user login
- bus search
- bus details
- schedule seat availability

Base URL:

```text
http://localhost:8080
```

## 1. Register User

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

## 2. Login User

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

## 3. Search Buses

Sample seeded data includes the route `Chennai -> Bengaluru` on `2026-04-10`.

Method: `GET`

URL:

```text
http://localhost:8080/api/buses/search?source=Chennai&destination=Bengaluru&date=2026-04-10
```

## 4. Get Bus Details

Method: `GET`

URL:

```text
http://localhost:8080/api/buses/1
```

## 5. Get Schedule Seat Availability

Method: `GET`

URL:

```text
http://localhost:8080/api/schedules/1/seats
```

## Expected Seeded Routes

- `Chennai -> Bengaluru` on `2026-04-10`
- `Bengaluru -> Hyderabad` on `2026-04-11`
