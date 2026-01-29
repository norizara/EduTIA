"use server";

import { getCurrentUser, requireAdminUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import {
  CourseLevel,
  ExperienceLevel,
  JobStatus,
  JobType,
  WorkMode,
} from "@prisma/client";
import { randomUUID } from "crypto";

export async function createJobAction(_prevState: any, formData: FormData) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "COMPANY") {
      return { error: "Not authorized" };
    }

    const title = formData.get("title")?.toString().trim();
    const description = formData.get("description")?.toString().trim();
    const location =
      formData.get("location")?.toString() ||
      user.profile?.companyAddress ||
      null;
    const categoryId = formData.get("categoryId")?.toString();
    const type = formData.get("type") as JobType;
    const workMode = formData.get("mode") as WorkMode;
    const level = formData.get("level") as ExperienceLevel | null;
    const status = formData.get("status") as JobStatus;
    const paycheckMin = formData.get("paycheckMin")
      ? Number(formData.get("paycheckMin"))
      : null;
    const paycheckMax = formData.get("paycheckMax")
      ? Number(formData.get("paycheckMax"))
      : null;
    const expiresAt = formData.get("expiredDate")
      ? new Date(formData.get("expiredDate") as string)
      : null;

    if (
      !title ||
      !description ||
      !categoryId ||
      !type ||
      !workMode ||
      !status
    ) {
      return { error: "Required fields are missing" };
    }

    const slug = `${slugify(title)}-${randomUUID().slice(0, 8)}`;

    await prisma.jobPosting.create({
      data: {
        userId: user.id,
        categoryId,
        title,
        slug,
        description,
        location,
        status,
        type,
        workMode,
        level,
        paycheckMin,
        paycheckMax,
        expiresAt,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Create job error:", error);
    return { error: "Something went wrong" };
  }
}

export async function updateJobAction(_prev: any, formData: FormData) {
  try {
    await requireAdminUser();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const thumbnailUrl = formData.get("thumbnailUrl") as string;
    const categoryId = formData.get("categoryId") as string;
    const level = formData.get("level") as CourseLevel;
    const isPublished = formData.get("isPublished") === "true";

    if (!title || !description || !categoryId || !level) {
      return { error: "All fields are required" };
    }

    await prisma.course.update({
      where: { slug: slugify(title) },
      data: {
        title,
        slug: slugify(title),
        description,
        level,
        thumbnailUrl,
        isPublished,
        categoryId,
      },
    });

    const updates: { id: string; position: number }[] = [];

    for (const [key, value] of formData.entries()) {
      if (key.startsWith("position_")) {
        const position = Number(value);

        if (isNaN(position)) {
          return { error: "Invalid position value" };
        }

        updates.push({
          id: key.replace("position_", ""),
          position,
        });
      }
    }

    const positions = updates.map((u) => u.position);
    const max = updates.length;

    if (positions.some((p) => p < 1 || p > max)) {
      return { error: `Positions must be between 1 and ${max}` };
    }

    if (new Set(positions).size !== positions.length) {
      return { error: "Positions must be unique" };
    }

    await prisma.$transaction(
      updates.map((u, i) =>
        prisma.courseItem.update({
          where: { id: u.id },
          data: { position: 1000 + i },
        }),
      ),
    );

    await prisma.$transaction(
      updates.map((u) =>
        prisma.courseItem.update({
          where: { id: u.id },
          data: { position: u.position },
        }),
      ),
    );

    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: "Failed to update course" };
  }
}

export async function deleteJobAction(courseId: string) {
  await requireAdminUser();
  await prisma.course.delete({
    where: { id: courseId },
  });
}
