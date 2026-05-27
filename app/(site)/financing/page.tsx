import type { Metadata } from "next";
import { getResourcesPage, getResourcesCount } from "@/lib/sanity";

export const metadata: Metadata = {
  title: "Pembiayaan & Pendanaan",
  description:
    "Temui geran, dana, dan pinjaman yang tersedia untuk usahawan wanita Malaysia. Cari pembiayaan yang sesuai untuk mengembangkan perniagaan anda.",
  openGraph: {
    title: "Pembiayaan & Pendanaan | Strivers' Hub",
    description:
      "Temui geran, dana, dan pinjaman yang tersedia untuk usahawan wanita Malaysia. Cari pembiayaan yang sesuai untuk mengembangkan perniagaan anda.",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    title: "Pembiayaan & Pendanaan | Strivers' Hub",
    description:
      "Temui geran, dana, dan pinjaman yang tersedia untuk usahawan wanita Malaysia. Cari pembiayaan yang sesuai untuk mengembangkan perniagaan anda.",
  },
};
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
    <div className="min-h-screen bg-gradient-to-b from-brand-rose">
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
