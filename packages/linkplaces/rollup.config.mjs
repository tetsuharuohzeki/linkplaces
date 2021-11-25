/* eslint-env node */

import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';

import {
    GIT_REVISION,
    BUILD_DATE,
    RELEASE_CHANNEL,
    LIB_NODE_ENV,
    IS_PRODUCTION_MODE,
} from './tools/buildconfig.js';

console.log(`
=========== rollup configuration vars ============
GIT_REVISION: ${GIT_REVISION}
BUILD_DATE: ${BUILD_DATE}
RELEASE_CHANNEL: ${RELEASE_CHANNEL}
LIB_NODE_ENV: ${LIB_NODE_ENV}
IS_PRODUCTION_MODE: ${IS_PRODUCTION_MODE}
======================================
`);

const REACT_RELATED_PKG_LIST = [
    /node_modules\/react\/.*/u,
    /node_modules\/object-assign\/.*/u,
    /node_modules\/react-dom\/.*/u,
    /node_modules\/scheduler\/.*/u,
];

class RollupWarningAsError extends Error {
    constructor(warning) {
        super(warning.message, {
            cause: warning
        });
    }
}

/**
 *  See:
 *      - https://github.com/rollup/rollup/wiki/JavaScript-API
 *      - https://github.com/rollup/rollup/wiki/Command-Line-Interface
 *
 *  @return {import('rollup').RollupOptions}
 */
// eslint-disable-next-line import/no-default-export
export default async function createConfiguration(_commandLineArgs) {

    return {
        strictDeprecations: true,

        treeshake: true,

        output: {
            strict: true,
            format: 'esm',
            exports: 'none',
            freeze: true,
            generatedCode: {
                preset: 'es2015',
            },

            sourcemap: true,
            globals: {
            },

            inlineDynamicImports: false,
        },

        external: [
        ],

        perf: false,

        shimMissingExports: false,

        plugins: [
            // https://github.com/rollup/plugins/tree/master/packages/node-resolve
            nodeResolve({
                mainFields: [],

                browser: true, // for browser
                preferBuiltins: false, // linking for browser

                // rollup does not have 'extensions' option,
                // so we need to specify this option at here to import jsx file.
                extensions: ['.mjs', '.js', '.jsx'],
            }),

            // https://github.com/rollup/plugins/tree/master/packages/commonjs
            commonjs({
                include: REACT_RELATED_PKG_LIST,
            }),

            // https://github.com/rollup/plugins/tree/master/packages/replace
            replace({
                exclude: [
                    'node_modules/**',
                ],
                delimiters: ['', ''],
                preventAssignment: true,
                values: {
                    '__COMPILE_TIME_EMBEDDED_CONSTANTS__.GIT_REVISION': JSON.stringify(GIT_REVISION),
                    '__COMPILE_TIME_EMBEDDED_CONSTANTS__.BUILD_DATE': JSON.stringify(BUILD_DATE),
                    '__COMPILE_TIME_EMBEDDED_CONSTANTS__.RELEASE_CHANNEL': JSON.stringify(RELEASE_CHANNEL),
                },
            }),
            replace({
                include: REACT_RELATED_PKG_LIST,
                delimiters: ['', ''],
                preventAssignment: true,
                values: {
                    'process.env.NODE_ENV': JSON.stringify(LIB_NODE_ENV),
                },
            }),
        ],

        onwarn(warning) {
            const e = new RollupWarningAsError(warning);
            throw e;
        },
    };
}
