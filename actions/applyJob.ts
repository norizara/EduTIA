"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function applyJob(jobId: string, slug: string) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "EDUCATEE") return;

  await prisma.jobApplication.create({
    data: {
      userId: user.id,
      jobId,
    },
  });

  redirect(`/jobs/${slug}`);
}
