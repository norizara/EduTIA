"use server";

import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import { CourseLevel } from "@prisma/client";

export async function createCourseAction(_prevState: any, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const categoryId = formData.get("categoryId") as string;
    const level = formData.get("level") as CourseLevel;

    if (!title || !description || !categoryId || !level) {
      return { error: "All fields are required" };
    }

    const exists = await prisma.course.findUnique({
      where: { slug: slugify(title) },
    });

    if (exists) {
      return { error: "Course already exists" };
    }

    await prisma.course.create({
      data: {
        title,
        slug: slugify(title),
        description,
        level,
        categoryId,
      },
    });

    return { success: true };
  } catch {
    return { error: "Something went wrong" };
  }
}
