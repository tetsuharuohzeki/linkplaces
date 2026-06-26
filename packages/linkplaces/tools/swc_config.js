import { IS_PRODUCTION_MODE } from './buildconfig.js';

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
                development: !IS_PRODUCTION_MODE,
            },
        },
    },
};
