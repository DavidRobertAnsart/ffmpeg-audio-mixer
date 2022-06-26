// eslint-disable-next-line no-undef
module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            globalReturn: true,
            generators: false,
            objectLiteralDuplicateProperties: false,
        },
        ecmaVersion: 2021,
        sourceType: 'module',
    },
    plugins: ['import', '@typescript-eslint', 'prettier'],
    extends: [
        'eslint:recommended',
        'plugin:prettier/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
    ],
    rules: {
        // misc
        'no-console': ['error', { allow: ['warn', 'error'] }],
        camelcase: ['error', { properties: 'always' }],

        // force import types
        '@typescript-eslint/consistent-type-imports': [
            'error',
            {
                prefer: 'type-imports',
                disallowTypeAnnotations: false,
            },
        ],

        // plugin:import
        'import/newline-after-import': ['error', { count: 1 }],
        'import/order': [
            'error',
            {
                groups: [
                    ['builtin', 'external', 'internal'],
                    ['parent', 'sibling', 'index'],
                ],
                'newlines-between': 'always',
                alphabetize: { order: 'asc', caseInsensitive: false },
            },
        ],

        // typescript
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/member-delimiter-style': [
            'error',
            {
                multiline: {
                    delimiter: 'semi',
                    requireLast: true,
                },
                singleline: {
                    delimiter: 'semi',
                    requireLast: false,
                },
            },
        ],
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
    settings: {
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts'],
        },
        'import/resolver': {
            node: {
                extensions: ['.js', '.ts'],
            },
            typescript: {}, // this loads <rootdir>/tsconfig.json to eslint
        },
    },
};
