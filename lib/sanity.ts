import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

// ── Client ────────────────────────────────────────────────────────────────────

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  useCdn: true, // serve cached responses from Sanity CDN
});

// ── Image URL builder ────────────────────────────────────────────────────────

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// ── Types ─────────────────────────────────────────────────────────────────────

export type ResourceCategory =
  | "finance"
  | "digital"
  | "marketing"
  | "legal"
  | "mentorship"
  | "grants";

export interface SanityResource {
  _id: string;
  title_en: string;
  title_bm: string;
  excerpt_en: string;
  excerpt_bm: string;
  category: ResourceCategory;
  readTime: number;
  publishedAt: string;
  slug: { current: string };
  image: SanityImageSource & { alt?: string };
}

export interface SanityResourceFull extends SanityResource {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body_en: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body_bm: any[];
}

// ── GROQ queries ──────────────────────────────────────────────────────────────

/** Fetch all resources for the listing page (no body — keeps payload small) */
export async function getResources(): Promise<SanityResource[]> {
  return sanityClient.fetch(
    `*[_type == "resource"] | order(publishedAt desc) {
      _id,
      title_en,
      title_bm,
      excerpt_en,
      excerpt_bm,
      category,
      readTime,
      publishedAt,
      slug,
      image
    }`,
    {},
    { next: { revalidate: 60 } } // ISR: revalidate every 60 seconds
  );
}

/** Fetch a single resource by slug (includes rich text body) */
export async function getResource(slug: string): Promise<SanityResourceFull | null> {
  return sanityClient.fetch(
    `*[_type == "resource" && slug.current == $slug][0] {
      _id,
      title_en,
      title_bm,
      excerpt_en,
      excerpt_bm,
      category,
      readTime,
      publishedAt,
      slug,
      image,
      body_en,
      body_bm
    }`,
    { slug },
    { next: { revalidate: 60 } }
  );
}

/** Fetch all slugs — used to generate static paths */
export async function getAllResourceSlugs(): Promise<{ slug: string }[]> {
  return sanityClient.fetch(
    `*[_type == "resource"] { "slug": slug.current }`,
    {},
    { next: { revalidate: 60 } }
  );
}
