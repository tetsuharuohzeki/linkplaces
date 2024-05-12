import * as assert from 'node:assert/strict';
import ESBuildMod from 'esbuild';

import { GIT_REVISION, BUILD_DATE, RELEASE_CHANNEL, LIB_NODE_ENV, IS_PRODUCTION_MODE } from './buildconfig.js';

console.log(`
=========== esbuild configuration vars ============
GIT_REVISION: ${GIT_REVISION}
BUILD_DATE: ${BUILD_DATE}
RELEASE_CHANNEL: ${RELEASE_CHANNEL}
LIB_NODE_ENV: ${LIB_NODE_ENV}
IS_PRODUCTION_MODE: ${IS_PRODUCTION_MODE}
======================================
`);

const { build } = ESBuildMod;

const ENTRY_POINT = process.env.ENTRY_POINT;
assert.ok(typeof ENTRY_POINT === 'string', `ENTRY_POINT was '${ENTRY_POINT}'`);

const OUTPUT_FILE = process.env.OUTPUT_FILE;
assert.ok(typeof OUTPUT_FILE === 'string', `OUTPUT_FILE was '${OUTPUT_FILE}'`);

build({
    entryPoints: [ENTRY_POINT],
    outfile: OUTPUT_FILE,

    target: 'es2020',
    platform: 'browser',
    format: 'esm',

    minify: false,
    bundle: true,
    sourcemap: true,
    logLevel: 'warning',

    define: {
        '__COMPILE_TIME_EMBEDDED_CONSTANTS__.GIT_REVISION': JSON.stringify(GIT_REVISION),
        '__COMPILE_TIME_EMBEDDED_CONSTANTS__.BUILD_DATE': JSON.stringify(BUILD_DATE),
        '__COMPILE_TIME_EMBEDDED_CONSTANTS__.RELEASE_CHANNEL': JSON.stringify(RELEASE_CHANNEL),
        'process.env.NODE_ENV': JSON.stringify(LIB_NODE_ENV),
    },
}).catch(() => {
    process.exit(1);
});
