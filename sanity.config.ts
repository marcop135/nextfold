"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { documentActions, newDocumentOptions, structure } from "./src/sanity/structure";

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  title: "Next Fold",
  schema: { types: schemaTypes },
  document: {
    newDocumentOptions,
    actions: (prev, { schemaType }) => documentActions(prev, schemaType),
  },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
});
