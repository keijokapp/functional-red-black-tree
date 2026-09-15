import base from '@arbendium/eslint-config-base'

export default [
  ...base,
  {
    rules: {
      'getter-return': 'off',
      'no-multi-assign': 'off',
      'no-underscore-dangle': 'off',
      'stylistic/array-bracket-newline': ['error', 'consistent'],
      'stylistic/indent': ['error', 2],
      'stylistic/multiline-ternary': ['error', 'always-multiline'],
      'stylistic/semi': ['error', 'never'],
    },
  },
  {
    files: ['bench/*.js', 'test/*.js'],
    rules: {
      'no-console': 'off',
    },
  },
]
