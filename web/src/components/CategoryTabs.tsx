"use client";

import { CATEGORIES, CATEGORY_ORDER } from "@/lib/categories";
import type { CategoryId } from "@/lib/types";

export function CategoryTabs({
  active,
  onChange,
  counts,
}: {
  active: CategoryId;
  onChange: (id: CategoryId) => void;
  counts: Partial<Record<CategoryId, number>>;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto px-4 pb-1 pt-2 no-scrollbar">
      {CATEGORY_ORDER.map((id) => {
        const meta = CATEGORIES[id];
        const isActive = id === active;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all active:scale-95 ${
              isActive ? meta.classes.chipActive : meta.classes.chipIdle
            }`}
          >
            <span className="text-base leading-none">{meta.emoji}</span>
            {meta.label}
            {counts[id] != null && (
              <span
                className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-bold ${
                  isActive ? "bg-white/25" : "bg-white/70"
                }`}
              >
                {counts[id]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
