import agent from "eslint-config-agent";
import dddPlugin from "./src/index.js";

export default [
  ...agent,
  {
    ignores: ["dist/**", "node_modules/**", "coverage/**"],
  },
  {
    plugins: {
      ddd: dddPlugin,
    },
    rules: {
      "ddd/require-spec-file": [
        "error",
        {
          excludePatterns: [
            "**/*.spec.js",
            "**/*.spec.ts",
            "**/*.test.js",
            "**/*.test.ts",
            "**/*.config.js",
            "**/*.config.ts",
            "**/index.js",
            "**/index.ts",
            "/examples/",
            ".release-it.js",
          ],
        },
      ],
    },
  },
];
