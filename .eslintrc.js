module.exports = {
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  rules: {
    // Prevent usage of 'any' type
    "@typescript-eslint/no-explicit-any": "error",

    // Prevent unused variables with more aggressive settings
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        vars: "all",
        args: "after-used",
        ignoreRestSiblings: false,
        argsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
      },
    ],

    // Optional: Additional strict type checking rules
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/no-unsafe-assignment": "error",
    "@typescript-eslint/no-unsafe-call": "error",
    "@typescript-eslint/no-unsafe-member-access": "error",

    // Ensure type annotations are used
    "@typescript-eslint/typedef": [
      "error",
      {
        arrowParameter: true,
        variableDeclaration: true,
      },
    ],
  },
};
