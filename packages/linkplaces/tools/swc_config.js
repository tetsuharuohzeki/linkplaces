import { IS_DEVELOPMENT_MODE } from './buildconfig.js';
import { getReactCompilerConfig } from './react_compiler_config.js';

const reactCompilerConfig = getReactCompilerConfig();

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
                development: IS_DEVELOPMENT_MODE,
            },
            reactCompiler: reactCompilerConfig,
        },
    },
};
