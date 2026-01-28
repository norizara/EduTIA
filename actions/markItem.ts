"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function handleMark(courseItemId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    const item = await prisma.courseItem.findUnique({
      where: { id: courseItemId },
    });

    if (!item || item.type !== "MODULE") return;

    const progress = await prisma.moduleProgress.findUnique({
      where: {
        userId_moduleId: {
          userId: user.id,
          moduleId: item.moduleId!,
        },
      },
    });

    if (!progress) {
      await prisma.moduleProgress.create({
        data: {
          userId: user.id,
          moduleId: item.moduleId!,
          completedAt: new Date(),
        },
      });
    } else {
      await prisma.moduleProgress.update({
        where: {
          userId_moduleId: {
            userId: user.id,
            moduleId: item.moduleId!,
          },
        },
        data: {
          completedAt: progress.completedAt ? null : new Date(),
        },
      });
    }

    revalidatePath("/courses");
  } catch (error) {
    console.error(error);
  }
}

async function recalculateProgress(userId: string, courseId: string) {
  const courseItems = await prisma.courseItem.findMany({
    where: { courseId },
    include: {
      module: {
        include: {
          progresses: {
            where: { userId },
          },
        },
      },
      workshop: {
        include: {
          submissions: {
            where: { userId },
          },
        },
      },
    },
  });

  const totalItems = courseItems.length;

  if (totalItems === 0) return 0;

  const completedItems = courseItems.filter((item) => {
    if (item.type === "MODULE") {
      return !!item.module?.progresses?.[0]?.completedAt;
    }

    if (item.type === "WORKSHOP") {
      return item.workshop?.submissions?.[0]?.score != null;
    }

    return false;
  }).length;

  return Math.round((completedItems / totalItems) * 100);
}
