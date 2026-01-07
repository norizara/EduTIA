import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guard";

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, context: Context) {
  try {
    const { id } = await context.params;

    const course = await prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      return NextResponse.json(
        { message: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch course" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, context: Context) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const { id } = await context.params;
    const body = await req.json();

    const { title, description, price } = body;

    if (!title || !description || typeof price !== "number") {
      return NextResponse.json(
        { message: "Invalid course data" },
        { status: 400 }
      );
    }

    const course = await prisma.course.update({
      where: { id },
      data: { title, description },
    });

    return NextResponse.json(course);
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { message: "Course not found" },
        { status: 404 }
      );
    }

    console.error(error);
    return NextResponse.json(
      { message: "Failed to update course" },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, context: Context) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const { id } = await context.params;
    await prisma.course.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Course not found" }, { status: 404 });
  }
}
