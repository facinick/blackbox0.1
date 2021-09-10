module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
    },
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 12,
    },
    plugins: ['@typescript-eslint', 'prettier'],
    rules: {
        'prettier/prettier': [
            'error',
            {
                semi: true,
                trailingComma: 'all',
                singleQuote: true,
                printWidth: 120,
                tabWidth: 4,
                proseWrap: 'always',
                arrowParens: 'avoid',
                bracketSpacing: true,
                endOfLine: 'lf',
                jsxBracketSameLine: false,
            },
            {
                usePrettierrc: true,
            },
        ],
        'arrow-body-style': 'off',
        'prefer-arrow-callback': 'off',
        '@typescript-eslint/no-explicit-any': ['off'],
        '@typescript-eslint/explicit-module-boundary-types': ['off'],
        '@typescript-eslint/no-unused-vars': [
            2,
            { vars: 'all', args: 'after-used', ignoreRestSiblings: false, varsIgnorePattern: '^_' },
        ],
    },
};
