import importPlugin from 'postcss-import';

import { RELEASE_CHANNEL, ENABLE_SOURCE_MAP } from './tools/buildconfig.js';

// XXX: for debugging information
console.log(`
########### postcss configuration #################
process.env.RELEASE_CHANNEL: ${RELEASE_CHANNEL}
ENABLE_SOURCE_MAP: ${ENABLE_SOURCE_MAP}
############################
`);

// We'd like to sort with https://github.com/postcss/postcss-load-config
// eslint-disable-next-line import/no-default-export
export default function getPostCssConfig() {
    return {
        map: ENABLE_SOURCE_MAP ? { inline: false } : false,

        plugins: [
            importPlugin({
                root: process.cwd(),
                path: [], // we'd like to enforce to use a relative path.
                skipDuplicates: true,
            }),
        ],
    };
}
