/* eslint-env commonjs, node */
'use strict';

const MaybeMod = require('option-t/cjs/Maybe');

const babel = require('rollup-plugin-babel');
const nodeResolve = require('rollup-plugin-node-resolve');
const replace = require('rollup-plugin-replace');

const GIT_REVISION = MaybeMod.mapOr(process.env.GIT_REVISION, 'unknown', String);
const BUILD_DATE = MaybeMod.mapOr(process.env.BUILD_DATE, 'unknown', String);

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
            'react': 'React',
            'react-dom': 'ReactDOM',
            'prop-types': 'PropTypes',
            'redux': 'Redux',
            'redux-thunk': 'window.ReduxThunk.default',
            'rxjs': 'Rx',

            // I know these are pretty messy approach.
            // But rxjs does not support properly TypeScript+rollup
            'rxjs/BehaviorSubject': 'Rx',
            'rxjs/Observable': 'Rx',
            'rxjs/operators': 'Rx.operators',
            'rxjs/Subject': 'Rx',
            'rxjs/Subscription': 'Rx',
            'rxjs/scheduler/animationFrame': 'Rx.Scheduler',
        },
    },

    external: [
        'react',
        'react-dom',
        'prop-types',
        'redux',
        'redux-thunk',

        'rxjs',
        'rxjs/BehaviorSubject',
        'rxjs/operators',
        'rxjs/Observable',
        'rxjs/Observer',
        'rxjs/Subject',
        'rxjs/Subscription',
        'rxjs/scheduler/animationFrame',
    ],

    experimentalDynamicImport: true,

    plugins: [
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

        replace({
            //include: 'config.js',
            exclude: 'node_modules/**',
            delimiters: ['', ''],
            values: {
                'process.env.GIT_REVISION': JSON.stringify(GIT_REVISION),
                'process.env.BUILD_DATE': JSON.stringify(BUILD_DATE),
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
