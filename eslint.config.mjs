import base from '@arbendium/eslint-config-base'

export default [
  ...base,
  {
    rules: {
      'block-scoped-var': 'off',
      camelcase: 'off',
      'getter-return': 'off',
      'import/no-commonjs': 'off',
      'no-multi-assign': 'off',
      'no-redeclare': 'off',
      'no-underscore-dangle': 'off',
      'no-var': 'off',
      strict: 'off',
      'stylistic/array-bracket-newline': ['error', 'consistent'],
      'stylistic/indent': ['error', 2],
      'stylistic/multiline-ternary': ['error', 'always-multiline'],
      'stylistic/semi': ['error', 'never'],
      'vars-on-top': 'off',
    },
  },
  {
    files: ['bench/*.js', 'test/*.js'],
    rules: {
      'no-console': 'off',
    },
  },
]
