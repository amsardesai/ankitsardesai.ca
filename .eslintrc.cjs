
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
  "globals": {
    "IS_SERVER": true,
    "IS_CLIENT": true
  },
  "rules": {
    "new-cap": 0,
    "react/jsx-filename-extension": 0,
    "import/prefer-default-export": 0
  }
}
