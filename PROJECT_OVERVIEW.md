# Project Overview: Spafy

## 1. Project Overview & Architecture

### Purpose & Primary Capabilities
**Spafy** is a modern, full-stack luxury salon and spa booking & management application designed to bridge the gap between salon owners and clients seeking wellness experiences. The platform provides end-to-end capabilities including:
* **Customer Service Catalog & Cart:** Browsing dynamic salon service offerings, adding services to a real-time cart, and calculating appointment totals.
* **Appointment Booking & Slot Management:** Booking appointments with built-in time slot overlap detection to prevent double-booking.
* **Payment Integration:** Secure order creation and online checkout via the **Razorpay** payment gateway API.
* **Salon Owner Authentication:** Account registration, JWT-based session authorization, and **Google OAuth 2.0** single sign-on flow.
* **Salon Owner Management Dashboard:** Comprehensive dashboard for salon owners to track daily/total booking statistics, manage client queues, review transactions, and update business operation details.

### Core Architecture & Structural Layout
The application follows a **decoupled client-server architecture**:

```
+-------------------------------------------------------+
|                   Client (Frontend)                   |
|  React 19 + Vite SPA | Zustand | TanStack React Query |
+---------------------------+---------------------------+
                            |
                     REST API / HTTP
                            |
+---------------------------v---------------------------+
|                   Server (Backend)                    |
|  Node.js + Express 5 | JWT Auth | Google OAuth 2.0    |
+---------------------------+---------------------------+
                            |
                       Mongoose ODM
                            |
+---------------------------v---------------------------+
|                   Database & Cloud                    |
|            MongoDB Database | Razorpay API            |
+-------------------------------------------------------+
```

* **Frontend Layer (`/frontend`):** Built as a Single Page Application (SPA) using **React 19** and **Vite**, styled with **TailwindCSS (v4)**. Global state management for service carts and checkout flows is powered by **Zustand**. Data fetching, caching, and server state synchronization use **TanStack React Query**. Page animations and splash screen transitions leverage **Framer Motion (`motion/react`)**.
* **Backend Layer (`/backend`):** Built on **Node.js** running **Express 5** configured as an ES Module environment (`"type": "module"`). Database persistence is managed via **Mongoose ODM** connected to **MongoDB**. Authentication uses **JSON Web Tokens (JWT)** stored in HTTP cookies and **bcrypt** for password hashing, alongside **Google Auth Library** for OAuth verification. Payloads are validated using **Zod** schemas.

---

## 2. Tech Stack & Dependencies

### Core Languages & Frameworks
* **Language:** JavaScript (ES2022+ / ES Modules)
* **Backend Framework:** Express 5 (`express@^5.2.1`) running on Node.js (v18+)
* **Frontend Framework:** React 19 (`react@^19.2.7`, `react-dom@^19.2.7`)
* **Build Tooling:** Vite 8 (`vite@^8.1.1`, `@vitejs/plugin-react@^6.0.3`)

### Libraries & Packages

#### Backend (`/backend/package.json`)
| Package | Version | Role / Responsibility |
| :--- | :--- | :--- |
| `express` | `^5.2.1` | Web framework & API routing engine |
| `mongoose` | `^9.8.0` | MongoDB Object Data Modeling (ODM) |
| `bcrypt` | `^6.0.0` | Password hashing & verification |
| `jsonwebtoken` | `^9.0.3` | JWT authentication token generation |
| `google-auth-library` | `^11.0.2` | Google OAuth 2.0 token verification |
| `razorpay` | `^2.9.8` | Payment order creation & gateway SDK |
| `zod` | `^4.5.4` | Data schema definition & API payload validation |
| `cors` | `^2.8.6` | Cross-Origin Resource Sharing middleware |
| `dotenv` | `^17.4.2` | Environment variables loader |

