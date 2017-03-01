module.exports = {
  root: true,
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true
  },
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  rules: {
    "space-before-function-paren": ["error", {
      "anonymous": "always",
      "named": "never",
      "asyncArrow": "always"
    }],
    "one-var": ["error", "always"],
    "indent": ["error", 2, { "VariableDeclarator": { "var": 2, "let": 2, "const": 3 } }]
  },
  globals: {}
}
