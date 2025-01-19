import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import prettierPlugin from "eslint-plugin-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,ts}"],
    languageOptions: { globals: globals.browser },
    plugins: {
      prettier: prettierPlugin,
    },
    extends: [
      pluginJs.configs.recommended,
      ...tseslint.configs.recommended,
      "plugin:prettier/recommended",
    ],
    rules: {
      "prettier/prettier": "error",
    },
  },
];