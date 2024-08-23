module.exports = { 
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
      "ecmaVersion": 2020,
      "sourceType": "module"
    },
    "extends": [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended"
    ],
    "plugins": [
      "@typescript-eslint"
    ],
    "rules": {
      // 自定义规则
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "semi": ["error", "always"],
      "space-before-blocks": ["error", "always"], 
    }
};
  