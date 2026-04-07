# 🚌 Bus Booking Module — React App

A fresher-friendly React booking module with Seat Selection, Booking Confirmation, and My Bookings pages.

---

## 📁 Project Structure

```
bus-booking/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── api/
│   │   └── api.js              # All Axios API calls
│   ├── components/
│   │   └── Navbar.js           # Top navigation bar
│   ├── pages/
│   │   ├── SeatSelectionPage.js        # Page 1
│   │   ├── BookingConfirmationPage.js  # Page 2
│   │   └── MyBookingsPage.js           # Page 3
│   ├── styles/
│   │   └── global.css          # All CSS styles
│   ├── App.js                  # Router setup
│   └── index.js                # React entry point
└── package.json
```

---

## 🚀 How to Run

### 1. Install dependencies
```bash
npm install
```

### 2. Start the development server
```bash
npm start
```

App opens at: http://localhost:3000

---

## 🔗 Page Routes

| Page                   | URL                        |
|------------------------|----------------------------|
| Seat Selection         | `/seats/:scheduleId`       |
| Booking Confirmation   | `/confirm-booking`         |
| My Bookings            | `/my-bookings`             |

**Example:** To test seat selection, go to:
```
http://localhost:3000/seats/101
```

---

## 🔌 API Endpoints Used

| Action          | Method | Endpoint                          |
|-----------------|--------|-----------------------------------|
| Get seats       | GET    | `/api/schedules/{id}/seats`       |
| Create booking  | POST   | `/api/bookings`                   |
| My bookings     | GET    | `/api/bookings/my`                |
| Cancel booking  | DELETE | `/api/bookings/{id}/cancel`       |

> The base URL is set in `src/api/api.js` — change it to your backend URL.

---

## 🔐 Authentication

User data is read from `localStorage` under the key `"user"`.

Expected format:
```json
{
  "id": 1,
  "name": "John Doe",
  "token": "your-jwt-token-here"
}
```

To simulate login (paste in browser console):
```javascript
localStorage.setItem("user", JSON.stringify({
  id: 1,
  name: "Test User",
  token: "test-token-123"
}));
```

---

## 📦 Dependencies

- **React 18** — UI library
- **React Router v6** — Navigation
- **Axios** — HTTP API calls

---

## 💡 Key Concepts Used (Fresher-Friendly)

| Concept | Where Used |
|---|---|
| `useState` | Managing seats, selections, loading, errors |
| `useEffect` | Fetching data on page load |
| `useParams` | Reading `:scheduleId` from URL |
| `useNavigate` | Moving between pages |
| `useLocation` | Reading data passed between pages |
| Axios | All API calls in `api/api.js` |
| localStorage | Reading logged-in user info |
