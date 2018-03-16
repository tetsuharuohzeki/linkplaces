/* eslint-env commonjs, node */
'use strict';

const UndefinableMod = require('option-t/cjs/Undefinable');

const PLACEHOLDER_PREFIX = '\0placeholder_module:';

function replaceImportWithGlobal(map) {
    const table = new Map(Object.entries(map));
    const innerTable = new Map();

    return {
        name: 'replace_import_with_global',

        resolveId(importee) {
            const src = table.get(importee);
            if (UndefinableMod.isUndefined(src)) {
                return null;
            }

            const key = PLACEHOLDER_PREFIX + importee;
            innerTable.set(key, src);
            return key;
        },

        load(id) {
            const src = innerTable.get(id);
            if (UndefinableMod.isUndefined(src)) {
                return null;
            }

            return src;
        },
    };
}

function createDefaultExport(name) {
    return `export default ${name}`;
}

module.exports = Object.freeze({
    replaceImportWithGlobal,
    createDefaultExport,
});
