const js = require("@eslint/js");

module.exports = [
  js.configs.recommended,
  {
    rules: {
      quotes: ["error", "single"],
      semi: ["error", "always"],
    },
  },
  {
    languageOptions: {
      parserOptions: {
        sourceType: "module",
      },
      globals: {
        process: true,
        __dirname: true,
        module: true,
        require: true,
        console: true,
      }
    },
  }
];
