import { createRequire as __createRequire } from "module";
import { fileURLToPath as __fileURLToPath } from "url";
import { dirname as __pathDirname } from "path";
const require = __createRequire(import.meta.url);
const __filename = __fileURLToPath(import.meta.url);
const __dirname = __pathDirname(__filename);
var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// src/config/index.ts
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });
var config_default = {
  PORT: process.env.PORT || 5e3,
  node_env: process.env.NODE_ENV || "development",
  database_url: process.env.DATABASE_URL,
  app_url: process.env.APP_URL || "http://localhost:3000",
  api_url: process.env.API_URL || "http://localhost:5000",
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS || 10,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  admin_name: process.env.ADMIN_NAME || "FixItNow Admin",
  admin_email: process.env.ADMIN_EMAIL || "admin@fixitnow.com",
  admin_password: process.env.ADMIN_PASSWORD || "Admin@1234",
  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
  stripe_currency: process.env.STRIPE_CURRENCY || "usd",
  ssl_store_id: process.env.SSL_STORE_ID,
  ssl_store_password: process.env.SSL_STORE_PASSWORD,
  ssl_is_live: process.env.SSL_IS_LIVE === "true",
  ssl_currency: process.env.SSL_CURRENCY || "BDT"
};

// src/routes/index.ts
import { Router as Router10 } from "express";

// src/auth/auth.routes.ts
import { Router } from "express";

// src/auth/auth.controller.ts
import httpStatus2 from "http-status";

// src/utils/catchAsync.ts
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// src/utils/sendResponse.ts
var sendResponse = (res, data) => {
  res.status(data.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    meta: data.meta,
    data: data.data
  });
};

