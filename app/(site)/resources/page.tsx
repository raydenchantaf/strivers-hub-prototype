import type { Metadata } from "next";
import { getResourcesPage, getResourcesCount, getCategories } from "@/lib/sanity";

export const metadata: Metadata = {
  title: "Insights & Resources",
  description:
    "Explore curated articles, guides, and tools designed to help Malaysian women entrepreneurs start and grow their businesses.",
  openGraph: {
    title: "Insights & Resources | Strivers' Hub",
    description:
      "Explore curated articles, guides, and tools designed to help Malaysian women entrepreneurs start and grow their businesses.",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    title: "Insights & Resources | Strivers' Hub",
    description:
      "Explore curated articles, guides, and tools designed to help Malaysian women entrepreneurs start and grow their businesses.",
  },
};
import ResourcesPageHeader from "@/components/resources/ResourcesPageHeader";
import ResourcesGrid from "@/components/resources/ResourcesGrid";
import Pagination from "@/components/ui/Pagination";
import { Suspense } from "react";

export const revalidate = 60;

const PAGE_SIZE = 12;

// Slugs owned by dedicated pages — exclude them from the general Resources feed
const EXCLUDED_CATEGORIES = ["event", "community", "report", "finance", "grant", "fund", "loan"];

interface Props {
  searchParams: Promise<{ page?: string; category?: string }>;
}

export default async function ResourcesPage({ searchParams }: Props) {
  const { page: pageParam, category } = await searchParams;

  const currentPage    = Math.max(1, parseInt(pageParam ?? "1", 10));
  const categoryFilter = category ?? undefined;

  const [resources, totalCount, categories] = await Promise.all([
    getResourcesPage(currentPage, PAGE_SIZE, categoryFilter, { exclude: EXCLUDED_CATEGORIES }),
    getResourcesCount(categoryFilter, { exclude: EXCLUDED_CATEGORIES }),
    getCategories(),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="min-h-screen bg-gray-50">
      <ResourcesPageHeader />
      <div className="container-max section-padding">
        <Suspense>
          <ResourcesGrid resources={resources} categories={categories} />
        </Suspense>
        <Suspense>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath="/resources"
          />
        </Suspense>
      </div>
    </div>
  );
}
