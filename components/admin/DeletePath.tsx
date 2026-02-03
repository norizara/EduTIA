"use client";

import { deletePathAction } from "@/actions/pathAdmin";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeletePathButton({ pathId }: { pathId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="p-2 bg-red-600 text-white rounded-md text-xs"
      >
        Delete Path
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md max-h-[90vh] overflow-hidden rounded-xl bg-white shadow-xl">
            <div className="p-6 overflow-y-auto max-h-[90vh]">
              <h2 className="text-lg font-bold mb-4">Delete Path</h2>
              <span>Confirm this path deletion</span>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 text-sm rounded border"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    await deletePathAction(pathId);
                    router.push("/admin/paths");
                  }}
                  className="px-4 py-2 text-sm rounded bg-red-600 text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
