/* eslint-env node */

'use strict';

const importPlugin = require('postcss-import');

const {
    RELEASE_CHANNEL,
    ENABLE_SOURCE_MAP,
} = require('./tools/buildconfig.cjs');


// XXX: for debugging information
console.log(`
########### postcss configuration #################
process.env.RELEASE_CHANNEL: ${RELEASE_CHANNEL}
ENABLE_SOURCE_MAP: ${ENABLE_SOURCE_MAP}
############################
`);

// https://github.com/michael-ciniawsky/postcss-load-config
module.exports = function (_ctx) {
    return {
        'map': ENABLE_SOURCE_MAP ? { 'inline': false } : false,

        'plugins': [
            importPlugin({
                root: process.cwd(),
                path: [], // we'd like to enforce to use a relative path.
                skipDuplicates: true,
            }),
        ],
    };
};
