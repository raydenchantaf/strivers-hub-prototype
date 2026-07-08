"use client";

import { useRef } from "react";
import type { SanityCategory } from "@/lib/sanity";

interface Props {
  cats: SanityCategory[];
  language: string;
  badgeClass: string;
}

export default function TagsRow({ cats, language, badgeClass }: Props) {
  const rowRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  if (cats.length === 0) return null;

  function onMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    dragging.current = true;
    startX.current = e.pageX - (rowRef.current?.offsetLeft ?? 0);
    scrollLeft.current = rowRef.current?.scrollLeft ?? 0;
  }

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!dragging.current || !rowRef.current) return;
    const x = e.pageX - rowRef.current.offsetLeft;
    rowRef.current.scrollLeft = scrollLeft.current - (x - startX.current);
  }

  function stopDrag() {
    dragging.current = false;
  }

  return (
    <div className="relative mb-2">
      <div
        ref={rowRef}
        className="flex overflow-x-auto tags-scroll gap-1 select-none cursor-grab active:cursor-grabbing"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
      >
        {cats.map((cat) => (
          <span
            key={cat._id}
            className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeClass}`}
          >
            {language === "bm" ? cat.title_bm : cat.title_en}
          </span>
        ))}
      </div>
      {cats.length > 2 && (
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      )}
    </div>
  );
}
