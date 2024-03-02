/** @type {import('@swc/core').Options} */
export const swcOptions = {
    jsc: {
        parser: {
            syntax: 'ecmascript',
            jsx: true,
        },
        target: 'es2022',
        transform: {
            react: {
                runtime: 'automatic',
            },
        },
    },
};