// src/auth/auth.service.ts
import bcrypt from "bcryptjs";
import httpStatus from "http-status";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path2 from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.10.0",
  "engineVersion": "0edf323efd1d98336f3f0a68684b56f689b900d3",
  "activeProvider": "postgresql",
  "inlineSchema": 'model Booking {\n  id String @id @default(uuid())\n\n  customerId String\n  customer   User   @relation("CustomerBookings", fields: [customerId], references: [id], onDelete: Cascade)\n\n  technicianId String\n  technician   TechnicianProfile @relation(fields: [technicianId], references: [id], onDelete: Cascade)\n\n  serviceId String\n  service   Service @relation(fields: [serviceId], references: [id], onDelete: Restrict)\n\n  scheduledAt DateTime\n  address     String\n  note        String?\n  totalAmount Float\n  status      BookingStatus @default(REQUESTED)\n\n  declineReason String?\n  cancelReason  String?\n  completedAt   DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  payment Payment?\n  review  Review?\n\n  @@index([customerId])\n  @@index([technicianId])\n  @@index([status])\n  @@map("bookings")\n}\n\nmodel Category {\n  id          String  @id @default(uuid())\n  name        String  @unique @db.VarChar(120)\n  slug        String  @unique @db.VarChar(140)\n  description String?\n  icon        String?\n  isActive    Boolean @default(true)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  services Service[]\n\n  @@map("categories")\n}\n\nenum ActiveStatus {\n  ACTIVE\n  BLOCKED\n}\n\nenum Role {\n  CUSTOMER\n  TECHNICIAN\n  ADMIN\n}\n\nenum BookingStatus {\n  REQUESTED\n  ACCEPTED\n  DECLINED\n  PAID\n  IN_PROGRESS\n  COMPLETED\n  CANCELLED\n}\n\nenum PaymentStatus {\n  PENDING\n  COMPLETED\n  FAILED\n  CANCELLED\n}\n\nenum PaymentProvider {\n  STRIPE\n  SSLCOMMERZ\n}\n\nenum WeekDay {\n  SATURDAY\n  SUNDAY\n  MONDAY\n  TUESDAY\n  WEDNESDAY\n  THURSDAY\n  FRIDAY\n}\n\nmodel Payment {\n  id String @id @default(uuid())\n\n  transactionId String @unique @db.VarChar(120)\n\n  bookingId String  @unique\n  booking   Booking @relation(fields: [bookingId], references: [id], onDelete: Cascade)\n\n  customerId String\n  customer   User   @relation(fields: [customerId], references: [id], onDelete: Cascade)\n\n  amount   Float\n  currency String @default("BDT") @db.VarChar(10)\n\n  provider PaymentProvider\n  method   String?         @db.VarChar(60)\n  status   PaymentStatus   @default(PENDING)\n\n  gatewaySessionId String? @db.VarChar(255)\n  gatewayResponse  Json?\n\n  paidAt    DateTime?\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n\n  @@index([customerId])\n  @@index([status])\n  @@map("payments")\n}\n\nmodel Review {\n  id String @id @default(uuid())\n\n  bookingId String  @unique\n  booking   Booking @relation(fields: [bookingId], references: [id], onDelete: Cascade)\n\n  customerId String\n  customer   User   @relation(fields: [customerId], references: [id], onDelete: Cascade)\n\n  technicianId String\n  technician   TechnicianProfile @relation(fields: [technicianId], references: [id], onDelete: Cascade)\n\n  rating  Int\n  comment String?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([technicianId])\n  @@map("reviews")\n}\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Service {\n  id          String  @id @default(uuid())\n  title       String  @db.VarChar(255)\n  description String?\n  price       Float\n  durationMin Int     @default(60)\n  isActive    Boolean @default(true)\n\n  categoryId String\n  category   Category @relation(fields: [categoryId], references: [id], onDelete: Restrict)\n\n  technicianId String\n  technician   TechnicianProfile @relation(fields: [technicianId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  bookings Booking[]\n\n  @@index([categoryId])\n  @@index([technicianId])\n  @@index([price])\n  @@map("services")\n}\n\nmodel TechnicianProfile {\n  id     String @id @default(uuid())\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  bio             String?\n  skills          String[]\n  experienceYears Int      @default(0)\n  hourlyRate      Float    @default(0)\n  location        String?  @db.VarChar(255)\n  nidNumber       String?  @db.VarChar(50)\n  isAvailable     Boolean  @default(true)\n  isVerified      Boolean  @default(false)\n\n  avgRating    Float @default(0)\n  totalReviews Int   @default(0)\n  totalJobs    Int   @default(0)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  services       Service[]\n  availabilities Availability[]\n  bookings       Booking[]\n  reviews        Review[]\n\n  @@index([location])\n  @@index([avgRating])\n  @@map("technician_profiles")\n}\n\nmodel Availability {\n  id String @id @default(uuid())\n\n  technicianId String\n  technician   TechnicianProfile @relation(fields: [technicianId], references: [id], onDelete: Cascade)\n\n  dayOfWeek WeekDay\n  startTime String  @db.VarChar(5) // "09:00"\n  endTime   String  @db.VarChar(5) // "18:00"\n  isActive  Boolean @default(true)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([technicianId, dayOfWeek, startTime, endTime])\n  @@index([technicianId])\n  @@map("availabilities")\n}\n\nmodel User {\n  id           String       @id @default(uuid())\n  name         String       @db.VarChar(255)\n  email        String       @unique\n  password     String\n  phone        String?      @db.VarChar(30)\n  address      String?\n  profilePhoto String?\n  role         Role         @default(CUSTOMER)\n  activeStatus ActiveStatus @default(ACTIVE)\n  createdAt    DateTime     @default(now())\n  updatedAt    DateTime     @updatedAt\n\n  technicianProfile TechnicianProfile?\n  bookings          Booking[]          @relation("CustomerBookings")\n  payments          Payment[]\n  reviews           Review[]\n\n  @@index([role])\n  @@map("users")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Booking":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"User","relationName":"CustomerBookings"},{"name":"technicianId","kind":"scalar","type":"String"},{"name":"technician","kind":"object","type":"TechnicianProfile","relationName":"BookingToTechnicianProfile"},{"name":"serviceId","kind":"scalar","type":"String"},{"name":"service","kind":"object","type":"Service","relationName":"BookingToService"},{"name":"scheduledAt","kind":"scalar","type":"DateTime"},{"name":"address","kind":"scalar","type":"String"},{"name":"note","kind":"scalar","type":"String"},{"name":"totalAmount","kind":"scalar","type":"Float"},{"name":"status","kind":"enum","type":"BookingStatus"},{"name":"declineReason","kind":"scalar","type":"String"},{"name":"cancelReason","kind":"scalar","type":"String"},{"name":"completedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"payment","kind":"object","type":"Payment","relationName":"BookingToPayment"},{"name":"review","kind":"object","type":"Review","relationName":"BookingToReview"}],"dbName":"bookings","schema":null},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"icon","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"services","kind":"object","type":"Service","relationName":"CategoryToService"}],"dbName":"categories","schema":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToPayment"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"User","relationName":"PaymentToUser"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"currency","kind":"scalar","type":"String"},{"name":"provider","kind":"enum","type":"PaymentProvider"},{"name":"method","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"gatewaySessionId","kind":"scalar","type":"String"},{"name":"gatewayResponse","kind":"scalar","type":"Json"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"payments","schema":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToReview"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"technicianId","kind":"scalar","type":"String"},{"name":"technician","kind":"object","type":"TechnicianProfile","relationName":"ReviewToTechnicianProfile"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"reviews","schema":null},"Service":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"durationMin","kind":"scalar","type":"Int"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToService"},{"name":"technicianId","kind":"scalar","type":"String"},{"name":"technician","kind":"object","type":"TechnicianProfile","relationName":"ServiceToTechnicianProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToService"}],"dbName":"services","schema":null},"TechnicianProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TechnicianProfileToUser"},{"name":"bio","kind":"scalar","type":"String"},{"name":"skills","kind":"scalar","type":"String"},{"name":"experienceYears","kind":"scalar","type":"Int"},{"name":"hourlyRate","kind":"scalar","type":"Float"},{"name":"location","kind":"scalar","type":"String"},{"name":"nidNumber","kind":"scalar","type":"String"},{"name":"isAvailable","kind":"scalar","type":"Boolean"},{"name":"isVerified","kind":"scalar","type":"Boolean"},{"name":"avgRating","kind":"scalar","type":"Float"},{"name":"totalReviews","kind":"scalar","type":"Int"},{"name":"totalJobs","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"services","kind":"object","type":"Service","relationName":"ServiceToTechnicianProfile"},{"name":"availabilities","kind":"object","type":"Availability","relationName":"AvailabilityToTechnicianProfile"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToTechnicianProfile"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToTechnicianProfile"}],"dbName":"technician_profiles","schema":null},"Availability":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"technicianId","kind":"scalar","type":"String"},{"name":"technician","kind":"object","type":"TechnicianProfile","relationName":"AvailabilityToTechnicianProfile"},{"name":"dayOfWeek","kind":"enum","type":"WeekDay"},{"name":"startTime","kind":"scalar","type":"String"},{"name":"endTime","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"availabilities","schema":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"Role"},{"name":"activeStatus","kind":"enum","type":"ActiveStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"technicianProfile","kind":"object","type":"TechnicianProfile","relationName":"TechnicianProfileToUser"},{"name":"bookings","kind":"object","type":"Booking","relationName":"CustomerBookings"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"}],"dbName":"users","schema":null}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","user","orderBy","cursor","services","_count","category","technician","bookings","availabilities","booking","customer","reviews","technicianProfile","payments","service","payment","review","Booking.findUnique","Booking.findUniqueOrThrow","Booking.findFirst","Booking.findFirstOrThrow","Booking.findMany","data","Booking.createOne","Booking.createMany","Booking.createManyAndReturn","Booking.updateOne","Booking.updateMany","Booking.updateManyAndReturn","create","update","Booking.upsertOne","Booking.deleteOne","Booking.deleteMany","having","_avg","_sum","_min","_max","Booking.groupBy","Booking.aggregate","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","Category.upsertOne","Category.deleteOne","Category.deleteMany","Category.groupBy","Category.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","Service.findUnique","Service.findUniqueOrThrow","Service.findFirst","Service.findFirstOrThrow","Service.findMany","Service.createOne","Service.createMany","Service.createManyAndReturn","Service.updateOne","Service.updateMany","Service.updateManyAndReturn","Service.upsertOne","Service.deleteOne","Service.deleteMany","Service.groupBy","Service.aggregate","TechnicianProfile.findUnique","TechnicianProfile.findUniqueOrThrow","TechnicianProfile.findFirst","TechnicianProfile.findFirstOrThrow","TechnicianProfile.findMany","TechnicianProfile.createOne","TechnicianProfile.createMany","TechnicianProfile.createManyAndReturn","TechnicianProfile.updateOne","TechnicianProfile.updateMany","TechnicianProfile.updateManyAndReturn","TechnicianProfile.upsertOne","TechnicianProfile.deleteOne","TechnicianProfile.deleteMany","TechnicianProfile.groupBy","TechnicianProfile.aggregate","Availability.findUnique","Availability.findUniqueOrThrow","Availability.findFirst","Availability.findFirstOrThrow","Availability.findMany","Availability.createOne","Availability.createMany","Availability.createManyAndReturn","Availability.updateOne","Availability.updateMany","Availability.updateManyAndReturn","Availability.upsertOne","Availability.deleteOne","Availability.deleteMany","Availability.groupBy","Availability.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","AND","OR","NOT","id","name","email","password","phone","address","profilePhoto","Role","role","ActiveStatus","activeStatus","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","every","some","none","technicianId","WeekDay","dayOfWeek","startTime","endTime","isActive","userId","bio","skills","experienceYears","hourlyRate","location","nidNumber","isAvailable","isVerified","avgRating","totalReviews","totalJobs","has","hasEvery","hasSome","title","description","price","durationMin","categoryId","bookingId","customerId","rating","comment","transactionId","amount","currency","PaymentProvider","provider","method","PaymentStatus","status","gatewaySessionId","gatewayResponse","paidAt","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","slug","icon","serviceId","scheduledAt","note","totalAmount","BookingStatus","declineReason","cancelReason","completedAt","technicianId_dayOfWeek_startTime_endTime","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","push","increment","decrement","multiply","divide"]'),
  graph: "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_ABCcAQAAngIAMJ0BAQAAAAGeAQEAAAABqAFAAPUBACGpAUAA9QEAIb0BIACLAgAhzgEBAPIBACHnAQEAAAAB6AEBAPIBACEBAAAAPAAgAQAAADwAIAwEAACNAgAgmgEAAJ4CADCbAQAAPwAQnAEAAJ4CADCdAQEA8QEAIZ4BAQDxAQAhqAFAAPUBACGpAUAA9QEAIb0BIACLAgAhzgEBAPIBACHnAQEA8QEAIegBAQDyAQAhAwQAAOcDACDOAQAAtQIAIOgBAAC1AgAgAwAAAD8AIAIAAEAAMAMAADwAIAMAAAA_ACACAABAADADAAA8ACADAAAAPwAgAgAAQAAwAwAAPAAgCQQAAIcEACCdAQEAAAABngEBAAAAAagBQAAAAAGpAUAAAAABvQEgAAAAAc4BAQAAAAHnAQEAAAAB6AEBAAAAAQEXAABEACAInQEBAAAAAZ4BAQAAAAGoAUAAAAABqQFAAAAAAb0BIAAAAAHOAQEAAAAB5wEBAAAAAegBAQAAAAEBFwAARgAwARcAAEYAMAkEAAD9AwAgnQEBALkCACGeAQEAuQIAIagBQAC9AgAhqQFAAL0CACG9ASAAjgMAIc4BAQC6AgAh5wEBALkCACHoAQEAugIAIQIAAAA8ACAXAABJACAInQEBALkCACGeAQEAuQIAIagBQAC9AgAhqQFAAL0CACG9ASAAjgMAIc4BAQC6AgAh5wEBALkCACHoAQEAugIAIQIAAAA_ACAXAABLACACAAAAPwAgFwAASwAgAwAAADwAIB4AAEQAIB8AAEkAIAEAAAA8ACABAAAAPwAgBQUAAPoDACAmAAD8AwAgJwAA-wMAIM4BAAC1AgAg6AEAALUCACALmgEAAJ0CADCbAQAAUgAQnAEAAJ0CADCdAQEA3wEAIZ4BAQDfAQAhqAFAAOMBACGpAUAA4wEAIb0BIAD8AQAhzgEBAOABACHnAQEA3wEAIegBAQDgAQAhAwAAAD8AIAIAAFEAMCMAAFIAIAMAAAA_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_AQEAAAABwAEAAM0DACDBAQIAAAABwgEIAAAAAcMBAQAAAAHEAQEAAAABxQEgAAAAAcYBIAAAAAHHAQgAAAAByAECAAAAAckBAgAAAAEBFwAAoAEAMAEXAACgAQAwFAEAAOQDACAEAACPAwAgCAAAkQMAIAkAAJADACAMAACSAwAgnQEBALkCACGoAUAAvQIAIakBQAC9AgAhvgEBALkCACG_AQEAugIAIcABAACNAwAgwQECAMwCACHCAQgA3QIAIcMBAQC6AgAhxAEBALoCACHFASAAjgMAIcYBIACOAwAhxwEIAN0CACHIAQIAzAIAIckBAgDMAgAhAgAAAJcBACAXAACjAQAgD50BAQC5AgAhqAFAAL0CACGpAUAAvQIAIb4BAQC5AgAhvwEBALoCACHAAQAAjQMAIMEBAgDMAgAhwgEIAN0CACHDAQEAugIAIcQBAQC6AgAhxQEgAI4DACHGASAAjgMAIccBCADdAgAhyAECAMwCACHJAQIAzAIAIQIAAAADACAXAAClAQAgAgAAAAMAIBcAAKUBACADAAAAlwEAIB4AAJ4BACAfAACjAQAgAQAAAJcBACABAAAAAwAgCAUAAN8DACAkAADgAwAgJQAA4wMAICYAAOIDACAnAADhAwAgvwEAALUCACDDAQAAtQIAIMQBAAC1AgAgEpoBAACBAgAwmwEAAKwBABCcAQAAgQIAMJ0BAQDfAQAhqAFAAOMBACGpAUAA4wEAIb4BAQDfAQAhvwEBAOABACHAAQAAggIAIMEBAgCDAgAhwgEIAIQCACHDAQEA4AEAIcQBAQDgAQAhxQEgAPwBACHGASAA_AEAIccBCACEAgAhyAECAIMCACHJAQIAgwIAIQMAAAADACACAACrAQAwIwAArAEAIAMAAAADACACAACaAQAwAwAAlwEAIAEAAAARACABAAAAEQAgAwAAAA8AIAIAABAAMAMAABEAIAMAAAAPACACAAAQADADAAARACADAAAADwAgAgAAEAAwAwAAEQAgCQcAAN4DACCdAQEAAAABqAFAAAAAAakBQAAAAAG4AQEAAAABugEAAAC6AQK7AQEAAAABvAEBAAAAAb0BIAAAAAEBFwAAtAEAIAidAQEAAAABqAFAAAAAAakBQAAAAAG4AQEAAAABugEAAAC6AQK7AQEAAAABvAEBAAAAAb0BIAAAAAEBFwAAtgEAMAEXAAC2AQAwCQcAAN0DACCdAQEAuQIAIagBQAC9AgAhqQFAAL0CACG4AQEAuQIAIboBAACxA7oBIrsBAQC5AgAhvAEBALkCACG9ASAAjgMAIQIAAAARACAXAAC5AQAgCJ0BAQC5AgAhqAFAAL0CACGpAUAAvQIAIbgBAQC5AgAhugEAALEDugEiuwEBALkCACG8AQEAuQIAIb0BIACOAwAhAgAAAA8AIBcAALsBACACAAAADwAgFwAAuwEAIAMAAAARACAeAAC0AQAgHwAAuQEAIAEAAAARACABAAAADwAgAwUAANoDACAmAADcAwAgJwAA2wMAIAuaAQAA-gEAMJsBAADCAQAQnAEAAPoBADCdAQEA3wEAIagBQADjAQAhqQFAAOMBACG4AQEA3wEAIboBAAD7AboBIrsBAQDfAQAhvAEBAN8BACG9ASAA_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_AQEA8gEAIcABAACCAgAgwQECAIkCACHCAQgAigIAIcMBAQDyAQAhxAEBAPIBACHFASAAiwIAIcYBIACLAgAhxwEIAIoCACHIAQIAiQIAIckBAgCJAgAh8gEAAAMAIPMBAAADACADtQEAAAsAILYBAAALACC3AQAACwAgA7UBAAAdACC2AQAAHQAgtwEAAB0AIAO1AQAAFAAgtgEAABQAILcBAAAUACALmgEAAPoBADCbAQAAwgEAEJwBAAD6AQAwnQEBAN8BACGoAUAA4wEAIakBQADjAQAhuAEBAN8BACG6AQAA-wG6ASK7AQEA3wEAIbwBAQDfAQAhvQEgAPwBACEHBQAA5QEAICYAAIACACAnAACAAgAgqgEAAAC6AQKrAQAAALoBCKwBAAAAugEIsQEAAP8BugEiBQUAAOUBACAmAAD-AQAgJwAA_gEAIKoBIAAAAAGxASAA_QEAIQUFAADlAQAgJgAA_gEAICcAAP4BACCqASAAAAABsQEgAP0BACECqgEgAAAAAbEBIAD-AQAhBwUAAOUBACAmAACAAgAgJwAAgAIAIKoBAAAAugECqwEAAAC6AQisAQAAALoBCLEBAAD_AboBIgSqAQAAALoBAqsBAAAAugEIrAEAAAC6AQixAQAAgAK6ASISmgEAAIECADCbAQAArAEAEJwBAACBAgAwnQEBAN8BACGoAUAA4wEAIakBQADjAQAhvgEBAN8BACG_AQEA4AEAIcABAACCAgAgwQECAIMCACHCAQgAhAIAIcMBAQDgAQAhxAEBAOABACHFASAA_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_AQEA8gEAIcABAACCAgAgwQECAIkCACHCAQgAigIAIcMBAQDyAQAhxAEBAPIBACHFASAAiwIAIcYBIACLAgAhxwEIAIoCACHIAQIAiQIAIckBAgCJAgAh8gEAAAMAIPMBAAADACAEuAEBAAAAAboBAAAAugECuwEBAAAAAbwBAQAAAAEMBwAAqgIAIJoBAACsAgAwmwEAAA8AEJwBAACsAgAwnQEBAPEBACGoAUAA9QEAIakBQAD1AQAhuAEBAPEBACG6AQAArQK6ASK7AQEA8QEAIbwBAQDxAQAhvQEgAIsCACEEqgEAAAC6AQKrAQAAALoBCKwBAAAAugEIsQEAAIACugEiFgcAAKoCACALAACMAgAgDwAAsAIAIBAAALECACARAACyAgAgmgEAAK4CADCbAQAACwAQnAEAAK4CADCdAQEA8QEAIaIBAQDxAQAhqAFAAPUBACGpAUAA9QEAIbgBAQDxAQAh0wEBAPEBACHdAQAArwLuASLpAQEA8QEAIeoBQAD1AQAh6wEBAPIBACHsAQgAigIAIe4BAQDyAQAh7wEBAPIBACHwAUAApwIAIQSqAQAAAO4BAqsBAAAA7gEIrAEAAADuAQixAQAAogLuASISBgAAtAIAIAcAAKoCACAIAAD3AQAgmgEAALMCADCbAQAABQAQnAEAALMCADCdAQEA8QEAIagBQAD1AQAhqQFAAPUBACG4AQEA8QEAIb0BIACLAgAhzQEBAPEBACHOAQEA8gEAIc8BCACKAgAh0AECAIkCACHRAQEA8QEAIfIBAAAFACDzAQAABQAgFQoAAKgCACALAACMAgAgmgEAAKMCADCbAQAAHQAQnAEAAKMCADCdAQEA8QEAIagBQAD1AQAhqQFAAPUBACHSAQEA8QEAIdMBAQDxAQAh1gEBAPEBACHXAQgAigIAIdgBAQDxAQAh2gEAAKQC2gEi2wEBAPIBACHdAQAApQLdASLeAQEA8gEAId8BAACmAgAg4AFAAKcCACHyAQAAHQAg8wEAAB0AIBAHAACqAgAgCgAAqAIAIAsAAIwCACCaAQAAqQIAMJsBAAAUABCcAQAAqQIAMJ0BAQDxAQAhqAFAAPUBACGpAUAA9QEAIbgBAQDxAQAh0gEBAPEBACHTAQEA8QEAIdQBAgCJAgAh1QEBAPIBACHyAQAAFAAg8wEAABQAIBAGAAC0AgAgBwAAqgIAIAgAAPcBACCaAQAAswIAMJsBAAAFABCcAQAAswIAMJ0BAQDxAQAhqAFAAPUBACGpAUAA9QEAIbgBAQDxAQAhvQEgAIsCACHNAQEA8QEAIc4BAQDyAQAhzwEIAIoCACHQAQIAiQIAIdEBAQDxAQAhDgQAAI0CACCaAQAAngIAMJsBAAA_ABCcAQAAngIAMJ0BAQDxAQAhngEBAPEBACGoAUAA9QEAIakBQAD1AQAhvQEgAIsCACHOAQEA8gEAIecBAQDxAQAh6AEBAPIBACHyAQAAPwAg8wEAAD8AIAAAAAAB9wEBAAAAAQH3AQEAAAABAfcBAAAApQECAfcBAAAApwECAfcBQAAAAAEHHgAAiAMAIB8AAIsDACD0AQAAiQMAIPUBAACKAwAg-AEAAAMAIPkBAAADACD6AQAAlwEAIAseAADlAgAwHwAA6gIAMPQBAADmAgAw9QEAAOcCADD2AQAA6AIAIPcBAADpAgAw-AEAAOkCADD5AQAA6QIAMPoBAADpAgAw-wEAAOsCADD8AQAA7AIAMAseAADTAgAwHwAA2AIAMPQBAADUAgAw9QEAANUCADD2AQAA1gIAIPcBAADXAgAw-AEAANcCADD5AQAA1wIAMPoBAADXAgAw-wEAANkCADD8AQAA2gIAMAseAADCAgAwHwAAxwIAMPQBAADDAgAw9QEAAMQCADD2AQAAxQIAIPcBAADGAgAw-AEAAMYCADD5AQAAxgIAMPoBAADGAgAw-wEAAMgCADD8AQAAyQIAMAkHAADSAgAgCgAA0QIAIJ0BAQAAAAGoAUAAAAABqQFAAAAAAbgBAQAAAAHSAQEAAAAB1AECAAAAAdUBAQAAAAECAAAAFgAgHgAA0AIAIAMAAAAWACAeAADQAgAgHwAAzQIAIAEXAADWBAAwDgcAAKoCACAKAACoAgAgCwAAjAIAIJoBAACpAgAwmwEAABQAEJwBAACpAgAwnQEBAAAAAagBQAD1AQAhqQFAAPUBACG4AQEA8QEAIdIBAQAAAAHTAQEA8QEAIdQBAgCJAgAh1QEBAPIBACECAAAAFgAgFwAAzQIAIAIAAADKAgAgFwAAywIAIAuaAQAAyQIAMJsBAADKAgAQnAEAAMkCADCdAQEA8QEAIagBQAD1AQAhqQFAAPUBACG4AQEA8QEAIdIBAQDxAQAh0wEBAPEBACHUAQIAiQIAIdUBAQDyAQAhC5oBAADJAgAwmwEAAMoCABCcAQAAyQIAMJ0BAQDxAQAhqAFAAPUBACGpAUAA9QEAIbgBAQDxAQAh0gEBAPEBACHTAQEA8QEAIdQBAgCJAgAh1QEBAPIBACEHnQEBALkCACGoAUAAvQIAIakBQAC9AgAhuAEBALkCACHSAQEAuQIAIdQBAgDMAgAh1QEBALoCACEF9wECAAAAAf4BAgAAAAH_AQIAAAABgAICAAAAAYECAgAAAAEJBwAAzwIAIAoAAM4CACCdAQEAuQIAIagBQAC9AgAhqQFAAL0CACG4AQEAuQIAIdIBAQC5AgAh1AECAMwCACHVAQEAugIAIQUeAADOBAAgHwAA1AQAIPQBAADPBAAg9QEAANMEACD6AQAAAQAgBR4AAMwEACAfAADRBAAg9AEAAM0EACD1AQAA0AQAIPoBAACXAQAgCQcAANICACAKAADRAgAgnQEBAAAAAagBQAAAAAGpAUAAAAABuAEBAAAAAdIBAQAAAAHUAQIAAAAB1QEBAAAAAQMeAADOBAAg9AEAAM8EACD6AQAAAQAgAx4AAMwEACD0AQAAzQQAIPoBAACXAQAgDgoAAOQCACCdAQEAAAABqAFAAAAAAakBQAAAAAHSAQEAAAAB1gEBAAAAAdcBCAAAAAHYAQEAAAAB2gEAAADaAQLbAQEAAAAB3QEAAADdAQLeAQEAAAAB3wGAAAAAAeABQAAAAAECAAAAHwAgHgAA4wIAIAMAAAAfACAeAADjAgAgHwAA4QIAIAEXAADLBAAwEwoAAKgCACALAACMAgAgmgEAAKMCADCbAQAAHQAQnAEAAKMCADCdAQEAAAABqAFAAPUBACGpAUAA9QEAIdIBAQAAAAHTAQEA8QEAIdYBAQAAAAHXAQgAigIAIdgBAQDxAQAh2gEAAKQC2gEi2wEBAPIBACHdAQAApQLdASLeAQEA8gEAId8BAACmAgAg4AFAAKcCACECAAAAHwAgFwAA4QIAIAIAAADbAgAgFwAA3AIAIBGaAQAA2gIAMJsBAADbAgAQnAEAANoCADCdAQEA8QEAIagBQAD1AQAhqQFAAPUBACHSAQEA8QEAIdMBAQDxAQAh1gEBAPEBACHXAQgAigIAIdgBAQDxAQAh2gEAAKQC2gEi2wEBAPIBACHdAQAApQLdASLeAQEA8gEAId8BAACmAgAg4AFAAKcCACERmgEAANoCADCbAQAA2wIAEJwBAADaAgAwnQEBAPEBACGoAUAA9QEAIakBQAD1AQAh0gEBAPEBACHTAQEA8QEAIdYBAQDxAQAh1wEIAIoCACHYAQEA8QEAIdoBAACkAtoBItsBAQDyAQAh3QEAAKUC3QEi3gEBAPIBACHfAQAApgIAIOABQACnAgAhDZ0BAQC5AgAhqAFAAL0CACGpAUAAvQIAIdIBAQC5AgAh1gEBALkCACHXAQgA3QIAIdgBAQC5AgAh2gEAAN4C2gEi2wEBALoCACHdAQAA3wLdASLeAQEAugIAId8BgAAAAAHgAUAA4AIAIQX3AQgAAAAB_gEIAAAAAf8BCAAAAAGAAggAAAABgQIIAAAAAQH3AQAAANoBAgH3AQAAAN0BAgH3AUAAAAABDgoAAOICACCdAQEAuQIAIagBQAC9AgAhqQFAAL0CACHSAQEAuQIAIdYBAQC5AgAh1wEIAN0CACHYAQEAuQIAIdoBAADeAtoBItsBAQC6AgAh3QEAAN8C3QEi3gEBALoCACHfAYAAAAAB4AFAAOACACEFHgAAxgQAIB8AAMkEACD0AQAAxwQAIPUBAADIBAAg-gEAAAEAIA4KAADkAgAgnQEBAAAAAagBQAAAAAGpAUAAAAAB0gEBAAAAAdYBAQAAAAHXAQgAAAAB2AEBAAAAAdoBAAAA2gEC2wEBAAAAAd0BAAAA3QEC3gEBAAAAAd8BgAAAAAHgAUAAAAABAx4AAMYEACD0AQAAxwQAIPoBAAABACARBwAAhAMAIA8AAIUDACAQAACGAwAgEQAAhwMAIJ0BAQAAAAGiAQEAAAABqAFAAAAAAakBQAAAAAG4AQEAAAAB3QEAAADuAQLpAQEAAAAB6gFAAAAAAesBAQAAAAHsAQgAAAAB7gEBAAAAAe8BAQAAAAHwAUAAAAABAgAAAAEAIB4AAIMDACADAAAAAQAgHgAAgwMAIB8AAPACACABFwAAxQQAMBYHAACqAgAgCwAAjAIAIA8AALACACAQAACxAgAgEQAAsgIAIJoBAACuAgAwmwEAAAsAEJwBAACuAgAwnQEBAAAAAaIBAQDxAQAhqAFAAPUBACGpAUAA9QEAIbgBAQDxAQAh0wEBAPEBACHdAQAArwLuASLpAQEA8QEAIeoBQAD1AQAh6wEBAPIBACHsAQgAigIAIe4BAQDyAQAh7wEBAPIBACHwAUAApwIAIQIAAAABACAXAADwAgAgAgAAAO0CACAXAADuAgAgEZoBAADsAgAwmwEAAO0CABCcAQAA7AIAMJ0BAQDxAQAhogEBAPEBACGoAUAA9QEAIakBQAD1AQAhuAEBAPEBACHTAQEA8QEAId0BAACvAu4BIukBAQDxAQAh6gFAAPUBACHrAQEA8gEAIewBCACKAgAh7gEBAPIBACHvAQEA8gEAIfABQACnAgAhEZoBAADsAgAwmwEAAO0CABCcAQAA7AIAMJ0BAQDxAQAhogEBAPEBACGoAUAA9QEAIakBQAD1AQAhuAEBAPEBACHTAQEA8QEAId0BAACvAu4BIukBAQDxAQAh6gFAAPUBACHrAQEA8gEAIewBCACKAgAh7gEBAPIBACHvAQEA8gEAIfABQACnAgAhDZ0BAQC5AgAhogEBALkCACGoAUAAvQIAIakBQAC9AgAhuAEBALkCACHdAQAA7wLuASLpAQEAuQIAIeoBQAC9AgAh6wEBALoCACHsAQgA3QIAIe4BAQC6AgAh7wEBALoCACHwAUAA4AIAIQH3AQAAAO4BAhEHAADxAgAgDwAA8gIAIBAAAPMCACARAAD0AgAgnQEBALkCACGiAQEAuQIAIagBQAC9AgAhqQFAAL0CACG4AQEAuQIAId0BAADvAu4BIukBAQC5AgAh6gFAAL0CACHrAQEAugIAIewBCADdAgAh7gEBALoCACHvAQEAugIAIfABQADgAgAhBR4AALMEACAfAADDBAAg9AEAALQEACD1AQAAwgQAIPoBAACXAQAgBR4AALEEACAfAADABAAg9AEAALIEACD1AQAAvwQAIPoBAAAHACAHHgAA_AIAIB8AAP8CACD0AQAA_QIAIPUBAAD-AgAg-AEAAB0AIPkBAAAdACD6AQAAHwAgBx4AAPUCACAfAAD4AgAg9AEAAPYCACD1AQAA9wIAIPgBAAAUACD5AQAAFAAg-gEAABYAIAkHAADSAgAgCwAA-wIAIJ0BAQAAAAGoAUAAAAABqQFAAAAAAbgBAQAAAAHTAQEAAAAB1AECAAAAAdUBAQAAAAECAAAAFgAgHgAA9QIAIAMAAAAUACAeAAD1AgAgHwAA-QIAIAsAAAAUACAHAADPAgAgCwAA-gIAIBcAAPkCACCdAQEAuQIAIagBQAC9AgAhqQFAAL0CACG4AQEAuQIAIdMBAQC5AgAh1AECAMwCACHVAQEAugIAIQkHAADPAgAgCwAA-gIAIJ0BAQC5AgAhqAFAAL0CACGpAUAAvQIAIbgBAQC5AgAh0wEBALkCACHUAQIAzAIAIdUBAQC6AgAhBR4AALoEACAfAAC9BAAg9AEAALsEACD1AQAAvAQAIPoBAADFAQAgAx4AALoEACD0AQAAuwQAIPoBAADFAQAgDgsAAIIDACCdAQEAAAABqAFAAAAAAakBQAAAAAHTAQEAAAAB1gEBAAAAAdcBCAAAAAHYAQEAAAAB2gEAAADaAQLbAQEAAAAB3QEAAADdAQLeAQEAAAAB3wGAAAAAAeABQAAAAAECAAAAHwAgHgAA_AIAIAMAAAAdACAeAAD8AgAgHwAAgAMAIBAAAAAdACALAACBAwAgFwAAgAMAIJ0BAQC5AgAhqAFAAL0CACGpAUAAvQIAIdMBAQC5AgAh1gEBALkCACHXAQgA3QIAIdgBAQC5AgAh2gEAAN4C2gEi2wEBALoCACHdAQAA3wLdASLeAQEAugIAId8BgAAAAAHgAUAA4AIAIQ4LAACBAwAgnQEBALkCACGoAUAAvQIAIakBQAC9AgAh0wEBALkCACHWAQEAuQIAIdcBCADdAgAh2AEBALkCACHaAQAA3gLaASLbAQEAugIAId0BAADfAt0BIt4BAQC6AgAh3wGAAAAAAeABQADgAgAhBR4AALUEACAfAAC4BAAg9AEAALYEACD1AQAAtwQAIPoBAADFAQAgAx4AALUEACD0AQAAtgQAIPoBAADFAQAgEQcAAIQDACAPAACFAwAgEAAAhgMAIBEAAIcDACCdAQEAAAABogEBAAAAAagBQAAAAAGpAUAAAAABuAEBAAAAAd0BAAAA7gEC6QEBAAAAAeoBQAAAAAHrAQEAAAAB7AEIAAAAAe4BAQAAAAHvAQEAAAAB8AFAAAAAAQMeAACzBAAg9AEAALQEACD6AQAAlwEAIAMeAACxBAAg9AEAALIEACD6AQAABwAgAx4AAPwCACD0AQAA_QIAIPoBAAAfACADHgAA9QIAIPQBAAD2AgAg-gEAABYAIBIEAADOAwAgCAAA0AMAIAkAAM8DACAMAADRAwAgnQEBAAAAAagBQAAAAAGpAUAAAAABvwEBAAAAAcABAADNAwAgwQECAAAAAcIBCAAAAAHDAQEAAAABxAEBAAAAAcUBIAAAAAHGASAAAAABxwEIAAAAAcgBAgAAAAHJAQIAAAABAgAAAJcBACAeAACIAwAgAwAAAAMAIB4AAIgDACAfAACMAwAgFAAAAAMAIAQAAI8DACAIAACRAwAgCQAAkAMAIAwAAJIDACAXAACMAwAgnQEBALkCACGoAUAAvQIAIakBQAC9AgAhvwEBALoCACHAAQAAjQMAIMEBAgDMAgAhwgEIAN0CACHDAQEAugIAIcQBAQC6AgAhxQEgAI4DACHGASAAjgMAIccBCADdAgAhyAECAMwCACHJAQIAzAIAIRIEAACPAwAgCAAAkQMAIAkAAJADACAMAACSAwAgnQEBALkCACGoAUAAvQIAIakBQAC9AgAhvwEBALoCACHAAQAAjQMAIMEBAgDMAgAhwgEIAN0CACHDAQEAugIAIcQBAQC6AgAhxQEgAI4DACHGASAAjgMAIccBCADdAgAhyAECAMwCACHJAQIAzAIAIQL3AQEAAAAE_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-AEAAOkCADD5AQAA6QIAMPoBAADpAgAw-wEAAMYDADD8AQAA7AIAMBEHAACEAwAgCwAApgMAIBAAAIYDACARAACHAwAgnQEBAAAAAaIBAQAAAAGoAUAAAAABqQFAAAAAAbgBAQAAAAHTAQEAAAAB3QEAAADuAQLqAUAAAAAB6wEBAAAAAewBCAAAAAHuAQEAAAAB7wEBAAAAAfABQAAAAAECAAAAAQAgHgAAyQMAIAMAAAABACAeAADJAwAgHwAAyAMAIAEXAACkBAAwAgAAAAEAIBcAAMgDACACAAAA7QIAIBcAAMcDACANnQEBALkCACGiAQEAuQIAIagBQAC9AgAhqQFAAL0CACG4AQEAuQIAIdMBAQC5AgAh3QEAAO8C7gEi6gFAAL0CACHrAQEAugIAIewBCADdAgAh7gEBALoCACHvAQEAugIAIfABQADgAgAhEQcAAPECACALAACkAwAgEAAA8wIAIBEAAPQCACCdAQEAuQIAIaIBAQC5AgAhqAFAAL0CACGpAUAAvQIAIbgBAQC5AgAh0wEBALkCACHdAQAA7wLuASLqAUAAvQIAIesBAQC6AgAh7AEIAN0CACHuAQEAugIAIe8BAQC6AgAh8AFAAOACACERBwAAhAMAIAsAAKYDACAQAACGAwAgEQAAhwMAIJ0BAQAAAAGiAQEAAAABqAFAAAAAAakBQAAAAAG4AQEAAAAB0wEBAAAAAd0BAAAA7gEC6gFAAAAAAesBAQAAAAHsAQgAAAAB7gEBAAAAAe8BAQAAAAHwAUAAAAABCwYAAMsDACAIAADMAwAgnQEBAAAAAagBQAAAAAGpAUAAAAABvQEgAAAAAc0BAQAAAAHOAQEAAAABzwEIAAAAAdABAgAAAAHRAQEAAAABAx4AAKIEACD0AQAAowQAIPoBAAA8ACAEHgAAwQMAMPQBAADCAwAw9gEAAMQDACD6AQAA6QIAMAH3AQEAAAAEBB4AALQDADD0AQAAtQMAMPYBAAC3AwAg-gEAALgDADAEHgAApwMAMPQBAACoAwAw9gEAAKoDACD6AQAAqwMAMAQeAACcAwAw9AEAAJ0DADD2AQAAnwMAIPoBAADpAgAwBB4AAJMDADD0AQAAlAMAMPYBAACWAwAg-gEAAMYCADADHgAAiAMAIPQBAACJAwAg-gEAAJcBACAEHgAA5QIAMPQBAADmAgAw9gEAAOgCACD6AQAA6QIAMAQeAADTAgAw9AEAANQCADD2AQAA1gIAIPoBAADXAgAwBB4AAMICADD0AQAAwwIAMPYBAADFAgAg-gEAAMYCADAIAQAA5gMAIAQAAOcDACAIAADXAwAgCQAA6AMAIAwAANkDACC_AQAAtQIAIMMBAAC1AgAgxAEAALUCACAAAAAAAAAFHgAAnQQAIB8AAKAEACD0AQAAngQAIPUBAACfBAAg-gEAAJcBACADHgAAnQQAIPQBAACeBAAg-gEAAJcBACAAAAAAAAUeAACYBAAgHwAAmwQAIPQBAACZBAAg9QEAAJoEACD6AQAAxQEAIAMeAACYBAAg9AEAAJkEACD6AQAAxQEAIAcIAADXAwAgDAAA2QMAIA0AANYDACAOAADYAwAgoQEAALUCACCiAQAAtQIAIKMBAAC1AgAgAAAAAAAAAAUeAACTBAAgHwAAlgQAIPQBAACUBAAg9QEAAJUEACD6AQAAlwEAIAMeAACTBAAg9AEAAJQEACD6AQAAlwEAIAAAAAAAAAAAAAAAAAALHgAA_gMAMB8AAIIEADD0AQAA_wMAMPUBAACABAAw9gEAAIEEACD3AQAAuAMAMPgBAAC4AwAw-QEAALgDADD6AQAAuAMAMPsBAACDBAAw_AEAALsDADALBwAA7wMAIAgAAMwDACCdAQEAAAABqAFAAAAAAakBQAAAAAG4AQEAAAABvQEgAAAAAc0BAQAAAAHOAQEAAAABzwEIAAAAAdABAgAAAAECAAAABwAgHgAAhgQAIAMAAAAHACAeAACGBAAgHwAAhQQAIAEXAACSBAAwAgAAAAcAIBcAAIUEACACAAAAvAMAIBcAAIQEACAJnQEBALkCACGoAUAAvQIAIakBQAC9AgAhuAEBALkCACG9ASAAjgMAIc0BAQC5AgAhzgEBALoCACHPAQgA3QIAIdABAgDMAgAhCwcAAO4DACAIAADAAwAgnQEBALkCACGoAUAAvQIAIakBQAC9AgAhuAEBALkCACG9ASAAjgMAIc0BAQC5AgAhzgEBALoCACHPAQgA3QIAIdABAgDMAgAhCwcAAO8DACAIAADMAwAgnQEBAAAAAagBQAAAAAGpAUAAAAABuAEBAAAAAb0BIAAAAAHNAQEAAAABzgEBAAAAAc8BCAAAAAHQAQIAAAABBB4AAP4DADD0AQAA_wMAMPYBAACBBAAg-gEAALgDADAAAAAAAAkHAADWAwAgCwAA5gMAIA8AAI4EACAQAACPBAAgEQAAkAQAIOsBAAC1AgAg7gEAALUCACDvAQAAtQIAIPABAAC1AgAgBAYAAJEEACAHAADWAwAgCAAA1wMAIM4BAAC1AgAgBgoAAI0EACALAADmAwAg2wEAALUCACDeAQAAtQIAIN8BAAC1AgAg4AEAALUCACAEBwAA1gMAIAoAAI0EACALAADmAwAg1QEAALUCACADBAAA5wMAIM4BAAC1AgAg6AEAALUCACAJnQEBAAAAAagBQAAAAAGpAUAAAAABuAEBAAAAAb0BIAAAAAHNAQEAAAABzgEBAAAAAc8BCAAAAAHQAQIAAAABEwEAAOUDACAIAADQAwAgCQAAzwMAIAwAANEDACCdAQEAAAABqAFAAAAAAakBQAAAAAG-AQEAAAABvwEBAAAAAcABAADNAwAgwQECAAAAAcIBCAAAAAHDAQEAAAABxAEBAAAAAcUBIAAAAAHGASAAAAABxwEIAAAAAcgBAgAAAAHJAQIAAAABAgAAAJcBACAeAACTBAAgAwAAAAMAIB4AAJMEACAfAACXBAAgFQAAAAMAIAEAAOQDACAIAACRAwAgCQAAkAMAIAwAAJIDACAXAACXBAAgnQEBALkCACGoAUAAvQIAIakBQAC9AgAhvgEBALkCACG_AQEAugIAIcABAACNAwAgwQECAMwCACHCAQgA3QIAIcMBAQC6AgAhxAEBALoCACHFASAAjgMAIcYBIACOAwAhxwEIAN0CACHIAQIAzAIAIckBAgDMAgAhEwEAAOQDACAIAACRAwAgCQAAkAMAIAwAAJIDACCdAQEAuQIAIagBQAC9AgAhqQFAAL0CACG-AQEAuQIAIb8BAQC6AgAhwAEAAI0DACDBAQIAzAIAIcIBCADdAgAhwwEBALoCACHEAQEAugIAIcUBIACOAwAhxgEgAI4DACHHAQgA3QIAIcgBAgDMAgAhyQECAMwCACEOCAAA0wMAIAwAANUDACAOAADUAwAgnQEBAAAAAZ4BAQAAAAGfAQEAAAABoAEBAAAAAaEBAQAAAAGiAQEAAAABowEBAAAAAaUBAAAApQECpwEAAACnAQKoAUAAAAABqQFAAAAAAQIAAADFAQAgHgAAmAQAIAMAAADIAQAgHgAAmAQAIB8AAJwEACAQAAAAyAEAIAgAAL8CACAMAADBAgAgDgAAwAIAIBcAAJwEACCdAQEAuQIAIZ4BAQC5AgAhnwEBALkCACGgAQEAuQIAIaEBAQC6AgAhogEBALoCACGjAQEAugIAIaUBAAC7AqUBIqcBAAC8AqcBIqgBQAC9AgAhqQFAAL0CACEOCAAAvwIAIAwAAMECACAOAADAAgAgnQEBALkCACGeAQEAuQIAIZ8BAQC5AgAhoAEBALkCACGhAQEAugIAIaIBAQC6AgAhowEBALoCACGlAQAAuwKlASKnAQAAvAKnASKoAUAAvQIAIakBQAC9AgAhEwEAAOUDACAEAADOAwAgCAAA0AMAIAwAANEDACCdAQEAAAABqAFAAAAAAakBQAAAAAG-AQEAAAABvwEBAAAAAcABAADNAwAgwQECAAAAAcIBCAAAAAHDAQEAAAABxAEBAAAAAcUBIAAAAAHGASAAAAABxwEIAAAAAcgBAgAAAAHJAQIAAAABAgAAAJcBACAeAACdBAAgAwAAAAMAIB4AAJ0EACAfAAChBAAgFQAAAAMAIAEAAOQDACAEAACPAwAgCAAAkQMAIAwAAJIDACAXAAChBAAgnQEBALkCACGoAUAAvQIAIakBQAC9AgAhvgEBALkCACG_AQEAugIAIcABAACNAwAgwQECAMwCACHCAQgA3QIAIcMBAQC6AgAhxAEBALoCACHFASAAjgMAIcYBIACOAwAhxwEIAN0CACHIAQIAzAIAIckBAgDMAgAhEwEAAOQDACAEAACPAwAgCAAAkQMAIAwAAJIDACCdAQEAuQIAIagBQAC9AgAhqQFAAL0CACG-AQEAuQIAIb8BAQC6AgAhwAEAAI0DACDBAQIAzAIAIcIBCADdAgAhwwEBALoCACHEAQEAugIAIcUBIACOAwAhxgEgAI4DACHHAQgA3QIAIcgBAgDMAgAhyQECAMwCACEInQEBAAAAAZ4BAQAAAAGoAUAAAAABqQFAAAAAAb0BIAAAAAHOAQEAAAAB5wEBAAAAAegBAQAAAAECAAAAPAAgHgAAogQAIA2dAQEAAAABogEBAAAAAagBQAAAAAGpAUAAAAABuAEBAAAAAdMBAQAAAAHdAQAAAO4BAuoBQAAAAAHrAQEAAAAB7AEIAAAAAe4BAQAAAAHvAQEAAAAB8AFAAAAAAQMAAAA_ACAeAACiBAAgHwAApwQAIAoAAAA_ACAXAACnBAAgnQEBALkCACGeAQEAuQIAIagBQAC9AgAhqQFAAL0CACG9ASAAjgMAIc4BAQC6AgAh5wEBALkCACHoAQEAugIAIQidAQEAuQIAIZ4BAQC5AgAhqAFAAL0CACGpAUAAvQIAIb0BIACOAwAhzgEBALoCACHnAQEAuQIAIegBAQC6AgAhCZ0BAQAAAAGoAUAAAAABqQFAAAAAAb0BIAAAAAHNAQEAAAABzgEBAAAAAc8BCAAAAAHQAQIAAAAB0QEBAAAAAQedAQEAAAABqAFAAAAAAakBQAAAAAG6AQAAALoBArsBAQAAAAG8AQEAAAABvQEgAAAAAQ4MAADVAwAgDQAA0gMAIA4AANQDACCdAQEAAAABngEBAAAAAZ8BAQAAAAGgAQEAAAABoQEBAAAAAaIBAQAAAAGjAQEAAAABpQEAAAClAQKnAQAAAKcBAqgBQAAAAAGpAUAAAAABAgAAAMUBACAeAACqBAAgAwAAAMgBACAeAACqBAAgHwAArgQAIBAAAADIAQAgDAAAwQIAIA0AAL4CACAOAADAAgAgFwAArgQAIJ0BAQC5AgAhngEBALkCACGfAQEAuQIAIaABAQC5AgAhoQEBALoCACGiAQEAugIAIaMBAQC6AgAhpQEAALsCpQEipwEAALwCpwEiqAFAAL0CACGpAUAAvQIAIQ4MAADBAgAgDQAAvgIAIA4AAMACACCdAQEAuQIAIZ4BAQC5AgAhnwEBALkCACGgAQEAuQIAIaEBAQC6AgAhogEBALoCACGjAQEAugIAIaUBAAC7AqUBIqcBAAC8AqcBIqgBQAC9AgAhqQFAAL0CACENnQEBAAAAAaIBAQAAAAGoAUAAAAABqQFAAAAAAdMBAQAAAAHdAQAAAO4BAukBAQAAAAHqAUAAAAAB6wEBAAAAAewBCAAAAAHuAQEAAAAB7wEBAAAAAfABQAAAAAEHnQEBAAAAAagBQAAAAAGpAUAAAAAB0gEBAAAAAdMBAQAAAAHUAQIAAAAB1QEBAAAAAQwGAADLAwAgBwAA7wMAIJ0BAQAAAAGoAUAAAAABqQFAAAAAAbgBAQAAAAG9ASAAAAABzQEBAAAAAc4BAQAAAAHPAQgAAAAB0AECAAAAAdEBAQAAAAECAAAABwAgHgAAsQQAIBMBAADlAwAgBAAAzgMAIAkAAM8DACAMAADRAwAgnQEBAAAAAagBQAAAAAGpAUAAAAABvgEBAAAAAb8BAQAAAAHAAQAAzQMAIMEBAgAAAAHCAQgAAAABwwEBAAAAAcQBAQAAAAHFASAAAAABxgEgAAAAAccBCAAAAAHIAQIAAAAByQECAAAAAQIAAACXAQAgHgAAswQAIA4IAADTAwAgDAAA1QMAIA0AANIDACCdAQEAAAABngEBAAAAAZ8BAQAAAAGgAQEAAAABoQEBAAAAAaIBAQAAAAGjAQEAAAABpQEAAAClAQKnAQAAAKcBAqgBQAAAAAGpAUAAAAABAgAAAMUBACAeAAC1BAAgAwAAAMgBACAeAAC1BAAgHwAAuQQAIBAAAADIAQAgCAAAvwIAIAwAAMECACANAAC-AgAgFwAAuQQAIJ0BAQC5AgAhngEBALkCACGfAQEAuQIAIaABAQC5AgAhoQEBALoCACGiAQEAugIAIaMBAQC6AgAhpQEAALsCpQEipwEAALwCpwEiqAFAAL0CACGpAUAAvQIAIQ4IAAC_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_AQEAugIAIcABAACNAwAgwQECAMwCACHCAQgA3QIAIcMBAQC6AgAhxAEBALoCACHFASAAjgMAIcYBIACOAwAhxwEIAN0CACHIAQIAzAIAIckBAgDMAgAhAwAAAAsAIB4AAM4EACAfAADVBAAgFAAAAAsAIAcAAPECACALAACkAwAgDwAA8gIAIBAAAPMCACAXAADVBAAgnQEBALkCACGiAQEAuQIAIagBQAC9AgAhqQFAAL0CACG4AQEAuQIAIdMBAQC5AgAh3QEAAO8C7gEi6QEBALkCACHqAUAAvQIAIesBAQC6AgAh7AEIAN0CACHuAQEAugIAIe8BAQC6AgAh8AFAAOACACESBwAA8QIAIAsAAKQDACAPAADyAgAgEAAA8wIAIJ0BAQC5AgAhogEBALkCACGoAUAAvQIAIakBQAC9AgAhuAEBALkCACHTAQEAuQIAId0BAADvAu4BIukBAQC5AgAh6gFAAL0CACHrAQEAugIAIewBCADdAgAh7gEBALoCACHvAQEAugIAIfABQADgAgAhB50BAQAAAAGoAUAAAAABqQFAAAAAAbgBAQAAAAHSAQEAAAAB1AECAAAAAdUBAQAAAAEFBwADCwACDwAEECULESYJBQUADAgcAQwhCQ0EAw4gCwYBAAIECAQFAAoIEwEJEggMFwkEBQAHBgAFBwADCA0BAgQJBAUABgEECgABCA4AAQcAAwMHAAMKAAELAAIEBBgACBoACRkADBsAAgoAAQsAAgMIIgAMJAAOIwAAAwcAAwsAAg8ABAMHAAMLAAIPAAQFBQARJAASJQATJgAUJwAVAAAAAAAFBQARJAASJQATJgAUJwAVAAADBQAaJgAbJwAcAAAAAwUAGiYAGycAHAIKAAELAAICCgABCwACBQUAISQAIiUAIyYAJCcAJQAAAAAABQUAISQAIiUAIyYAJCcAJQMHAAMKAAELAAIDBwADCgABCwACBQUAKiQAKyUALCYALScALgAAAAAABQUAKiQAKyUALCYALScALgIGAAUHAAMCBgAFBwADBQUAMyQANCUANSYANicANwAAAAAABQUAMyQANCUANSYANicANwEBAAIBAQACBQUAPCQAPSUAPiYAPycAQAAAAAAABQUAPCQAPSUAPiYAPycAQAEHAAMBBwADAwUARSYARicARwAAAAMFAEUmAEYnAEcAAAMFAEwmAE0nAE4AAAADBQBMJgBNJwBOEgIBEycBFCgBFSkBFioBGCwBGS4NGi8OGzEBHDMNHTQPIDUBITYBIjcNKDoQKTsWKj0FKz4FLEEFLUIFLkMFL0UFMEcNMUgXMkoFM0wNNE0YNU4FNk8FN1ANOFMZOVQdOlULO1YLPFcLPVgLPlkLP1sLQF0NQV4eQmALQ2INRGMfRWQLRmULR2YNSGkgSWomSmsJS2wJTG0JTW4JTm8JT3EJUHMNUXQnUnYJU3gNVHkoVXoJVnsJV3wNWH8pWYABL1qBAQRbggEEXIMBBF2EAQRehQEEX4cBBGCJAQ1higEwYowBBGOOAQ1kjwExZZABBGaRAQRnkgENaJUBMmmWAThqmAEDa5kBA2ybAQNtnAEDbp0BA2-fAQNwoQENcaIBOXKkAQNzpgENdKcBOnWoAQN2qQEDd6oBDXitATt5rgFBeq8BCHuwAQh8sQEIfbIBCH6zAQh_tQEIgAG3AQ2BAbgBQoIBugEIgwG8AQ2EAb0BQ4UBvgEIhgG_AQiHAcABDYgBwwFEiQHEAUiKAcYBAosBxwECjAHKAQKNAcsBAo4BzAECjwHOAQKQAdABDZEB0QFJkgHTAQKTAdUBDZQB1gFKlQHXAQKWAdgBApcB2QENmAHcAUuZAd0BTw"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AnyNull: () => AnyNull2,
  AvailabilityScalarFieldEnum: () => AvailabilityScalarFieldEnum,
  BookingScalarFieldEnum: () => BookingScalarFieldEnum,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  JsonNullValueFilter: () => JsonNullValueFilter,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullableJsonNullValueInput: () => NullableJsonNullValueInput,
  NullsOrder: () => NullsOrder,
  PaymentScalarFieldEnum: () => PaymentScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  ServiceScalarFieldEnum: () => ServiceScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TechnicianProfileScalarFieldEnum: () => TechnicianProfileScalarFieldEnum,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.10.0",
  engine: "0edf323efd1d98336f3f0a68684b56f689b900d3"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  Booking: "Booking",
  Category: "Category",
  Payment: "Payment",
  Review: "Review",
  Service: "Service",
  TechnicianProfile: "TechnicianProfile",
  Availability: "Availability",
  User: "User"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var BookingScalarFieldEnum = {
  id: "id",
  customerId: "customerId",
  technicianId: "technicianId",
  serviceId: "serviceId",
  scheduledAt: "scheduledAt",
  address: "address",
  note: "note",
  totalAmount: "totalAmount",
  status: "status",
  declineReason: "declineReason",
  cancelReason: "cancelReason",
  completedAt: "completedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CategoryScalarFieldEnum = {
  id: "id",
  name: "name",
  slug: "slug",
  description: "description",
  icon: "icon",
  isActive: "isActive",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var PaymentScalarFieldEnum = {
  id: "id",
  transactionId: "transactionId",
  bookingId: "bookingId",
  customerId: "customerId",
  amount: "amount",
  currency: "currency",
  provider: "provider",
  method: "method",
  status: "status",
  gatewaySessionId: "gatewaySessionId",
  gatewayResponse: "gatewayResponse",
  paidAt: "paidAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ReviewScalarFieldEnum = {
  id: "id",
  bookingId: "bookingId",
  customerId: "customerId",
  technicianId: "technicianId",
  rating: "rating",
  comment: "comment",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ServiceScalarFieldEnum = {
  id: "id",
  title: "title",
  description: "description",
  price: "price",
  durationMin: "durationMin",
  isActive: "isActive",
  categoryId: "categoryId",
  technicianId: "technicianId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TechnicianProfileScalarFieldEnum = {
  id: "id",
  userId: "userId",
  bio: "bio",
  skills: "skills",
  experienceYears: "experienceYears",
  hourlyRate: "hourlyRate",
  location: "location",
  nidNumber: "nidNumber",
  isAvailable: "isAvailable",
  isVerified: "isVerified",
  avgRating: "avgRating",
  totalReviews: "totalReviews",
  totalJobs: "totalJobs",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var AvailabilityScalarFieldEnum = {
  id: "id",
  technicianId: "technicianId",
  dayOfWeek: "dayOfWeek",
  startTime: "startTime",
  endTime: "endTime",
  isActive: "isActive",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  password: "password",
  phone: "phone",
  address: "address",
  profilePhoto: "profilePhoto",
  role: "role",
  activeStatus: "activeStatus",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var NullableJsonNullValueInput = {
  DbNull: DbNull2,
  JsonNull: JsonNull2
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var JsonNullValueFilter = {
  DbNull: DbNull2,
  JsonNull: JsonNull2,
  AnyNull: AnyNull2
};
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/enums.ts
var ActiveStatus = {
  ACTIVE: "ACTIVE",
  BLOCKED: "BLOCKED"
};
var Role = {
  CUSTOMER: "CUSTOMER",
  TECHNICIAN: "TECHNICIAN",
  ADMIN: "ADMIN"
};
var BookingStatus = {
  REQUESTED: "REQUESTED",
  ACCEPTED: "ACCEPTED",
  DECLINED: "DECLINED",
  PAID: "PAID",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED"
};
var PaymentStatus = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED"
};
var PaymentProvider = {
  STRIPE: "STRIPE",
  SSLCOMMERZ: "SSLCOMMERZ"
};

// generated/prisma/client.ts
globalThis["__dirname"] = path2.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/utils/jwt.ts
import jwt from "jsonwebtoken";
var createToken = (payload, secret, expiresIn) => {
  const token = jwt.sign(payload, secret, { expiresIn });
  return token;
};
var verifyToken = (token, secret) => {
  try {
    const verifiedToken = jwt.verify(token, secret);
    return {
      success: true,
      data: verifiedToken
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};
var jwtUtils = {
  createToken,
  verifyToken
};

// src/utils/AppError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message, stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};

// src/auth/auth.service.ts
var buildJwtPayload = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role
});
var registerUser = async (payload) => {
  const {
    name,
    email,
    password,
    phone,
    address,
    profilePhoto,
    role,
    bio,
    skills,
    experienceYears,
    hourlyRate,
    location
  } = payload;
  const isUserExist = await prisma.user.findUnique({ where: { email } });
  if (isUserExist) {
    throw new AppError(httpStatus.CONFLICT, "A user with this email already exists");
  }
  const hashedPassword = await bcrypt.hash(password, Number(config_default.bcrypt_salt_rounds));
  const userRole = role === "TECHNICIAN" ? "TECHNICIAN" : "CUSTOMER";
  const createdUser = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        address,
        profilePhoto,
        role: userRole
      }
    });
    if (userRole === "TECHNICIAN") {
      await tx.technicianProfile.create({
        data: {
          userId: user.id,
          bio,
          skills: skills ?? [],
          experienceYears: experienceYears ?? 0,
          hourlyRate: hourlyRate ?? 0,
          location: location ?? address
        }
      });
    }
    return tx.user.findUniqueOrThrow({
      where: { id: user.id },
      omit: { password: true },
      include: { technicianProfile: true }
    });
  });
  return createdUser;
};
var loginUser = async (payload) => {
  const { email, password } = payload;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }
  if (user.activeStatus === "BLOCKED") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Your account has been blocked. Please contact support"
    );
  }
  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }
  const jwtPayload = buildJwtPayload(user);
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expires_in
  );
  const refreshToken3 = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_refresh_secret,
    config_default.jwt_refresh_expires_in
  );
  const { password: _pwd, ...safeUser } = user;
  return { accessToken, refreshToken: refreshToken3, user: safeUser };
};
var refreshToken = async (token) => {
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Refresh token is missing");
  }
  const verifiedRefreshToken = jwtUtils.verifyToken(token, config_default.jwt_refresh_secret);
  if (!verifiedRefreshToken.success) {
    throw new AppError(httpStatus.UNAUTHORIZED, verifiedRefreshToken.error);
  }
  const { id } = verifiedRefreshToken.data;
  const user = await prisma.user.findUniqueOrThrow({ where: { id } });
  if (user.activeStatus === "BLOCKED") {
    throw new AppError(httpStatus.FORBIDDEN, "Your account has been blocked");
  }
  const accessToken = jwtUtils.createToken(
    buildJwtPayload(user),
    config_default.jwt_access_secret,
    config_default.jwt_access_expires_in
  );
  return { accessToken };
};
var getMe = async (userId) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    omit: { password: true },
    include: {
      technicianProfile: {
        include: {
          availabilities: true,
          _count: { select: { services: true, bookings: true } }
        }
      },
      _count: { select: { bookings: true, reviews: true } }
    }
  });
  return user;
};
var changePassword = async (userId, payload) => {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  const isPasswordMatched = await bcrypt.compare(payload.oldPassword, user.password);
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Your old password is incorrect");
  }
  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config_default.bcrypt_salt_rounds)
  );
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword }
  });
  return null;
};
var authService = {
  registerUser,
  loginUser,
  refreshToken,
  getMe,
  changePassword
};

