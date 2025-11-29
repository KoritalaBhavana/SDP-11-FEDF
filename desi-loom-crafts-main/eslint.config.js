import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
      // project override: allow `any` in a few places to reduce noisy lint failures
      "@typescript-eslint/no-explicit-any": "off",
      // some utility types or configs use empty object types; allow them
      "@typescript-eslint/no-empty-object-type": "off",
      // allow require() in config files like tailwind.config.ts
      "@typescript-eslint/no-require-imports": "off",
    },
  },
);
