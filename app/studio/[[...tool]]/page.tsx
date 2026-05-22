"use client";

/**
 * Sanity Studio embedded at /studio
 *
 * Uses dynamic import with ssr:false to prevent Next.js (Turbopack) from
 * evaluating sanity.config.ts in the RSC context, where client-only APIs
 * like React.createContext are not available.
 */

import dynamic from "next/dynamic";

const StudioWithConfig = dynamic(
  async () => {
    // Both imports must be dynamic — sanity.config.ts transitively
    // calls createContext which is client-only.
    const [{ NextStudio }, { default: config }] = await Promise.all([
      import("next-sanity/studio"),
      import("../../../sanity.config"),
    ]);

    function Studio() {
      return <NextStudio config={config} />;
    }

    return Studio;
  },
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400 text-sm">Loading Strivers Hub CMS…</p>
      </div>
    ),
  }
);

export default function StudioPage() {
  return <StudioWithConfig />;
}