// src/auth/auth.controller.ts
var cookieOptions = {
  httpOnly: true,
  secure: config_default.node_env === "production",
  sameSite: "lax"
};
var registerUser2 = catchAsync(async (req, res, next) => {
  const result = await authService.registerUser(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus2.CREATED,
    message: "User registered successfully",
    data: result
  });
});
var loginUser2 = catchAsync(async (req, res, next) => {
  const { accessToken, refreshToken: refreshToken3, user } = await authService.loginUser(req.body);
  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 1e3 * 60 * 60 * 24
    // 1 day
  });
  res.cookie("refreshToken", refreshToken3, {
    ...cookieOptions,
    maxAge: 1e3 * 60 * 60 * 24 * 7
    // 7 days
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus2.OK,
    message: "User logged in successfully",
    data: { accessToken, refreshToken: refreshToken3, user }
  });
});
var refreshToken2 = catchAsync(async (req, res, next) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;
  const { accessToken } = await authService.refreshToken(token);
  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 1e3 * 60 * 60 * 24
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus2.OK,
    message: "Token refreshed successfully",
    data: { accessToken }
  });
});
var getMe2 = catchAsync(async (req, res, next) => {
  const result = await authService.getMe(req.user?.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus2.OK,
    message: "Current user retrieved successfully",
    data: result
  });
});
var changePassword2 = catchAsync(async (req, res, next) => {
  const result = await authService.changePassword(req.user?.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus2.OK,
    message: "Password changed successfully",
    data: result
  });
});
var logout = catchAsync(async (req, res, next) => {
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus2.OK,
    message: "Logged out successfully",
    data: null
  });
});
var authController = {
  registerUser: registerUser2,
  loginUser: loginUser2,
  refreshToken: refreshToken2,
  getMe: getMe2,
  changePassword: changePassword2,
  logout
};

