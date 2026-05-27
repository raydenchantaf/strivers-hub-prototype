"use client";

import { useMemo } from "react";
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

// ── Callout styles ────────────────────────────────────────────────────────────

const calloutStyles = {
  info: {
    bg: "bg-blue-50",
    border: "border-blue-400",
    text: "text-blue-800",
    icon: "ℹ️",
  },
  warning: {
    bg: "bg-amber-50",
    border: "border-amber-400",
    text: "text-amber-800",
    icon: "⚠️",
  },
  tip: {
    bg: "bg-emerald-50",
    border: "border-emerald-400",
    text: "text-emerald-800",
    icon: "💡",
  },
} as const;

// ── Article body with language toggle ────────────────────────────────────────

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body_en: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body_bm: any[];
}

export default function ArticleBody({ body_en, body_bm }: Props) {
  const { language } = useLanguage();
  const isBm = language === "bm";

  const body = isBm ? body_bm : body_en;
  const hasBody = Array.isArray(body) && body.length > 0;

  // Build component map inside the component so renderers can access `isBm`
  const components: PortableTextComponents = useMemo(
    () => ({
      // ── Custom block types ──────────────────────────────────
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

        divider: () => (
          <div className="my-8 flex items-center gap-3">
            <hr className="flex-1 border-t border-gray-200" />
            <span className="text-gray-300 text-xs">✦</span>
            <hr className="flex-1 border-t border-gray-200" />
          </div>
        ),

        callout: ({ value }) => {
          const s =
            calloutStyles[value.type as keyof typeof calloutStyles] ??
            calloutStyles.info;
          return (
            <div
              className={`my-6 flex gap-3 rounded-xl border-l-4 ${s.border} ${s.bg} px-4 py-3`}
            >
              <span className="text-lg mt-0.5 shrink-0">{s.icon}</span>
              <p className={`text-sm leading-relaxed ${s.text}`}>{value.text}</p>
            </div>
          );
        },

        rawHtml: ({ value }) => {
          if (!value.code) return null;
          const isIframe = value.code.trimStart().startsWith("<iframe");
          return isIframe ? (
            // Responsive iframe wrapper — preserves 16:9 by default
            <div
              className="my-6 w-full overflow-hidden rounded-xl"
              style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}
              dangerouslySetInnerHTML={{
                __html: value.code.replace(
                  "<iframe",
                  '<iframe style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;"'
                ),
              }}
            />
          ) : (
            // Plain HTML — renders as-is
            <div
              className="my-6"
              dangerouslySetInnerHTML={{ __html: value.code }}
            />
          );
        },

        fileDownload: ({ value }) => {
          const label = isBm ? value.title_bm : value.title_en;
          const desc = isBm ? value.description_bm : value.description_en;

          // Resolve Sanity file asset URL from the _ref string
          // Ref format: "file-{id}-{extension}" → cdn URL
          const ref: string | undefined = value.file?.asset?._ref;
          const match = ref?.match(/^file-(.+)-([^-]+)$/);
          const fileUrl =
            match
              ? `https://cdn.sanity.io/files/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${match[1]}.${match[2]}`
              : null;

          if (!fileUrl) return null;

          return (
            <div className="my-6 flex items-center gap-4 rounded-xl border border-primary bg-gray-50 px-4 py-3">
              <span className="text-2xl shrink-0">📎</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900 truncate">{label}</p>
                {desc && (
                  <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                )}
              </div>
              <a
                href={fileUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
              >
                {isBm ? "Muat Turun" : "Download"}
              </a>
            </div>
          );
        },
      },

      // ── Inline marks ────────────────────────────────────────
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
        "strike-through": ({ children }) => (
          <s className="text-gray-400">{children}</s>
        ),
      },

      // ── Block styles ─────────────────────────────────────────
      block: {
        normal: ({ children }) => (
          <p className="text-gray-700 leading-relaxed mb-4">{children}</p>
        ),
        lead: ({ children }) => (
          <p className="text-lg md:text-xl text-gray-500 leading-relaxed mb-6 font-light">
            {children}
          </p>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 mt-6 mb-2">
            {children}
          </h3>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-primary pl-4 italic text-gray-600 my-4">
            {children}
          </blockquote>
        ),
        caption: ({ children }) => (
          <p className="text-xs text-gray-400 italic text-center mb-4">{children}</p>
        ),
      },

      // ── Lists ────────────────────────────────────────────────
      list: {
        bullet: ({ children }) => (
          <ul className="list-disc list-inside space-y-1 mb-4 text-gray-700 pl-2">
            {children}
          </ul>
        ),
        number: ({ children }) => (
          <ol className="list-decimal list-inside space-y-1 mb-4 text-gray-700 pl-2">
            {children}
          </ol>
        ),
      },
    }),
    [isBm]
  );

  return (
    <article className="article-body max-w-none">
      {hasBody ? (
        <PortableText value={body} components={components} />
      ) : (
        <p className="text-gray-400 italic">
          {isBm ? "Kandungan artikel akan datang." : "Article content coming soon."}
        </p>
      )}
    </article>
  );
}
