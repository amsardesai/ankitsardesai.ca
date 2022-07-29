
module.exports = {
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    },
  },
  "env": {
    "browser": true,
    "mocha": true,
    "node": true
  },
  "extends": "eslint:recommended",
  "globals": {
    "IS_SERVER": true,
    "IS_CLIENT": true
  },
  "rules": {
    "no-inner-declarations": 0,
  }
}
