import nextConfig from "eslint-config-next";

const base = Array.isArray(nextConfig) ? nextConfig : [nextConfig];

// Find the typescript config block (it registers the @typescript-eslint plugin).
const tsBlock = base.find(
  (c) => c && typeof c === "object" && "plugins" in c && c.plugins && "@typescript-eslint" in c.plugins,
);

if (tsBlock) {
  tsBlock.rules = {
    ...(tsBlock.rules ?? {}),
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
  };
}

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "artifacts/**",
      "public/**",
      "scripts/**",
      "vitest.config.ts",
      "next.config.ts",
    ],
  },
  ...base,
  {
    rules: {
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "off",
    },
  },
];

export default eslintConfig;
