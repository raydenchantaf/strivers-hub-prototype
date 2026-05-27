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
  featured?: boolean;
  order?: number;
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
  featured,
  order,
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
    { next: { revalidate: 3600 } }
  );
}

/** Fetch all resources for the listing page (no body — keeps payload small) */
export async function getResources(): Promise<SanityResource[]> {
  return sanityClient.fetch(
    `*[_type == "resource"] | order(featured desc, order asc, publishedAt desc) { ${RESOURCE_PROJECTION} }`,
    {},
    { next: { revalidate: 60 } }
  );
}

/**
 * Fetch up to 6 resources for the given assessment grade.
 * If fewer than 6 grade-matched articles exist, top up with the most
 * recently published articles (excluding already-fetched IDs and
 * excluding event/financing/community category slugs).
 */
export async function getResourcesByGrade(grade: string): Promise<SanityResource[]> {
  const LIMIT = 6;
  const EXCLUDED_CATS = ["event", "community", "report", "finance", "grant", "fund", "loan"];

  // Step 1 — grade-matched articles
  const graded: SanityResource[] = await sanityClient.fetch(
    `*[_type == "resource" && assessmentGrade == $grade] | order(featured desc, order asc, publishedAt desc)[0...${LIMIT}] { ${RESOURCE_PROJECTION} }`,
    { grade: grade.toLowerCase() },
    { next: { revalidate: 300 } }
  );

  const needed = LIMIT - graded.length;
  if (needed <= 0) return graded;

  // Step 2 — top up with recent general articles, skipping already-fetched IDs
  const seenIds: string[] = graded.map((r) => r._id);
  const topUp: SanityResource[] = await sanityClient.fetch(
    `*[_type == "resource" && !(_id in $seenIds) && count(category[@->value.current in $excluded]) == 0] | order(publishedAt desc)[0...${needed}] { ${RESOURCE_PROJECTION} }`,
    { seenIds, excluded: EXCLUDED_CATS },
    { next: { revalidate: 300 } }
  );

  return [...graded, ...topUp];
}

interface ResourceQueryOptions {
  /** Include only resources that have at least one of these category slugs */
  include?: string | string[];
  /** Exclude resources that have any of these category slugs */
  exclude?: string | string[];
}

function buildCategoryFilter(opts: ResourceQueryOptions): { filter: string; params: Record<string, string[] | null> } {
  const include = opts.include ? (Array.isArray(opts.include) ? opts.include : [opts.include]) : null;
  const exclude = opts.exclude ? (Array.isArray(opts.exclude) ? opts.exclude : [opts.exclude]) : null;

  const clauses: string[] = ['_type == "resource"'];
  if (include) clauses.push(`count(category[@->value.current in $includeValues]) > 0`);
  if (exclude) clauses.push(`count(category[@->value.current in $excludeValues]) == 0`);

  return {
    filter: clauses.join(" && "),
    params: {
      includeValues: include,
      excludeValues: exclude,
    },
  };
}

/** Fetch a page of resources with optional include/exclude category filters */
export async function getResourcesPage(
  page: number,
  pageSize: number,
  categoryValue?: string | string[],
  opts?: ResourceQueryOptions
): Promise<SanityResource[]> {
  const offset = (page - 1) * pageSize;
  const { filter, params } = buildCategoryFilter({
    include: opts?.include ?? categoryValue,
    exclude: opts?.exclude,
  });
  return sanityClient.fetch(
    `*[${filter}] | order(featured desc, order asc, publishedAt desc) [${offset}...${offset + pageSize}] { ${RESOURCE_PROJECTION} }`,
    params,
    { next: { revalidate: 60 } }
  );
}

/** Count total resources with optional include/exclude category filters */
export async function getResourcesCount(
  categoryValue?: string | string[],
  opts?: ResourceQueryOptions
): Promise<number> {
  const { filter, params } = buildCategoryFilter({
    include: opts?.include ?? categoryValue,
    exclude: opts?.exclude,
  });
  return sanityClient.fetch(
    `count(*[${filter}])`,
    params,
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
