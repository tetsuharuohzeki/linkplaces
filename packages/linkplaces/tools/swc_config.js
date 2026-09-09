import { IS_DEVELOPMENT_MODE } from './buildconfig.js';

/** @type {import('@swc/core').ReactCompilerOptions} */
const reactCompilerConfig = {
    // See https://react.dev/reference/react-compiler/compilationMode
    compilationMode: 'infer',

    // We cannot know the difference of severity between `critical_errors` and `all_errors` from the document.
    // Conservertively, we choose `all_errors`
    // https://react.dev/reference/react-compiler/panicThreshold
    panicThreshold: 'all_errors',

    // https://swc.rs/docs/configuration/react-compiler#outputmode
    outputMode: 'client',

    // https://swc.rs/docs/configuration/react-compiler#isdev
    isDev: IS_DEVELOPMENT_MODE,
};

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