// src/auth/auth.validation.ts
import { z } from "zod";
var registerUserSchema = z.object({
  name: z.string({ error: "Name is required" }).min(3, "Name must be at least 3 characters long").max(255, "Name can not be longer than 255 characters"),
  email: z.email("Please provide a valid email address"),
  password: z.string({ error: "Password is required" }).min(6, "Password must be at least 6 characters long").regex(/[A-Za-z]/, "Password must contain at least one letter").regex(/[0-9]/, "Password must contain at least one number"),
  phone: z.string().regex(/^[0-9+\-\s()]{7,20}$/, "Please provide a valid phone number").optional(),
  address: z.string().max(500, "Address is too long").optional(),
  profilePhoto: z.url("Profile photo must be a valid URL").optional(),
  // ADMIN can never be created from the public register route
  role: z.enum(["CUSTOMER", "TECHNICIAN"], {
    error: "Role must be either CUSTOMER or TECHNICIAN"
  }).optional(),
  bio: z.string().max(1e3, "Bio is too long").optional(),
  skills: z.array(z.string().min(1, "A skill can not be empty")).optional(),
  experienceYears: z.number().int("Experience years must be a whole number").min(0, "Experience years can not be negative").max(70, "Experience years looks unrealistic").optional(),
  hourlyRate: z.number().min(0, "Hourly rate can not be negative").optional(),
  location: z.string().max(255, "Location is too long").optional()
});
var loginUserSchema = z.object({
  email: z.email("Please provide a valid email address"),
  password: z.string({ error: "Password is required" }).min(1, "Password is required")
});
var changePasswordSchema = z.object({
  oldPassword: z.string({ error: "Old password is required" }).min(1, "Old password is required"),
  newPassword: z.string({ error: "New password is required" }).min(6, "New password must be at least 6 characters long").regex(/[A-Za-z]/, "New password must contain at least one letter").regex(/[0-9]/, "New password must contain at least one number")
});
var authValidation = {
  registerUserSchema,
  loginUserSchema,
  changePasswordSchema
};

