import { getResources } from "@/lib/sanity";
import ResourcesGrid from "@/components/resources/ResourcesGrid";

export const revalidate = 60;

export default async function ResourcesPage() {
  const resources = await getResources();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary to-primary-dark section-padding py-14">
        <div className="container-max text-center">
          <h1 className="text-2xl md:text-4xl font-extrabold text-white mb-3">
            Insights & Resources
          </h1>
          <p className="text-white/80 text-sm md:text-base max-w-xl mx-auto">
            Curated articles, guides, and tools to help your business grow.
          </p>
        </div>
      </div>
      <div className="container-max section-padding">
        <ResourcesGrid resources={resources} />
      </div>
    </div>
  );
}
