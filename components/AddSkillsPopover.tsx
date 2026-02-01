"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Plus } from "lucide-react";

export default function AddSkillPopover({
  onAdd,
}: {
  onAdd: (name: string) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const openPopover = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();

    setPos({
      top: rect.bottom + 8,
      left: Math.min(rect.left, window.innerWidth - 280),
    });

    setOpen(true);
  };

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".skill-popover")) {
        setOpen(false);
      }
    };

    if (open) window.addEventListener("mousedown", close);
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
        Add Skill
      </button>

      {open &&
        createPortal(
          <div
            className="skill-popover fixed z-9999 w-64 bg-white border rounded-xl shadow-xl p-4"
            style={{
              top: pos.top,
              left: pos.left,
            }}
          >
            <input
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="e.g. React, Python"
              className="w-full border rounded-md px-3 py-2 text-sm"
            />

            <div className="mt-3 flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="text-sm text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!value.trim()) return;
                  await onAdd(value);
                  setValue("");
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
