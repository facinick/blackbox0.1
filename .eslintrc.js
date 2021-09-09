module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
    },
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 12,
    },
    plugins: ['@typescript-eslint'],
    rules: {},
};
