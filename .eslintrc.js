module.exports = {
  extends: [
    'next',
    'next/core-web-vitals',
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'prettier',
  ],
  plugins: ['prettier'],
  parserOptions: {
    project: 'tsconfig.eslint.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  rules: {
    'react/jsx-props-no-spreading': 'off',
    'react/no-array-index-key': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'no-nested-ternary': 'off',
    'max-len': 'off',
    'no-useless-escape': 'off',
    'no-return-assign': 'off',
    'import/no-self-import': 'off',
    'import/no-extraneous-dependencies': 'off',
    'react/require-default-props': 'off',
    'no-plusplus': 'off',
    'no-else-return': 'off',
    'react/function-component-definition': [
      2,
      { namedComponents: ['arrow-function', 'function-declaration'] },
    ],
  },
};
