'use strict';

const assert = require('assert');

const UndefinableMod = require('option-t/cjs/Undefinable');

const PLACEHOLDER_PREFIX = '\0placeholder_module:';

function replaceImportWithGlobal(map) {
    const table = new Map(Object.entries(map));
    const innerTable = new Map();

    // This implements PluginHooks
    return {
        name: 'replace_import_with_global',

        async resolveId(source, _importer) {
            const src = table.get(source);
            if (UndefinableMod.isUndefined(src)) {
                return null;
            }

            assert.strictEqual(typeof src, 'string');

            const key = PLACEHOLDER_PREFIX + source;
            innerTable.set(key, src);
            return {
                id: key,
                external: false,
                moduleSideEffects: true,
            };
        },

        async load(id) {
            const src = innerTable.get(id);
            if (UndefinableMod.isUndefined(src)) {
                return null;
            }

            assert.strictEqual(typeof src, 'string');

            return {
                code: src,
                map: undefined,
            };
        },
    };
}

function createDefaultExport(name) {
    assert.strictEqual(typeof name, 'string');

    const text = `export default ${name};`;
    return text;
}

function createNamedExport(name, namespace) {
    assert.strictEqual(typeof name, 'string');
    assert.strictEqual(typeof namespace, 'string');

    const text = `export var ${name} = ${namespace}.${name};`;
    return text;
}

function createModule(list) {
    assert.ok(Array.isArray(list));

    const text = list.join('\n');
    return text;
}

module.exports = Object.freeze({
    replaceImportWithGlobal,
    createDefaultExport,
    createNamedExport,
    createModule,
});
