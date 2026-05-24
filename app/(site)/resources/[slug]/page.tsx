import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getResource, getAllResourceSlugs } from "@/lib/sanity";
import ArticleBackLink from "@/components/resources/ArticleBackLink";
import ArticleHeader from "@/components/resources/ArticleHeader";
import ArticleBody from "@/components/resources/ArticleBody";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllResourceSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const url = `https://strivershub.com/resources/${slug}`;
  return {
    alternates: {
      canonical: url,
      languages: {
        "ms": url,        // Bahasa Malaysia — default language
        "en": url,        // English — same URL, content toggled client-side
        "x-default": url, // Fallback for unmatched locales
      },
    },
  };
}

export default async function ResourceArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getResource(slug);
  if (!article) notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-max section-padding max-w-3xl">
        {/* Back link */}
        <ArticleBackLink />

        {/* Header — handles cover image + meta + title, all language-aware */}
        <ArticleHeader
          title_en={article.title_en}
          title_bm={article.title_bm}
          category={article.category}
          publishedAt={article.publishedAt}
          image_en={article.image_en}
          image_bm={article.image_bm}
        />

        {/* Body */}
        <ArticleBody body_en={article.body_en} body_bm={article.body_bm} />
      </div>
    </div>
  );
}
