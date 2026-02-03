"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PathDetailUI, PathUI } from "@/types/path.ui";
import { updatePathAction } from "@/actions/pathAdmin";

export default function UpdatePathPopover({ path }: { path: PathUI }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [state, formAction, isPending] = useActionState(updatePathAction, null);

  useEffect(() => {
    if (state?.success) {
      setOpen(false);
      router.refresh();
    }
  }, [state]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="p-2 bg-gray-200 text-black rounded-md text-xs w-25"
      >
        Update Path
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />

          <div className="relative z-10 w-full max-w-md max-h-[90vh] overflow-hidden rounded-xl bg-white shadow-xl">
            <div className="p-6 overflow-y-auto max-h-[90vh]">
              <h2 className="text-lg font-bold mb-4">Update Path</h2>

              <form action={formAction} className="space-y-3">
                <p>
                  <b>Title:</b>
                </p>
                <input
                  name="title"
                  required
                  defaultValue={path.title}
                  placeholder="Path title"
                  className="w-full rounded border p-2"
                />

                <p>
                  <b>Description:</b>
                </p>
                <input
                  name="description"
                  required
                  defaultValue={path.description}
                  placeholder="Description"
                  className="w-full rounded border p-2"
                />

                <p>
                  <b>Thumbnail URL:</b>
                </p>
                <input
                  name="thumbnailUrl"
                  required
                  defaultValue={path.thumbnailUrl}
                  placeholder="Thumbnail URL"
                  className="w-full rounded border p-2"
                />

                <p>
                  <b>Path Items:</b>
                </p>
                <div className="space-y-2">
                  {path.items.map((i) => (
                    <div
                      key={i.id}
                      className="grid grid-cols-[1fr_45px] items-center gap-3 w-full"
                    >
                      <span className="text-sm truncate">{i.course.title}</span>

                      <input
                        name={`position_${i.id}`}
                        required
                        defaultValue={i.position}
                        className="w-full rounded border p-1 text-center"
                      />
                    </div>
                  ))}
                </div>

                <p>
                  <b>Published:</b>
                </p>

                <select
                  name="isPublished"
                  required
                  defaultValue={path.isPublished ? "true" : "false"}
                  className="w-full rounded border p-2"
                >
                  <option value="true">Published</option>
                  <option value="false">Draft</option>
                </select>

                {state?.error && (
                  <p className="text-sm text-red-600">{state.error}</p>
                )}

                <div className="mt-6 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 text-sm rounded border"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="px-4 py-2 text-sm rounded bg-black text-white"
                  >
                    {isPending ? "Updating..." : "Update"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
