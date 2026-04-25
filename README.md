<div align="center">

# 🏛️ Smart Campus Management System

**A full-stack web application for managing campus resources, bookings, facilities, and maintenance — built for SLIIT students and staff.**

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.3-6DB33F?style=flat&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Java](https://img.shields.io/badge/Java-25-ED8B00?style=flat&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat&logo=jsonwebtokens)](https://jwt.io/)

**IT3030 — Programming and Frameworks | SLIIT | 2026**

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [System Architecture](#-system-architecture)
- [Modules](#-modules)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Configuration](#-environment-configuration)
- [API Reference](#-api-reference)
- [Frontend Routes](#-frontend-routes)
- [Database Schema](#-database-schema)
- [Team](#-team)

---

## 🌐 Overview

Smart Campus is a **full-stack web platform** designed to digitize and streamline SLIIT campus operations. Students and staff can browse campus resources, make reservations, track maintenance issues, and receive real-time notifications — all from a single unified interface.

The system supports two user roles:

| Role | Capabilities |
|------|-------------|
| **Student / Staff** | Browse resources, create bookings, report maintenance issues, view notifications |
| **Admin** | Manage resources, approve/reject bookings, update ticket status, oversee all activity |

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────┐
│                  React Frontend (Vite)                    │
│    Auth   |   Facilities   |   Bookings   |   Tickets    │
└─────────────────────────┬────────────────────────────────┘
                          │ HTTP / REST (JSON)
                          ▼
┌──────────────────────────────────────────────────────────┐
│                Spring Boot REST API                       │
│                                                          │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  Controller │─▶│    Service   │─▶│  Repository   │  │
│  │   (HTTP)    │  │   (Logic)    │  │   (JPA/DB)    │  │
│  └─────────────┘  └──────────────┘  └───────────────┘  │
│                                                          │
│     Spring Security  |  JWT + OAuth2  |  Validation     │
└─────────────────────────┬────────────────────────────────┘
                          │ JPA / Hibernate
                          ▼
                ┌────────────────────┐
                │     MySQL 8.0      │
                │  users, resources, │
                │  bookings, tickets │
                └────────────────────┘
```

---

## 🧩 Modules

The project is divided into **4 feature modules**, each developed on a separate Git branch and owned by a team member.

---

### 🔐 1. Authentication & Notifications
**Branch:** `feature/authentication`

Handles all user identity, login flows, and real-time notifications.

**Features:**
- Google OAuth2 login via Spring Security
- JWT token issuance and validation on every request
- Role-based access control (`STUDENT`, `ADMIN`)
- In-app notification delivery when booking status changes
- Auth callback handling on the frontend

**Frontend Pages:**
```
auth-notifications/
├── LoginPage.jsx         # Google login entry point
└── AuthCallback.jsx      # Handles OAuth2 redirect
```

---

### 🏢 2. Facilities & Asset Management
**Branch:** `feature/facilities-assest`

Enables admins to manage campus resources and allows users to browse availability.

**Features:**
- Full CRUD for campus resources (rooms, labs, equipment)
- Resource types: `LECTURE_ROOM`, `COMPUTER_LAB`, `EQUIPMENT`, etc.
- Resource status management: `ACTIVE`, `INACTIVE`, `UNDER_MAINTENANCE`
- Calendar view showing bookings per resource per day
- Capacity, location, and availability hours tracked per resource

**Frontend Pages:**
```
facilities-assets/
├── ResourceListPage.jsx       # Browse all resources
├── ResourceCalendarPage.jsx   # Per-resource booking calendar
└── AdminResourcesPage.jsx     # Admin CRUD panel
```

**Resource Data Model:**
```
name · type · capacity · location · imagePath
availableFrom · availableTo · status · createdAt · updatedAt
```

---

### 📅 3. Booking Management
**Branch:** `feature/bookingmanagement`

The core reservation system — users book resources and admins approve or reject requests.

**Features:**
- Submit booking requests for any active campus resource
- Full approval workflow: `PENDING → APPROVED / REJECTED`
- Double-booking conflict detection at both creation and approval time
- HMAC-SHA256 signed QR codes for approved bookings
- Public QR verification endpoint for gate access (no login required)
- Busy-slot API to power the campus calendar view
- Notifications sent to users on approval or rejection
- Admin panel to manage all pending bookings

**Backend Files:**
```
bookingmanagement/
├── BookingController.java     # REST API layer
├── BookingService.java        # Business logic
├── QrService.java             # HMAC signing & QR PNG generation
└── dto/                       # Request & Response DTOs
    ├── BookingCreateRequest.java
    ├── BookingResponse.java
    ├── BusySlotResponse.java
    ├── RejectRequest.java
    └── VerifyQrRequest.java
```

**Frontend Pages:**
```
booking-management/
├── BookingsHubPage.jsx        # Booking section landing page
├── BookingFormPage.jsx        # Create a new booking
├── MyBookingsPage.jsx         # View own bookings + download QR
├── AdminBookingsPage.jsx      # Admin approval panel
└── QrVerifyPage.jsx           # Public QR code verification
```

**Booking Workflow:**
```
User submits form
      │
      ▼
 [PENDING] ──── Admin reviews ────▶ [APPROVED] ──▶ QR Code issued
                               │
                               └──▶ [REJECTED] ──▶ Reason sent to user
```

**API Endpoints:**

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/bookings` | User | Create a booking (returns 201) |
| `GET` | `/api/bookings/my` | User | Get my bookings |
| `GET` | `/api/bookings/{id}` | Owner / Admin | Get single booking |
| `GET` | `/api/bookings/{id}/qr` | Owner / Admin | Download QR as PNG |
| `GET` | `/api/bookings/busy?date=` | User | Get busy time slots |
| `GET` | `/api/bookings` | Admin | Get all bookings |
| `PUT` | `/api/bookings/{id}/approve` | Admin | Approve a booking |
| `PUT` | `/api/bookings/{id}/reject` | Admin | Reject with reason |
| `POST` | `/api/bookings/verify` | Public | Verify QR payload |

---

### 🔧 4. Maintenance Ticket Management
**Branch:** `feature/ticketmanagement`

Allows students and staff to report campus issues and track their resolution.

**Features:**
- Submit maintenance tickets with description and location
- Ticket status tracking: `OPEN`, `IN_PROGRESS`, `RESOLVED`
- Admin dashboard to manage and update all tickets
- Individual ticket detail view with full status history

**Frontend Pages:**
```
maintenance-tickets/
├── TicketCreatePage.jsx       # Report a new maintenance issue
├── TicketDashboardPage.jsx    # View and filter all tickets
└── TicketDetailPage.jsx       # Individual ticket detail view
```

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Java | 25 | Core language |
| Spring Boot | 4.0.3 | Application framework |
| Spring Security | 4.x | Authentication & authorization |
| Spring Data JPA | 4.x | ORM / database access |
| Spring Validation | 4.x | Request bean validation |
| jjwt | 0.12.5 | JWT token creation & parsing |
| Spring OAuth2 Client | 4.x | Google OAuth2 login |
| Google ZXing | 3.5.3 | QR code generation |
| Lombok | Latest | Boilerplate code reduction |
| MySQL Connector/J | Latest | MySQL JDBC driver |
| H2 | Latest | In-memory DB for tests |
| Maven | 3.x | Build & dependency management |

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI component framework |
| Vite | Build tool and dev server |
| React Router v6 | Client-side routing |
| Context API | Global auth state management |

### Database
| Technology | Purpose |
|------------|---------|
| MySQL 8.0 | Primary relational database |

---

## 📁 Project Structure

```
it3030-paf-2026-smart-campus/
│
├── backend/
│   └── smart-campus-api/
│       ├── pom.xml
│       └── src/main/java/com/sliit/smartcampus/
│           ├── bookingmanagement/
│           │   ├── BookingController.java
│           │   ├── BookingService.java
│           │   ├── QrService.java
│           │   └── dto/
│           ├── domain/
│           │   ├── entity/
│           │   │   ├── Booking.java
│           │   │   ├── Resource.java
│           │   │   └── User.java
│           │   └── enums/
│           │       ├── BookingStatus.java
│           │       ├── ResourceStatus.java
│           │       ├── ResourceType.java
│           │       └── UserRole.java
│           └── repository/
│               └── BookingRepository.java
│
└── frontend/
    └── smart-campus-ui/
        └── src/
            ├── App.jsx
            ├── auth/
            ├── layout/
            ├── routes/
            │   ├── ProtectedRoute.jsx
            │   └── AdminRoute.jsx
            ├── pages/
            │   └── HomePage.jsx
            └── modules/
                ├── auth-notifications/
                ├── facilities-assets/
                ├── booking-management/
                └── maintenance-tickets/
```

---

## 🚀 Getting Started

### Prerequisites

- Java 25+
- Node.js 18+
- MySQL 8.0+
- Maven 3.8+

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/it3030-paf-2026-smart-campus.git
cd it3030-paf-2026-smart-campus
```

---

### 2. Database Setup

```sql
CREATE DATABASE smart_campus
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

---

### 3. Backend Setup

```bash
cd backend/smart-campus-api
```

Create `src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/smart_campus
spring.datasource.username=root
spring.datasource.password=your_password

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

# JWT
app.jwt.secret=your_jwt_secret_key_minimum_32_characters_long
app.jwt.expiration-ms=86400000

# QR HMAC signing
app.qr.hmac-secret=your_qr_secret_key_min_16_chars

# Google OAuth2
spring.security.oauth2.client.registration.google.client-id=YOUR_GOOGLE_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_GOOGLE_CLIENT_SECRET
```

Run the backend:

```bash
./mvnw spring-boot:run
```

> API available at: `http://localhost:8080`

---

### 4. Frontend Setup

```bash
cd frontend/smart-campus-ui
npm install
npm run dev
```

> Frontend available at: `http://localhost:5173`

---

## 🔒 Environment Configuration

| Key | Description | Required |
|-----|-------------|----------|
| `spring.datasource.url` | MySQL JDBC connection URL | ✅ |
| `spring.datasource.username` | Database username | ✅ |
| `spring.datasource.password` | Database password | ✅ |
| `app.jwt.secret` | JWT signing secret (min 32 chars) | ✅ |
| `app.qr.hmac-secret` | QR code HMAC key (min 16 chars) | ✅ |
| `...google.client-id` | Google OAuth2 Client ID | ✅ |
| `...google.client-secret` | Google OAuth2 Client Secret | ✅ |

> ⚠️ **Never commit `application.properties` with real credentials to Git.** Add it to `.gitignore`.

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/oauth2/authorization/google` | Start Google OAuth2 flow |
| `GET` | `/auth/callback` | OAuth2 redirect callback |

### Bookings
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/bookings` | User | Create a new booking |
| `GET` | `/api/bookings/my` | User | Get my bookings |
| `GET` | `/api/bookings/{id}` | Owner/Admin | Get single booking |
| `GET` | `/api/bookings/{id}/qr` | Owner/Admin | Download QR as PNG |
| `GET` | `/api/bookings/busy?date=YYYY-MM-DD` | User | Get busy slots for a date |
| `GET` | `/api/bookings` | Admin | Get all bookings |
| `PUT` | `/api/bookings/{id}/approve` | Admin | Approve a booking |
| `PUT` | `/api/bookings/{id}/reject` | Admin | Reject with optional reason |
| `POST` | `/api/bookings/verify` | Public | Verify a QR payload |

### Resources
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/resources` | User | List all resources |
| `POST` | `/api/resources` | Admin | Create a resource |
| `PUT` | `/api/resources/{id}` | Admin | Update a resource |
| `DELETE` | `/api/resources/{id}` | Admin | Delete a resource |

### Tickets
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/tickets` | User/Admin | List tickets |
| `POST` | `/api/tickets` | User | Submit a ticket |
| `GET` | `/api/tickets/{id}` | User/Admin | Get ticket detail |
| `PUT` | `/api/tickets/{id}/status` | Admin | Update ticket status |

---

## 🗺️ Frontend Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Home page |
| `/login` | Public | Google login page |
| `/auth/callback` | Public | OAuth2 redirect handler |
| `/facilities` | Protected | Browse campus resources |
| `/facilities/:id/calendar` | Protected | Resource booking calendar |
| `/admin/resources` | Admin | Manage resources |
| `/bookings` | Protected | Bookings hub |
| `/bookings/new` | Protected | Create a booking |
| `/bookings/my` | Protected | My bookings and QR codes |
| `/bookings/verify` | Public | QR code verification |
| `/admin/bookings` | Admin | Booking approval panel |
| `/tickets` | Protected | Maintenance ticket dashboard |
| `/tickets/new` | Protected | Submit a maintenance ticket |
| `/tickets/:id` | Protected | Ticket detail view |

---

## 🗃️ Database Schema

### `bookings`
| Column | Type | Notes |
|--------|------|-------|
| `id` | BIGINT PK | Auto-increment |
| `resource_id` | BIGINT FK | → resources.id |
| `user_id` | BIGINT FK | → users.id |
| `approved_by` | BIGINT FK | → users.id (nullable) |
| `booking_date` | DATE | |
| `start_time` | TIME | |
| `end_time` | TIME | |
| `purpose` | TEXT | |
| `expected_attendees` | INT | |
| `status` | ENUM | PENDING, APPROVED, REJECTED, CANCELLED |
| `rejection_reason` | TEXT | nullable |
| `created_at` | DATETIME | set on insert |
| `updated_at` | DATETIME | set on insert and update |

### `resources`
| Column | Type | Notes |
|--------|------|-------|
| `id` | BIGINT PK | Auto-increment |
| `name` | VARCHAR(255) | |
| `type` | ENUM | ResourceType |
| `capacity` | INT | Max occupants |
| `location` | VARCHAR(255) | |
| `image_path` | VARCHAR(500) | nullable |
| `available_from` | TIME | Opening time |
| `available_to` | TIME | Closing time |
| `status` | ENUM | ACTIVE, INACTIVE, UNDER_MAINTENANCE |
| `created_at` | DATETIME | auto |
| `updated_at` | DATETIME | auto |

---

## 👥 Team

| Module | Developer | Branch |
|--------|-----------|--------|
| 🔐 Authentication & Notifications | Member 1 | `feature/authentication` |
| 🏢 Facilities & Asset Management | Member 2 | `feature/facilities-assest` |
| 📅 Booking Management | **Your Name** | `feature/bookingmanagement` |
| 🔧 Maintenance Ticket Management | Member 4 | `feature/ticketmanagement` |

---

## 📄 License

This project is developed for academic purposes as part of the **IT3030 — Programming and Frameworks** module at **SLIIT (Sri Lanka Institute of Information Technology)**, 2026.

---

<div align="center">

**Built with ❤️ by the Smart Campus Team — SLIIT 2026**

</div>
