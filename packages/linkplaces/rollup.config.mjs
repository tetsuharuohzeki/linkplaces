/* eslint-env node */

import alias from '@rollup/plugin-alias';
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';

import babelConfig from './babel.config.mjs';

import {
    GIT_REVISION,
    BUILD_DATE,
    RELEASE_CHANNEL,
    LIB_NODE_ENV,
    IS_PRODUCTION_MODE,
    ENABLE_REACT_PROFILER,
    ENABLE_MV3,
    USE_EVENT_PAGE_WORKAROUND,
} from './tools/buildconfig.js';

console.log(`
=========== rollup configuration vars ============
GIT_REVISION: ${GIT_REVISION}
BUILD_DATE: ${BUILD_DATE}
RELEASE_CHANNEL: ${RELEASE_CHANNEL}
LIB_NODE_ENV: ${LIB_NODE_ENV}
IS_PRODUCTION_MODE: ${IS_PRODUCTION_MODE}
ENABLE_REACT_PROFILER: ${ENABLE_REACT_PROFILER}
ENABLE_MV3: ${ENABLE_MV3}
USE_EVENT_PAGE_WORKAROUND: ${USE_EVENT_PAGE_WORKAROUND}
======================================
`);

/** @typedef {import('@rollup/plugin-alias').Alias} RollupAlias */

/** @type {Array<RollupAlias>} */
const PKG_ALIAS_ENTIRIES = [];
if (ENABLE_REACT_PROFILER) {
    // See https://fb.me/react-profiling
    PKG_ALIAS_ENTIRIES.push({
        find: /^react-dom$/u,
        replacement: 'react-dom/profiling',
    });
}

const REACT_RELATED_PKG_LIST = [
    /node_modules\/react\/.*/u,
    /node_modules\/object-assign\/.*/u,
    /node_modules\/react-dom\/.*/u,
    /node_modules\/scheduler\/.*/u,
];

class RollupWarningAsError extends Error {
    constructor(warning) {
        super(warning.message, {
            cause: warning,
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
            interop: 'esModule',

            sourcemap: true,
            globals: {},

            inlineDynamicImports: false,
        },

        external: [],

        perf: false,

        shimMissingExports: false,

        plugins: [
            // https://github.com/rollup/plugins/tree/master/packages/alias
            alias({
                entries: PKG_ALIAS_ENTIRIES,
            }),

            // https://github.com/rollup/plugins/tree/master/packages/node-resolve
            nodeResolve({
                exportConditions: ['default', 'module', 'import'],

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
                exclude: ['node_modules/**'],
                delimiters: ['', ''],
                preventAssignment: true,
                values: {
                    '__COMPILE_TIME_EMBEDDED_CONSTANTS__.GIT_REVISION': JSON.stringify(GIT_REVISION),
                    '__COMPILE_TIME_EMBEDDED_CONSTANTS__.BUILD_DATE': JSON.stringify(BUILD_DATE),
                    '__COMPILE_TIME_EMBEDDED_CONSTANTS__.RELEASE_CHANNEL': JSON.stringify(RELEASE_CHANNEL),
                    '__COMPILE_TIME_EMBEDDED_CONSTANTS__.ENABLE_MV3': JSON.stringify(ENABLE_MV3),
                    '__COMPILE_TIME_EMBEDDED_CONSTANTS__.USE_EVENT_PAGE_WORKAROUND':
                        JSON.stringify(USE_EVENT_PAGE_WORKAROUND),
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

            // https://github.com/rollup/plugins/tree/master/packages/babel
            babel({
                ...babelConfig,
                babelHelpers: 'bundled',
                extensions: ['.jsx'],
            }),
        ],

        onwarn(warning) {
            const e = new RollupWarningAsError(warning);
            throw e;
        },
    };
}
