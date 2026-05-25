import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

// ── Client ────────────────────────────────────────────────────────────────────

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  useCdn: true,
});

// ── Image URL builder ─────────────────────────────────────────────────────────

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SanityCategory {
  _id: string;
  title_en: string;
  title_bm: string;
  value: string;  // slug identifier e.g. "finance"
}

export interface SanityResource {
  _id: string;
  title_en: string;
  title_bm: string;
  excerpt_en: string;
  excerpt_bm: string;
  category: SanityCategory[];
  publishedAt: string;
  slug: { current: string };
  image_en?: SanityImageSource & { alt?: string };
  image_bm?: SanityImageSource & { alt?: string };
}

export interface SanityResourceFull extends SanityResource {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body_en: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body_bm: any[];
}

// ── GROQ projection — reused across queries ───────────────────────────────────

const CATEGORY_PROJECTION = `
  _id,
  title_en,
  title_bm,
  "value": value.current
`;

const RESOURCE_PROJECTION = `
  _id,
  title_en,
  title_bm,
  excerpt_en,
  excerpt_bm,
  "category": category[]-> { ${CATEGORY_PROJECTION} },
  publishedAt,
  slug,
  image_en,
  image_bm
`;

// ── GROQ queries ──────────────────────────────────────────────────────────────

/** Fetch all categories — used for filter tabs */
export async function getCategories(): Promise<SanityCategory[]> {
  return sanityClient.fetch(
    `*[_type == "category"] | order(title_en asc) { ${CATEGORY_PROJECTION} }`,
    {},
    { next: { revalidate: 3600 } } // categories change rarely — cache for 1 hour
  );
}

/** Fetch all resources for the listing page (no body — keeps payload small) */
export async function getResources(): Promise<SanityResource[]> {
  return sanityClient.fetch(
    `*[_type == "resource"] | order(publishedAt desc) { ${RESOURCE_PROJECTION} }`,
    {},
    { next: { revalidate: 60 } }
  );
}

/** Fetch a single resource by slug (includes rich text body) */
export async function getResource(slug: string): Promise<SanityResourceFull | null> {
  return sanityClient.fetch(
    `*[_type == "resource" && slug.current == $slug][0] {
      ${RESOURCE_PROJECTION},
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
