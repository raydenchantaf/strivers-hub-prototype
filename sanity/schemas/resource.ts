import { defineField, defineType } from "sanity";

// ── Category document type ────────────────────────────────────────────────────
// Editors manage categories in Studio — no code changes needed to add new ones.

export const categorySchema = defineType({
  name: "category",
  type: "document",
  title: "Category",
  fields: [
    defineField({
      name: "title_en",
      type: "string",
      title: "Title (English)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title_bm",
      type: "string",
      title: "Title (Bahasa Malaysia)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "value",
      type: "slug",
      title: "Identifier",
      description: "Used internally for filtering. Auto-generated from English title. Do not change after creation.",
      options: { source: "title_en" },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "title_en", subtitle: "title_bm" },
    prepare({ title, subtitle }) {
      return { title, subtitle };
    },
  },
});

// ── Assessment Grade type ─────────────────────────────────────────────────────
// Used as an optional field on resource documents.
// Phase 2: used to gate learning module content by user's assessed grade.

export type AssessmentGrade = "aspiring" | "managing" | "growing";

// ── Custom block types ────────────────────────────────────────────────────────

// YouTube embed
const youtubeEmbed = defineType({
  name: "youtube",
  type: "object",
  title: "YouTube Embed",
  fields: [
    defineField({
      name: "url",
      type: "url",
      title: "YouTube URL",
      description: "Paste the full YouTube video URL (e.g. https://www.youtube.com/watch?v=xxxxx)",
      validation: (Rule) =>
        Rule.required().uri({ scheme: ["https", "http"] }),
    }),
    defineField({
      name: "caption",
      type: "string",
      title: "Caption (optional)",
    }),
  ],
  preview: {
    select: { url: "url", caption: "caption" },
    prepare({ url, caption }) {
      return {
        title: caption || "YouTube Embed",
        subtitle: url,
        media: undefined,
      };
    },
  },
});

// Section divider
const dividerBlock = defineType({
  name: "divider",
  type: "object",
  title: "Section Divider",
  fields: [
    defineField({
      name: "style",
      type: "string",
      title: "Style",
      hidden: true,
      initialValue: "line",
      readOnly: true,
    }),
  ],
  preview: {
    prepare() {
      return { title: "── Section Divider ──" };
    },
  },
});

// Callout (Info / Warning / Tip)
const calloutBlock = defineType({
  name: "callout",
  type: "object",
  title: "Callout",
  fields: [
    defineField({
      name: "type",
      type: "string",
      title: "Type",
      options: {
        list: [
          { title: "ℹ️  Info", value: "info" },
          { title: "⚠️  Warning", value: "warning" },
          { title: "💡 Tip", value: "tip" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "info",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "text",
      type: "text",
      title: "Content",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { type: "type", text: "text" },
    prepare({ type, text }) {
      const icons: Record<string, string> = { info: "ℹ️", warning: "⚠️", tip: "💡" };
      const label = type ? type.charAt(0).toUpperCase() + type.slice(1) : "Callout";
      return {
        title: `${icons[type] ?? "📌"} ${label}`,
        subtitle: text,
      };
    },
  },
});

// File download block
const fileDownloadBlock = defineType({
  name: "fileDownload",
  type: "object",
  title: "File Download",
  fields: [
    defineField({
      name: "file",
      type: "file",
      title: "File",
      description: "Upload the file (PDF, DOCX, XLSX, etc.)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title_en",
      type: "string",
      title: "Button Label (English)",
      description: "e.g. Download Grant Guide",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title_bm",
      type: "string",
      title: "Button Label (Bahasa Malaysia)",
      description: "cth. Muat Turun Panduan Geran",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description_en",
      type: "string",
      title: "Description (English, optional)",
      description: "Short note shown below the button label",
    }),
    defineField({
      name: "description_bm",
      type: "string",
      title: "Description (Bahasa Malaysia, optional)",
    }),
  ],
  preview: {
    select: { title: "title_en", desc: "description_en" },
    prepare({ title, desc }) {
      return {
        title: `📎 ${title || "File Download"}`,
        subtitle: desc,
      };
    },
  },
});

// Raw HTML / iframe embed block
const rawHtmlBlock = defineType({
  name: "rawHtml",
  type: "object",
  title: "HTML / Embed",
  fields: [
    defineField({
      name: "code",
      type: "text",
      title: "HTML or Embed Code",
      description: "Paste raw HTML or an iframe embed code (e.g. Google Maps, Typeform, etc.)",
      rows: 6,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "label",
      type: "string",
      title: "Internal Label (optional)",
      description: "Only shown in Studio — helps identify this block (e.g. 'Google Maps — Kuala Lumpur office')",
    }),
  ],
  preview: {
    select: { label: "label", code: "code" },
    prepare({ label, code }) {
      return {
        title: `</> ${label || "HTML / Embed"}`,
        subtitle: code ? code.slice(0, 80) : undefined,
      };
    },
  },
});

// ── Portable Text (rich text) — shared for EN and BM body ────────────────────

const portableTextField = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "array",
    of: [
      {
        type: "block",
        styles: [
          { title: "Normal", value: "normal" },
          { title: "Lead Paragraph", value: "lead" },
          { title: "Heading 2", value: "h2" },
          { title: "Heading 3", value: "h3" },
          { title: "Quote", value: "blockquote" },
          { title: "Caption", value: "caption" },
        ],
        lists: [
          { title: "Bullet", value: "bullet" },
          { title: "Numbered", value: "number" },
        ],
        marks: {
          decorators: [
            { title: "Bold", value: "strong" },
            { title: "Italic", value: "em" },
            { title: "Underline", value: "underline" },
            { title: "Strikethrough", value: "strike-through" },
          ],
          annotations: [
            {
              name: "link",
              type: "object",
              title: "Link",
              fields: [
                defineField({
                  name: "href",
                  type: "url",
                  title: "URL",
                  validation: (Rule) =>
                    Rule.uri({ scheme: ["https", "http", "mailto"] }),
                }),
                defineField({
                  name: "blank",
                  type: "boolean",
                  title: "Open in new tab",
                  initialValue: true,
                }),
              ],
            },
          ],
        },
      },
      // Inline image inside body
      {
        type: "image",
        options: { hotspot: true },
        fields: [
          defineField({
            name: "caption",
            type: "string",
            title: "Caption",
          }),
          defineField({
            name: "alt",
            type: "string",
            title: "Alt text",
          }),
        ],
      },
      // Custom block types
      { type: "youtube" },
      { type: "divider" },
      { type: "callout" },
      { type: "fileDownload" },
      { type: "rawHtml" },
    ],
  });

// ── Resource document schema ──────────────────────────────────────────────────

export const resourceSchema = defineType({
  name: "resource",
  title: "Resource",
  type: "document",
  fields: [
    // ── Identity ─────────────────────────────────────────────
    defineField({
      name: "title_en",
      title: "Title (English)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title_bm",
      title: "Title (Bahasa Malaysia)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Auto-generated from Bahasa Malaysia title. Used in the article URL.",
      options: {
        source: "title_bm",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    // ── Category ─────────────────────────────────────────────
    defineField({
      name: "category",
      title: "Category",
      description: "Select at least 1 and up to 5 categories. Manage categories under the Categories section in Studio.",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
      validation: (Rule) => Rule.required().min(1).max(5),
    }),

    // ── Assessment Grade ──────────────────────────────────────
    defineField({
      name: "assessmentGrade",
      title: "Assessment Grade",
      description: "Optional. Tag this article for a specific learner grade. ",
      type: "string",
      options: {
        list: [
          { title: "Aspiring",  value: "aspiring" },
          { title: "Managing",  value: "managing" },
          { title: "Growing",   value: "growing" },
        ],
      },
    }),

    // ── Ordering & featuring ─────────────────────────────────
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      description: "Pin this article to the top of the listing, above all other posts.",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Sort Order",
      type: "number",
      description: "Lower numbers appear first (e.g. 1 before 2). Leave blank to sort by date.",
    }),

    // ── Cover images (bilingual) ──────────────────────────────
    defineField({
      name: "image_en",
      title: "Cover Image (English)",
      description: "Use this version when the image contains English text.",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text (English)",
          type: "string",
          description: "Describe the image for accessibility and SEO.",
        }),
      ],
    }),
    defineField({
      name: "image_bm",
      title: "Cover Image (Bahasa Malaysia)",
      description: "Use this version when the image contains Bahasa Malaysia text.",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text (Bahasa Malaysia)",
          type: "string",
          description: "Huraikan imej untuk kebolehcapaian dan SEO.",
        }),
      ],
    }),

    // ── Meta ──────────────────────────────────────────────────
    defineField({
      name: "publishedAt",
      title: "Published Date",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),

    // ── Excerpt ───────────────────────────────────────────────
    defineField({
      name: "excerpt_en",
      title: "Excerpt (English)",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(500),
    }),
    defineField({
      name: "excerpt_bm",
      title: "Excerpt (Bahasa Malaysia)",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(500),
    }),

    // ── Body (rich text) ──────────────────────────────────────
    portableTextField("body_en", "Article Body (English)"),
    portableTextField("body_bm", "Article Body (Bahasa Malaysia)"),
  ],

  // Studio document preview
  preview: {
    select: {
      title: "title_en",
      subtitle: "title_bm",
      media: "image_en",
    },
    prepare({ title, subtitle, media }) {
      return {
        title:    title || "Untitled",
        subtitle: subtitle || "",
        media,
      };
    },
  },
});

export const schemaTypes = [
  categorySchema,
  resourceSchema,
  youtubeEmbed,
  dividerBlock,
  calloutBlock,
  fileDownloadBlock,
  rawHtmlBlock,
];
