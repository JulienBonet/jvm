module.exports = {
  root: true,
  env: {
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  extends: ["eslint:recommended", "prettier"],
  rules: {
    "no-console": "off",
    "no-unused-vars": "warn",
    "prettier/prettier": "error",
  },
};


