// Served as JSON at GET /api-docs.json and rendered by Swagger UI at GET /api-docs

const bearerAuth = [{ bearerAuth: [] }];

const errorResponse = {
    description: "Structured error response",
    content: {
        "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" }
        }
    }
};

const commonResponses = {
    400: errorResponse,
    401: errorResponse,
    403: errorResponse,
    404: errorResponse,
    500: errorResponse
};

export const swaggerSpec = {
    openapi: "3.0.3",
    info: {
        title: "FixItNow API",
        version: "1.0.0",
        description:
            "Backend API for FixItNow, a home services marketplace. Customers book technicians for services, " +
            "pay through Stripe Checkout, and leave reviews. Technicians manage profiles, availability and jobs. " +
            "Admins manage users, bookings and service categories.\n\n" +
            "**Error format** — every error returns `{ success: false, message: string, errorDetails: any }`.\n\n" +
            "**Auth** — send the JWT as `Authorization: Bearer <accessToken>`. Login also sets httpOnly cookies."
    },
    servers: [
        { url: "http://localhost:5000", description: "Local development" }
    ],
    tags: [
        { name: "Auth", description: "Registration, login, token refresh and current user" },
        { name: "Users", description: "Logged-in user profile" },
        { name: "Public", description: "Public browsing of services, technicians and categories" },
        { name: "Technician", description: "Technician-only profile, availability and job management" },
        { name: "Bookings", description: "Booking lifecycle" },
        { name: "Payments", description: "Stripe payment processing" },
        { name: "Reviews", description: "Customer reviews" },
        { name: "Admin", description: "Admin-only platform management" }
    ],
    components: {
        securitySchemes: {
            bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
        },
        schemas: {
            ErrorResponse: {
                type: "object",
                properties: {
                    success: { type: "boolean", example: false },
                    message: { type: "string", example: "Validation Error" },
                    errorDetails: {
                        example: [{ path: "email", message: "Provide a valid email address" }]
                    }
                }
            },
            SuccessResponse: {
                type: "object",
                properties: {
                    success: { type: "boolean", example: true },
                    statusCode: { type: "integer", example: 200 },
                    message: { type: "string", example: "Operation successful" },
                    data: { type: "object" },
                    meta: {
                        type: "object",
                        properties: {
                            page: { type: "integer", example: 1 },
                            limit: { type: "integer", example: 10 },
                            total: { type: "integer", example: 42 },
                            totalPages: { type: "integer", example: 5 }
                        }
                    }
                }
            },
            RegisterRequest: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                    name: { type: "string", example: "Rahim Uddin" },
                    email: { type: "string", format: "email", example: "rahim@example.com" },
                    password: { type: "string", minLength: 6, example: "Pass@1234" },
                    phone: { type: "string", example: "+8801711223344" },
                    address: { type: "string", example: "Savar, Dhaka" },
                    role: { type: "string", enum: ["CUSTOMER", "TECHNICIAN"], example: "CUSTOMER" },
                    bio: { type: "string", description: "Technician only" },
                    skills: { type: "array", items: { type: "string" }, description: "Technician only" },
                    experienceYears: { type: "integer", description: "Technician only" },
                    hourlyRate: { type: "number", description: "Technician only" }
                }
            },
            LoginRequest: {
                type: "object",
                required: ["email", "password"],
                properties: {
                    email: { type: "string", format: "email", example: "admin@fixitnow.com" },
                    password: { type: "string", example: "Admin@1234" }
                }
            },
            UpdateUserProfileRequest: {
                type: "object",
                properties: {
                    name: { type: "string", example: "Rahim Uddin" },
                    phone: { type: "string", example: "+8801711223344" },
                    address: { type: "string", example: "Mirpur, Dhaka" },
                    profilePhoto: { type: "string", format: "uri", example: "https://example.com/me.jpg" }
                }
            },
            TechnicianProfileRequest: {
                type: "object",
                properties: {
                    bio: { type: "string", example: "Licensed plumber with 8 years of experience." },
                    skills: { type: "array", items: { type: "string" }, example: ["plumbing", "pipe-fitting"] },
                    experienceYears: { type: "integer", example: 8 },
                    hourlyRate: { type: "number", example: 600 },
                    location: { type: "string", example: "Savar, Dhaka" },
                    nidNumber: { type: "string", example: "1990123456789" },
                    isAvailable: { type: "boolean", example: true }
                }
            },
            AvailabilityRequest: {
                type: "object",
                required: ["slots"],
                properties: {
                    slots: {
                        type: "array",
                        items: {
                            type: "object",
                            required: ["dayOfWeek", "startTime", "endTime"],
                            properties: {
                                dayOfWeek: {
                                    type: "string",
                                    enum: ["SATURDAY", "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
                                    example: "MONDAY"
                                },
                                startTime: { type: "string", example: "09:00" },
                                endTime: { type: "string", example: "17:00" }
                            }
                        }
                    }
                }
            },
            ServiceRequest: {
                type: "object",
                required: ["title", "price", "categoryId"],
                properties: {
                    title: { type: "string", example: "Emergency Pipe Leak Repair" },
                    description: { type: "string", example: "Fast on-site repair for leaking pipes and fittings." },
                    price: { type: "number", example: 1500 },
                    durationMin: { type: "integer", example: 90, description: "How long the job takes, in minutes" },
                    categoryId: { type: "string", format: "uuid" },
                    isActive: { type: "boolean", example: true }
                }
            },
            BookingRequest: {
                type: "object",
                required: ["serviceId", "scheduledAt", "address"],
                properties: {
                    serviceId: { type: "string", format: "uuid" },
                    scheduledAt: { type: "string", format: "date-time", example: "2026-10-01T10:00:00.000Z" },
                    address: { type: "string", example: "House 12, Road 4, Savar, Dhaka" },
                    note: { type: "string", example: "Kitchen sink is leaking badly." }
                }
            },
            BookingStatusRequest: {
                type: "object",
                required: ["status"],
                properties: {
                    status: {
                        type: "string",
                        enum: ["ACCEPTED", "DECLINED", "IN_PROGRESS", "COMPLETED"],
                        example: "ACCEPTED"
                    },
                    reason: { type: "string", example: "Fully booked that day", description: "Optional, used when declining" }
                }
            },
            PaymentCreateRequest: {
                type: "object",
                required: ["bookingId"],
                properties: {
                    bookingId: { type: "string", format: "uuid" }
                }
            },
            PaymentConfirmRequest: {
                type: "object",
                properties: {
                    sessionId: { type: "string", example: "cs_test_a1b2c3" },
                    transactionId: { type: "string", example: "TXN-0f0e1a..." }
                }
            },
            ReviewRequest: {
                type: "object",
                required: ["bookingId", "rating"],
                properties: {
                    bookingId: { type: "string", format: "uuid" },
                    rating: { type: "integer", minimum: 1, maximum: 5, example: 5 },
                    comment: { type: "string", example: "Arrived on time and fixed everything." }
                }
            },
            CategoryRequest: {
                type: "object",
                required: ["name"],
                properties: {
                    name: { type: "string", example: "Plumbing" },
                    description: { type: "string", example: "Pipes, taps, drains and water systems." },
                    icon: { type: "string", example: "faucet" },
                    isActive: { type: "boolean", example: true }
                }
            },
            UserStatusRequest: {
                type: "object",
                required: ["activeStatus"],
                properties: {
                    activeStatus: { type: "string", enum: ["ACTIVE", "BLOCKED"], example: "BLOCKED" }
                }
            }
        }
    },
    paths: {
        "/api/auth/register": {
            post: {
                tags: ["Auth"],
                summary: "Register a new customer or technician",
                requestBody: {
                    required: true,
                    content: { "application/json": { schema: { $ref: "#/components/schemas/RegisterRequest" } } }
                },
                responses: { 201: { description: "User registered" }, ...commonResponses }
            }
        },
        "/api/auth/login": {
            post: {
                tags: ["Auth"],
                summary: "Login and receive access + refresh tokens",
                requestBody: {
                    required: true,
                    content: { "application/json": { schema: { $ref: "#/components/schemas/LoginRequest" } } }
                },
                responses: { 200: { description: "Logged in" }, ...commonResponses }
            }
        },
        "/api/auth/refresh-token": {
            post: {
                tags: ["Auth"],
                summary: "Issue a new access token from the refresh token",
                responses: { 200: { description: "Token refreshed" }, ...commonResponses }
            }
        },
        "/api/auth/me": {
            get: {
                tags: ["Auth"],
                summary: "Get the currently authenticated user",
                security: bearerAuth,
                responses: { 200: { description: "Current user" }, ...commonResponses }
            }
        },
        "/api/users/me": {
            get: {
                tags: ["Users"],
                summary: "Get my profile",
                security: bearerAuth,
                responses: { 200: { description: "Profile" }, ...commonResponses }
            },
            put: {
                tags: ["Users"],
                summary: "Update my profile",
                security: bearerAuth,
                requestBody: {
                    required: true,
                    content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateUserProfileRequest" } } }
                },
                responses: { 200: { description: "Profile updated" }, ...commonResponses }
            }
        },
        "/api/categories": {
            get: {
                tags: ["Public"],
                summary: "Get all service categories",
                responses: { 200: { description: "Categories" }, ...commonResponses }
            }
        },
        "/api/services": {
            get: {
                tags: ["Public"],
                summary: "Browse services with search, filters, sorting and pagination",
                parameters: [
                    { name: "searchTerm", in: "query", schema: { type: "string" } },
                    { name: "categoryId", in: "query", schema: { type: "string" } },
                    { name: "category", in: "query", schema: { type: "string" } },
                    { name: "location", in: "query", schema: { type: "string" } },
                    { name: "minPrice", in: "query", schema: { type: "number" } },
                    { name: "maxPrice", in: "query", schema: { type: "number" } },
                    { name: "minRating", in: "query", schema: { type: "number" } },
                    { name: "page", in: "query", schema: { type: "integer" } },
                    { name: "limit", in: "query", schema: { type: "integer" } },
                    { name: "sortBy", in: "query", schema: { type: "string", example: "price" } },
                    { name: "sortOrder", in: "query", schema: { type: "string", enum: ["asc", "desc"] } }
                ],
                responses: { 200: { description: "Services" }, ...commonResponses }
            },
            post: {
                tags: ["Technician"],
                summary: "Create a service (technician only)",
                security: bearerAuth,
                requestBody: {
                    required: true,
                    content: { "application/json": { schema: { $ref: "#/components/schemas/ServiceRequest" } } }
                },
                responses: { 201: { description: "Service created" }, ...commonResponses }
            }
        },
        "/api/services/my-services": {
            get: {
                tags: ["Technician"],
                summary: "Get my own services (technician only)",
                security: bearerAuth,
                responses: { 200: { description: "Services" }, ...commonResponses }
            }
        },
        "/api/services/{id}": {
            get: {
                tags: ["Public"],
                summary: "Get a single service",
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                responses: { 200: { description: "Service" }, ...commonResponses }
            },
            patch: {
                tags: ["Technician"],
                summary: "Update my service (technician only)",
                security: bearerAuth,
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                requestBody: {
                    content: { "application/json": { schema: { $ref: "#/components/schemas/ServiceRequest" } } }
                },
                responses: { 200: { description: "Service updated" }, ...commonResponses }
            },
            delete: {
                tags: ["Technician"],
                summary: "Delete my service (technician only)",
                security: bearerAuth,
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                responses: { 200: { description: "Service deleted" }, ...commonResponses }
            }
        },
        "/api/technicians": {
            get: {
                tags: ["Public"],
                summary: "Browse technicians with filters",
                parameters: [
                    { name: "searchTerm", in: "query", schema: { type: "string" } },
                    { name: "skill", in: "query", schema: { type: "string" } },
                    { name: "minRating", in: "query", schema: { type: "number" } },
                    { name: "minRate", in: "query", schema: { type: "number" } },
                    { name: "maxRate", in: "query", schema: { type: "number" } },
                    { name: "location", in: "query", schema: { type: "string" } },
                    { name: "page", in: "query", schema: { type: "integer" } },
                    { name: "limit", in: "query", schema: { type: "integer" } }
                ],
                responses: { 200: { description: "Technicians" }, ...commonResponses }
            }
        },
        "/api/technicians/{id}": {
            get: {
                tags: ["Public"],
                summary: "Get a technician profile with services and reviews",
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                responses: { 200: { description: "Technician profile" }, ...commonResponses }
            }
        },
        "/api/technician/profile": {
            put: {
                tags: ["Technician"],
                summary: "Update my technician profile",
                security: bearerAuth,
                requestBody: {
                    required: true,
                    content: { "application/json": { schema: { $ref: "#/components/schemas/TechnicianProfileRequest" } } }
                },
                responses: { 200: { description: "Profile updated" }, ...commonResponses }
            }
        },
        "/api/technician/availability": {
            get: {
                tags: ["Technician"],
                summary: "Get my availability slots",
                security: bearerAuth,
                responses: { 200: { description: "Availability" }, ...commonResponses }
            },
            put: {
                tags: ["Technician"],
                summary: "Replace my availability slots",
                security: bearerAuth,
                requestBody: {
                    required: true,
                    content: { "application/json": { schema: { $ref: "#/components/schemas/AvailabilityRequest" } } }
                },
                responses: { 200: { description: "Availability updated" }, ...commonResponses }
            }
        },
        "/api/technician/bookings": {
            get: {
                tags: ["Technician"],
                summary: "Get bookings assigned to me",
                security: bearerAuth,
                parameters: [{ name: "status", in: "query", schema: { type: "string" } }],
                responses: { 200: { description: "Bookings" }, ...commonResponses }
            }
        },
        "/api/technician/bookings/{id}": {
            patch: {
                tags: ["Technician"],
                summary: "Accept, decline, start or complete a booking",
                security: bearerAuth,
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                requestBody: {
                    required: true,
                    content: { "application/json": { schema: { $ref: "#/components/schemas/BookingStatusRequest" } } }
                },
                responses: { 200: { description: "Booking updated" }, ...commonResponses }
            }
        },
        "/api/bookings": {
            post: {
                tags: ["Bookings"],
                summary: "Create a booking (customer only)",
                security: bearerAuth,
                requestBody: {
                    required: true,
                    content: { "application/json": { schema: { $ref: "#/components/schemas/BookingRequest" } } }
                },
                responses: { 201: { description: "Booking created" }, ...commonResponses }
            },
            get: {
                tags: ["Bookings"],
                summary: "Get my bookings",
                security: bearerAuth,
                parameters: [
                    { name: "status", in: "query", schema: { type: "string" } },
                    { name: "page", in: "query", schema: { type: "integer" } },
                    { name: "limit", in: "query", schema: { type: "integer" } }
                ],
                responses: { 200: { description: "Bookings" }, ...commonResponses }
            }
        },
        "/api/bookings/{id}": {
            get: {
                tags: ["Bookings"],
                summary: "Get booking details",
                security: bearerAuth,
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                responses: { 200: { description: "Booking" }, ...commonResponses }
            }
        },
        "/api/bookings/{id}/cancel": {
            patch: {
                tags: ["Bookings"],
                summary: "Cancel a booking before it reaches IN_PROGRESS (customer only)",
                security: bearerAuth,
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                responses: { 200: { description: "Booking cancelled" }, ...commonResponses }
            }
        },
        "/api/payments/create": {
            post: {
                tags: ["Payments"],
                summary: "Create a Stripe Checkout session for an ACCEPTED booking",
                security: bearerAuth,
                requestBody: {
                    required: true,
                    content: { "application/json": { schema: { $ref: "#/components/schemas/PaymentCreateRequest" } } }
                },
                responses: { 201: { description: "Checkout session created, redirect to paymentUrl" }, ...commonResponses }
            }
        },
        "/api/payments/confirm": {
            post: {
                tags: ["Payments"],
                summary: "Verify a payment with Stripe and mark the booking PAID",
                requestBody: {
                    required: true,
                    content: { "application/json": { schema: { $ref: "#/components/schemas/PaymentConfirmRequest" } } }
                },
                responses: { 200: { description: "Payment verified" }, ...commonResponses }
            }
        },
        "/api/payments/webhook": {
            post: {
                tags: ["Payments"],
                summary: "Stripe webhook endpoint (raw body, signature verified)",
                description: "Called by Stripe, not by clients. Requires the stripe-signature header.",
                responses: { 200: { description: "Webhook processed" }, ...commonResponses }
            }
        },
        "/api/payments": {
            get: {
                tags: ["Payments"],
                summary: "Get my payment history",
                security: bearerAuth,
                parameters: [
                    { name: "status", in: "query", schema: { type: "string", enum: ["PENDING", "COMPLETED", "FAILED"] } },
                    { name: "page", in: "query", schema: { type: "integer" } },
                    { name: "limit", in: "query", schema: { type: "integer" } }
                ],
                responses: { 200: { description: "Payments" }, ...commonResponses }
            }
        },
        "/api/payments/{id}": {
            get: {
                tags: ["Payments"],
                summary: "Get payment details",
                security: bearerAuth,
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                responses: { 200: { description: "Payment" }, ...commonResponses }
            }
        },
        "/api/reviews": {
            post: {
                tags: ["Reviews"],
                summary: "Leave a review after job completion (customer only)",
                security: bearerAuth,
                requestBody: {
                    required: true,
                    content: { "application/json": { schema: { $ref: "#/components/schemas/ReviewRequest" } } }
                },
                responses: { 201: { description: "Review created" }, ...commonResponses }
            }
        },
        "/api/reviews/my-reviews": {
            get: {
                tags: ["Reviews"],
                summary: "Get reviews I have written",
                security: bearerAuth,
                responses: { 200: { description: "Reviews" }, ...commonResponses }
            }
        },
        "/api/reviews/technician/{technicianId}": {
            get: {
                tags: ["Public"],
                summary: "Get all reviews for a technician",
                parameters: [{ name: "technicianId", in: "path", required: true, schema: { type: "string" } }],
                responses: { 200: { description: "Reviews" }, ...commonResponses }
            }
        },
        "/api/admin/stats": {
            get: {
                tags: ["Admin"],
                summary: "Platform dashboard statistics",
                security: bearerAuth,
                responses: { 200: { description: "Stats" }, ...commonResponses }
            }
        },
        "/api/admin/users": {
            get: {
                tags: ["Admin"],
                summary: "Get all users",
                security: bearerAuth,
                parameters: [
                    { name: "searchTerm", in: "query", schema: { type: "string" } },
                    { name: "role", in: "query", schema: { type: "string", enum: ["CUSTOMER", "TECHNICIAN", "ADMIN"] } },
                    { name: "activeStatus", in: "query", schema: { type: "string", enum: ["ACTIVE", "BLOCKED"] } },
                    { name: "page", in: "query", schema: { type: "integer" } },
                    { name: "limit", in: "query", schema: { type: "integer" } }
                ],
                responses: { 200: { description: "Users" }, ...commonResponses }
            }
        },
        "/api/admin/users/{id}": {
            get: {
                tags: ["Admin"],
                summary: "Get a single user with counts",
                security: bearerAuth,
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                responses: { 200: { description: "User" }, ...commonResponses }
            },
            patch: {
                tags: ["Admin"],
                summary: "Ban or unban a user",
                security: bearerAuth,
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                requestBody: {
                    required: true,
                    content: { "application/json": { schema: { $ref: "#/components/schemas/UserStatusRequest" } } }
                },
                responses: { 200: { description: "User status updated" }, ...commonResponses }
            }
        },
        "/api/admin/technicians/{id}/verify": {
            patch: {
                tags: ["Admin"],
                summary: "Verify or unverify a technician",
                security: bearerAuth,
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["isVerified"],
                                properties: { isVerified: { type: "boolean", example: true } }
                            }
                        }
                    }
                },
                responses: { 200: { description: "Technician verification updated" }, ...commonResponses }
            }
        },
        "/api/admin/bookings": {
            get: {
                tags: ["Admin"],
                summary: "Get all bookings on the platform",
                security: bearerAuth,
                parameters: [{ name: "status", in: "query", schema: { type: "string" } }],
                responses: { 200: { description: "Bookings" }, ...commonResponses }
            }
        },
        "/api/admin/payments": {
            get: {
                tags: ["Admin"],
                summary: "Get all payments on the platform",
                security: bearerAuth,
                responses: { 200: { description: "Payments" }, ...commonResponses }
            }
        },
        "/api/admin/categories": {
            get: {
                tags: ["Admin"],
                summary: "Get all service categories",
                security: bearerAuth,
                responses: { 200: { description: "Categories" }, ...commonResponses }
            },
            post: {
                tags: ["Admin"],
                summary: "Create a service category",
                security: bearerAuth,
                requestBody: {
                    required: true,
                    content: { "application/json": { schema: { $ref: "#/components/schemas/CategoryRequest" } } }
                },
                responses: { 201: { description: "Category created" }, ...commonResponses }
            }
        },
        "/api/admin/categories/{id}": {
            patch: {
                tags: ["Admin"],
                summary: "Update a service category",
                security: bearerAuth,
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                requestBody: {
                    content: { "application/json": { schema: { $ref: "#/components/schemas/CategoryRequest" } } }
                },
                responses: { 200: { description: "Category updated" }, ...commonResponses }
            },
            delete: {
                tags: ["Admin"],
                summary: "Delete a service category",
                security: bearerAuth,
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                responses: { 200: { description: "Category deleted" }, ...commonResponses }
            }
        }
    }
};
