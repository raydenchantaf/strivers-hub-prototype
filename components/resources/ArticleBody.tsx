"use client";

import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/lib/sanity";
import { useLanguage } from "@/context/LanguageContext";

// ── YouTube embed ─────────────────────────────────────────────────────────────

function YouTubeEmbed({ value }: { value: { url: string; caption?: string } }) {
  const getVideoId = (url: string) => {
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match?.[1] ?? null;
  };

  const videoId = getVideoId(value.url);
  if (!videoId) return null;

  return (
    <figure className="my-6">
      <div className="aspect-video rounded-xl overflow-hidden shadow-md">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={value.caption || "YouTube video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
      {value.caption && (
        <figcaption className="text-center text-xs text-gray-400 mt-2">
          {value.caption}
        </figcaption>
      )}
    </figure>
  );
}

// ── PortableText component map ────────────────────────────────────────────────

const portableTextComponents: PortableTextComponents = {
  types: {
    youtube: YouTubeEmbed,
    image: ({ value }) => {
      const src = urlFor(value).width(900).auto("format").url();
      return (
        <figure className="my-6">
          <img
            src={src}
            alt={value.alt || ""}
            className="rounded-xl w-full object-cover shadow-sm"
          />
          {value.caption && (
            <figcaption className="text-center text-xs text-gray-400 mt-2">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value.href}
        target={value.blank ? "_blank" : "_self"}
        rel={value.blank ? "noopener noreferrer" : undefined}
        className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
      >
        {children}
      </a>
    ),
  },
  block: {
    h2: ({ children }) => (
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-lg md:text-xl font-semibold text-gray-900 mt-6 mb-2">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-4 italic text-gray-600 my-4">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="text-gray-700 leading-relaxed mb-4">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside space-y-1 mb-4 text-gray-700 pl-2">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside space-y-1 mb-4 text-gray-700 pl-2">{children}</ol>
    ),
  },
};

// ── Article body with language toggle ────────────────────────────────────────

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body_en: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body_bm: any[];
}

export default function ArticleBody({ body_en, body_bm }: Props) {
  const { language } = useLanguage();

  const body = language === "bm" ? body_bm : body_en;
  const hasBody = Array.isArray(body) && body.length > 0;

  return (
    <article className="prose-sm max-w-none">
      {hasBody ? (
        <PortableText value={body} components={portableTextComponents} />
      ) : (
        <p className="text-gray-400 italic">
          {language === "bm"
            ? "Kandungan artikel akan datang."
            : "Article content coming soon."}
        </p>
      )}
    </article>
  );
}
