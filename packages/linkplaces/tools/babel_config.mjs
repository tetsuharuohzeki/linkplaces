import { ENABLE_REACT_COMPILER } from './buildconfig.js';

/**
 *  @type   {Partial<import('babel-plugin-react-compiler').PluginOptions>}
 *  @see    https://react.dev/reference/react-compiler/configuration
 */
const REACT_COMPILER_CONFIG = {
    // See https://react.dev/reference/react-compiler/compilationMode
    compilationMode: 'infer',
    // We cannot know the difference of severity between `critical_errors` and `all_errors` from the document.
    // Conservertively, we choose `all_errors`
    // https://react.dev/reference/react-compiler/panicThreshold
    panicThreshold: 'all_errors',
    // This code is based on the following document (at 2025/Aug/25).
    // https://react.dev/reference/react-compiler/logger#detailed-error-logging
    //
    // I had thought we don't have to setup a this field because the plugin would have a default pretty logger.
    // But it was too much expectation.
    //
    // At least, babel-plugin-react-compiler _19.1.0-rc.2_ does not show any failure details on a panic.
    // As a result, we cannot know why the panic happens if we don't set this.
    //
    // Perhaps, this might be just by design that they assumes to use with the linter plugin
    // to know a panic detail when we use this with setting some panic thresholds.
    //
    // For such situation (and under the situation that CI jobs are separatedly),
    // we need to dump the details on the build process too to know more detailed diagnostics.
    logger: {
        logEvent(filename, event) {
            if (event.kind === 'CompileError') {
                console.error(`\n❌Compilation failed: ${filename}`);
                const detail = event.detail;
                console.error(`💡Reason: ${detail.reason}`);

                const description = detail.description;
                if (description) {
                    console.error(`Details: ${description}`);
                }

                const loc = detail.loc;
                if (loc) {
                    const { line, column } = loc.start;
                    console.error(`📜Location: Line ${line}, Column ${column}`);
                }

                const suggestions = detail.suggestions;
                if (suggestions) {
                    console.error('🔨Suggestions:', suggestions);
                }
            }
        },
    },
};

const plugins = ENABLE_REACT_COMPILER
    ? [
          // @prettier-ignore
          ['babel-plugin-react-compiler', REACT_COMPILER_CONFIG],
          // This is required to parse jsx syntax.
          // react compiler is required to place to the first.
          // So other transformer have not transformed jsx yet.
          ['@babel/plugin-syntax-jsx'],
      ]
    : [];

export const rollupConfig = {
    presets: [],
    plugins,
};
