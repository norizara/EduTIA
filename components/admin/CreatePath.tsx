"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createPathAction } from "@/actions/pathAdmin";

export default function CreatePathPopover() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [state, formAction, isPending] = useActionState(createPathAction, null);

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
        className="p-2 bg-black text-white rounded-md"
      >
        Create Path
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />

          <div className="relative z-10 w-full max-w-md max-h-[90vh] overflow-hidden rounded-xl bg-white shadow-xl">
            <div className="p-6 overflow-y-auto max-h-[90vh]">
              <h2 className="text-lg font-bold mb-4">Create Path</h2>

              <form action={formAction} className="space-y-3">
                <p>
                  <b>Title:</b>
                </p>
                <input
                  name="title"
                  required
                  placeholder="Path title"
                  className="w-full rounded border p-2"
                />

                <p>
                  <b>Description:</b>
                </p>
                <input
                  name="description"
                  required
                  placeholder="Description"
                  className="w-full rounded border p-2"
                />

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
                    {isPending ? "Creating..." : "Create"}
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