#### Frontend (`/frontend/package.json`)
| Package | Version | Role / Responsibility |
| :--- | :--- | :--- |
| `react` / `react-dom` | `^19.2.7` | UI component library & DOM renderer |
| `react-router-dom` | `^7.18.1` | Client-side routing engine |
| `zustand` | `^5.0.14` | Client-side global state management |
| `@tanstack/react-query`| `^5.101.4` | Server state management & caching |
| `axios` | `^1.18.1` | HTTP request client |
| `tailwindcss` / `@tailwindcss/vite` | `^4.3.3` | Utility-first CSS engine & Vite plugin |
| `motion` | `^12.42.2` | Declarative UI animations (Framer Motion) |
| `react-icons` | `^5.7.0` | Icon library |
| `react-calendar` / `@daypicker/react` | `^6.0.1` / `^10.0.1` | Date selection & calendar components |

### Infrastructure & Tooling
* **Development Process Management:** `nodemon` (backend live reload) and Vite dev server (`http://localhost:5173`).
* **Code Linting:** ESLint 10 (`eslint@^10.6.0`, `@eslint/js`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`).
* **Environment Configuration:** Managed via `.env` files in both backend (MongoDB URI, JWT secret, Razorpay test credentials, Google OAuth client secrets) and frontend (`Vite_Razorpay_Key`).

---

## 3. Currently Implemented Features

### Authentication & Authorization Module
* **User Signup & Login:** Email/password registration and login handlers with password hashing (`bcrypt`) and cookie-based JWT token generation (`/api/auth/signup`, `/api/auth/login`, `/api/auth/logout`).
* **Google OAuth 2.0 Login:** Redirect URL generator and OAuth callback verifier utilizing `google-auth-library` (`/api/auth/google`, `/api/auth/google/callback`).
* **Role-Based Protection Middleware:** `protectRoute` (JWT verification) and `ownerOnly` (verifying role is `"owner"` or `"admin"`).
* **Salon Owner Login Page (`/salon/login`):** React page component featuring email/password input toggles, responsive layout, and Google OAuth redirection button.

### Salon Management Module
* **Public Salon Browsing:** Paginated list of active salons (`GET /api/salons`) and detailed salon view by ID (`GET /api/salons/:id`).
* **Owner Salon Dashboard Endpoints:** Retrieval of salons registered by the authenticated owner (`GET /api/salons/my-salons`).
* **Salon Registration & CRUD:** Endpoints for creating (`POST /api/salons`), updating (`PATCH /api/salons/:id`), and soft-deleting (`DELETE /api/salons/:id`) salon locations.
* **Salon Registration Interface (`/salon/register`):** Multi-section form allowing owners to register business metadata, address details, and day-by-day opening/closing hours.

### Services & Dynamic Cart Module
* **Service Catalog Engine:** Backend endpoints (`/api/salons/fetch-services`) querying active salon services from MongoDB.
* **Master Service Schemas:** Hierarchical database models separating master categories (`Category.js`), global master services (`MasterService.js`), and salon-customized service offerings (`SalonService.js`).
* **Customer Services Catalog Page (`/salon/:name`):** 
  * Animated **Splash Screen** on entry with cursor-following atmospheric watermark movement.
  * Interactive **Service Cards** displaying pricing, duration, and descriptions.
  * **Zustand Cart Store (`services-store.jsx`)** supporting dynamic service addition, removal, toggle, and subtotal calculation.
  * **Slide-out Cart Drawer (`services-cart.jsx`)** with instant checkout navigation.

### Booking & Availability System
* **Slot Availability Engine (`bookService.js`):** Business logic (`isSlotAvailable`) computing start/end timestamp ranges against duration minutes and querying MongoDB for slot conflicts.
* **User Appointment Booking:** 
  * Creating new appointments (`POST /api/user/booking/book`).
  * Viewing user booking history (`GET /api/user/booking/my-bookings`) and specific booking details (`GET /api/user/booking/:id`).
  * Cancelling (`PATCH /api/user/booking/cancel/:id`) and rescheduling (`PATCH /api/user/booking/reschedule/:id`) existing bookings.
  * Querying slot availability real-time (`POST /api/user/booking/check-slot`).
* **Owner Appointment Controls:** Endpoints for salon owners to view all bookings (`GET /api/owner/booking/all`), view today's schedule (`GET /api/owner/booking/today`), update booking status (`PATCH /api/owner/booking/:id/status`), and cancel appointments (`PATCH /api/owner/booking/:id/cancel`).

### Payment Integration Module
* **Razorpay Order Creation:** Backend payment controller (`POST /api/payment/create-order`) initiating Razorpay orders in INR.
* **Payment Records Schema (`Payment.js`):** Database tracking for `bookingId`, `userId`, `salonId`, `razorpayOrderId`, `razorpayPaymentId`, `amount`, and payment state (`pending`, `success`, `failed`, `refunded`).
* **Frontend Razorpay Flow (`Razorpay.jsx`):** Helper component invoking Razorpay checkout modal via `window.Razorpay`.
* **Checkout Layout (`/salon/checkout`):** Customer checkout view displaying selected reservation services, user details, terms toggle, and order total.

### Salon Owner Dashboard Interface
* **Owner Overview Dashboard (`/salon/dashboard`):** React dashboard layout featuring:
  * Key metrics summary cards (Total Bookings, Advance Payments).
  * Visual progress bars for top booked services today.
  * Real-time client appointment queue.
  * Recent transactions table showing client name, service type, amount, and booking status.

---

## 4. In Progress & Planned Features

### Partially Implemented Logic & Stubs
* **Empty / Unpopulated State Stores:**
  * `frontend/src/stores/auth-store.jsx` (0 bytes) – State management for authenticated user profile session on the frontend is currently a stub placeholder.
  * `frontend/src/stores/dashboard-store.jsx` (0 bytes) – State management for owner dashboard metrics and live filters is currently a stub placeholder.
* **Unused Routing File:**
  * `frontend/src/Routes.jsx` (0 bytes) – Routing declarations are currently configured inside `App.jsx`, leaving `Routes.jsx` as an empty file.
* **Google OAuth Persistence Logic:**
  * In `backend/src/controllers/auth.controller.js`, `googleCallback` currently retrieves user profile payload from Google but has database user lookup/creation and refresh token creation logic commented out before redirecting to the frontend.
* **Cloudinary Profile Picture Uploads:**
  * In `auth.controller.js`, `updateProfile` calls `cloudinary.uploader.upload()`, but `cloudinary` is not included in `package.json` dependencies nor imported in the file.
* **Staff Member Allocation:**
  * `backend/src/models/Booking.js` contains index definitions for `staffId`, but the field `staffId` is currently commented out in the schema definition. The `Staff.js` model exists but is not yet fully referenced in active booking controllers.
* **Hardcoded API Base URLs:**
  * `frontend/src/api/axiosClient.js` contains standard interceptor setup pointing to placeholder `https://api.yourdomain.com`, while `services-queries.js` and `Razorpay.jsx` use hardcoded `http://localhost:8080` API targets.
* **Zod Schema Validator Middleware Integration:**
  * Zod schemas exist in `backend/src/validators/` (`bookingValidator.js`, `paymentValidator.js`, `salonValidators.js`, etc.), but `validateMiddleware.js` is not yet applied as middleware across all Express route handlers.

---

## 5. Directory Structure Map

```
spafy/
├── PROJECT_OVERVIEW.md             # Project documentation & architecture overview
├── backend/                        # Express 5 REST API Node.js application
│   ├── server.js                   # Application entry point, middleware setup & server launch
│   ├── dataInit.js                 # Database seed script for initial testing data
│   ├── package.json                # Backend dependency manifest & npm scripts
│   └── src/
│       ├── controllers/            # API request handlers
│       │   ├── auth.controller.js  # User auth, registration, login & Google OAuth handlers
│       │   ├── salonController.js  # Salon CRUD operations & owner listing logic
│       │   ├── userBookingController.js  # Customer booking creation, slot checks & rescheduling
│       │   ├── ownerBookingController.js # Owner schedule view & booking status management
│       │   ├── paymentController.js# Razorpay payment order generator
│       │   └── salon.js            # Services fetch controller
│       ├── lib/                    # Shared backend utilities
│       │   ├── db.js               # MongoDB connection handler
│       │   └── utils.js            # JWT token creation & cookie configuration
│       ├── middleware/             # Express middlewares
│       │   ├── auth.middleware.js  # Protects routes by validating JWT tokens
│       │   ├── owner.middleware.js # Restricts endpoints to users with "owner" role
│       │   └── validateMiddleware.js # Zod validation payload wrapper
│       ├── models/                 # Mongoose database models
│       │   ├── User.js             # User accounts (user, owner, admin roles)
│       │   ├── Salon.js            # Salon profile, address, slug & operating hours
│       │   ├── SalonService.js     # Individual salon service pricing & duration
│       │   ├── Booking.js          # Customer booking record & status workflow
│       │   ├── Payment.js          # Razorpay payment tracking records
│       │   ├── Category.js         # Master service categories
│       │   ├── MasterService.js    # Master service catalog definitions
│       │   ├── Staff.js            # Salon staff members
│       │   └── Review.js           # Salon customer reviews
│       ├── routes/                 # Express route definitions
│       │   ├── auth.route.js       # Auth & Google OAuth endpoints (`/api/auth`)
│       │   ├── salonRoute.js       # Salon discovery & owner CRUD (`/api/salons`)
│       │   ├── userBookingRoute.js # Customer booking endpoints (`/api/user/booking`)
│       │   ├── ownerBookingRoute.js# Owner booking management (`/api/owner/booking`)
│       │   └── paymentRoutes.js    # Razorpay payment routes (`/api/payment`)
│       ├── services/               # Core business logic helpers
│       │   ├── bookService.js      # Appointment end-time & slot overlap collision logic
│       │   └── googleAuthService.js# Google OAuth2 client & ID token verifier
│       └── validators/             # Zod validation schema definitions
│
└── frontend/                       # React 19 + Vite Frontend SPA
    ├── index.html                  # Core HTML file with Google Fonts & Material Symbols
    ├── vite.config.js              # Vite build setup with React & Tailwind plugins
    ├── package.json                # Frontend manifests, Tailwind v4 & npm scripts
    └── src/
        ├── main.jsx                # React app mounting point with Providers
        ├── App.jsx                 # Top-level routing setup with React Router
        ├── Routes.jsx              # [Stub] Empty route file placeholder
        ├── api/                    # HTTP client configuration
        │   └── axiosClient.js      # Axios instance with request/response interceptors
        ├── checkout/               # Checkout module
        │   ├── checout-layout.jsx  # Main checkout layout wrapper
        │   ├── reservation.jsx     # Reservation summary & user info card
        │   └── footer.jsx          # Checkout footer
        ├── dashboard/              # Salon Owner Dashboard UI
        │   ├── dashboard-layout.jsx# Owner dashboard grid view with statistics
        │   ├── sidebar.jsx         # Dashboard navigation bar
        │   ├── header.jsx          # Dashboard top bar
        │   └── dashboard-card.jsx  # Metric display card components
        ├── login/                  # Authentication view
        │   ├── salonLogin.jsx      # Salon owner login page with Google OAuth button
        │   └── salonLogin.css      # Login page styles
        ├── pages/                  # Miscellaneous page components
        │   └── Razorpay.jsx        # Razorpay modal integration component
        ├── queries/                # TanStack React Query hooks
        │   └── services-queries.js # React Query hook (`useServices`) fetching catalog services
        ├── registration/           # Salon Registration module
        │   ├── register-salon.jsx  # Multi-step salon registration form
        │   └── register-salon.css  # Registration page styling
        ├── services-page/          # Customer Salon Browsing View
        │   ├── services-layout.jsx # Orchestrates splash screen and main catalog transition
        │   ├── homepage-layout.jsx # Main catalog view rendering service cards & cart drawer
        │   ├── splash.jsx          # Animated branding splash screen
        │   ├── service-card.jsx    # Individual service display card
        │   ├── services-cart.jsx   # Interactive slide-out cart drawer
        │   ├── hero.jsx            # Hero banner section
        │   ├── header.jsx          # Navigation header with cart badge
        │   └── bottom-nav.jsx      # Sticky mobile navigation bar
        └── stores/                 # Zustand global state stores
            ├── services-store.jsx  # Services cart state store (items, drawer state)
            ├── checkout-store.jsx  # Checkout form state store & total calculation
            ├── auth-store.jsx      # [Stub] Auth state store placeholder
            └── dashboard-store.jsx # [Stub] Dashboard state store placeholder
```
