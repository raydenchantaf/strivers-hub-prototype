import { getResources, getCategories } from "@/lib/sanity";
import ResourcesPageHeader from "@/components/resources/ResourcesPageHeader";
import ResourcesGrid from "@/components/resources/ResourcesGrid";

export const revalidate = 60;

export default async function ResourcesPage() {
  const [resources, categories] = await Promise.all([
    getResources(),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <ResourcesPageHeader />
      <div className="container-max section-padding">
        <ResourcesGrid resources={resources} categories={categories} />
      </div>
    </div>
  );
}
