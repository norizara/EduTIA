"use client";

import { useActionState, useEffect, useState } from "react";
import { createJobAction } from "@/actions/jobManagement";
import { useRouter } from "next/navigation";
import { JobCategory } from "@prisma/client";

export default function CreateJobPopover({
  categories,
}: {
  categories: JobCategory[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [state, formAction, isPending] = useActionState(createJobAction, null);

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
        className="p-2 bg-eduBlue text-white rounded-md"
      >
        Create Job
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />

          <div className="relative z-10 w-full max-w-md max-h-[90vh] overflow-hidden rounded-xl bg-white shadow-xl">
            <div className="p-6 overflow-y-auto max-h-[90vh]">
              <h2 className="text-lg font-bold mb-4">Create Job</h2>

              <form action={formAction} className="space-y-3">
                <p className="font-semibold">Title:*</p>
                <input
                  name="title"
                  required
                  placeholder="Course title"
                  className="w-full rounded border p-2"
                />

                <p className="font-semibold">Description:*</p>
                <input
                  name="description"
                  required
                  placeholder="Description"
                  className="w-full rounded border p-2"
                />

                <p className="font-semibold">Location:</p>
                <input
                  name="location"
                  placeholder="Company address as default"
                  className="w-full rounded border p-2"
                />

                <p className="font-semibold">Category:*</p>
                <select
                  name="categoryId"
                  required
                  className="w-full rounded border p-2"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                <p className="font-semibold">Job Type:*</p>
                <select
                  name="type"
                  required
                  className="w-full rounded border p-2"
                >
                  <option value="">Select type</option>
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="FREELANCE">Freelance</option>
                  <option value="INTERNSHIP">Internship</option>
                </select>

                <p className="font-semibold">Work Mode:*</p>
                <select
                  name="mode"
                  required
                  className="w-full rounded border p-2"
                >
                  <option value="">Select mode</option>
                  <option value="ONSITE">Onsite</option>
                  <option value="REMOTE">Remote</option>
                  <option value="HYBRID">Hybrid</option>
                </select>

                <p className="font-semibold">Level:</p>
                <select
                  name="level"
                  required
                  className="w-full rounded border p-2"
                >
                  <option value="">Any</option>
                  <option value="JUNIOR">Junior</option>
                  <option value="MID">Mid</option>
                  <option value="SENIOR">Senior</option>
                  <option value="LEAD">Lead</option>
                </select>

                <p className="font-semibold">Minimum Paycheck:</p>
                <input
                  type="number"
                  name="paycheckMin"
                  placeholder="Minimum payment"
                  className="w-full rounded border p-2"
                />

                <p className="font-semibold">Maximum Paycheck:</p>
                <input
                  type="number"
                  name="paycheckMax"
                  placeholder="Maximum payment"
                  className="w-full rounded border p-2"
                />

                <p className="font-semibold">Expired Date:</p>
                <input
                  type="date"
                  name="expiredDate"
                  placeholder="Maximum payment"
                  className="w-full rounded border p-2"
                />

                <p className="font-semibold">Status:</p>
                <select
                  name="status"
                  required
                  className="w-full rounded border p-2"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
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
                    className="px-4 py-2 text-sm rounded bg-eduBlue text-white"
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
