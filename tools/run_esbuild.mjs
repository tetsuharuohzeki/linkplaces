import assert from 'assert';
import ESBuildMod from 'esbuild';

import buildconfigMod from './buildconfig.js';

const {
    GIT_REVISION,
    BUILD_DATE,
    RELEASE_CHANNEL,
    LIB_NODE_ENV,
    IS_PRODUCTION_MODE,
    USE_REACT_CONCURRENT_MODE,
} = buildconfigMod;


console.log(`
=========== rollup configuration vars ============
GIT_REVISION: ${GIT_REVISION}
BUILD_DATE: ${BUILD_DATE}
RELEASE_CHANNEL: ${RELEASE_CHANNEL}
LIB_NODE_ENV: ${LIB_NODE_ENV}
IS_PRODUCTION_MODE: ${IS_PRODUCTION_MODE}
USE_REACT_CONCURRENT_MODE: ${USE_REACT_CONCURRENT_MODE}
======================================
`);


const { build } = ESBuildMod;

const ENTRY_POINT = process.env.ENTRY_POINT;
assert.ok(typeof ENTRY_POINT === 'string', `ENTRY_POINT was '${ENTRY_POINT}'`);

const OUTPUT_FILE = process.env.OUTPUT_FILE;
assert.ok(typeof OUTPUT_FILE === 'string', `OUTPUT_FILE was '${OUTPUT_FILE}'`);

build({
    entryPoints: [
        ENTRY_POINT,
    ],
    outfile: OUTPUT_FILE,

    target: 'es2020',
    platform: 'browser',

    minify: false,
    bundle: true,
    sourcemap: true,
    logLevel: 'warning',

    define: {
        'process.env.GIT_REVISION': JSON.stringify(GIT_REVISION),
        'process.env.BUILD_DATE': JSON.stringify(BUILD_DATE),
        'process.env.RELEASE_CHANNEL': JSON.stringify(RELEASE_CHANNEL),
        'process.env.USE_REACT_CONCURRENT_MODE': JSON.stringify(USE_REACT_CONCURRENT_MODE),
        'process.env.NODE_ENV': JSON.stringify(LIB_NODE_ENV),
    },
}).catch(() => {
    process.exit(1);
});
