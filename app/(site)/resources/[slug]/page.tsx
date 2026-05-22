import { notFound } from "next/navigation";
import { getResource, getAllResourceSlugs, urlFor } from "@/lib/sanity";
import ArticleBackLink from "@/components/resources/ArticleBackLink";
import ArticleHeader from "@/components/resources/ArticleHeader";
import ArticleBody from "@/components/resources/ArticleBody";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllResourceSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export default async function ResourceArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getResource(slug);
  if (!article) notFound();

  const coverSrc = article.image
    ? urlFor(article.image).width(900).auto("format").url()
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-max section-padding max-w-3xl">
        {/* Back link — above the cover image */}
        <ArticleBackLink />

        {/* Cover image — constrained to article width */}
        {coverSrc && (
          <div className="w-full rounded-xl overflow-hidden mb-8">
            <img
              src={coverSrc}
              alt={article.image?.alt || article.title_en}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Header — fully language-aware client component */}
        <ArticleHeader
          title_en={article.title_en}
          title_bm={article.title_bm}
          category={article.category}
          readTime={article.readTime}
          publishedAt={article.publishedAt}
        />

        {/* Body — language-aware client component */}
        <ArticleBody body_en={article.body_en} body_bm={article.body_bm} />
      </div>
    </div>
  );

}
