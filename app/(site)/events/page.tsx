import type { Metadata } from "next";
import { getResourcesPage, getResourcesCount } from "@/lib/sanity";

export const metadata: Metadata = {
  title: "Aktiviti & Komuniti",
  description:
    "Ikuti perkembangan bengkel, forum, dan perhimpunan komuniti untuk usahawanita.",
  openGraph: {
    title: "Aktiviti & Komuniti | Strivers' Hub",
    description:
      "Ikuti perkembangan bengkel, forum, dan perhimpunan komuniti untuk usahawanita.",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    title: "Aktiviti & Komuniti | Strivers' Hub",
    description:
      "Ikuti perkembangan bengkel, forum, dan perhimpunan komuniti untuk usahawanita.",
  },
};
import EventsGrid from "@/components/events/EventsGrid";
import EventsPageHeader from "@/components/events/EventsPageHeader";
import Pagination from "@/components/ui/Pagination";
import { Suspense } from "react";

export const revalidate = 60;

const PAGE_SIZE   = 12;
const CATEGORIES  = ["event", "community", "report"]; // Sanity category identifier slugs

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function EventsPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10));

  const [events, totalCount] = await Promise.all([
    getResourcesPage(currentPage, PAGE_SIZE, CATEGORIES),
    getResourcesCount(CATEGORIES),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-rose">
      <EventsPageHeader />
      <div className="container-max section-padding">
        <Suspense>
          <EventsGrid events={events} />
        </Suspense>
        <Suspense>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath="/events"
          />
        </Suspense>
      </div>
    </div>
  );
}
