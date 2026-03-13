import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
import stylistic from "@stylistic/eslint-plugin";

export default defineConfig([
    { files: [ "**/*.js" ], languageOptions: { sourceType: "commonjs" } },
    { files: [ "**/*.{js,mjs,cjs,jsx}" ], languageOptions: { globals: {...globals.browser, ...globals.node} } },
    pluginReact.configs.flat.recommended,
    {
        plugins: {
            "@stylistic": stylistic
        },
        rules: {
            "@stylistic/indent": [ "error", 4 ],
            "@stylistic/spaced-comment": [ "error", "always" ],
            "@stylistic/no-extra-semi": "error",
            "@stylistic/array-bracket-newline": [ "error", "consistent" ],
            "@stylistic/array-bracket-spacing": [ "error", "always" ],
            "@stylistic/arrow-parens": [ "error", "always" ],
            "@stylistic/array-element-newline": [ "error", "consistent" ],
            "@stylistic/quotes": [ "error", "double" ],
            "@stylistic/no-tabs": [ "error", { "allowIndentationTabs": true } ]
        }
    }
]);
