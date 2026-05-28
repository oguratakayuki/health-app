import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: [
      "src/backend/**/Repository/**/*.spec.ts",
      "src/backend/**/repositories/**/__tests__/**/*.spec.ts",
      "src/backend/**/services/**/__tests__/**/*.spec.ts",
      "src/backend/domain/entities/__tests__/**/*.spec.ts",
      "src/backend/application/services/calculators/__tests__/**/*.spec.ts",
      "src/backend/infrastructure/graphql/__tests__/**/*.spec.ts",
      "src/backend/presentation/resolvers/__tests__/**/*.spec.ts",
    ],
    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: {
    alias: {
      "@backend": path.resolve(__dirname, "src/backend"),
      "@frontend": path.resolve(__dirname, "src/frontend"),
      "@": path.resolve(__dirname, "src"),
    },
  },
});
