/* eslint-env node */

import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';

import buildconfigMod from './tools/buildconfig.js';
import {
    replaceImportWithGlobal,
    createNamedExport,
    createModule,
} from './tools/rollup/replace_import_with_global.mjs';

const {
    GIT_REVISION,
    BUILD_DATE,
    RELEASE_CHANNEL,
    LIB_NODE_ENV,
    IS_PRODUCTION_MODE,
    USE_REACT_CONCURRENT_MODE,
    USE_REDUX_SIDEBAR_BACKEND,
} = buildconfigMod;

console.log(`
=========== rollup configuration vars ============
GIT_REVISION: ${GIT_REVISION}
BUILD_DATE: ${BUILD_DATE}
RELEASE_CHANNEL: ${RELEASE_CHANNEL}
LIB_NODE_ENV: ${LIB_NODE_ENV}
IS_PRODUCTION_MODE: ${IS_PRODUCTION_MODE}
USE_REACT_CONCURRENT_MODE: ${USE_REACT_CONCURRENT_MODE}
USE_REDUX_SIDEBAR_BACKEND: ${USE_REDUX_SIDEBAR_BACKEND}
======================================
`);

const RXJS_NAMESPCACE_OBJ_NAME = 'window.rxjs';
const RXJS_OPERATOR_NAMESPCACE_OBJ_NAME = `${RXJS_NAMESPCACE_OBJ_NAME}.operators`;

const REACT_RELATED_PKG_LIST = [
    'node_modules/react/**',
    'node_modules/object-assign/**',
    'node_modules/react-dom/**',
    'node_modules/scheduler/**',
];

// https://github.com/rollup/rollup/wiki/JavaScript-API
// https://github.com/rollup/rollup/wiki/Command-Line-Interface
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
            preferConst: true,

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
            replaceImportWithGlobal({
                // 'redux-thunk': createDefaultExport('window.ReduxThunk.default'),

                // I know these are pretty messy approach.
                // But rxjs does not support properly TypeScript+rollup
                'rxjs': createModule([
                    createNamedExport('BehaviorSubject', RXJS_NAMESPCACE_OBJ_NAME),
                    createNamedExport('Observable', RXJS_NAMESPCACE_OBJ_NAME),
                    createNamedExport('merge', RXJS_NAMESPCACE_OBJ_NAME),
                    createNamedExport('Subject', RXJS_NAMESPCACE_OBJ_NAME),
                    createNamedExport('Subscription', RXJS_NAMESPCACE_OBJ_NAME),
                    createNamedExport('animationFrameScheduler', RXJS_NAMESPCACE_OBJ_NAME),
                    createNamedExport('asyncScheduler', RXJS_NAMESPCACE_OBJ_NAME),
                    createNamedExport('fromEvent', RXJS_NAMESPCACE_OBJ_NAME),
                ]),
                'rxjs/operators': createModule([
                    createNamedExport('filter', RXJS_OPERATOR_NAMESPCACE_OBJ_NAME),
                    createNamedExport('map', RXJS_OPERATOR_NAMESPCACE_OBJ_NAME),
                    createNamedExport('share', RXJS_OPERATOR_NAMESPCACE_OBJ_NAME),
                    createNamedExport('startWith', RXJS_OPERATOR_NAMESPCACE_OBJ_NAME),
                    createNamedExport('debounceTime', RXJS_OPERATOR_NAMESPCACE_OBJ_NAME),
                    createNamedExport('subscribeOn', RXJS_OPERATOR_NAMESPCACE_OBJ_NAME),
                ]),
            }),

            // https://github.com/rollup/plugins/tree/master/packages/node-resolve
            nodeResolve({
                mainFields: ['module', 'main'],

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
                values: {
                    'process.env.GIT_REVISION': JSON.stringify(GIT_REVISION),
                    'process.env.BUILD_DATE': JSON.stringify(BUILD_DATE),
                    'process.env.RELEASE_CHANNEL': JSON.stringify(RELEASE_CHANNEL),
                    'process.env.USE_REACT_CONCURRENT_MODE': JSON.stringify(USE_REACT_CONCURRENT_MODE),
                    'process.env.USE_REDUX_SIDEBAR_BACKEND': JSON.stringify(USE_REDUX_SIDEBAR_BACKEND),
                },
            }),
            replace({
                include: [
                    '**/redux/es/redux.js',
                ],
                delimiters: ['', ''],
                values: {
                    'process.env.NODE_ENV': JSON.stringify(LIB_NODE_ENV),
                },
            }),
            replace({
                include: REACT_RELATED_PKG_LIST,
                delimiters: ['', ''],
                values: {
                    'process.env.NODE_ENV': JSON.stringify(LIB_NODE_ENV),
                },
            }),
        ],
    };
}
