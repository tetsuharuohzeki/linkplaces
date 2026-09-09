import { ENABLE_REACT_COMPILER } from './buildconfig.js';

/**
 * @import { ReactCompilerOptions } from '@swc/core';
 */

/**
 *  @returns    {Readonly<ReactCompilerOptions>|null}
 */
export function getReactCompilerConfig() {
    if (!ENABLE_REACT_COMPILER) {
        return null;
    }

    return {
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
}
