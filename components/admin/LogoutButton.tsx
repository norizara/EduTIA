"use client";

import { logoutAction } from "@/actions/auth";

export default function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="block hover:underline text-sm text-gray-300"
      >
        Log out
      </button>
    </form>
  );
}
