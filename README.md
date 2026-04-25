📅 Booking Management Module — Smart Campus
> **IT3030 PAF 2026 | SLIIT**  
> Smart Campus Resource Booking System — Booking Management Feature
---
📌 Overview
The Booking Management Module enables students and staff to reserve campus resources such as lecture rooms, computer labs, and equipment. It implements a full approval workflow with admin oversight and QR-based access verification at the gate.
Developed by: [Your Name]  
Branch: `feature/bookingmanagement`  
Stack: Spring Boot (Java) · React (Vite) · MySQL · JWT Security
---
✨ Features
📋 Resource Booking — Users can submit booking requests for any active campus resource
🔄 Approval Workflow — Bookings start as `PENDING` and require admin approval
🚫 Conflict Detection — Prevents double-booking with checks at both creation and approval time
📲 QR Code Generation — Approved bookings generate a signed QR code for gate access
🔐 HMAC Signature Verification — QR codes are cryptographically signed and verified at the gate
🔔 Notifications — Users receive in-app notifications when their booking is approved or rejected
📅 Calendar Integration — Busy slot API powers the campus calendar view
---
🏗️ Architecture
```
bookingmanagement/
├── BookingController.java     # REST API layer — HTTP endpoints
├── BookingService.java        # Business logic — validation, conflict checks, notifications
├── QrService.java             # QR code generation & HMAC signature verification
└── dto/
    ├── BookingCreateRequest.java
    ├── BookingResponse.java
    ├── BusySlotResponse.java
    ├── RejectRequest.java
    └── VerifyQrRequest.java
```
```
frontend/src/modules/booking-management/
├── BookingsHubPage.jsx        # Landing hub for the booking section
├── BookingFormPage.jsx        # Create a new booking
├── MyBookingsPage.jsx         # View own bookings + QR download
├── AdminBookingsPage.jsx      # Admin approval panel
└── QrVerifyPage.jsx           # Public QR verification page
```
---
🔄 Booking Workflow
```
User submits booking
        │
        ▼
   [PENDING] ──── Admin reviews ────► [APPROVED] ──► QR Code generated
                                  │
                                  └──► [REJECTED] ──► Reason sent to user
```
---
🌐 REST API Endpoints
User Endpoints
Method	Endpoint	Description
`POST`	`/api/bookings`	Create a new booking (returns 201)
`GET`	`/api/bookings/my`	Get my own bookings
`GET`	`/api/bookings/{id}`	Get a specific booking (owner or admin)
`GET`	`/api/bookings/{id}/qr`	Download QR code as PNG (owner or admin)
`GET`	`/api/bookings/busy?date=`	Get busy time slots for a date
Admin Endpoints (requires `ADMIN` role)
Method	Endpoint	Description
`GET`	`/api/bookings`	Get all bookings in the system
`PUT`	`/api/bookings/{id}/approve`	Approve a pending booking
`PUT`	`/api/bookings/{id}/reject`	Reject a booking with optional reason
Public Endpoint
Method	Endpoint	Description
`POST`	`/api/bookings/verify`	Verify a QR code payload (no login required)
---
🔐 Security
Role-based access — Admin endpoints protected with `@PreAuthorize("hasRole('ADMIN')")`
Ownership checks — Users can only view/download their own bookings
JWT Authentication — Logged-in user is extracted from JWT via `@AuthenticationPrincipal`
QR Signing — QR payloads are signed using `HmacSHA256` with a server-side secret key
Timing-safe comparison — Signature verification uses constant-time comparison to prevent timing attacks
---
⚙️ Key Technical Decisions
Why conflict check twice?
Conflict is checked both at creation (prevents obvious overlap) and at approval (prevents race conditions where two PENDING bookings exist for the same slot).
Why is `/verify` public?
Gate scanners are physical devices that cannot authenticate. The HMAC signature makes the QR tamper-proof without requiring a login.
Why manual ownership check instead of `@PreAuthorize`?
`@PreAuthorize` handles static role checks. Ownership is dynamic (depends on the booking's `userId`), so it must be checked in code after fetching the booking.
---
🗃️ Data Model
```java
Booking {
    Long id
    Resource resource          // FK → which room/lab
    User user                  // FK → who booked
    User approvedBy            // FK → which admin approved
    LocalDate bookingDate
    LocalTime startTime
    LocalTime endTime
    String purpose
    int expectedAttendees
    BookingStatus status       // PENDING | APPROVED | REJECTED | CANCELLED
    String rejectionReason
    LocalDateTime createdAt
    LocalDateTime updatedAt
}
```
---
🚀 Getting Started
Prerequisites
Java 17+
Node.js 18+
MySQL 8+
Backend Setup
```bash
# Clone the repo
git clone https://github.com/your-username/it3030-paf-2026-smart-campus.git
cd backend/smart-campus-api

# Configure application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/smart_campus
spring.datasource.username=root
spring.datasource.password=your_password
app.qr.hmac-secret=your_secret_key_min_16_chars

# Run
./mvnw spring-boot:run
```
Frontend Setup
```bash
cd frontend/smart-campus-ui
npm install
npm run dev
```
---
📸 Module Pages
Page	Route	Description
Booking Form	`/bookings/new`	Submit a new booking request
My Bookings	`/bookings/my`	View your bookings and QR codes
Admin Panel	`/bookings/admin`	Approve or reject pending bookings
QR Verify	`/bookings/verify`	Verify a QR code at the gate
---
🧪 API Request Examples
Create a booking:
```json
POST /api/bookings
{
  "resourceId": 3,
  "bookingDate": "2026-05-10",
  "startTime": "09:00",
  "endTime": "11:00",
  "purpose": "Group project meeting",
  "expectedAttendees": 8
}
```
Reject a booking:
```json
PUT /api/bookings/12/reject
{
  "reason": "Resource is under maintenance on that date."
}
```
Verify a QR code:
```json
POST /api/bookings/verify
{
  "payload": "42:a3f9c2d1e0b..."
}
```
---
🤝 Related Modules
Module	Branch	Description
Authentication	`feature/authentication`	JWT & OAuth2 login, user roles
Facilities & Assets	`feature/facilities-assest`	Resource management
Maintenance Tickets	`feature/ticketmanagement`	Campus issue reporting
---
📄 License
This project is developed for academic purposes as part of the SLIIT PAF module (IT3030).
