"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Props {
  currentPage: number;
  totalPages: number;
  basePath: string; // e.g. "/resources" or "/events"
}

function buildHref(basePath: string, page: number, params: URLSearchParams): string {
  const next = new URLSearchParams(params.toString());
  next.set("page", String(page));
  return `${basePath}?${next.toString()}`;
}

function getPageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "…")[] = [1];

  if (current > 3) pages.push("…");

  const start = Math.max(2, current - 1);
  const end   = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("…");
  pages.push(total);

  return pages;
}

export default function Pagination({ currentPage, totalPages, basePath }: Props) {
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const btnBase =
    "inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-semibold transition-all";
  const btnActive = "bg-primary text-white shadow-md";
  const btnInactive =
    "bg-white border border-gray-200 text-gray-600 hover:border-primary hover:text-primary";
  const btnDisabled = "bg-white border border-gray-100 text-gray-300 cursor-not-allowed";

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1.5 mt-10"
    >
      {/* Previous */}
      {hasPrev ? (
        <Link
          href={buildHref(basePath, currentPage - 1, searchParams)}
          className={`${btnBase} ${btnInactive}`}
          aria-label="Previous page"
        >
          ←
        </Link>
      ) : (
        <span className={`${btnBase} ${btnDisabled}`} aria-disabled>←</span>
      )}

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="px-1 text-gray-400 select-none">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(basePath, p, searchParams)}
            className={`${btnBase} ${p === currentPage ? btnActive : btnInactive}`}
            aria-current={p === currentPage ? "page" : undefined}
          >
            {p}
          </Link>
        )
      )}

      {/* Next */}
      {hasNext ? (
        <Link
          href={buildHref(basePath, currentPage + 1, searchParams)}
          className={`${btnBase} ${btnInactive}`}
          aria-label="Next page"
        >
          →
        </Link>
      ) : (
        <span className={`${btnBase} ${btnDisabled}`} aria-disabled>→</span>
      )}
    </nav>
  );
}