// src/middlewares/validateRequest.ts
var validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
};

// src/middlewares/auth.ts
import httpStatus3 from "http-status";
var auth = (...requiredRoles) => {
  return catchAsync(async (req, res, next) => {
    const token = req.cookies?.accessToken ? req.cookies.accessToken : req.headers.authorization?.startsWith("Bearer") ? req.headers.authorization?.split(" ")[1] : req.headers.authorization;
    if (!token) {
      throw new AppError(
        httpStatus3.UNAUTHORIZED,
        "You are not logged in. Please log in to access this resource"
      );
    }
    const verifiedToken = jwtUtils.verifyToken(token, config_default.jwt_access_secret);
    if (!verifiedToken.success) {
      throw new AppError(httpStatus3.UNAUTHORIZED, verifiedToken.error);
    }
    const { id, name, email, role } = verifiedToken.data;
    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new AppError(
        httpStatus3.FORBIDDEN,
        "Forbidden. You don't have permission to access this resource"
      );
    }
    const user = await prisma.user.findUnique({
      where: { id }
    });
    if (!user) {
      throw new AppError(httpStatus3.UNAUTHORIZED, "User not found. Please log in again.");
    }
    if (user.activeStatus === "BLOCKED") {
      throw new AppError(
        httpStatus3.FORBIDDEN,
        "Your account has been blocked. Please contact support"
      );
    }
    req.user = { id, name, email, role };
    next();
  });
};

// src/auth/auth.routes.ts
var router = Router();
router.post(
  "/register",
  validateRequest(authValidation.registerUserSchema),
  authController.registerUser
);
router.post("/login", validateRequest(authValidation.loginUserSchema), authController.loginUser);
router.post("/refresh-token", authController.refreshToken);
router.get(
  "/me",
  auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN),
  authController.getMe
);
router.post(
  "/change-password",
  auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN),
  validateRequest(authValidation.changePasswordSchema),
  authController.changePassword
);
router.post("/logout", authController.logout);
var authRoutes = router;

// src/modules/user/user.route.ts
import { Router as Router2 } from "express";

// src/modules/user/user.controller.ts
import httpStatus4 from "http-status";

// src/modules/user/user.service.ts
var getMyProfileFromDB = async (userId) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    omit: { password: true },
    include: {
      technicianProfile: {
        include: {
          services: { include: { category: true } },
          availabilities: { orderBy: { startTime: "asc" } }
        }
      }
    }
  });
  return user;
};
var updateMyProfileInDB = async (userId, payload) => {
  const { name, phone, address, profilePhoto } = payload;
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { name, phone, address, profilePhoto },
    omit: { password: true },
    include: { technicianProfile: true }
  });
  return updatedUser;
};
var userService = {
  getMyProfileFromDB,
  updateMyProfileInDB
};

// src/modules/user/user.controller.ts
var getMyProfile = catchAsync(async (req, res, next) => {
  const result = await userService.getMyProfileFromDB(req.user?.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus4.OK,
    message: "Profile retrieved successfully",
    data: result
  });
});
var updateMyProfile = catchAsync(async (req, res, next) => {
  const result = await userService.updateMyProfileInDB(req.user?.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus4.OK,
    message: "Profile updated successfully",
    data: result
  });
});
var userController = {
  getMyProfile,
  updateMyProfile
};

// src/modules/user/user.validation.ts
import { z as z2 } from "zod";
var updateProfileSchema = z2.object({
  name: z2.string().min(3, "Name must be at least 3 characters long").max(255, "Name can not be longer than 255 characters").optional(),
  phone: z2.string().regex(/^[0-9+\-\s()]{7,20}$/, "Please provide a valid phone number").optional(),
  address: z2.string().max(500, "Address is too long").optional(),
  profilePhoto: z2.url("Profile photo must be a valid URL").optional()
});
var userValidation = {
  updateProfileSchema
};

// src/modules/user/user.route.ts
var router2 = Router2();
router2.get("/me", auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN), userController.getMyProfile);
router2.patch(
  "/me",
  auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN),
  validateRequest(userValidation.updateProfileSchema),
  userController.updateMyProfile
);
var userRoutes = router2;

// src/modules/category/category.route.ts
import { Router as Router3 } from "express";

// src/modules/category/category.controller.ts
import httpStatus6 from "http-status";

// src/modules/category/category.service.ts
import httpStatus5 from "http-status";
var toSlug = (name) => name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
var getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    include: { _count: { select: { services: true } } }
  });
  return categories;
};
var getAllCategoriesForAdmin = async () => {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { services: true } } }
  });
  return categories;
};
var createCategory = async (payload) => {
  const slug = toSlug(payload.name);
  const isExist = await prisma.category.findFirst({
    where: { OR: [{ name: payload.name }, { slug }] }
  });
  if (isExist) {
    throw new AppError(httpStatus5.CONFLICT, "A category with this name already exists");
  }
  const category = await prisma.category.create({
    data: { ...payload, slug }
  });
  return category;
};
var updateCategory = async (categoryId, payload) => {
  await prisma.category.findUniqueOrThrow({ where: { id: categoryId } });
  const slug = payload.name ? toSlug(payload.name) : void 0;
  if (slug) {
    const clash = await prisma.category.findFirst({
      where: { slug, NOT: { id: categoryId } }
    });
    if (clash) {
      throw new AppError(httpStatus5.CONFLICT, "Another category already uses this name");
    }
  }
  const category = await prisma.category.update({
    where: { id: categoryId },
    data: { ...payload, ...slug ? { slug } : {} }
  });
  return category;
};
var deleteCategory = async (categoryId) => {
  const category = await prisma.category.findUniqueOrThrow({
    where: { id: categoryId },
    include: { _count: { select: { services: true } } }
  });
  if (category._count.services > 0) {
    throw new AppError(
      httpStatus5.BAD_REQUEST,
      "This category still has services attached. Deactivate it instead of deleting it"
    );
  }
  await prisma.category.delete({ where: { id: categoryId } });
};
var categoryService = {
  getAllCategories,
  getAllCategoriesForAdmin,
  createCategory,
  updateCategory,
  deleteCategory
};

// src/modules/category/category.controller.ts
var getAllCategories2 = catchAsync(async (req, res, next) => {
  const result = await categoryService.getAllCategories();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus6.OK,
    message: "Categories retrieved successfully",
    data: result
  });
});
var getAllCategoriesForAdmin2 = catchAsync(
  async (req, res, next) => {
    const result = await categoryService.getAllCategoriesForAdmin();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus6.OK,
      message: "Categories retrieved successfully",
      data: result
    });
  }
);
var createCategory2 = catchAsync(async (req, res, next) => {
  const result = await categoryService.createCategory(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus6.CREATED,
    message: "Category created successfully",
    data: result
  });
});
var updateCategory2 = catchAsync(async (req, res, next) => {
  const result = await categoryService.updateCategory(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus6.OK,
    message: "Category updated successfully",
    data: result
  });
});
var deleteCategory2 = catchAsync(async (req, res, next) => {
  await categoryService.deleteCategory(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus6.OK,
    message: "Category deleted successfully",
    data: null
  });
});
var categoryController = {
  getAllCategories: getAllCategories2,
  getAllCategoriesForAdmin: getAllCategoriesForAdmin2,
  createCategory: createCategory2,
  updateCategory: updateCategory2,
  deleteCategory: deleteCategory2
};

// src/modules/category/category.route.ts
var router3 = Router3();
router3.get("/", categoryController.getAllCategories);
var categoryRoutes = router3;

// src/modules/service/service.route.ts
import { Router as Router4 } from "express";

// src/modules/service/service.controller.ts
import httpStatus8 from "http-status";

// src/modules/service/service.service.ts
import httpStatus7 from "http-status";

// src/utils/pagination.ts
var calculatePagination = (options, defaultSortBy = "createdAt") => {
  const page = Number(options.page) > 0 ? Number(options.page) : 1;
  const rawLimit = Number(options.limit) > 0 ? Number(options.limit) : 10;
  const limit = rawLimit > 100 ? 100 : rawLimit;
  const skip = (page - 1) * limit;
  const sortBy = options.sortBy ? options.sortBy : defaultSortBy;
  const sortOrder = options.sortOrder === "asc" ? "asc" : "desc";
  return { page, limit, skip, sortBy, sortOrder };
};
var buildMeta = (page, limit, total) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit)
});

// src/modules/service/service.service.ts
var getMyProfileOrThrow = async (userId) => {
  const profile = await prisma.technicianProfile.findUnique({ where: { userId } });
  if (!profile) {
    throw new AppError(httpStatus7.NOT_FOUND, "No technician profile exists for this account");
  }
  return profile;
};
var getAllServices = async (query) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(query);
  const andConditions = [
    { isActive: true },
    { technician: { user: { activeStatus: "ACTIVE" } } }
  ];
  if (query.searchTerm) {
    andConditions.push({
      OR: [
        { title: { contains: query.searchTerm, mode: "insensitive" } },
        { description: { contains: query.searchTerm, mode: "insensitive" } },
        { category: { name: { contains: query.searchTerm, mode: "insensitive" } } },
        { technician: { user: { name: { contains: query.searchTerm, mode: "insensitive" } } } }
      ]
    });
  }
  if (query.categoryId) {
    andConditions.push({ categoryId: query.categoryId });
  }
  if (query.category) {
    andConditions.push({
      category: {
        OR: [
          { name: { equals: query.category, mode: "insensitive" } },
          { slug: { equals: query.category, mode: "insensitive" } }
        ]
      }
    });
  }
  if (query.location) {
    andConditions.push({
      technician: { location: { contains: query.location, mode: "insensitive" } }
    });
  }
  if (query.minPrice) {
    andConditions.push({ price: { gte: Number(query.minPrice) } });
  }
  if (query.maxPrice) {
    andConditions.push({ price: { lte: Number(query.maxPrice) } });
  }
  if (query.minRating) {
    andConditions.push({ technician: { avgRating: { gte: Number(query.minRating) } } });
  }
  const where = { AND: andConditions };
  const [services, total] = await Promise.all([
    prisma.service.findMany({
      where,
      take: limit,
      skip,
      orderBy: { [sortBy]: sortOrder },
      include: {
        category: true,
        technician: {
          include: {
            user: { select: { id: true, name: true, profilePhoto: true } }
          }
        }
      }
    }),
    prisma.service.count({ where })
  ]);
  return { data: services, meta: buildMeta(page, limit, total) };
};
var getServiceById = async (serviceId) => {
  const service = await prisma.service.findUniqueOrThrow({
    where: { id: serviceId },
    include: {
      category: true,
      technician: {
        include: {
          user: { select: { id: true, name: true, email: true, phone: true, profilePhoto: true } },
          availabilities: { where: { isActive: true }, orderBy: { startTime: "asc" } }
        }
      }
    }
  });
  return service;
};
var createService = async (userId, payload) => {
  const profile = await getMyProfileOrThrow(userId);
  const category = await prisma.category.findUniqueOrThrow({
    where: { id: payload.categoryId }
  });
  if (!category.isActive) {
    throw new AppError(httpStatus7.BAD_REQUEST, "This category is not accepting new services");
  }
  const service = await prisma.service.create({
    data: { ...payload, technicianId: profile.id },
    include: { category: true }
  });
  return service;
};
var getMyServices = async (userId) => {
  const profile = await getMyProfileOrThrow(userId);
  const services = await prisma.service.findMany({
    where: { technicianId: profile.id },
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      _count: { select: { bookings: true } }
    }
  });
  return services;
};
var updateService = async (userId, serviceId, payload) => {
  const profile = await getMyProfileOrThrow(userId);
  const service = await prisma.service.findUniqueOrThrow({ where: { id: serviceId } });
  if (service.technicianId !== profile.id) {
    throw new AppError(httpStatus7.FORBIDDEN, "You are not the owner of this service");
  }
  if (payload.categoryId) {
    await prisma.category.findUniqueOrThrow({ where: { id: payload.categoryId } });
  }
  const updated = await prisma.service.update({
    where: { id: serviceId },
    data: payload,
    include: { category: true }
  });
  return updated;
};
var deleteService = async (userId, serviceId) => {
  const profile = await getMyProfileOrThrow(userId);
  const service = await prisma.service.findUniqueOrThrow({ where: { id: serviceId } });
  if (service.technicianId !== profile.id) {
    throw new AppError(httpStatus7.FORBIDDEN, "You are not the owner of this service");
  }
  const activeBookings = await prisma.booking.count({
    where: {
      serviceId,
      status: { in: ["REQUESTED", "ACCEPTED", "PAID", "IN_PROGRESS"] }
    }
  });
  if (activeBookings > 0) {
    throw new AppError(
      httpStatus7.BAD_REQUEST,
      "This service has active bookings. Deactivate it instead of deleting it"
    );
  }
  await prisma.service.delete({ where: { id: serviceId } });
};
var serviceService = {
  getAllServices,
  getServiceById,
  createService,
  getMyServices,
  updateService,
  deleteService
};

// src/modules/service/service.controller.ts
var getAllServices2 = catchAsync(async (req, res, next) => {
  const result = await serviceService.getAllServices(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus8.OK,
    message: "Services retrieved successfully",
    meta: result.meta,
    data: result.data
  });
});
var getServiceById2 = catchAsync(async (req, res, next) => {
  const result = await serviceService.getServiceById(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus8.OK,
    message: "Service retrieved successfully",
    data: result
  });
});
var createService2 = catchAsync(async (req, res, next) => {
  const result = await serviceService.createService(req.user?.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus8.CREATED,
    message: "Service created successfully",
    data: result
  });
});
var getMyServices2 = catchAsync(async (req, res, next) => {
  const result = await serviceService.getMyServices(req.user?.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus8.OK,
    message: "Your services retrieved successfully",
    data: result
  });
});
var updateService2 = catchAsync(async (req, res, next) => {
  const result = await serviceService.updateService(
    req.user?.id,
    req.params.id,
    req.body
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus8.OK,
    message: "Service updated successfully",
    data: result
  });
});
var deleteService2 = catchAsync(async (req, res, next) => {
  await serviceService.deleteService(req.user?.id, req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus8.OK,
    message: "Service deleted successfully",
    data: null
  });
});
var serviceController = {
  getAllServices: getAllServices2,
  getServiceById: getServiceById2,
  createService: createService2,
  getMyServices: getMyServices2,
  updateService: updateService2,
  deleteService: deleteService2
};

// src/modules/service/service.validation.ts
import { z as z3 } from "zod";
var createServiceSchema = z3.object({
  title: z3.string({ error: "Service title is required" }).min(3, "Title must be at least 3 characters long").max(255, "Title can not be longer than 255 characters"),
  description: z3.string().max(2e3, "Description is too long").optional(),
  price: z3.number({ error: "Price is required and must be a number" }).positive("Price must be greater than 0"),
  durationMin: z3.number().int("Duration must be a whole number of minutes").min(15, "Duration must be at least 15 minutes").max(1440, "Duration can not exceed 24 hours").optional(),
  categoryId: z3.uuid("categoryId must be a valid uuid"),
  isActive: z3.boolean().optional()
});
var updateServiceSchema = z3.object({
  title: z3.string().min(3, "Title must be at least 3 characters long").max(255, "Title can not be longer than 255 characters").optional(),
  description: z3.string().max(2e3, "Description is too long").optional(),
  price: z3.number().positive("Price must be greater than 0").optional(),
  durationMin: z3.number().int("Duration must be a whole number of minutes").min(15, "Duration must be at least 15 minutes").max(1440, "Duration can not exceed 24 hours").optional(),
  categoryId: z3.uuid("categoryId must be a valid uuid").optional(),
  isActive: z3.boolean().optional()
});
var serviceValidation = {
  createServiceSchema,
  updateServiceSchema
};

// src/modules/service/service.route.ts
var router4 = Router4();
router4.get("/my-services", auth(Role.TECHNICIAN), serviceController.getMyServices);
router4.get("/", serviceController.getAllServices);
router4.get("/:id", serviceController.getServiceById);
router4.post(
  "/",
  auth(Role.TECHNICIAN),
  validateRequest(serviceValidation.createServiceSchema),
  serviceController.createService
);
router4.patch(
  "/:id",
  auth(Role.TECHNICIAN),
  validateRequest(serviceValidation.updateServiceSchema),
  serviceController.updateService
);
router4.delete("/:id", auth(Role.TECHNICIAN), serviceController.deleteService);
var serviceRoutes = router4;

// src/modules/technician/technician.route.ts
import { Router as Router5 } from "express";

// src/modules/technician/technician.controller.ts
import httpStatus10 from "http-status";

