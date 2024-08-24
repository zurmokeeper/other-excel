module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb-base',
  ],
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    // 自定义规则
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'linebreak-style': 'off',
    'max-len': ['error', {
      code: 200,
      ignoreUrls: true, // 忽略 URL 行
      ignoreComments: true, // 忽略注释行
      ignoreStrings: false, // 不忽略字符串字面量
      ignoreTemplateLiterals: false, // 不忽略模板字面量
      ignoreRegExpLiterals: true, // 忽略正则表达式字面量
    }],
    'operator-assignment': 'off',
    'import/extensions': 'off',
    'object-shorthand': 'off',
    'import/no-unresolved': 'off',
    'no-param-reassign': 'off',
    'import/prefer-default-export': 'off',
    'no-bitwise': 'off',
    'no-plusplus': 'off',
    'no-continue': 'off',
    'prefer-destructuring': 'off',
    'no-restricted-syntax': 'off',
    'lines-between-class-members': 'off',
    'no-tabs': ['error', {
      'allowIndentationTabs': true 
    }],
    // "semi": ["error", "always"],
    // "space-before-blocks": ["error", "always"],
    // "object-curly-spacing": ["error", "always"],
  },
};
