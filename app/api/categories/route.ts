import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminUser } from "@/lib/auth";
import { slugify } from "@/lib/slugify";

export async function GET() {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  try {
    await requireAdminUser();

    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { message: "Missing require fields" },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug: slugify(name),
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to create category" },
      { status: 500 }
    );
  }
}
