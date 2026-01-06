import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.profile.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  // ===== USERS =====
  const admin = await prisma.user.create({
    data: {
      email: "admin@edutia.com",
      password: "hashed_admin_password",
      role: "ADMIN",
    },
  });

  const student = await prisma.user.create({
    data: {
      email: "student@edutia.com",
      password: "hashed_student_password",
      role: "EDUCATEE",
    },
  });

  // ===== PROFILES =====
  await prisma.profile.createMany({
    data: [
      {
        userId: admin.id,
        gender: "MALE",
        bio: "Platform administrator",
      },
      {
        userId: student.id,
        gender: "FEMALE",
        bio: "Learner interested in technology",
      },
    ],
  });

  // ===== COURSES =====
  await prisma.course.createMany({
    data: [
      {
        title: "Introduction to Data Science",
        description:
          "Learn the basics of data analysis, statistics, and Python.",
        category: "Data Science",
        level: "BEGINNER",
        duration: 180,
        isPublished: true,
      },
      {
        title: "Fullstack Web Development",
        description:
          "Build modern web applications using React, Next.js, and APIs.",
        category: "Web Development",
        level: "INTERMEDIATE",
        duration: 240,
        isPublished: true,
      },
      {
        title: "Advanced Machine Learning",
        description: "Deep dive into ML models, optimization, and deployment.",
        category: "Machine Learning",
        level: "ADVANCED",
        duration: 300,
        isPublished: false,
      },
    ],
  });

  console.log("Seeding completed.");
}

main()
  .catch((error) => {
    console.error("Seeding error:", error);
    throw error;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
