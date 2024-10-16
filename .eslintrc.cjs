module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/jsx-runtime',
    'plugin:prettier/recommended', // last
  ],
  overrides: [
    {
      files: ['**/src/ui/*.tsx'],
      rules: {
        'react/prop-types': [2, { ignore: ['className'] }],
        // 'react-refresh/only-export-components': 'off',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
  },
  ignorePatterns: ['!.prettierrc.cjs'],
}