// src/modules/technician/technician.service.ts
import httpStatus9 from "http-status";
var getMyProfileOrThrow2 = async (userId) => {
  const profile = await prisma.technicianProfile.findUnique({ where: { userId } });
  if (!profile) {
    throw new AppError(httpStatus9.NOT_FOUND, "No technician profile exists for this account");
  }
  return profile;
};
var getAllTechnicians = async (query) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(query, "avgRating");
  const andConditions = [
    // never surface technicians whose account has been banned
    { user: { activeStatus: "ACTIVE" } }
  ];
  if (query.searchTerm) {
    andConditions.push({
      OR: [
        { user: { name: { contains: query.searchTerm, mode: "insensitive" } } },
        { bio: { contains: query.searchTerm, mode: "insensitive" } },
        { location: { contains: query.searchTerm, mode: "insensitive" } },
        { skills: { has: query.searchTerm } }
      ]
    });
  }
  if (query.skill) {
    andConditions.push({ skills: { has: query.skill } });
  }
  if (query.location) {
    andConditions.push({ location: { contains: query.location, mode: "insensitive" } });
  }
  if (query.minRating) {
    andConditions.push({ avgRating: { gte: Number(query.minRating) } });
  }
  if (query.minRate) {
    andConditions.push({ hourlyRate: { gte: Number(query.minRate) } });
  }
  if (query.maxRate) {
    andConditions.push({ hourlyRate: { lte: Number(query.maxRate) } });
  }
  if (query.isAvailable) {
    andConditions.push({ isAvailable: query.isAvailable === "true" });
  }
  const where = { AND: andConditions };
  const [technicians, total] = await Promise.all([
    prisma.technicianProfile.findMany({
      where,
      take: limit,
      skip,
      orderBy: { [sortBy]: sortOrder },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true, profilePhoto: true } },
        services: { where: { isActive: true }, include: { category: true } },
        availabilities: { where: { isActive: true } },
        _count: { select: { reviews: true, bookings: true } }
      }
    }),
    prisma.technicianProfile.count({ where })
  ]);
  return { data: technicians, meta: buildMeta(page, limit, total) };
};
var getTechnicianById = async (technicianId) => {
  const technician = await prisma.technicianProfile.findUniqueOrThrow({
    where: { id: technicianId },
    include: {
      user: {
        select: { id: true, name: true, email: true, phone: true, address: true, profilePhoto: true }
      },
      services: { where: { isActive: true }, include: { category: true } },
      availabilities: { where: { isActive: true }, orderBy: { startTime: "asc" } },
      reviews: {
        orderBy: { createdAt: "desc" },
        include: {
          customer: { select: { id: true, name: true, profilePhoto: true } },
          booking: { select: { id: true, service: { select: { title: true } } } }
        }
      }
    }
  });
  return technician;
};
var updateMyProfile2 = async (userId, payload) => {
  await getMyProfileOrThrow2(userId);
  const updated = await prisma.technicianProfile.update({
    where: { userId },
    data: payload,
    include: {
      user: { select: { id: true, name: true, email: true } }
    }
  });
  return updated;
};
var updateMyAvailability = async (userId, slots) => {
  const profile = await getMyProfileOrThrow2(userId);
  const byDay = /* @__PURE__ */ new Map();
  for (const slot of slots) {
    const existing = byDay.get(slot.dayOfWeek) ?? [];
    for (const other of existing) {
      if (slot.startTime < other.endTime && other.startTime < slot.endTime) {
        throw new AppError(
          httpStatus9.BAD_REQUEST,
          `Overlapping availability slots on ${slot.dayOfWeek}: ${other.startTime}-${other.endTime} and ${slot.startTime}-${slot.endTime}`
        );
      }
    }
    existing.push(slot);
    byDay.set(slot.dayOfWeek, existing);
  }
  const result = await prisma.$transaction(async (tx) => {
    await tx.availability.deleteMany({ where: { technicianId: profile.id } });
    await tx.availability.createMany({
      data: slots.map((slot) => ({
        technicianId: profile.id,
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isActive: slot.isActive ?? true
      }))
    });
    return tx.availability.findMany({
      where: { technicianId: profile.id },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }]
    });
  });
  return result;
};
var getMyAvailability = async (userId) => {
  const profile = await getMyProfileOrThrow2(userId);
  return prisma.availability.findMany({
    where: { technicianId: profile.id },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }]
  });
};
var getMyBookings = async (userId, status) => {
  const profile = await getMyProfileOrThrow2(userId);
  const bookings = await prisma.booking.findMany({
    where: {
      technicianId: profile.id,
      ...status ? { status } : {}
    },
    orderBy: { scheduledAt: "desc" },
    include: {
      customer: { select: { id: true, name: true, email: true, phone: true } },
      service: { include: { category: true } },
      payment: true,
      review: true
    }
  });
  return bookings;
};
var updateBookingStatus = async (userId, bookingId, payload) => {
  const profile = await getMyProfileOrThrow2(userId);
  const { status, reason } = payload;
  const booking = await prisma.booking.findUniqueOrThrow({ where: { id: bookingId } });
  if (booking.technicianId !== profile.id) {
    throw new AppError(httpStatus9.FORBIDDEN, "This booking is not assigned to you");
  }
  const allowedTransitions = {
    REQUESTED: [BookingStatus.ACCEPTED, BookingStatus.DECLINED],
    PAID: [BookingStatus.IN_PROGRESS],
    IN_PROGRESS: [BookingStatus.COMPLETED]
  };
  const allowed = allowedTransitions[booking.status] ?? [];
  if (!allowed.includes(status)) {
    throw new AppError(
      httpStatus9.BAD_REQUEST,
      booking.status === BookingStatus.ACCEPTED ? "This booking is waiting for the customer's payment before work can start" : `A booking with status ${booking.status} can not be changed to ${status}`
    );
  }
  const result = await prisma.$transaction(async (tx) => {
    const updated = await tx.booking.update({
      where: { id: bookingId },
      data: {
        status,
        ...status === "DECLINED" ? { declineReason: reason } : {},
        ...status === "COMPLETED" ? { completedAt: /* @__PURE__ */ new Date() } : {}
      },
      include: {
        customer: { select: { id: true, name: true, email: true } },
        service: { include: { category: true } },
        payment: true
      }
    });
    if (status === "COMPLETED") {
      await tx.technicianProfile.update({
        where: { id: profile.id },
        data: { totalJobs: { increment: 1 } }
      });
    }
    return updated;
  });
  return result;
};
var technicianService = {
  getAllTechnicians,
  getTechnicianById,
  updateMyProfile: updateMyProfile2,
  updateMyAvailability,
  getMyAvailability,
  getMyBookings,
  updateBookingStatus
};

// src/modules/technician/technician.controller.ts
var getAllTechnicians2 = catchAsync(async (req, res, next) => {
  const result = await technicianService.getAllTechnicians(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus10.OK,
    message: "Technicians retrieved successfully",
    meta: result.meta,
    data: result.data
  });
});
var getTechnicianById2 = catchAsync(async (req, res, next) => {
  const result = await technicianService.getTechnicianById(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus10.OK,
    message: "Technician profile retrieved successfully",
    data: result
  });
});
var updateMyProfile3 = catchAsync(async (req, res, next) => {
  const result = await technicianService.updateMyProfile(req.user?.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus10.OK,
    message: "Technician profile updated successfully",
    data: result
  });
});
var updateMyAvailability2 = catchAsync(async (req, res, next) => {
  const result = await technicianService.updateMyAvailability(
    req.user?.id,
    req.body.slots
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus10.OK,
    message: "Availability updated successfully",
    data: result
  });
});
var getMyAvailability2 = catchAsync(async (req, res, next) => {
  const result = await technicianService.getMyAvailability(req.user?.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus10.OK,
    message: "Availability retrieved successfully",
    data: result
  });
});
var getMyBookings2 = catchAsync(async (req, res, next) => {
  const status = req.query.status;
  const result = await technicianService.getMyBookings(req.user?.id, status);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus10.OK,
    message: "Bookings retrieved successfully",
    data: result
  });
});
var updateBookingStatus2 = catchAsync(async (req, res, next) => {
  const result = await technicianService.updateBookingStatus(
    req.user?.id,
    req.params.id,
    req.body
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus10.OK,
    message: `Booking marked as ${req.body.status} successfully`,
    data: result
  });
});
var technicianController = {
  getAllTechnicians: getAllTechnicians2,
  getTechnicianById: getTechnicianById2,
  updateMyProfile: updateMyProfile3,
  updateMyAvailability: updateMyAvailability2,
  getMyAvailability: getMyAvailability2,
  getMyBookings: getMyBookings2,
  updateBookingStatus: updateBookingStatus2
};

// src/modules/technician/technician.validation.ts
import { z as z4 } from "zod";
var timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
var updateProfileSchema2 = z4.object({
  bio: z4.string().max(1e3, "Bio is too long").optional(),
  skills: z4.array(z4.string().min(1, "A skill can not be empty")).optional(),
  experienceYears: z4.number().int("Experience years must be a whole number").min(0, "Experience years can not be negative").max(70, "Experience years looks unrealistic").optional(),
  hourlyRate: z4.number().min(0, "Hourly rate can not be negative").optional(),
  location: z4.string().max(255, "Location is too long").optional(),
  nidNumber: z4.string().max(50, "NID number is too long").optional(),
  isAvailable: z4.boolean().optional()
});
var availabilitySlotSchema = z4.object({
  dayOfWeek: z4.enum(
    ["SATURDAY", "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
    { error: "dayOfWeek must be a valid week day in uppercase" }
  ),
  startTime: z4.string({ error: "startTime is required" }).regex(timeRegex, "startTime must be in 24-hour HH:mm format"),
  endTime: z4.string({ error: "endTime is required" }).regex(timeRegex, "endTime must be in 24-hour HH:mm format"),
  isActive: z4.boolean().optional()
}).refine((slot) => slot.startTime < slot.endTime, {
  message: "startTime must be earlier than endTime",
  path: ["startTime"]
});
var updateAvailabilitySchema = z4.object({
  slots: z4.array(availabilitySlotSchema).min(1, "Provide at least one availability slot").max(50, "Too many availability slots")
});
var updateBookingStatusSchema = z4.object({
  status: z4.enum(["ACCEPTED", "DECLINED", "IN_PROGRESS", "COMPLETED"], {
    error: "status must be one of ACCEPTED, DECLINED, IN_PROGRESS or COMPLETED"
  }),
  reason: z4.string().max(500, "Reason is too long").optional()
});
var technicianValidation = {
  updateProfileSchema: updateProfileSchema2,
  updateAvailabilitySchema,
  updateBookingStatusSchema
};

// src/modules/technician/technician.route.ts
var publicRouter = Router5();
publicRouter.get("/", technicianController.getAllTechnicians);
publicRouter.get("/:id", technicianController.getTechnicianById);
var privateRouter = Router5();
privateRouter.put(
  "/profile",
  auth(Role.TECHNICIAN),
  validateRequest(technicianValidation.updateProfileSchema),
  technicianController.updateMyProfile
);
privateRouter.get("/availability", auth(Role.TECHNICIAN), technicianController.getMyAvailability);
privateRouter.put(
  "/availability",
  auth(Role.TECHNICIAN),
  validateRequest(technicianValidation.updateAvailabilitySchema),
  technicianController.updateMyAvailability
);
privateRouter.get("/bookings", auth(Role.TECHNICIAN), technicianController.getMyBookings);
privateRouter.patch(
  "/bookings/:id",
  auth(Role.TECHNICIAN),
  validateRequest(technicianValidation.updateBookingStatusSchema),
  technicianController.updateBookingStatus
);
var technicianPublicRoutes = publicRouter;
var technicianRoutes = privateRouter;

// src/modules/booking/booking.route.ts
import { Router as Router6 } from "express";

// src/modules/booking/booking.controller.ts
import httpStatus12 from "http-status";

// src/modules/booking/booking.service.ts
import httpStatus11 from "http-status";
var ACTIVE_STATUSES = [
  BookingStatus.REQUESTED,
  BookingStatus.ACCEPTED,
  BookingStatus.PAID,
  BookingStatus.IN_PROGRESS
];
var createBooking = async (customerId, payload) => {
  const { serviceId, scheduledAt, address, note } = payload;
  const service = await prisma.service.findUniqueOrThrow({
    where: { id: serviceId },
    include: { technician: { include: { user: true } } }
  });
  if (!service.isActive) {
    throw new AppError(httpStatus11.BAD_REQUEST, "This service is no longer available");
  }
  if (!service.technician.isAvailable) {
    throw new AppError(httpStatus11.BAD_REQUEST, "This technician is not taking bookings right now");
  }
  if (service.technician.user.activeStatus === "BLOCKED") {
    throw new AppError(httpStatus11.BAD_REQUEST, "This technician is not taking bookings right now");
  }
  if (service.technician.userId === customerId) {
    throw new AppError(httpStatus11.BAD_REQUEST, "You can not book your own service");
  }
  const scheduledDate = new Date(scheduledAt);
  const jobEnd = new Date(scheduledDate.getTime() + service.durationMin * 60 * 1e3);
  const sameDayBookings = await prisma.booking.findMany({
    where: {
      technicianId: service.technicianId,
      status: { in: ACTIVE_STATUSES },
      scheduledAt: {
        gte: new Date(scheduledDate.getTime() - 24 * 60 * 60 * 1e3),
        lte: new Date(scheduledDate.getTime() + 24 * 60 * 60 * 1e3)
      }
    },
    include: { service: { select: { durationMin: true } } }
  });
  const clash = sameDayBookings.find((existing) => {
    const existingStart = existing.scheduledAt.getTime();
    const existingEnd = existingStart + existing.service.durationMin * 60 * 1e3;
    return scheduledDate.getTime() < existingEnd && existingStart < jobEnd.getTime();
  });
  if (clash) {
    throw new AppError(
      httpStatus11.CONFLICT,
      "This technician is already booked during the time slot you selected"
    );
  }
  const booking = await prisma.booking.create({
    data: {
      customerId,
      technicianId: service.technicianId,
      serviceId,
      scheduledAt: scheduledDate,
      address,
      note,
      // the price is frozen at booking time so a later price change never
      // alters what this customer owes
      totalAmount: service.price
    },
    include: {
      service: { include: { category: true } },
      technician: {
        include: { user: { select: { id: true, name: true, email: true, phone: true } } }
      }
    }
  });
  return booking;
};
var getMyBookings3 = async (userId, role, query) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(query, "scheduledAt");
  const andConditions = [];
  if (role === Role.TECHNICIAN) {
    const profile = await prisma.technicianProfile.findUnique({ where: { userId } });
    if (!profile) {
      throw new AppError(httpStatus11.NOT_FOUND, "No technician profile exists for this account");
    }
    andConditions.push({ technicianId: profile.id });
  } else {
    andConditions.push({ customerId: userId });
  }
  if (query.status) {
    andConditions.push({ status: query.status });
  }
  const where = { AND: andConditions };
  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      take: limit,
      skip,
      orderBy: { [sortBy]: sortOrder },
      include: {
        service: { include: { category: true } },
        technician: {
          include: { user: { select: { id: true, name: true, email: true, phone: true } } }
        },
        customer: { select: { id: true, name: true, email: true, phone: true } },
        payment: true,
        review: true
      }
    }),
    prisma.booking.count({ where })
  ]);
  return { data: bookings, meta: buildMeta(page, limit, total) };
};
var getBookingById = async (bookingId, userId, role) => {
  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId },
    include: {
      service: { include: { category: true } },
      technician: {
        include: { user: { select: { id: true, name: true, email: true, phone: true } } }
      },
      customer: { select: { id: true, name: true, email: true, phone: true } },
      payment: true,
      review: true
    }
  });
  const isOwner = booking.customerId === userId;
  const isAssignedTechnician = booking.technician.userId === userId;
  if (role !== Role.ADMIN && !isOwner && !isAssignedTechnician) {
    throw new AppError(httpStatus11.FORBIDDEN, "You don't have permission to view this booking");
  }
  return booking;
};
var cancelBooking = async (bookingId, customerId, reason) => {
  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId },
    include: { payment: true }
  });
  if (booking.customerId !== customerId) {
    throw new AppError(httpStatus11.FORBIDDEN, "You can only cancel your own bookings");
  }
  const nonCancellable = [
    BookingStatus.IN_PROGRESS,
    BookingStatus.COMPLETED,
    BookingStatus.CANCELLED,
    BookingStatus.DECLINED
  ];
  if (nonCancellable.includes(booking.status)) {
    throw new AppError(
      httpStatus11.BAD_REQUEST,
      booking.status === BookingStatus.IN_PROGRESS ? "Work has already started, so this booking can no longer be cancelled" : `A booking with status ${booking.status} can no longer be cancelled`
    );
  }
  const cancelled = await prisma.$transaction(async (tx) => {
    const updated = await tx.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.CANCELLED, cancelReason: reason },
      include: { service: true, payment: true }
    });
    if (booking.payment && booking.payment.status === "PENDING") {
      await tx.payment.update({
        where: { id: booking.payment.id },
        data: { status: "CANCELLED" }
      });
    }
    return updated;
  });
  return cancelled;
};
var bookingService = {
  createBooking,
  getMyBookings: getMyBookings3,
  getBookingById,
  cancelBooking
};

