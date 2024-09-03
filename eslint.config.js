import jest from "eslint-plugin-jest";
import babelParser from "babel-eslint";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends("eslint:recommended", "prettier"), {
    plugins: {
        jest,
    },

    languageOptions: {
        globals: {
            ...jest.environments.globals.globals,
            process: true,
            console: true,
            module: true,
            Promise: true,
            exports: true,
            Buffer: true,
            globalThis: true,
            fetch: true,
            URLSearchParams: true,
            URL: true,
            Response: true,
            ANONYMITY_BOT: true,
            addEventListener: true,
        },

        parser: babelParser,
    },
}];