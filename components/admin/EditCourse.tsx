"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditCoursePopover() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [level, setLevel] = useState("BEGINNER");
  const [loading, setLoading] = useState(false);

  async function handleEdit() {
    if (!title || !categoryId) return;

    setLoading(true);

    await fetch("/api/admin/courses", {
      method: "POST",
      body: JSON.stringify({
        title,
        categoryId,
        level,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setLoading(false);
    setOpen(false);
    setTitle("");
    setCategoryId("");
    router.refresh();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-2 bg-gray-200 text-black rounded-md text-xs"
      >
        Edit Detail
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />

          <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold mb-4">Edit Course</h2>

            <div className="space-y-3">
              <input
                placeholder="Course title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded border p-2"
              />

              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded border p-2"
              >
                <option value="">Select category</option>
                <option value="cat-id-1">Programming</option>
                <option value="cat-id-2">Design</option>
              </select>

              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full rounded border p-2"
              >
                <option value="">Select level</option>
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-sm rounded border"
              >
                Cancel
              </button>

              <button
                onClick={handleEdit}
                disabled={loading}
                className="px-4 py-2 text-sm rounded bg-black text-white"
              >
                {loading ? "Editing..." : "Edit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
