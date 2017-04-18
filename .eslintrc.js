module.exports = {
  root: true,
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    "sourceType": "module"
  },
  extends: 'vue',
  rules: {
    "one-var": ["error", {
      var: "always",
      let: "never",
      const: "never"
    }],
    "indent": ["error", 2, {
      "VariableDeclarator": {
        "var": 2,
        "let": 2,
        "const": 3
      }
    }]
  }
}
