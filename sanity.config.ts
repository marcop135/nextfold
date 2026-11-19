"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId, studioUrl } from "./src/sanity/env";
import { resolve } from "./src/sanity/presentation";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { documentActions, newDocumentOptions, structure } from "./src/sanity/structure";

export default defineConfig({
  basePath: studioUrl,
  projectId,
  dataset,
  title: "Next Fold",
  schema: { types: schemaTypes },
  document: {
    newDocumentOptions,
    actions: (prev, { schemaType }) => documentActions(prev, schemaType),
  },
  plugins: [
    structureTool({ structure }),
    presentationTool({ resolve, previewUrl: { previewMode: { enable: "/api/draft-mode/enable" } } }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
