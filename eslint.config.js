import pluginVue from 'eslint-plugin-vue'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import prettier from 'eslint-plugin-prettier'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import vueEslintParser from 'vue-eslint-parser'
import tsEslintParser from '@typescript-eslint/parser'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue,js,jsx}'],
  },
  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**', 'node_modules'],
  },
  ...pluginVue.configs['flat/essential'],
  ...vueTsEslintConfig(),
  skipFormatting,
  {
    name: 'app/plugins',
    plugins: {
      vue: pluginVue,
      '@typescript-eslint': typescriptEslint,
      prettier,
    },
  },
  {
    name: 'app/parser-config-vue',
    languageOptions: {
      parser: vueEslintParser,
    },
  },
  {
    name: 'app/parser-config-ts',
    files: ['**/*.{ts,mts,tsx}'],
    languageOptions: {
      parser: tsEslintParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  {
    name: 'app/custom-rules',
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'off' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'key-spacing': [
        'error',
        {
          beforeColon: false,
          afterColon: true,
        },
      ],
      'space-in-parens': ['error', 'never'],
      'object-curly-spacing': ['error', 'always'],
      'object-curly-newline': [
        'error',
        {
          minProperties: 4,
          multiline: true,
          consistent: true,
        },
      ],
      'vue/object-curly-spacing': ['error', 'always'],
      'max-len': 'off',
      'no-multi-spaces': 'error',
      'no-return-assign': 'off',
      semi: 'off',
      eqeqeq: 'error',
      'jsx-quotes': ['off', 'prefer-single'],
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-noninteractive-element-interactions': 'off',
      'import/prefer-default-export': 'off',
      'import/extensions': 'off',
      'import/no-unresolved': 'off',
      'no-multiple-empty-lines': [
        'error',
        {
          max: 2,
          maxEOF: 1,
        },
      ],
      'no-param-reassign': 'off',
      'vue/eqeqeq': ['error', 'always'],
      'vue/html-end-tags': 'error',
      'vue/no-spaces-around-equal-signs-in-attribute': 'error',
      'vue/multi-word-component-names': 'off',
      'vue/no-template-shadow': 'error',
      'vue/require-prop-types': 'error',
      'vue/require-explicit-emits': 'error',
      'vue/mustache-interpolation-spacing': ['error', 'always'],
      'vue/no-multi-spaces': [
        'error',
        {
          ignoreProperties: false,
        },
      ],
      'vue/html-closing-bracket-newline': [
        'error',
        {
          singleline: 'never',
          multiline: 'always',
        },
      ],
      'vue/html-self-closing': 'off',
      'vue/block-lang': 'off',
      'vue/html-indent': [
        'error',
        2,
        {
          attribute: 1,
          baseIndent: 1,
          closeBracket: 0,
          alignAttributesVertically: true,
          ignores: ['VExpressionContainer'],
        },
      ],
      'vue/html-closing-bracket-spacing': [
        'error',
        {
          startTag: 'never',
          endTag: 'never',
          selfClosingTag: 'always',
        },
      ],
      'vue/max-attributes-per-line': [
        'error',
        {
          singleline: 6,
          multiline: 1,
        },
      ],
      'prettier/prettier': 'warn',
      'vue/attribute-hyphenation': 'off',
      '@typescript-eslint/no-shadow': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/indent': 'off',
    },
  },
]
