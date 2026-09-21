<div align="center">

# FixOra-API 🔧

**Your Trusted Home Service Platform**

A modern backend RESTful API powering a home services marketplace where customers can seamlessly browse services, book skilled technicians, process secure Stripe payments, and post verified reviews.

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white)](https://zod.dev/)
[![Stripe](https://img.shields.io/badge/Stripe-6366F1?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)
[![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)](https://www.postman.com/)
[![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://swagger.io/)

</div>

---

## 🛠️ Tech Stack Architecture

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Runtime Environment** | **Node.js** | JavaScript V8 Runtime Engine |
| **Language** | **TypeScript** | Type-safe Backend Architecture |
| **Web Framework** | **Express 5** | High-performance Routing & Middleware |
| **Database** | **PostgreSQL** | Relational Database Management System |
| **ORM** | **Prisma 7** | Modern Type-safe Query Builder |
| **Authentication** | **JWT & Zod v4** | Token-based Auth & Schema Validation |
| **Payments** | **Stripe API** | Secure Payment Gateway Integration |
| **API Documentation**| **Swagger & Postman** | Interactive API Specs & Testing Collections |

---

## 📚 API Documentation

> 📮 **Interactive Postman Documentation**  
> Access full endpoint details, request payloads, response schemas, and authentication flows.
>
<p align="left">
  <a href="https://documenter.getpostman.com/view/54899242/2sBYB1PoQQ" target="_blank">
    <img src="https://run.pstmn.io/button.svg" alt="Run In Postman" width="128" height="32">
  </a>
</p>

👉 **[Explore Full API Documentation →](https://documenter.getpostman.com/view/54899242/2sBYB1PoQQ)**
>

---

## 🚀 Live API

> ▲ **Deployed on Vercel**  
> Access the live FixOra REST API deployed and hosted on Vercel.

> [![Live API](https://img.shields.io/badge/Live%20API-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://fixora-api-chi.vercel.app/)

👉 [**Explore Live API →**](https://fixora-api-chi.vercel.app/)

---

## 🚀 Getting Started

```bash
# 1. install dependencies
npm install

# 2. create your .env file (copy .env.example and fill in the values)
cp .env.example .env

# 3. generate the Prisma client
npm run prisma:generate

# 4. run the migration
npm run prisma:migrate

# 5. seed the database (creates the admin, categories and demo users)
npm run seed

# 6. start the dev server
npm run dev
```

The server runs on `http://localhost:5000` by default.

### Stripe webhook (local testing)

```bash
npm run stripe:webhook
# => stripe listen --forward-to localhost:5000/api/payments/webhook
```

Copy the `whsec_...` value the CLI prints into `STRIPE_WEBHOOK_SECRET` in your `.env`.

---

## 📚 API Documentation

| Resource | URL |
|---|---|
| Swagger UI | `http://localhost:5000/api-docs` |
| Raw OpenAPI JSON | `http://localhost:5000/api-docs.json` |
| Postman collection | `docs/FixItNow.postman_collection.json` |

To use the Postman collection, import it and set the `baseUrl` variable (default `http://localhost:5000`). The login requests automatically save the returned `accessToken` into the collection variables, so protected requests work straight away.

---

## 🧱 Project Structure

```
prisma/
  schema/            # multi-file Prisma schema (one model per file)
  migrations/
  seed.ts
src/
  config/            # env loader
  lib/               # prisma + stripe singletons
  middlewares/       # auth, validateRequest, notFound, globalErrorHandler
  utils/             # catchAsync, sendResponse, AppError, jwt, pick
  docs/swagger.ts    # OpenAPI 3.0 spec
  routes/index.ts    # central route registry
  modules/
    auth/ user/ category/ service/
    technician/ booking/ payment/ review/ admin/
  app.ts
  server.ts
```

Every module follows the same pattern: `*.interface.ts` → `*.validation.ts` → `*.service.ts` → `*.controller.ts` → `*.route.ts`.

---

## 👥 Roles & Permissions

| Role | Permissions |
|---|---|
| **CUSTOMER** | Browse services/technicians, book, pay, track bookings, cancel (before IN_PROGRESS), leave reviews, manage profile |
| **TECHNICIAN** | Create/update service profile & services, set availability, view bookings, accept/decline, mark in-progress/completed |
| **ADMIN** | View all users, ban/unban, view all bookings & payments, manage service categories, dashboard stats |

Users choose `CUSTOMER` or `TECHNICIAN` at registration. `ADMIN` accounts can only be created through the seed script — never through the public register endpoint.

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a customer or technician |
| POST | `/api/auth/login` | Public | Login, returns JWT access + refresh tokens |
| POST | `/api/auth/refresh-token` | Public | Issue a new access token |
| GET | `/api/auth/me` | Authenticated | Get the current user |

### User Profile
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/users/me` | Authenticated | Get my profile |
| PUT | `/api/users/me` | Authenticated | Update my profile |

### Public Browsing
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/categories` | All service categories |
| GET | `/api/services` | All services — filter by `searchTerm`, `category`, `categoryId`, `location`, `minPrice`, `maxPrice`, `minRating`, paginate with `page`/`limit`, sort with `sortBy`/`sortOrder` |
| GET | `/api/services/:id` | Single service detail |
| GET | `/api/technicians` | All technicians — filter by `searchTerm`, `skill`, `minRating`, `minRate`, `maxRate`, `location` |
| GET | `/api/technicians/:id` | Technician profile with services and reviews |
| GET | `/api/reviews/technician/:technicianId` | All reviews for a technician |

### Bookings
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/bookings` | Customer | Create a booking |
| GET | `/api/bookings` | Customer / Technician | My bookings (filter by `status`) |
| GET | `/api/bookings/:id` | Owner / Assigned tech / Admin | Booking details |
| PATCH | `/api/bookings/:id/cancel` | Customer | Cancel before IN_PROGRESS |

### Payments (Stripe)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/payments/create` | Customer | Create a Stripe Checkout session for an ACCEPTED booking |
| POST | `/api/payments/confirm` | Public (verified with Stripe) | Verify a session and mark the booking PAID |
| POST | `/api/payments/webhook` | Stripe only | Signature-verified webhook |
| GET | `/api/payments` | Authenticated | My payment history (filter by `status`) |
| GET | `/api/payments/:id` | Owner / Admin | Payment details |

### Technician Management
| Method | Endpoint | Access | Description |
|---|---|---|---|
| PUT | `/api/technician/profile` | Technician | Update skills, experience, pricing, bio |
| GET | `/api/technician/availability` | Technician | My availability slots |
| PUT | `/api/technician/availability` | Technician | Replace availability slots (day names, e.g. `MONDAY`) |
| GET | `/api/technician/bookings` | Technician | Bookings assigned to me |
| PATCH | `/api/technician/bookings/:id` | Technician | Accept / decline / start / complete |
| POST | `/api/services` | Technician | Create a service |
| GET | `/api/services/my-services` | Technician | My services |
| PATCH | `/api/services/:id` | Technician | Update my service |
| DELETE | `/api/services/:id` | Technician | Delete my service |

### Reviews
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/reviews` | Customer | Leave a review after COMPLETED |
| GET | `/api/reviews/my-reviews` | Customer | Reviews I have written |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/stats` | Dashboard counters and total revenue |
| GET | `/api/admin/users` | All users (filter by `role`, `activeStatus`, `searchTerm`) |
| GET | `/api/admin/users/:id` | Single user detail |
| PATCH | `/api/admin/users/:id` | Ban / unban a user |
| PATCH | `/api/admin/technicians/:id/verify` | Verify / unverify a technician |
| GET | `/api/admin/bookings` | All bookings |
| GET | `/api/admin/payments` | All payments |
| GET | `/api/admin/categories` | All categories |
| POST | `/api/admin/categories` | Create a category |
| PATCH | `/api/admin/categories/:id` | Update a category |
| DELETE | `/api/admin/categories/:id` | Delete a category |

---

## 📊 Booking Status Flow

```
REQUESTED ──accept──> ACCEPTED ──pay (Stripe)──> PAID ──start──> IN_PROGRESS ──finish──> COMPLETED
    │                                                                                        │
    └──decline──> DECLINED                                                          review allowed
    
Customer may CANCEL at any point before IN_PROGRESS.
```

Every transition is enforced server-side. For example a technician cannot mark a booking `IN_PROGRESS` until payment has actually been confirmed by Stripe, and a review can only be created once the booking is `COMPLETED`.

---

## ✅ Response Format

**Success**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Services retrieved successfully",
  "data": [],
  "meta": { "page": 1, "limit": 10, "total": 24, "totalPages": 3 }
}
```

**Error** — every error in the API, including 404s and validation failures, returns this shape:
```json
{
  "success": false,
  "message": "Validation Error",
  "errorDetails": [
    { "path": "email", "message": "Provide a valid email address" }
  ]
}
```

Handled cases include Zod validation errors, JWT errors (invalid/expired), Prisma errors (`P2002` duplicate, `P2003` foreign key, `P2025` not found, connection errors), permission errors, and unmatched routes.

---

## 💳 Payment Flow

1. Customer books a service → booking is `REQUESTED`.
2. Technician accepts → booking is `ACCEPTED`.
3. Customer calls `POST /api/payments/create` → the API creates a **Stripe Checkout Session** and returns `paymentUrl`.
4. Customer completes payment on Stripe's hosted page.
5. Stripe calls `POST /api/payments/webhook` (signature verified with `STRIPE_WEBHOOK_SECRET`) → the payment is marked `COMPLETED` and the booking becomes `PAID`.
6. As a fallback, the success redirect can call `POST /api/payments/confirm`, which retrieves the session from Stripe and verifies `payment_status === "paid"` before updating anything. Both paths are idempotent.

Payments are never marked paid based on client input alone — the state always comes from Stripe.