// src/modules/booking/booking.controller.ts
var createBooking2 = catchAsync(async (req, res, next) => {
  const result = await bookingService.createBooking(req.user?.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus12.CREATED,
    message: "Booking created successfully",
    data: result
  });
});
var getMyBookings4 = catchAsync(async (req, res, next) => {
  const result = await bookingService.getMyBookings(
    req.user?.id,
    req.user?.role,
    req.query
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus12.OK,
    message: "Bookings retrieved successfully",
    meta: result.meta,
    data: result.data
  });
});
var getBookingById2 = catchAsync(async (req, res, next) => {
  const result = await bookingService.getBookingById(
    req.params.id,
    req.user?.id,
    req.user?.role
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus12.OK,
    message: "Booking retrieved successfully",
    data: result
  });
});
var cancelBooking2 = catchAsync(async (req, res, next) => {
  const result = await bookingService.cancelBooking(
    req.params.id,
    req.user?.id,
    req.body?.reason
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus12.OK,
    message: "Booking cancelled successfully",
    data: result
  });
});
var bookingController = {
  createBooking: createBooking2,
  getMyBookings: getMyBookings4,
  getBookingById: getBookingById2,
  cancelBooking: cancelBooking2
};

// src/modules/booking/booking.validation.ts
import { z as z5 } from "zod";
var createBookingSchema = z5.object({
  serviceId: z5.uuid("serviceId must be a valid uuid"),
  scheduledAt: z5.string({ error: "scheduledAt is required" }).refine((value) => !Number.isNaN(Date.parse(value)), "scheduledAt must be a valid ISO date").refine((value) => new Date(value).getTime() > Date.now(), "scheduledAt must be in the future"),
  address: z5.string({ error: "Service address is required" }).min(5, "Address must be at least 5 characters long").max(500, "Address is too long"),
  note: z5.string().max(1e3, "Note is too long").optional()
});
var cancelBookingSchema = z5.object({
  reason: z5.string().max(500, "Reason is too long").optional()
});
var bookingValidation = {
  createBookingSchema,
  cancelBookingSchema
};

// src/modules/booking/booking.route.ts
var router5 = Router6();
router5.post(
  "/",
  auth(Role.CUSTOMER),
  validateRequest(bookingValidation.createBookingSchema),
  bookingController.createBooking
);
router5.get("/", auth(Role.CUSTOMER, Role.TECHNICIAN), bookingController.getMyBookings);
router5.get(
  "/:id",
  auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN),
  bookingController.getBookingById
);
router5.patch(
  "/:id/cancel",
  auth(Role.CUSTOMER),
  validateRequest(bookingValidation.cancelBookingSchema),
  bookingController.cancelBooking
);
var bookingRoutes = router5;

// src/modules/payment/payment.route.ts
import { Router as Router7 } from "express";

// src/modules/payment/payment.controller.ts
import httpStatus14 from "http-status";

// src/modules/payment/payment.service.ts
import httpStatus13 from "http-status";

// src/lib/stripe.ts
import Stripe from "stripe";
if (!config_default.stripe_secret_key) {
  throw new Error("STRIPE_SECRET_KEY is missing in environment variables!");
}
var stripe = new Stripe(config_default.stripe_secret_key);

// src/utils/transactionId.ts
import crypto from "crypto";
var generateTransactionId = (prefix = "FIX") => {
  const random = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `${prefix}-${Date.now()}-${random}`;
};

// src/modules/payment/payment.utils.ts
var markPaymentCompleted = async (session) => {
  const bookingId = session.metadata?.bookingId;
  if (!bookingId) {
    console.log("Webhook: checkout session has no bookingId in its metadata");
    return;
  }
  const payment = await prisma.payment.findUnique({ where: { bookingId } });
  if (!payment) {
    console.log(`Webhook: no payment record exists for booking ${bookingId}`);
    return;
  }
  if (payment.status === PaymentStatus.COMPLETED) {
    return;
  }
  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.COMPLETED,
        paidAt: /* @__PURE__ */ new Date(),
        method: session.payment_method_types?.[0] ?? "card",
        gatewayResponse: {
          sessionId: session.id,
          paymentIntent: session.payment_intent ?? null,
          paymentStatus: session.payment_status,
          amountTotal: session.amount_total,
          currency: session.currency
        }
      }
    });
    await tx.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.PAID }
    });
  });
};
var markPaymentFailed = async (session) => {
  const bookingId = session.metadata?.bookingId;
  if (!bookingId) return;
  const payment = await prisma.payment.findUnique({ where: { bookingId } });
  if (!payment || payment.status === PaymentStatus.COMPLETED) return;
  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: PaymentStatus.FAILED,
      gatewayResponse: {
        sessionId: session.id,
        paymentStatus: session.payment_status
      }
    }
  });
};

// src/modules/payment/payment.service.ts
var createPayment = async (customerId, bookingId) => {
  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId },
    include: {
      service: true,
      payment: true,
      customer: { select: { id: true, name: true, email: true } }
    }
  });
  if (booking.customerId !== customerId) {
    throw new AppError(httpStatus13.FORBIDDEN, "You can only pay for your own bookings");
  }
  if (booking.status !== BookingStatus.ACCEPTED) {
    throw new AppError(
      httpStatus13.BAD_REQUEST,
      booking.status === BookingStatus.REQUESTED ? "The technician has not accepted this booking yet" : `Payment is only possible for ACCEPTED bookings. This booking is ${booking.status}`
    );
  }
  if (booking.payment?.status === PaymentStatus.COMPLETED) {
    throw new AppError(httpStatus13.BAD_REQUEST, "This booking has already been paid for");
  }
  const currency = config_default.stripe_currency;
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: booking.customer.email,
    line_items: [
      {
        price_data: {
          currency,
          product_data: {
            name: booking.service.title,
            ...booking.service.description ? { description: booking.service.description.slice(0, 250) } : {}
          },
          // Stripe works in the smallest currency unit
          unit_amount: Math.round(booking.totalAmount * 100)
        },
        quantity: 1
      }
    ],
    success_url: `${config_default.app_url}/payment/success?bookingId=${booking.id}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config_default.app_url}/payment/cancel?bookingId=${booking.id}`,
    metadata: {
      bookingId: booking.id,
      customerId: booking.customerId
    }
  });
  const payment = await prisma.payment.upsert({
    where: { bookingId: booking.id },
    create: {
      transactionId: generateTransactionId(),
      bookingId: booking.id,
      customerId: booking.customerId,
      amount: booking.totalAmount,
      currency: currency.toUpperCase(),
      provider: PaymentProvider.STRIPE,
      status: PaymentStatus.PENDING,
      gatewaySessionId: session.id
    },
    update: {
      amount: booking.totalAmount,
      currency: currency.toUpperCase(),
      status: PaymentStatus.PENDING,
      gatewaySessionId: session.id
    }
  });
  return {
    paymentId: payment.id,
    transactionId: payment.transactionId,
    amount: payment.amount,
    currency: payment.currency,
    sessionId: session.id,
    paymentUrl: session.url
  };
};
var handleWebhook = async (payload, signature) => {
  if (!signature) {
    throw new AppError(httpStatus13.BAD_REQUEST, "Missing stripe-signature header");
  }
  const event = stripe.webhooks.constructEvent(payload, signature, config_default.stripe_webhook_secret);
  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded":
      await markPaymentCompleted(event.data.object);
      break;
    case "checkout.session.expired":
    case "checkout.session.async_payment_failed":
      await markPaymentFailed(event.data.object);
      break;
    default:
      console.log(`Unhandled Stripe event type: ${event.type}`);
      break;
  }
};
var confirmPayment = async (sessionId, transactionId) => {
  let resolvedSessionId = sessionId;
  if (!resolvedSessionId) {
    const existing = await prisma.payment.findUnique({ where: { transactionId } });
    if (!existing?.gatewaySessionId) {
      throw new AppError(
        httpStatus13.NOT_FOUND,
        "No Stripe checkout session is linked to this transaction"
      );
    }
    resolvedSessionId = existing.gatewaySessionId;
  }
  const session = await stripe.checkout.sessions.retrieve(resolvedSessionId);
  if (session.payment_status !== "paid") {
    await markPaymentFailed(session);
    throw new AppError(httpStatus13.BAD_REQUEST, "This payment has not been completed yet");
  }
  await markPaymentCompleted(session);
  const payment = await prisma.payment.findUniqueOrThrow({
    where: { bookingId: session.metadata?.bookingId },
    include: {
      booking: { include: { service: { select: { id: true, title: true } } } }
    }
  });
  return payment;
};
var getMyPayments = async (userId, role, query) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(query);
  const andConditions = [];
  if (role === Role.CUSTOMER) {
    andConditions.push({ customerId: userId });
  } else if (role === Role.TECHNICIAN) {
    const profile = await prisma.technicianProfile.findUnique({ where: { userId } });
    if (!profile) {
      throw new AppError(httpStatus13.NOT_FOUND, "No technician profile exists for this account");
    }
    andConditions.push({ booking: { technicianId: profile.id } });
  }
  if (query.status) {
    andConditions.push({ status: query.status });
  }
  const where = { AND: andConditions };
  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      take: limit,
      skip,
      orderBy: { [sortBy]: sortOrder },
      include: {
        booking: {
          include: { service: { select: { id: true, title: true, price: true } } }
        }
      }
    }),
    prisma.payment.count({ where })
  ]);
  return { data: payments, meta: buildMeta(page, limit, total) };
};
var getPaymentById = async (paymentId, userId, role) => {
  const payment = await prisma.payment.findUniqueOrThrow({
    where: { id: paymentId },
    include: {
      customer: { select: { id: true, name: true, email: true } },
      booking: {
        include: {
          service: { include: { category: true } },
          technician: { include: { user: { select: { id: true, name: true } } } }
        }
      }
    }
  });
  const isOwner = payment.customerId === userId;
  const isAssignedTechnician = payment.booking.technician.userId === userId;
  if (role !== Role.ADMIN && !isOwner && !isAssignedTechnician) {
    throw new AppError(httpStatus13.FORBIDDEN, "You don't have permission to view this payment");
  }
  return payment;
};
var paymentService = {
  createPayment,
  handleWebhook,
  confirmPayment,
  getMyPayments,
  getPaymentById
};

// src/modules/payment/payment.controller.ts
var createPayment2 = catchAsync(async (req, res, next) => {
  const result = await paymentService.createPayment(req.user?.id, req.body.bookingId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus14.CREATED,
    message: "Payment session created. Redirect the customer to paymentUrl to pay",
    data: result
  });
});
var handleWebhook2 = catchAsync(async (req, res, next) => {
  const signature = req.headers["stripe-signature"];
  await paymentService.handleWebhook(req.body, signature);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus14.OK,
    message: "Webhook handled successfully",
    data: null
  });
});
var confirmPayment2 = catchAsync(async (req, res, next) => {
  const { sessionId, transactionId } = req.body;
  const result = await paymentService.confirmPayment(sessionId, transactionId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus14.OK,
    message: "Payment verified with Stripe and the booking is now PAID",
    data: result
  });
});
var getMyPayments2 = catchAsync(async (req, res, next) => {
  const result = await paymentService.getMyPayments(
    req.user?.id,
    req.user?.role,
    req.query
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus14.OK,
    message: "Payment history retrieved successfully",
    meta: result.meta,
    data: result.data
  });
});
var getPaymentById2 = catchAsync(async (req, res, next) => {
  const result = await paymentService.getPaymentById(
    req.params.id,
    req.user?.id,
    req.user?.role
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus14.OK,
    message: "Payment retrieved successfully",
    data: result
  });
});
var paymentController = {
  createPayment: createPayment2,
  handleWebhook: handleWebhook2,
  confirmPayment: confirmPayment2,
  getMyPayments: getMyPayments2,
  getPaymentById: getPaymentById2
};

// src/modules/payment/payment.validation.ts
import { z as z6 } from "zod";
var createPaymentSchema = z6.object({
  bookingId: z6.uuid("bookingId must be a valid uuid")
});
var confirmPaymentSchema = z6.object({
  sessionId: z6.string().min(1, "sessionId can not be empty").optional(),
  transactionId: z6.string().min(1, "transactionId can not be empty").optional()
}).refine((data) => Boolean(data.sessionId || data.transactionId), {
  message: "Provide either sessionId or transactionId to confirm a payment",
  path: ["sessionId"]
});
var paymentValidation = {
  createPaymentSchema,
  confirmPaymentSchema
};

// src/modules/payment/payment.route.ts
var router6 = Router7();
router6.post("/webhook", paymentController.handleWebhook);
router6.post(
  "/create",
  auth(Role.CUSTOMER),
  validateRequest(paymentValidation.createPaymentSchema),
  paymentController.createPayment
);
router6.post(
  "/confirm",
  validateRequest(paymentValidation.confirmPaymentSchema),
  paymentController.confirmPayment
);
router6.get("/", auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN), paymentController.getMyPayments);
router6.get(
  "/:id",
  auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN),
  paymentController.getPaymentById
);
var paymentRoutes = router6;

// src/modules/review/review.route.ts
import { Router as Router8 } from "express";

// src/modules/review/review.controller.ts
import httpStatus16 from "http-status";

// src/modules/review/review.service.ts
import httpStatus15 from "http-status";
var recalculateTechnicianRating = async (tx, technicianId) => {
  const aggregate = await tx.review.aggregate({
    where: { technicianId },
    _avg: { rating: true },
    _count: { rating: true }
  });
  await tx.technicianProfile.update({
    where: { id: technicianId },
    data: {
      avgRating: Number((aggregate._avg.rating ?? 0).toFixed(2)),
      totalReviews: aggregate._count.rating
    }
  });
};
var createReview = async (customerId, payload) => {
  const { bookingId, rating, comment } = payload;
  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId },
    include: { review: true }
  });
  if (booking.customerId !== customerId) {
    throw new AppError(httpStatus15.FORBIDDEN, "You can only review your own bookings");
  }
  if (booking.status !== BookingStatus.COMPLETED) {
    throw new AppError(
      httpStatus15.BAD_REQUEST,
      "You can only leave a review once the job has been completed"
    );
  }
  if (booking.review) {
    throw new AppError(httpStatus15.CONFLICT, "You have already reviewed this booking");
  }
  const result = await prisma.$transaction(async (tx) => {
    const review = await tx.review.create({
      data: {
        bookingId,
        customerId,
        technicianId: booking.technicianId,
        rating,
        comment
      },
      include: {
        customer: { select: { id: true, name: true, profilePhoto: true } }
      }
    });
    await recalculateTechnicianRating(tx, booking.technicianId);
    return review;
  });
  return result;
};
var getTechnicianReviews = async (technicianId) => {
  await prisma.technicianProfile.findUniqueOrThrow({ where: { id: technicianId } });
  const reviews = await prisma.review.findMany({
    where: { technicianId },
    orderBy: { createdAt: "desc" },
    include: {
      customer: { select: { id: true, name: true, profilePhoto: true } },
      booking: {
        select: { id: true, scheduledAt: true, service: { select: { title: true } } }
      }
    }
  });
  return reviews;
};
var getMyReviews = async (customerId) => {
  const reviews = await prisma.review.findMany({
    where: { customerId },
    orderBy: { createdAt: "desc" },
    include: {
      technician: { include: { user: { select: { id: true, name: true } } } },
      booking: { select: { id: true, service: { select: { title: true } } } }
    }
  });
  return reviews;
};
var reviewService = {
  createReview,
  getTechnicianReviews,
  getMyReviews
};

// src/modules/review/review.controller.ts
var createReview2 = catchAsync(async (req, res, next) => {
  const result = await reviewService.createReview(req.user?.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus16.CREATED,
    message: "Review submitted successfully",
    data: result
  });
});
var getTechnicianReviews2 = catchAsync(
  async (req, res, next) => {
    const result = await reviewService.getTechnicianReviews(req.params.technicianId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus16.OK,
      message: "Technician reviews retrieved successfully",
      data: result
    });
  }
);
var getMyReviews2 = catchAsync(async (req, res, next) => {
  const result = await reviewService.getMyReviews(req.user?.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus16.OK,
    message: "Your reviews retrieved successfully",
    data: result
  });
});
var reviewController = {
  createReview: createReview2,
  getTechnicianReviews: getTechnicianReviews2,
  getMyReviews: getMyReviews2
};

// src/modules/review/review.validation.ts
import { z as z7 } from "zod";
var createReviewSchema = z7.object({
  bookingId: z7.uuid("bookingId must be a valid uuid"),
  rating: z7.number({ error: "Rating is required and must be a number" }).int("Rating must be a whole number").min(1, "Rating must be between 1 and 5").max(5, "Rating must be between 1 and 5"),
  comment: z7.string().max(1e3, "Comment can not be longer than 1000 characters").optional()
});
var updateReviewSchema = z7.object({
  rating: z7.number().int("Rating must be a whole number").min(1, "Rating must be between 1 and 5").max(5, "Rating must be between 1 and 5").optional(),
  comment: z7.string().max(1e3, "Comment can not be longer than 1000 characters").optional()
});
var reviewValidation = {
  createReviewSchema,
  updateReviewSchema
};

// src/modules/review/review.route.ts
var router7 = Router8();
router7.post(
  "/",
  auth(Role.CUSTOMER),
  validateRequest(reviewValidation.createReviewSchema),
  reviewController.createReview
);
router7.get("/my-reviews", auth(Role.CUSTOMER), reviewController.getMyReviews);
router7.get("/technician/:technicianId", reviewController.getTechnicianReviews);
var reviewRoutes = router7;

// src/modules/admin/admin.route.ts
import { Router as Router9 } from "express";

// src/modules/admin/admin.controller.ts
import httpStatus18 from "http-status";

