"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function handleMark(formData: FormData) {
  const courseItemId = formData.get("courseItemId") as string;

  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const item = await prisma.courseItem.findUnique({
    where: { id: courseItemId },
    include: { course: true },
  });

  if (!item || item.type !== "MODULE" || !item.moduleId) return;

  const progress = await prisma.moduleProgress.findUnique({
    where: {
      userId_moduleId: {
        userId: user.id,
        moduleId: item.moduleId,
      },
    },
  });

  if (!progress) {
    await prisma.moduleProgress.create({
      data: {
        userId: user.id,
        moduleId: item.moduleId,
        completedAt: new Date(),
      },
    });
  } else {
    await prisma.moduleProgress.update({
      where: {
        userId_moduleId: {
          userId: user.id,
          moduleId: item.moduleId,
        },
      },
      data: {
        completedAt: progress.completedAt ? null : new Date(),
      },
    });
  }

  const percentage = await recalculateProgress(user.id, item.courseId);

  await prisma.enrollment.update({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: item.courseId,
      },
    },
    data: {
      progressPercent: percentage,
      status: percentage === 100 ? "COMPLETED" : "IN_PROGRESS",
    },
  });

  revalidatePath(`/courses/${item.course.slug}/${item.slug}`);
}

export async function handleSubmitWorkshop(formData: FormData) {
  const courseItemId = formData.get("courseItemId") as string;
  const submissionUrl = formData.get("submissionUrl") as string;

  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const item = await prisma.courseItem.findUnique({
    where: { id: courseItemId },
    include: { course: true },
  });

  if (!item || item.type !== "WORKSHOP" || !item.workshopId) return;

  await prisma.workshopSubmission.upsert({
    where: {
      userId_workshopId: {
        userId: user.id,
        workshopId: item.workshopId,
      },
    },
    update: {
      submissionUrl,
      submittedAt: new Date(),
      score: 100,
      feedback: "Auto-graded",
    },
    create: {
      userId: user.id,
      workshopId: item.workshopId,
      submissionUrl,
      score: 100,
      feedback: "Auto-graded",
    },
  });

  const percentage = await recalculateProgress(user.id, item.courseId);

  await prisma.enrollment.update({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: item.courseId,
      },
    },
    data: {
      progressPercent: percentage,
      status: percentage === 100 ? "COMPLETED" : "IN_PROGRESS",
    },
  });

  revalidatePath(`/courses/${item.course.slug}/${item.slug}`);
}

export async function gradeWorkshopSubmission(
  submissionId: string,
  score: number,
  feedback?: string,
) {
  const submission = await prisma.workshopSubmission.update({
    where: { id: submissionId },
    data: {
      score,
      feedback,
    },
    include: {
      workshop: {
        include: {
          courseItem: {
            include: {
              course: true,
            },
          },
        },
      },
    },
  });

  const { courseItem } = submission.workshop;
  if (!courseItem) return;

  const percentage = await recalculateProgress(
    submission.userId,
    courseItem.courseId,
  );

  await prisma.enrollment.update({
    where: {
      userId_courseId: {
        userId: submission.userId,
        courseId: courseItem.courseId,
      },
    },
    data: {
      progressPercent: percentage,
      status: percentage === 100 ? "COMPLETED" : "IN_PROGRESS",
    },
  });

  revalidatePath(`/courses/${courseItem.course.slug}/${courseItem.slug}`);
}

async function recalculateProgress(userId: string, courseId: string) {
  const items = await prisma.courseItem.findMany({
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

  if (!items.length) return 0;

  const completed = items.filter((item) => {
    if (item.type === "MODULE") {
      return !!item.module?.progresses?.[0]?.completedAt;
    }

    if (item.type === "WORKSHOP") {
      return item.workshop?.submissions.some((s) => s.score != null);
    }

    return false;
  }).length;

  return Math.round((completed / items.length) * 100);
}
