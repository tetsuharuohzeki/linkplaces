import { IS_DEVELOPMENT_MODE, ENABLE_REACT_COMPILER } from './buildconfig.js';

/** @type {import('@swc/core').ReactCompilerOptions} */
const reactCompilerConfig = !ENABLE_REACT_COMPILER
    ? undefined
    : {
          // See https://react.dev/reference/react-compiler/compilationMode
          compilationMode: 'infer',

          // We cannot know the difference of severity between `critical_errors` and `all_errors` from the document.
          // Conservertively, we choose `all_errors`
          // https://react.dev/reference/react-compiler/panicThreshold
          panicThreshold: 'all_errors',

          // https://swc.rs/docs/configuration/react-compiler#outputmode
          outputMode: 'client',

          // This option is defined in the react compiler
          // but not used in anywhere in https://github.com/react/react/tree/e92bda78750136493cb324e98df1726f62ba8e92
          // isDev
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
