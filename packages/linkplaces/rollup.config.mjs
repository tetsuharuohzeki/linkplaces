/* eslint-env node */

import alias from '@rollup/plugin-alias';
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import { default as swc } from '@rollup/plugin-swc';

import { rollupConfig as babelConfig } from './tools/babel_config.mjs';
import {
    GIT_REVISION,
    BUILD_DATE,
    RELEASE_CHANNEL,
    NODE_ENV,
    LIB_NODE_ENV,
    LIB_NODE_ENV_IS_NOT_PRODUCTION,
    IS_PRODUCTION_MODE,
    ENABLE_SWC_REACT_TRANSFORM,
    ENABLE_REACT_PROFILER,
    ENABLE_REACT_COMPILER,
} from './tools/buildconfig.js';
import { swcOptions } from './tools/swc_config.js';

console.log(`
=========== rollup configuration vars ============
GIT_REVISION: ${GIT_REVISION}
BUILD_DATE: ${BUILD_DATE}
RELEASE_CHANNEL: ${RELEASE_CHANNEL}
NODE_ENV: ${NODE_ENV}
LIB_NODE_ENV: ${LIB_NODE_ENV}
LIB_NODE_ENV_IS_NOT_PRODUCTION: ${LIB_NODE_ENV_IS_NOT_PRODUCTION}
IS_PRODUCTION_MODE: ${IS_PRODUCTION_MODE}
ENABLE_SWC_REACT_TRANSFORM: ${ENABLE_SWC_REACT_TRANSFORM}
ENABLE_REACT_PROFILER: ${ENABLE_REACT_PROFILER}
ENABLE_REACT_COMPILER: ${ENABLE_REACT_COMPILER}
======================================
`);

/** @typedef {import('@rollup/plugin-alias').Alias} RollupAlias */

/** @type {Array<RollupAlias>} */
const PKG_ALIAS_ENTIRIES = [];
if (ENABLE_REACT_PROFILER) {
    // See https://fb.me/react-profiling
    PKG_ALIAS_ENTIRIES.push({
        find: 'react-dom/client',
        replacement: 'react-dom/profiling',
    });
}

const REACT_RELATED_PKG_LIST = [
    /node_modules\/react\/.*/u,
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

// This is for jsx files placed in other workspace.
// For the current workspace, we transform react jsx by babel cli offline.
const reactTransformer = ENABLE_SWC_REACT_TRANSFORM
    ? [
          // https://github.com/rollup/plugins/tree/master/packages/babel
          babel({
              ...babelConfig,
              babelHelpers: 'bundled',
              extensions: ['.jsx'],
          }),
          // https://www.npmjs.com/package/@rollup/plugin-swc#options
          swc({
              swc: swcOptions,
              include: ['**/**/*.jsx'],
          }),
      ]
    : [
          // https://github.com/rollup/plugins/tree/master/packages/babel
          babel({
              ...babelConfig,
              babelHelpers: 'bundled',
              extensions: ['.jsx'],
          }),
      ];

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
                exportConditions: [
                    'default',
                    'import',
                    // https://github.com/rollup/plugins/pull/1823
                    LIB_NODE_ENV_IS_NOT_PRODUCTION ? 'development' : 'production',
                ],

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

            ...reactTransformer,
        ],

        onwarn(warning) {
            const e = new RollupWarningAsError(warning);
            throw e;
        },
    };
}
