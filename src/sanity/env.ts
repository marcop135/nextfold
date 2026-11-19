export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = "2026-11-17";
export const studioUrl = "/studio";

export const isSanityConfigured = projectId.length > 0;
