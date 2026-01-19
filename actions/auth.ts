"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function signupAction(_prevState: any, formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const passwordConfirmation = formData.get("passwordConfirmation") as string;
    const role = formData.get("role") as "EDUCATEE" | "CORPORATION";

    if (!email || !password || !passwordConfirmation) {
      return { error: "All fields are required" };
    }

    if (password !== passwordConfirmation) {
      return { error: "Passwords do not match" };
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return { error: "Email already in use" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
      },
    });

    return { success: true };
  } catch {
    return { error: "Something went wrong" };
  }
}
