import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["tests/e2e/**/*.test.ts"],
    exclude: ["node_modules", "dist"],
    testTimeout: 60000,
    hookTimeout: 60000,
    pool: "forks",
    poolOptions: {
      forks: {
        singleFork: true, // E2E tests run sequentially
      },
    },
    reporters: ["verbose"],
    setupFiles: ["./tests/setup.ts"],
    // E2E tests may need longer timeouts
    retry: 1,
  },
  resolve: {
    alias: {
      "@": "./src",
    },
  },
});
