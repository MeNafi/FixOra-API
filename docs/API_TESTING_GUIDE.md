# End-to-End Testing Guide

A single walkthrough that exercises the whole booking and payment lifecycle.
Import `FixOra-API.postman_collection.json` into Postman first — login requests store the access
token automatically, so you never have to copy it by hand.

---

### 1. Seed and start

```bash
npm run prisma:migrate
npm run seed
npm run dev
```

In a second terminal, forward Stripe events:

```bash
npm run stripe:webhook
```

---

### 2. Admin creates a category

- **Login - Admin** (`admin@fixitnow.com` / `Admin@1234`)
- **Admin → Create Category** — the returned `id` is saved into `{{categoryId}}`

---

### 3. Technician sets up shop

- **Login - Technician** (`karim.tech@fixitnow.com` / `Tech@1234`)
- **Technician → Update Technician Profile** — set skills, experience and hourly rate
- **Technician → Update Availability** — set weekly slots
- **Technician → Create Service** — uses `{{categoryId}}`

---

### 4. Customer browses and books

- **Public → Get All Services** — copy a service `id` into `{{serviceId}}`
- **Login - Customer** (`customer@fixitnow.com` / `Customer@1234`)
- **Bookings → Create Booking** — `{{bookingId}}` is saved automatically
  Booking status is now `REQUESTED`

---

### 5. Technician accepts

- **Login - Technician**
- **Technician → Accept Booking** → status becomes `ACCEPTED`

Try **Start Job (In Progress)** here — it should be rejected, because payment has not happened yet.
That is the status-flow guard working.

---

### 6. Customer pays through Stripe

- **Login - Customer**
- **Payments → Create Payment Session** — open the returned `paymentUrl` in a browser
- Pay with test card `4242 4242 4242 4242`, any future expiry, any CVC
- The Stripe CLI forwards `checkout.session.completed` to the webhook, which marks the payment
  `COMPLETED` and the booking `PAID`
- If you are not running the Stripe CLI, call **Payments → Confirm Payment** instead — it asks
  Stripe directly whether the session was paid

Check with **Payments → Get My Payments**.

---

### 7. Technician completes the job

- **Login - Technician**
- **Technician → Start Job (In Progress)** → `IN_PROGRESS`
- **Technician → Complete Job** → `COMPLETED`

---

### 8. Customer reviews

- **Login - Customer**
- **Reviews → Create Review** — rating 1–5
- **Public → Get Technician By Id** — `avgRating` and `totalReviews` have been recalculated

---

### 9. Admin oversight

- **Login - Admin**
- **Admin → Dashboard Stats**, **Get All Users**, **Get All Bookings**, **Get All Payments**
- **Admin → Ban User** then try logging in as that user — login is refused

---

## Error responses worth checking

| Request | Expected |
|---|---|
| **Error Handling Examples → 404 - Unknown Route** | 404, `{ success, message, errorDetails }` |
| **Error Handling Examples → 400 - Validation Error** | 400 with a field-level `errorDetails` array |
| **Error Handling Examples → 401 - Unauthorized** | 401, no token supplied |
| Create a booking for a service you own | 400, cannot book your own service |
| Review a booking that is not `COMPLETED` | 400 |
| Customer calling an `/api/admin/*` route | 403 |
| Paying for a booking that is still `REQUESTED` | 400 |
