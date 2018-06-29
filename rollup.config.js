/* eslint-env commonjs, node */
'use strict';

const MaybeMod = require('option-t/cjs/Maybe');

const babel = require('rollup-plugin-babel');
const nodeResolve = require('rollup-plugin-node-resolve');
const replace = require('rollup-plugin-replace');

const {
    replaceImportWithGlobal,
    createDefaultExport,
    createNamedExport,
    createModule,
} = require('./tools/rollup/replace_import_with_global');

const GIT_REVISION = MaybeMod.mapOr(process.env.GIT_REVISION, 'unknown', String);
const BUILD_DATE = MaybeMod.mapOr(process.env.BUILD_DATE, 'unknown', String);
const USE_WEB_COMPONENT = MaybeMod.mapOr(process.env.USE_WEB_COMPONENT, 'false', String);

const RELEASE_CHANNEL = MaybeMod.mapOr(process.env.RELEASE_CHANNEL, 'production', String);
const LIB_NODE_ENV = (RELEASE_CHANNEL === 'production') ? 'production' : 'development';
const IS_PRODUCTION_MODE = (RELEASE_CHANNEL === 'production');

console.log(`
=========== rollup configuration vars ============
GIT_REVISION: ${GIT_REVISION}
BUILD_DATE: ${BUILD_DATE}
RELEASE_CHANNEL: ${RELEASE_CHANNEL}
LIB_NODE_ENV: ${LIB_NODE_ENV}
IS_PRODUCTION_MODE: ${IS_PRODUCTION_MODE}
USE_WEB_COMPONENT: ${USE_WEB_COMPONENT}
======================================
`);

const RXJS_NAMESPCACE_OBJ_NAME = 'window.rxjs';
const RXJS_OPERATOR_NAMESPCACE_OBJ_NAME = `${RXJS_NAMESPCACE_OBJ_NAME}.operators`;

// https://github.com/rollup/rollup/wiki/JavaScript-API
// https://github.com/rollup/rollup/wiki/Command-Line-Interface
module.exports = async function (_commandLineArgs) {

    return {
        treeshake: true,

        output: {
            strict: true,
            format: 'esm',
            exports: 'none',

            sourcemap: true,
            globals: {
            },
        },

        external: [
        ],

        perf: false,

        inlineDynamicImports: true,
        shimMissingExports: false,

        plugins: [
            replaceImportWithGlobal({
                'react': createDefaultExport('window.React'),
                'react-dom': createDefaultExport('window.ReactDOM'),
                'prop-types': createDefaultExport('window.PropTypes'),
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
                ]),
                'rxjs/operators': createModule([
                    createNamedExport('filter', RXJS_OPERATOR_NAMESPCACE_OBJ_NAME),
                    createNamedExport('map', RXJS_OPERATOR_NAMESPCACE_OBJ_NAME),
                    createNamedExport('share', RXJS_OPERATOR_NAMESPCACE_OBJ_NAME),
                    createNamedExport('startWith', RXJS_OPERATOR_NAMESPCACE_OBJ_NAME),
                    createNamedExport('debounceTime', RXJS_OPERATOR_NAMESPCACE_OBJ_NAME),
                ]),
            }),

            // https://github.com/rollup/rollup-plugin-node-resolve
            nodeResolve({
                module: true,
                main: true,
                jsnext: true,
                browser: true, // for browser
                preferBuiltins: false, // linking for browser

                // rollup does not have 'extensions' option,
                // so we need to specify this option at here to import jsx file.
                extensions: ['.mjs', '.js', '.jsx'],
            }),

            // https://github.com/rollup/rollup-plugin-replace
            replace({
                exclude: [
                    'node_modules/**',
                ],
                delimiters: ['', ''],
                values: {
                    'process.env.GIT_REVISION': JSON.stringify(GIT_REVISION),
                    'process.env.BUILD_DATE': JSON.stringify(BUILD_DATE),
                    'process.env.RELEASE_CHANNEL': JSON.stringify(RELEASE_CHANNEL),
                    'process.env.USE_WEB_COMPONENT': JSON.stringify(USE_WEB_COMPONENT),
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

            // https://github.com/rollup/rollup-plugin-babel
            babel({
                exclude: 'node_modules/**',
                externalHelpers: false,
                babelrc: false,
                presets: [
                    ['@babel/preset-react', {
                        // https://github.com/babel/babel/tree/master/packages/babel-preset-react#options
                        development: !IS_PRODUCTION_MODE,
                    }],
                ],
                plugins: [
                    '@babel/plugin-syntax-dynamic-import',
                    '@babel/plugin-syntax-async-generators',
                ],
            }),
        ],
    };
};