// src/modules/admin/admin.service.ts
import bcrypt2 from "bcrypt";
import jwt2 from "jsonwebtoken";
import httpStatus17 from "http-status";
var createAdmin = async (payload) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email }
  });
  if (existingUser) {
    throw new AppError(httpStatus17.BAD_REQUEST, "User with this email already exists");
  }
  const hashedPassword = await bcrypt2.hash(payload.password, 10);
  const admin = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
      role: Role.ADMIN
    },
    omit: { password: true }
  });
  return admin;
};
var loginAdmin = async (payload) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email }
  });
  if (!user || user.role !== Role.ADMIN) {
    throw new AppError(httpStatus17.UNAUTHORIZED, "Invalid credentials or not an admin");
  }
  if (user.activeStatus === ActiveStatus.BLOCKED) {
    throw new AppError(httpStatus17.FORBIDDEN, "This admin account is blocked");
  }
  const isPasswordMatched = await bcrypt2.compare(payload.password, user.password);
  if (!isPasswordMatched) {
    throw new AppError(httpStatus17.UNAUTHORIZED, "Invalid credentials");
  }
  const jwtPayload = { id: user.id, role: user.role, email: user.email };
  const accessToken = jwt2.sign(jwtPayload, config_default.jwt_access_secret, {
    expiresIn: "1d"
  });
  return { accessToken };
};
var getAllUsers = async (query) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(query);
  const andConditions = [];
  if (query.searchTerm) {
    andConditions.push({
      OR: [
        { name: { contains: query.searchTerm, mode: "insensitive" } },
        { email: { contains: query.searchTerm, mode: "insensitive" } },
        { phone: { contains: query.searchTerm, mode: "insensitive" } }
      ]
    });
  }
  if (query.role) {
    andConditions.push({ role: query.role });
  }
  if (query.activeStatus) {
    andConditions.push({ activeStatus: query.activeStatus });
  }
  const where = { AND: andConditions };
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      take: limit,
      skip,
      orderBy: { [sortBy]: sortOrder },
      omit: { password: true },
      include: {
        technicianProfile: true,
        _count: { select: { bookings: true, payments: true, reviews: true } }
      }
    }),
    prisma.user.count({ where })
  ]);
  return { data: users, meta: buildMeta(page, limit, total) };
};
var getUserById = async (userId) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    omit: { password: true },
    include: {
      technicianProfile: {
        include: { services: { include: { category: true } }, availabilities: true }
      },
      _count: { select: { bookings: true, payments: true, reviews: true } }
    }
  });
  return user;
};
var updateUserStatus = async (userId, activeStatus) => {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  if (user.role === Role.ADMIN) {
    throw new AppError(httpStatus17.BAD_REQUEST, "An admin account can not be blocked");
  }
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { activeStatus },
    omit: { password: true }
  });
  return updated;
};
var verifyTechnician = async (technicianId, isVerified) => {
  await prisma.technicianProfile.findUniqueOrThrow({ where: { id: technicianId } });
  const updated = await prisma.technicianProfile.update({
    where: { id: technicianId },
    data: { isVerified },
    include: { user: { select: { id: true, name: true, email: true } } }
  });
  return updated;
};
var getAllBookings = async (query) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(query);
  const andConditions = [];
  if (query.status) {
    andConditions.push({ status: query.status });
  }
  const where = { AND: andConditions };
  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      take: limit,
      skip,
      orderBy: { [sortBy]: sortOrder },
      include: {
        customer: { select: { id: true, name: true, email: true } },
        technician: { include: { user: { select: { id: true, name: true, email: true } } } },
        service: { include: { category: true } },
        payment: true,
        review: true
      }
    }),
    prisma.booking.count({ where })
  ]);
  return { data: bookings, meta: buildMeta(page, limit, total) };
};
var getAllPayments = async (query) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(query);
  const andConditions = [];
  if (query.status) {
    andConditions.push({ status: query.status });
  }
  const where = { AND: andConditions };
  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      take: limit,
      skip,
      orderBy: { [sortBy]: sortOrder },
      include: {
        customer: { select: { id: true, name: true, email: true } },
        booking: {
          select: { id: true, status: true, service: { select: { title: true } } }
        }
      }
    }),
    prisma.payment.count({ where })
  ]);
  return { data: payments, meta: buildMeta(page, limit, total) };
};
var getDashboardStats = async () => {
  const stats = await prisma.$transaction(async (tx) => {
    const [
      totalUsers,
      totalCustomers,
      totalTechnicians,
      blockedUsers,
      totalCategories,
      totalServices,
      totalBookings,
      completedBookings,
      cancelledBookings,
      revenue
    ] = await Promise.all([
      tx.user.count(),
      tx.user.count({ where: { role: Role.CUSTOMER } }),
      tx.user.count({ where: { role: Role.TECHNICIAN } }),
      tx.user.count({ where: { activeStatus: ActiveStatus.BLOCKED } }),
      tx.category.count(),
      tx.service.count(),
      tx.booking.count(),
      tx.booking.count({ where: { status: BookingStatus.COMPLETED } }),
      tx.booking.count({ where: { status: BookingStatus.CANCELLED } }),
      tx.payment.aggregate({
        where: { status: PaymentStatus.COMPLETED },
        _sum: { amount: true },
        _count: { id: true }
      })
    ]);
    return {
      totalUsers,
      totalCustomers,
      totalTechnicians,
      blockedUsers,
      totalCategories,
      totalServices,
      totalBookings,
      completedBookings,
      cancelledBookings,
      successfulPayments: revenue._count.id,
      totalRevenue: revenue._sum.amount ?? 0
    };
  });
  return stats;
};
var adminService = {
  createAdmin,
  loginAdmin,
  getAllUsers,
  getUserById,
  updateUserStatus,
  verifyTechnician,
  getAllBookings,
  getAllPayments,
  getDashboardStats
};

// src/modules/admin/admin.controller.ts
var createAdmin2 = catchAsync(async (req, res) => {
  const result = await adminService.createAdmin(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus18.CREATED,
    message: "Admin account registered successfully",
    data: result
  });
});
var loginAdmin2 = catchAsync(async (req, res) => {
  const result = await adminService.loginAdmin(req.body);
  res.cookie("accessToken", result.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production"
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus18.OK,
    message: "Admin logged in successfully",
    data: result
  });
});
var logoutAdmin = catchAsync(async (req, res) => {
  res.clearCookie("accessToken");
  sendResponse(res, {
    success: true,
    statusCode: httpStatus18.OK,
    message: "Admin logged out successfully",
    data: null
  });
});
var getAllUsers2 = catchAsync(async (req, res, next) => {
  const result = await adminService.getAllUsers(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus18.OK,
    message: "Users retrieved successfully",
    meta: result.meta,
    data: result.data
  });
});
var getUserById2 = catchAsync(async (req, res, next) => {
  const result = await adminService.getUserById(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus18.OK,
    message: "User retrieved successfully",
    data: result
  });
});
var updateUserStatus2 = catchAsync(async (req, res, next) => {
  const result = await adminService.updateUserStatus(
    req.params.id,
    req.body.activeStatus
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus18.OK,
    message: `User status updated to ${req.body.activeStatus} successfully`,
    data: result
  });
});
var verifyTechnician2 = catchAsync(async (req, res, next) => {
  const result = await adminService.verifyTechnician(req.params.id, req.body.isVerified);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus18.OK,
    message: req.body.isVerified ? "Technician verified successfully" : "Technician verification removed",
    data: result
  });
});
var getAllBookings2 = catchAsync(async (req, res, next) => {
  const result = await adminService.getAllBookings(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus18.OK,
    message: "All bookings retrieved successfully",
    meta: result.meta,
    data: result.data
  });
});
var getAllPayments2 = catchAsync(async (req, res, next) => {
  const result = await adminService.getAllPayments(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus18.OK,
    message: "All payments retrieved successfully",
    meta: result.meta,
    data: result.data
  });
});
var getDashboardStats2 = catchAsync(async (req, res, next) => {
  const result = await adminService.getDashboardStats();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus18.OK,
    message: "Dashboard stats retrieved successfully",
    data: result
  });
});
var adminController = {
  createAdmin: createAdmin2,
  loginAdmin: loginAdmin2,
  logoutAdmin,
  getAllUsers: getAllUsers2,
  getUserById: getUserById2,
  updateUserStatus: updateUserStatus2,
  verifyTechnician: verifyTechnician2,
  getAllBookings: getAllBookings2,
  getAllPayments: getAllPayments2,
  getDashboardStats: getDashboardStats2
};

// src/modules/admin/admin.validation.ts
import { z as z8 } from "zod";
var createAdminSchema = z8.object({
  name: z8.string({ message: "Name must be a string" }).min(1, "Name is required"),
  email: z8.string({ message: "Email must be a string" }).min(1, "Email is required").email("Invalid email address"),
  password: z8.string({ message: "Password must be a string" }).min(1, "Password is required").min(6, "Password must be at least 6 characters long"),
  phone: z8.string().optional(),
  address: z8.string().optional()
});
var adminLoginSchema = z8.object({
  email: z8.string({ message: "Email must be a string" }).min(1, "Email is required").email("Invalid email address"),
  password: z8.string({ message: "Password must be a string" }).min(1, "Password is required")
});
var updateUserStatusSchema = z8.object({
  activeStatus: z8.enum(["ACTIVE", "BLOCKED"], {
    message: "activeStatus must be either ACTIVE or BLOCKED"
  })
});
var verifyTechnicianSchema = z8.object({
  isVerified: z8.boolean({
    message: "isVerified must be true or false"
  })
});
var adminValidation = {
  createAdminSchema,
  adminLoginSchema,
  updateUserStatusSchema,
  verifyTechnicianSchema
};

// src/modules/category/category.validation.ts
import { z as z9 } from "zod";
var createCategorySchema = z9.object({
  name: z9.string({ error: "Category name is required" }).min(2, "Category name must be at least 2 characters long").max(120, "Category name can not be longer than 120 characters"),
  description: z9.string().max(1e3, "Description is too long").optional(),
  icon: z9.string().max(255, "Icon is too long").optional(),
  isActive: z9.boolean().optional()
});
var updateCategorySchema = z9.object({
  name: z9.string().min(2, "Category name must be at least 2 characters long").max(120, "Category name can not be longer than 120 characters").optional(),
  description: z9.string().max(1e3, "Description is too long").optional(),
  icon: z9.string().max(255, "Icon is too long").optional(),
  isActive: z9.boolean().optional()
});
var categoryValidation = {
  createCategorySchema,
  updateCategorySchema
};

// src/modules/admin/admin.route.ts
var router8 = Router9();
router8.post(
  "/register",
  validateRequest(adminValidation.createAdminSchema),
  adminController.createAdmin
);
router8.post(
  "/login",
  validateRequest(adminValidation.adminLoginSchema),
  adminController.loginAdmin
);
router8.post("/logout", adminController.logoutAdmin);
router8.use(auth(Role.ADMIN));
router8.get("/stats", adminController.getDashboardStats);
router8.get("/users", adminController.getAllUsers);
router8.get("/users/:id", adminController.getUserById);
router8.patch(
  "/users/:id",
  validateRequest(adminValidation.updateUserStatusSchema),
  adminController.updateUserStatus
);
router8.patch(
  "/technicians/:id/verify",
  validateRequest(adminValidation.verifyTechnicianSchema),
  adminController.verifyTechnician
);
router8.get("/bookings", adminController.getAllBookings);
router8.get("/payments", adminController.getAllPayments);
router8.get("/categories", categoryController.getAllCategoriesForAdmin);
router8.post(
  "/categories",
  validateRequest(categoryValidation.createCategorySchema),
  categoryController.createCategory
);
router8.patch(
  "/categories/:id",
  validateRequest(categoryValidation.updateCategorySchema),
  categoryController.updateCategory
);
router8.delete("/categories/:id", categoryController.deleteCategory);
var adminRoutes = router8;

// src/routes/index.ts
var router9 = Router10();
var moduleRoutes = [
  { path: "/auth", route: authRoutes },
  { path: "/users", route: userRoutes },
  { path: "/categories", route: categoryRoutes },
  { path: "/services", route: serviceRoutes },
  { path: "/technicians", route: technicianPublicRoutes },
  { path: "/technician", route: technicianRoutes },
  { path: "/bookings", route: bookingRoutes },
  { path: "/payments", route: paymentRoutes },
  { path: "/reviews", route: reviewRoutes },
  { path: "/admin", route: adminRoutes }
];
moduleRoutes.forEach((item) => router9.use(item.path, item.route));
var routes_default = router9;

// src/middlewares/notFound.ts
import httpStatus19 from "http-status";
var notFound = (req, res) => {
  res.status(httpStatus19.NOT_FOUND).json({
    success: false,
    statusCode: httpStatus19.NOT_FOUND,
    message: "Route not found",
    errorDetails: [
      {
        path: req.originalUrl,
        message: `The requested route '${req.method} ${req.originalUrl}' does not exist on this server`
      }
    ]
  });
};

// src/middlewares/globalErrorHandler.ts
import httpStatus20 from "http-status";
import { ZodError } from "zod";
var globalErrorHandler = (err, req, res, next) => {
  if (config_default.node_env === "development") {
    console.log("Error : ", err);
  }
  let statusCode = httpStatus20.INTERNAL_SERVER_ERROR;
  let message = err.message || "Something went wrong!";
  let errorDetails = [
    {
      path: "",
      message: err.message || "Something went wrong!"
    }
  ];
  if (err instanceof ZodError) {
    statusCode = httpStatus20.BAD_REQUEST;
    message = "Validation Error";
    errorDetails = err.issues.map((issue) => ({
      path: String(issue.path[issue.path.length - 1] ?? ""),
      message: issue.message
    }));
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorDetails = [{ path: "", message: err.message }];
  } else if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = httpStatus20.BAD_REQUEST;
    message = "You have provided an incorrect field type or missing required fields";
    errorDetails = [{ path: "", message }];
  } else if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const target = err.meta?.target || [];
      statusCode = httpStatus20.CONFLICT;
      message = "Duplicate Key Error";
      errorDetails = [
        {
          path: target[0] ?? "",
          message: `A record with this ${target.join(", ") || "value"} already exists`
        }
      ];
    } else if (err.code === "P2003") {
      statusCode = httpStatus20.BAD_REQUEST;
      message = "Foreign Key constraint failed";
      errorDetails = [
        { path: "", message: "The related record you referenced does not exist" }
      ];
    } else if (err.code === "P2025") {
      statusCode = httpStatus20.NOT_FOUND;
      message = "Record not found";
      errorDetails = [
        {
          path: "",
          message: "The operation failed because it depends on one or more records that were required but not found"
        }
      ];
    } else {
      statusCode = httpStatus20.BAD_REQUEST;
      message = "Database request error";
      errorDetails = [{ path: "", message: err.message }];
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      statusCode = httpStatus20.UNAUTHORIZED;
      message = "Authentication failed against the database server. Please check your credentials";
    } else if (err.errorCode === "P1001") {
      statusCode = httpStatus20.BAD_GATEWAY;
      message = "Can't reach the database server";
    } else {
      statusCode = httpStatus20.INTERNAL_SERVER_ERROR;
      message = "Database initialization failed";
    }
    errorDetails = [{ path: "", message }];
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    statusCode = httpStatus20.INTERNAL_SERVER_ERROR;
    message = "An error occurred during query execution";
    errorDetails = [{ path: "", message }];
  } else if (err.name === "JsonWebTokenError") {
    statusCode = httpStatus20.UNAUTHORIZED;
    message = "Invalid token. Please log in again";
    errorDetails = [{ path: "", message }];
  } else if (err.name === "TokenExpiredError") {
    statusCode = httpStatus20.UNAUTHORIZED;
    message = "Your session has expired. Please log in again";
    errorDetails = [{ path: "", message }];
  }
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errorDetails,
    ...config_default.node_env === "development" && { stack: err.stack }
  });
};

// src/docs/swagger.ts
var bearerAuth = [{ bearerAuth: [] }];
var errorResponse = {
  description: "Structured error response",
  content: {
    "application/json": {
      schema: { $ref: "#/components/schemas/ErrorResponse" }
    }
  }
};
var commonResponses = {
  400: errorResponse,
  401: errorResponse,
  403: errorResponse,
  404: errorResponse,
  500: errorResponse
};
var swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "FixItNow API",
    version: "1.0.0",
    description: "Backend API for FixItNow, a home services marketplace. Customers book technicians for services, pay through Stripe Checkout, and leave reviews. Technicians manage profiles, availability and jobs. Admins manage users, bookings and service categories.\n\n**Error format** \u2014 every error returns `{ success: false, message: string, errorDetails: any }`.\n\n**Auth** \u2014 send the JWT as `Authorization: Bearer <accessToken>`. Login also sets httpOnly cookies."
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

// src/app.ts
var app = express();
app.use(cors({
  origin: config_default.app_url,
  credentials: true
}));
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "FixItNow API is running \u{1F527}",
    documentation: "/api-docs"
  });
});
app.get("/api-docs.json", (req, res) => {
  res.status(200).json(swaggerSpec);
});
app.get("/api-docs", (req, res) => {
  res.status(200).send(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>FixItNow API Docs</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui.min.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui-bundle.min.js"></script>
    <script>
      window.onload = () => {
        window.ui = SwaggerUIBundle({
          url: "/api-docs.json",
          dom_id: "#swagger-ui",
          persistAuthorization: true
        });
      };
    </script>
  </body>
</html>`);
});
app.use("/api", routes_default);
app.use(notFound);
app.use(globalErrorHandler);
var app_default = app;

// src/index.ts
var index_default = app_default;
export {
  index_default as default
};
