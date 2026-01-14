import HeaderClient from "./Header.client";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type CategoryUI = {
  id: string;
  name: string;
  slug: string;
};

export default async function Header() {
  const user = await getCurrentUser();
  const categories: CategoryUI[] = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: { name: "asc" },
  });

  return <HeaderClient user={user} categories={categories} />;
}
