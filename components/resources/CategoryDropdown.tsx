"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import type { SanityCategory } from "@/lib/sanity";

interface Props {
  categories: SanityCategory[];
}

export default function CategoryDropdown({ categories }: Props) {
  const { language }     = useLanguage();
  const router           = useRouter();
  const pathname         = usePathname();
  const searchParams     = useSearchParams();
  const activeFilter     = searchParams.get("category") ?? "all";

  const [open, setOpen]       = useState(false);
  const [query, setQuery]     = useState("");
  const containerRef          = useRef<HTMLDivElement>(null);
  const searchRef             = useRef<HTMLInputElement>(null);

  const isBm = language === "bm";

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") { setOpen(false); setQuery(""); }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  function navigate(value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      next.delete("category");
    } else {
      next.set("category", value);
    }
    next.delete("page");
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
    setOpen(false);
    setQuery("");
  }

  // Active category label for button
  const activeCategory = categories.find((c) => c.value === activeFilter);
  const buttonLabel = activeFilter === "all"
    ? (isBm ? "Semua Kategori" : "All Categories")
    : (isBm ? (activeCategory?.title_bm ?? activeFilter) : (activeCategory?.title_en ?? activeFilter));

  // Filter categories by search query
  const filtered = categories.filter((cat) => {
    const label = isBm ? cat.title_bm : cat.title_en;
    return label.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div ref={containerRef} className="relative mb-8 w-full max-w-xs">
      {/* Trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-full text-sm font-semibold border transition-all ${
          activeFilter !== "all"
            ? "bg-primary text-white border-primary shadow-md"
            : "bg-white border-gray-200 text-gray-700 hover:border-primary hover:text-primary"
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate">{buttonLabel}</span>
        <svg
          className={`w-4 h-4 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute z-50 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Search input */}
          <div className="p-3 border-b border-gray-100">
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
              <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isBm ? "Cari kategori..." : "Search category..."}
                className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
              />
              {query && (
                <button onClick={() => setQuery("")} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Options list */}
          <ul
            role="listbox"
            className="max-h-60 overflow-y-auto py-1.5"
          >
            {/* "All" option — only show when not searching */}
            {!query && (
              <li>
                <button
                  role="option"
                  aria-selected={activeFilter === "all"}
                  onClick={() => navigate("all")}
                  className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors ${
                    activeFilter === "all"
                      ? "bg-primary/10 text-primary"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {isBm ? "Semua Kategori" : "All Categories"}
                  {activeFilter === "all" && (
                    <span className="float-right text-primary">✓</span>
                  )}
                </button>
              </li>
            )}

            {filtered.length > 0 ? filtered.map((cat) => {
              const label    = isBm ? cat.title_bm : cat.title_en;
              const isActive = activeFilter === cat.value;
              return (
                <li key={cat._id}>
                  <button
                    role="option"
                    aria-selected={isActive}
                    onClick={() => navigate(cat.value)}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-gray-700 hover:bg-gray-50 font-medium"
                    }`}
                  >
                    {label}
                    {isActive && <span className="float-right text-primary">✓</span>}
                  </button>
                </li>
              );
            }) : (
              <li className="px-4 py-6 text-center text-sm text-gray-400">
                {isBm ? "Tiada kategori dijumpai." : "No categories found."}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
