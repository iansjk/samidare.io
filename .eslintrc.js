module.exports = {
  extends: ["airbnb-typescript", "prettier", "prettier/@typescript-eslint"],
  parserOptions: {
    project: ["./tsconfig.json"],
  },
  ignorePatterns: [".eslintrc.js"]
};
