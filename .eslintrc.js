module.exports = {
  env: {
    es6: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  plugins: ['import', 'variables'],
  rules: {
    'array-bracket-newline': [2, 'consistent'],
    'array-bracket-spacing': 2,
    'arrow-parens': 2,
    'arrow-spacing': 2,
    'block-scoped-var': 2,
    'block-spacing': 2,
    'brace-style': [2, '1tbs', { allowSingleLine: true }],
    'callback-return': 2,
    'comma-dangle': [2, 'never'],
    'comma-spacing': 2,
    'comma-style': 2,
    'computed-property-spacing': 2,
    'consistent-this': [2, 'self'],
    'constructor-super': 2,
    curly: 2,
    'dot-location': [2, 'property'],
    'dot-notation': 2,
    'eol-last': 2,
    eqeqeq: [2, 'allow-null'],
    'func-call-spacing': 2,
    'guard-for-in': 2,
    'implicit-arrow-linebreak': [2, 'beside'],
    'import/newline-after-import': 2,
    'import/no-useless-path-segments': 2,
    'import/order': [2, {
    'newlines-between': 'always',
    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index']
    }],
    indent: [2, 2, { SwitchCase: 1 }],
    'key-spacing': [2, { beforeColon: false, afterColon: true }],
    'keyword-spacing': [2, { before: true, after: true }],
    'linebreak-style': 2,
    'max-len': [2, {
        code: 140,
        ignoreComments: true,
        ignoreStrings: true,
        ignoreUrls: true,
        ignoreTemplateLiterals: true
      }],
    'newline-per-chained-call': [2, { ignoreChainWithDepth: 4 }],
    'new-parens': 2,
    'no-alert': 2,
    'no-array-constructor': 2,
    'no-async-promise-executor': 2,
    'no-caller': 2,
    'no-class-assign': 2,
    'no-console': 2,
    'no-const-assign': 2,
    'no-constant-condition': 2,
    'no-debugger': 2,
    'no-delete-var': 2,
    'no-dupe-args': 2,
    'no-dupe-class-members': 2,
    'no-dupe-keys': 2,
    'no-duplicate-case': 2,
    'no-duplicate-imports': 2,
    'no-else-return': 2,
    'no-empty': 2,
    'no-eval': 2,
    'no-ex-assign': 2,
    'no-extend-native': 2,
    'no-extra-bind': 2,
    'no-extra-boolean-cast': 2,
    'no-extra-parens': [2, 'functions'],
    'no-extra-semi': 2,
    'no-fallthrough': 2,
    'no-floating-decimal': 2,
    'no-func-assign': 2,
    'no-implicit-coercion': [2, { boolean: false }],
    'no-implied-eval': 2,
    'no-inner-declarations': 2,
    'no-invalid-regexp': 2,
    'no-irregular-whitespace': 2,
    'no-label-var': 2,
    'no-lone-blocks': 2,
    'no-lonely-if': 2,
    'no-loop-func': 2,
    'no-mixed-spaces-and-tabs': 2,
    'no-multi-spaces': [2, { ignoreEOLComments: true }],
    'no-multi-str': 2,
    'no-multiple-empty-lines': [2, { max: 1 }],
    'no-native-reassign': 2,
    'no-negated-in-lhs': 2,
    'no-nested-ternary': 2,
    'no-new-func': 2,
    'no-new-object': 2,
    'no-new-wrappers': 2,
    'no-obj-calls': 2,
    'no-octal-escape': 2,
    'no-octal': 2,
    'no-path-concat': 2,
    'no-proto': 2,
    'no-redeclare': 2,
    'no-regex-spaces': 2,
    'no-return-assign': 2,
    'no-return-await': 2,
    'no-script-url': 2,
    'no-self-compare': 2,
    'no-sequences': 2,
    'no-shadow-restricted-names': 2,
    //'no-shadow': 2,
    'no-spaced-func': 2,
    'no-sparse-arrays': 2,
    'no-this-before-super': 2,
    //'no-throw-literal': 2,
    'no-trailing-spaces': 2,
    'no-undef-init': 2,
    'no-undef': 2,
    'no-unexpected-multiline': 2,
    'no-unneeded-ternary': 2,
    'no-unreachable': 2,
    'no-unsafe-finally': 2,
    'no-unsafe-negation': 2,
    'no-unused-vars': [2, { vars: 'all', args: 'none', ignoreRestSiblings: true }],
    'no-useless-call': 2,
    'no-useless-computed-key': 2,
    'no-useless-concat': 2,
    'no-useless-rename': 2,
    'no-useless-return': 2,
    'no-var': 2,
    'no-void': 2,
    'no-whitespace-before-property': 2,
    'no-with': 2,
    'nonblock-statement-body-position': 2,
    'object-curly-spacing': [2, 'always'],
    'object-shorthand': [2, 'always'],
    'one-var': [2, 'never'],
    'operator-linebreak': [2, 'after', { overrides: { '?': 'after' } }],
    'prefer-const': 2,
    'prefer-promise-reject-errors': 2,
    'prefer-spread': 2,
    'quote-props': [2, 'as-needed'],
    quotes: [2, 'single', { allowTemplateLiterals: true }],
    radix: 2,
    'require-await': 2,
    'rest-spread-spacing': 2,
    'semi-spacing': 2,
    'semi-style': [2, 'last'],
    semi: 2,
    'space-before-blocks': 2,
    'space-before-function-paren': [2, { named: 'never' }],
    'space-in-parens': 2,
    'space-infix-ops': 2,
    'space-unary-ops': 2,
    'spaced-comment': 2,
    strict: 0,
    'template-curly-spacing': 2,
    'use-isnan': 2,
    'valid-typeof': 2,
    'variables/only-ascii-variables': 2,
    'wrap-iife': [2, 'any'],
    yoda: 2
  }
};
