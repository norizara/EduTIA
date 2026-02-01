"use server";

import { prisma } from "@/lib/prisma";

export async function addSkill(name: string, userId: string) {
  await prisma.skill.create({
    data: { name, userId },
  });
}

export async function addExperience(
  data: {
    jobTitle: string;
    companyName: string;
    startDate: string;
    endDate?: string;
  },
  userId: string,
) {
  await prisma.experience.create({
    data: {
      ...data,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      userId,
    },
  });
}
