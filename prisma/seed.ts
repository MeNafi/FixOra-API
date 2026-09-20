import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";
import config from "../src/config";
import { Role, WeekDay } from "../generated/prisma/enums";

/**
 * Seeds the platform with everything needed to demo the API end to end:
 *   - one ADMIN account (credentials read from .env)
 *   - the default service categories
 *   - two technicians with profiles, weekly availability and services
 *   - one customer
 *
 * Every write is an upsert, so running `npm run seed` twice is harmless.
 */

const toSlug = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const WORKING_DAYS: WeekDay[] = [
  WeekDay.SUNDAY,
  WeekDay.MONDAY,
  WeekDay.TUESDAY,
  WeekDay.WEDNESDAY,
  WeekDay.THURSDAY,
];

const main = async () => {
  console.log("Seeding database...\n");

  const saltRounds = Number(config.bcrypt_salt_rounds) || 10;

  // ---------------- Admin ----------------
  const adminPassword = await bcrypt.hash(config.admin_password, saltRounds);

  const admin = await prisma.user.upsert({
    where: { email: config.admin_email },
    update: {
      name: config.admin_name,
      password: adminPassword,
      role: Role.ADMIN,
      activeStatus: "ACTIVE",
    },
    create: {
      name: config.admin_name,
      email: config.admin_email,
      password: adminPassword,
      role: Role.ADMIN,
      phone: "+8801700000000",
      address: "FixItNow HQ, Dhaka",
    },
  });

  console.log(`Admin        : ${admin.email}`);

  // ---------------- Categories ----------------
  const categories = [
    { name: "Plumbing", description: "Pipes, taps, drains and water systems.", icon: "faucet" },
    { name: "Electrical", description: "Wiring, switches, fixtures and repairs.", icon: "zap" },
    { name: "Cleaning", description: "Deep cleaning for homes and apartments.", icon: "sparkles" },
    { name: "Painting", description: "Interior and exterior painting.", icon: "paint-roller" },
    { name: "Appliance Repair", description: "Fridges, washers, ovens and ACs.", icon: "washing-machine" },
    { name: "Carpentry", description: "Furniture, doors, cabinets and woodwork.", icon: "hammer" },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: { description: category.description, icon: category.icon },
      create: { ...category, slug: toSlug(category.name) },
    });
  }

  console.log(`Categories   : ${categories.length} ready`);

  const plumbing = await prisma.category.findUniqueOrThrow({ where: { name: "Plumbing" } });
  const electrical = await prisma.category.findUniqueOrThrow({ where: { name: "Electrical" } });
  const cleaning = await prisma.category.findUniqueOrThrow({ where: { name: "Cleaning" } });

  // ---------------- Technicians ----------------
  const technicianPassword = await bcrypt.hash("Tech@1234", saltRounds);

  const technicianSeeds = [
    {
      name: "Karim Hossain",
      email: "karim.tech@fixitnow.com",
      phone: "+8801711111111",
      address: "Savar, Dhaka",
      bio: "Licensed plumber with 8 years of residential experience.",
      skills: ["plumbing", "pipe-fitting", "leak-repair"],
      experienceYears: 8,
      hourlyRate: 600,
      location: "Savar, Dhaka",
      isVerified: true,
      services: [
        {
          title: "Emergency Pipe Leak Repair",
          description:
            "Fast on-site diagnosis and repair of leaking pipes, joints and fittings, including parts.",
          price: 1500,
          durationMin: 90,
          categoryId: plumbing.id,
        },
        {
          title: "Bathroom Fixture Installation",
          description:
            "Installation of taps, showers, basins and toilet fittings with a six month warranty.",
          price: 2500,
          durationMin: 180,
          categoryId: plumbing.id,
        },
      ],
    },
    {
      name: "Nasrin Akter",
      email: "nasrin.tech@fixitnow.com",
      phone: "+8801722222222",
      address: "Mirpur, Dhaka",
      bio: "Certified electrician specialising in home wiring and safety inspections.",
      skills: ["electrical", "wiring", "ac-repair"],
      experienceYears: 5,
      hourlyRate: 800,
      location: "Mirpur, Dhaka",
      isVerified: true,
      services: [
        {
          title: "Full Home Wiring Inspection",
          description:
            "Complete safety inspection of the home electrical system with a written report.",
          price: 2000,
          durationMin: 120,
          categoryId: electrical.id,
        },
        {
          title: "Post-Repair Deep Cleaning",
          description: "Deep cleaning of the work area including dust and debris removal.",
          price: 1200,
          durationMin: 60,
          categoryId: cleaning.id,
        },
      ],
    },
  ];

  for (const seed of technicianSeeds) {
    const technician = await prisma.user.upsert({
      where: { email: seed.email },
      update: {},
      create: {
        name: seed.name,
        email: seed.email,
        password: technicianPassword,
        phone: seed.phone,
        address: seed.address,
        role: Role.TECHNICIAN,
        technicianProfile: {
          create: {
            bio: seed.bio,
            skills: seed.skills,
            experienceYears: seed.experienceYears,
            hourlyRate: seed.hourlyRate,
            location: seed.location,
            isVerified: seed.isVerified,
          },
        },
      },
    });

    const profile = await prisma.technicianProfile.findUniqueOrThrow({
      where: { userId: technician.id },
    });

    // 09:00 - 17:00, Sunday to Thursday
    for (const dayOfWeek of WORKING_DAYS) {
      await prisma.availability.upsert({
        where: {
          technicianId_dayOfWeek_startTime_endTime: {
            technicianId: profile.id,
            dayOfWeek,
            startTime: "09:00",
            endTime: "17:00",
          },
        },
        update: {},
        create: {
          technicianId: profile.id,
          dayOfWeek,
          startTime: "09:00",
          endTime: "17:00",
        },
      });
    }

    for (const service of seed.services) {
      const exists = await prisma.service.findFirst({
        where: { title: service.title, technicianId: profile.id },
      });

      if (!exists) {
        await prisma.service.create({
          data: { ...service, technicianId: profile.id },
        });
      }
    }

    console.log(`Technician   : ${technician.email}`);
  }

  // ---------------- Customer ----------------
  const customerPassword = await bcrypt.hash("Customer@1234", saltRounds);

  const customer = await prisma.user.upsert({
    where: { email: "customer@fixitnow.com" },
    update: {},
    create: {
      name: "Tanvir Ahmed",
      email: "customer@fixitnow.com",
      password: customerPassword,
      phone: "+8801733333333",
      address: "House 12, Road 4, Savar, Dhaka",
      role: Role.CUSTOMER,
    },
  });

  console.log(`Customer     : ${customer.email}`);

  console.log("\nSeeding completed successfully.");
  console.log("--------------------------------------------------");
  console.log(`Admin login    : ${config.admin_email} / ${config.admin_password}`);
  console.log("Technician login: karim.tech@fixitnow.com / Tech@1234");
  console.log("Customer login  : customer@fixitnow.com / Customer@1234");
  console.log("--------------------------------------------------");
};

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
