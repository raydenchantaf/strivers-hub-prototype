import { getResourcesPage, getResourcesCount } from "@/lib/sanity";
import FinancingPageHeader from "@/components/financing/FinancingPageHeader";
import FinancingGrid from "@/components/financing/FinancingGrid";
import Pagination from "@/components/ui/Pagination";
import { Suspense } from "react";

export const revalidate = 60;

const PAGE_SIZE  = 12;
const CATEGORIES = ["finance", "grant", "fund", "loan"];

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function FinancingPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10));

  const [items, totalCount] = await Promise.all([
    getResourcesPage(currentPage, PAGE_SIZE, CATEGORIES),
    getResourcesCount(CATEGORIES),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="min-h-screen bg-gray-50">
      <FinancingPageHeader />
      <div className="container-max section-padding">
        <Suspense>
          <FinancingGrid items={items} />
        </Suspense>
        <Suspense>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath="/financing"
          />
        </Suspense>
      </div>
    </div>
  );
}
