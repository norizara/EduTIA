"use server";

import { requireAdminUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";

export async function createPathAction(_prevState: any, formData: FormData) {
  try {
    await requireAdminUser();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    if (!title || !description) {
      return { error: "All fields are required" };
    }

    const slug = slugify(title);

    const exists = await prisma.learningPath.findUnique({
      where: { slug },
    });

    if (exists) {
      return { error: "Path already exists" };
    }

    await prisma.learningPath.create({
      data: {
        title,
        slug,
        description,
      },
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong" };
  }
}

export async function updatePathAction(_prev: any, formData: FormData) {
  try {
    await requireAdminUser();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const thumbnailUrl = formData.get("thumbnailUrl") as string;
    const isPublished = formData.get("isPublished") === "true";

    if (!title || !description) {
      return { error: "All fields are required" };
    }

    await prisma.learningPath.update({
      where: { slug: slugify(title) },
      data: {
        title,
        slug: slugify(title),
        description,
        thumbnailUrl,
        isPublished,
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
        prisma.learningPathItem.update({
          where: { id: u.id },
          data: { position: 1000 + i },
        }),
      ),
    );

    await prisma.$transaction(
      updates.map((u) =>
        prisma.learningPathItem.update({
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

export async function deletePathAction(pathId: string) {
  await requireAdminUser();
  await prisma.learningPath.delete({
    where: { id: pathId },
  });
}
