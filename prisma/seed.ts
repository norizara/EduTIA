import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  // ===== CLEAN DATABASE =====
  await prisma.certificate.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.workshopRegistration.deleteMany();
  await prisma.workshop.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();
  await prisma.category.deleteMany();
  await prisma.corporationVerification.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  // ===== USERS =====
  const admin = await prisma.user.create({
    data: {
      email: "admin@edutia.com",
      password: await bcrypt.hash("hashed_admin_password", 10),
      role: "ADMIN",
    },
  });

  const student = await prisma.user.create({
    data: {
      email: "student@edutia.com",
      password: await bcrypt.hash("halo", 10),
      role: "EDUCATEE",
    },
  });

  const corp1 = await prisma.user.create({
    data: {
      email: "corp@techcorp.com",
      password: await bcrypt.hash("hashed_corp_password", 10),
      role: "CORPORATION",
    },
  });

  const corp2 = await prisma.user.create({
    data: {
      email: "hr@innovate.io",
      password: await bcrypt.hash("hashed_corp_password", 10),
      role: "CORPORATION",
    },
  });

  // ===== PROFILES =====
  const adminProfile = await prisma.profile.create({
    data: {
      userId: admin.id,
      gender: "MALE",
      bio: "Platform administrator",
    },
  });

  const studentProfile = await prisma.profile.create({
    data: {
      userId: student.id,
      gender: "FEMALE",
      pictureUrl: "/avatars/female.svg",
      bio: "Learner interested in technology",
    },
  });

  const corpProfile1 = await prisma.profile.create({
    data: {
      userId: corp1.id,
      companyName: "TechCorp Solutions",
      companyWebsite: "https://techcorp.com",
      bio: "Enterprise technology solutions provider",
    },
  });

  const corpProfile2 = await prisma.profile.create({
    data: {
      userId: corp2.id,
      companyName: "Innovate IO",
      companyWebsite: "https://innovate.io",
      bio: "HR and talent development company",
    },
  });

  // ===== CORPORATION VERIFICATION =====
  await prisma.corporationVerification.createMany({
    data: [
      {
        profileId: corpProfile1.id,
        status: "VERIFIED",
        verifiedAt: new Date(),
      },
      {
        profileId: corpProfile2.id,
        status: "PENDING",
      },
    ],
  });

  // ===== CATEGORIES =====
  const categories = await prisma.category.createMany({
    data: [
      { name: "Development", slug: "development" },
      { name: "Data Science", slug: "data-science" },
      { name: "Design", slug: "design" },
      { name: "IT & Software", slug: "it-software" },
      { name: "Business", slug: "business" },
    ],
    skipDuplicates: true,
  });

  const categoryList = await prisma.category.findMany();
  const categoryMap = Object.fromEntries(
    categoryList.map((c) => [c.slug, c.id])
  );

  // ===== COURSES =====
  await prisma.course.createMany({
    data: [
      {
        title: "Python for Data Analysis",
        description:
          "Analyze data using Python, Pandas, NumPy, and real-world datasets.",
        categoryId: categoryMap["data-science"],
        level: "BEGINNER",
        duration: 180,
        isPublished: true,
      },
      {
        title: "React & Next.js Web Development",
        description:
          "Build production-ready web apps using React, Next.js, and REST APIs.",
        categoryId: categoryMap["development"],
        level: "INTERMEDIATE",
        duration: 240,
        isPublished: true,
      },
      {
        title: "Machine Learning A–Z",
        description:
          "Learn supervised and unsupervised machine learning techniques.",
        categoryId: categoryMap["data-science"],
        level: "ADVANCED",
        duration: 300,
        isPublished: false,
      },
      {
        title: "UI/UX Design Fundamentals",
        description:
          "Learn design principles, wireframing, and user experience basics.",
        categoryId: categoryMap["design"],
        level: "BEGINNER",
        duration: 150,
        isPublished: true,
      },
      {
        title: "Cybersecurity Basics",
        description:
          "Understand networks, threats, and basic security best practices.",
        categoryId: categoryMap["it-software"],
        level: "BEGINNER",
        duration: 200,
        isPublished: true,
      },
      {
        title: "Startup & Entrepreneurship",
        description:
          "Learn how to validate ideas, build startups, and scale businesses.",
        categoryId: categoryMap["business"],
        level: "INTERMEDIATE",
        duration: 220,
        isPublished: true,
      },
    ],
  });
}

main()
  .catch((error) => {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
