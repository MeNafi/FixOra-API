# Admin & Test Credentials

These accounts are created by the seed script: `npm run seed`

## Admin

| Field | Value |
|---|---|
| Email | ` admin@example.com` |
| Password | `password123` |

> The admin is created from `ADMIN_EMAIL` and `ADMIN_PASSWORD` in your `.env` file.
> The public `/api/auth/register` endpoint can only create `CUSTOMER` or `TECHNICIAN` accounts —
> an admin can never be created from the outside.

## Test Technicians

| Name | Email | Password |
|---|---|---|
| Karim Hossain | `karim.tech@fixitnow.com` | `Tech@1234` |
| Nasrin Akter | `nasrin.tech@fixitnow.com` | `Tech@1234` |

## Test Customer

| Name | Email | Password |
|---|---|---|
| Tanvir Ahmed | `customer@fixitnow.com` | `Customer@1234` |

## Stripe test card

| Field | Value |
|---|---|
| Card number | `4242 4242 4242 4242` |
| Expiry | Any future date |
| CVC | Any 3 digits |
| ZIP | Any 5 digits |
