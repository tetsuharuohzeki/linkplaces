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
const LIB_NODE_ENV = MaybeMod.mapOr(process.env.RELEASE_CHANNEL, 'production', String);

console.log(`
=========== rollup configuration vars ============
GIT_REVISION: ${GIT_REVISION}
BUILD_DATE: ${BUILD_DATE}
LIB_NODE_ENV: ${LIB_NODE_ENV}
======================================
`);

// https://github.com/rollup/rollup/wiki/JavaScript-API
// https://github.com/rollup/rollup/wiki/Command-Line-Interface
module.exports = {
    treeshake: true,

    output: {
        strict: true,
        format: 'es',
        exports: 'none',

        sourcemap: true,
        globals: {
        },
    },

    external: [
    ],

    perf: false,

    experimentalDynamicImport: true,

    plugins: [
        replaceImportWithGlobal({
            'react': createDefaultExport('window.React'),
            'react-dom': createDefaultExport('window.ReactDOM'),
            'prop-types': createDefaultExport('window.PropTypes'),
            'redux-thunk': createDefaultExport('window.ReduxThunk.default'),

            // I know these are pretty messy approach.
            // But rxjs does not support properly TypeScript+rollup
            'rxjs/BehaviorSubject': createModule([
                createNamedExport('BehaviorSubject', 'window.Rx'),
            ]),
            'rxjs/Observable': createModule([
                createNamedExport('Observable', 'window.Rx'),
            ]),
            'rxjs/observable/merge': createModule([
                createNamedExport('merge', 'window.Rx.Observable'),
            ]),
            'rxjs/operators': createModule([
                createNamedExport('filter', 'window.Rx.operators'),
                createNamedExport('map', 'window.Rx.operators'),
                createNamedExport('share', 'window.Rx.operators'),
                createNamedExport('startWith', 'window.Rx.operators'),
                createNamedExport('observeOn', 'window.Rx.operators'),
            ]),
            'rxjs/Subject': createModule([
                createNamedExport('Subject', 'window.Rx'),
            ]),
            'rxjs/Subscription': createModule([
                createNamedExport('Subscription', 'window.Rx'),
            ]),
            'rxjs/scheduler/animationFrame': createModule([
                createNamedExport('animationFrame', 'window.Rx.Scheduler'),
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
                '@babel/preset-react',
            ],
            plugins: [
                '@babel/plugin-syntax-dynamic-import',
                '@babel/plugin-syntax-async-generators',
            ],
        }),
    ],
};
