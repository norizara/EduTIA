"use server";

import { getCurrentUser } from "@/lib/auth";
import { generatePdfCV } from "@/lib/cvGenerator";

export async function generateUserCV() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  return generatePdfCV(user.id);
}
