import { defineField, defineType } from "sanity";

// Custom YouTube embed block for rich text
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

// Portable Text (rich text) definition — shared for EN and BM body
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
          { title: "Heading 2", value: "h2" },
          { title: "Heading 3", value: "h3" },
          { title: "Quote", value: "blockquote" },
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
      // YouTube embed block
      { type: "youtube" },
    ],
  });

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
      description: "Auto-generated from English title. Used in the article URL.",
      options: {
        source: "title_en",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    // ── Category ─────────────────────────────────────────────
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Finance", value: "finance" },
          { title: "Digital", value: "digital" },
          { title: "Marketing", value: "marketing" },
          { title: "Legal", value: "legal" },
          { title: "Mentorship", value: "mentorship" },
          { title: "Grants", value: "grants" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),

    // ── Cover image ───────────────────────────────────────────
    defineField({
      name: "image",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "Describe the image for accessibility and SEO.",
        }),
      ],
    }),

    // ── Meta ──────────────────────────────────────────────────
    defineField({
      name: "readTime",
      title: "Read Time (minutes)",
      type: "number",
      validation: (Rule) => Rule.required().min(1).max(60),
    }),
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
      validation: (Rule) => Rule.required().max(250),
    }),
    defineField({
      name: "excerpt_bm",
      title: "Excerpt (Bahasa Malaysia)",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(300),
    }),

    // ── Body (rich text) ──────────────────────────────────────
    portableTextField("body_en", "Article Body (English)"),
    portableTextField("body_bm", "Article Body (Bahasa Malaysia)"),
  ],

  // Studio document preview
  preview: {
    select: {
      title: "title_en",
      subtitle: "category",
      media: "image",
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || "Untitled",
        subtitle: subtitle
          ? subtitle.charAt(0).toUpperCase() + subtitle.slice(1)
          : "No category",
        media,
      };
    },
  },
});

export const schemaTypes = [resourceSchema, youtubeEmbed];
