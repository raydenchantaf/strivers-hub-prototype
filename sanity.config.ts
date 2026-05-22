import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemas/resource";

export default defineConfig({
  name: "strivers-hub",
  title: "Strivers' Hub CMS",
  basePath: "/studio", // tells the Studio where it's mounted in the app

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Resources")
              .child(S.documentTypeList("resource").title("All Resources")),
          ]),
    }),
  ],

  schema: {
    types: schemaTypes,
  },
});
