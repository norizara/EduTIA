"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Plus } from "lucide-react";

export default function AddExperiencePopover({
  onAdd,
}: {
  onAdd: (data: {
    jobTitle: string;
    companyName: string;
    startDate: string;
    endDate?: string;
  }) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [form, setForm] = useState({
    jobTitle: "",
    companyName: "",
    startDate: "",
    endDate: "",
  });

  const openPopover = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();

    setPos({
      top: rect.bottom + 8,
      left: Math.min(rect.left, window.innerWidth - 300),
    });

    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;

    const close = (e: MouseEvent) => {
      if (
        !popoverRef.current?.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={openPopover}
        className="flex items-center gap-1 text-sm font-medium text-eduBlue hover:underline"
      >
        <Plus className="w-4 h-4" />
        Add Experience
      </button>

      {open &&
        createPortal(
          <div
            ref={popoverRef}
            className="fixed z-9999 w-72 bg-white border rounded-xl shadow-xl p-4 space-y-3"
            style={{
              top: pos.top,
              left: pos.left,
            }}
          >
            <input
              placeholder="Job Title"
              className="w-full border rounded px-3 py-2 text-sm"
              onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
            />

            <input
              placeholder="Company Name"
              className="w-full border rounded px-3 py-2 text-sm"
              onChange={(e) =>
                setForm({ ...form, companyName: e.target.value })
              }
            />

            <input
              type="date"
              className="w-full border rounded px-3 py-2 text-sm"
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            />

            <input
              type="date"
              className="w-full border rounded px-3 py-2 text-sm"
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setOpen(false)}
                className="text-sm text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await onAdd(form);
                  setOpen(false);
                }}
                className="px-3 py-1.5 text-sm bg-eduBlue text-white rounded-md"
              >
                Add
              </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
