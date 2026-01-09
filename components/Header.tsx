import HeaderClient from "./Header.client";

type CategoryUI = {
  id: string;
  name: string;
  slug: string;
};

export default async function Header() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/categories`, {
    cache: "force-cache",
  });

  const categories: CategoryUI[] = await res.json();

  return <HeaderClient categories={categories} />;
}
