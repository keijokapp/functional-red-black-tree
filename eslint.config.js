// eslint-disable-next-line import/no-unresolved
import tseslint from 'typescript-eslint'
import base from '@arbendium/eslint-config-base'

export default [
  ...base,
  {
    languageOptions: {
      parser: tseslint.parser,
      sourceType: 'module',
    },
    plugins: {
      typescript: tseslint.plugin,
    },
    rules: {
      'getter-return': 'off',
      'no-multi-assign': 'off',
      'no-underscore-dangle': 'off',
      'object-shorthand': ['error', 'always', { avoidExplicitReturnArrows: true }],
      'stylistic/array-bracket-newline': ['error', 'consistent'],
      'stylistic/comma-dangle': ['error', 'always-multiline'],
      'stylistic/indent': ['error', 2],
      'stylistic/member-delimiter-style': ['error', { singleline: { delimiter: 'comma' }, multiline: { delimiter: 'none' } }],
      'stylistic/multiline-ternary': ['error', 'always-multiline'],
      'stylistic/semi': ['error', 'never'],
      'typescript/ban-ts-comment': ['error', {
        'ts-check': true, 'ts-expect-error': false, 'ts-ignore': true, 'ts-nocheck': true,
      }],
      'typescript/no-empty-object-type': 'error',
      'typescript/no-extra-non-null-assertion': 'error',
      'typescript/no-extraneous-class': 'error',
      'typescript/no-invalid-void-type': 'error',
      'typescript/no-misused-new': 'error',
      'typescript/no-namespace': 'error',
      'typescript/no-non-null-asserted-nullish-coalescing': 'error',
      'typescript/no-non-null-asserted-optional-chain': 'error',
      'typescript/no-non-null-assertion': 'error',
      'typescript/no-require-imports': 'error',
      'typescript/no-this-alias': 'error',
      'typescript/no-unnecessary-type-constraint': 'error',
      'typescript/no-unsafe-declaration-merging': 'error',
      'typescript/no-unsafe-function-type': 'error',
      'no-useless-constructor': 'off',
      'typescript/no-useless-constructor': 'error',
      'typescript/no-wrapper-object-types': 'error',
      'typescript/prefer-as-const': 'error',
      'typescript/prefer-literal-enum-member': 'error',
      'typescript/prefer-namespace-keyword': 'error',
      'typescript/triple-slash-reference': 'error',
      'typescript/unified-signatures': 'error',
    },
  },
  {
    files: ['bench/*.js', 'test/*.js'],
    rules: {
      'no-console': 'off',
    },
  },
]
