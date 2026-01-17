import { prisma } from "@/lib/prisma";

export async function getPaths() {
  return await prisma.learningPath.findMany({
    where: {
      isPublished: true,
    },
    include: {
      items: {
        include: {
          course: true,
        },
        orderBy: { position: "asc" },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
