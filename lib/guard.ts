import { NextResponse } from "next/server";
import { getUserFromCookie } from "@/lib/auth";

export async function requireLogin() {
  const user = await getUserFromCookie();

  if (!user) {
    return {
      error: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }

  return { user };
}

export async function requireAdmin() {
  const user = await getUserFromCookie();

  if (!user) {
    return {
      error: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }

  if (user.role !== "ADMIN") {
    return {
      error: NextResponse.json({ message: "Forbidden" }, { status: 403 }),
    };
  }

  return { user };
}
