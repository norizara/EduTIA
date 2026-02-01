"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { Gender } from "@prisma/client";
import { writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function updateProfile(_: any, formData: FormData) {
  try {
    const user = await requireUser();
    const userId = user.id;

    // ===== TEXT FIELDS =====
    const name = formData.get("name")?.toString() || null;
    const bio = formData.get("bio")?.toString() || null;
    const companyWebsite = formData.get("companyWebsite")?.toString() || null;
    const companyAddress = formData.get("companyAddress")?.toString() || null;

    const dobRaw = formData.get("dob");
    const dob = typeof dobRaw === "string" && dobRaw ? new Date(dobRaw) : null;

    const genderRaw = formData.get("gender");
    const gender =
      genderRaw === "MALE" || genderRaw === "FEMALE"
        ? (genderRaw as Gender)
        : null;

    let pictureUrl: string | null = null;

    const file = formData.get("avatar") as File | null;

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = file.name.split(".").pop();
      const filename = `${crypto.randomUUID()}.${ext}`;
      const uploadPath = path.join(process.cwd(), "public/uploads", filename);

      await writeFile(uploadPath, buffer);
      pictureUrl = `/uploads/${filename}`;
    }

    if (!pictureUrl) {
      pictureUrl =
        gender === "FEMALE" ? "/avatars/female.svg" : "/avatars/male.svg";
    }

    await prisma.profile.upsert({
      where: { userId },
      update: {
        name,
        dob,
        gender,
        bio,
        pictureUrl,
        companyWebsite,
        companyAddress,
      },
      create: {
        userId,
        name,
        dob,
        gender,
        bio,
        pictureUrl,
        companyWebsite,
        companyAddress,
      },
    });

    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: "Failed to update profile" };
  }
}
