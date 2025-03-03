import { join } from "path";

export const config = {
  upload: {
    // Base directory untuk upload files
    baseDir: join(process.cwd(), "public"),

    // Subfolder untuk logo
    imageDir: join(process.cwd(), "public", "image"),

    // URL base path untuk mengakses file
    baseUrl: "/public",

    // Allowed file types
    allowedTypes: ["image/jpeg", "image/png"],

    // Max file size (2MB)
    maxSize: 2 * 1024 * 1024,
  },
};
