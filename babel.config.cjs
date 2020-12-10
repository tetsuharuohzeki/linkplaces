/*eslint-env commonjs*/
'use strict';

const buildconfigMod = require('./tools/buildconfig.cjs');

const {
    IS_PRODUCTION_MODE,
} = buildconfigMod;

module.exports = Object.freeze({
    presets: [
        ['@babel/preset-react', {
            // https://github.com/babel/babel/tree/master/packages/babel-preset-react#options
            development: !IS_PRODUCTION_MODE,
            useSpread: true,
            runtime: 'automatic',
        }],
    ],
    plugins: [
    ],
});
