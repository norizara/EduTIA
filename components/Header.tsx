import HeaderClient from "./Header.client";
import { getCurrentUser } from "@/lib/auth";

type CategoryUI = {
  id: string;
  name: string;
  slug: string;
};

export default async function Header() {
  const user = await getCurrentUser();

  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/categories`, {
    cache: "force-cache",
  });

  const categories: CategoryUI[] = await res.json();

  return <HeaderClient user={user} categories={categories} />;
}
