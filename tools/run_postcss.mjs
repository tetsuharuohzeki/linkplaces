import * as assert from 'assert';
// eslint-disable-next-line import/no-unresolved
import * as fs from 'fs/promises';
import * as path from 'path';
import postcss from 'postcss';

import getConfig from '../postcss.config.mjs';

(async () => {
    const ENTRY_POINT = process.env.ENTRY_POINT;
    assert.strictEqual(typeof ENTRY_POINT, 'string');

    const OUTPUT_FILE = process.env.OUTPUT_FILE;
    assert.strictEqual(typeof OUTPUT_FILE, 'string');

    console.log(`
========== running postcss processor ==========
ENTRY_POINT: ${ENTRY_POINT}
OUTPUT_FILE: ${OUTPUT_FILE}
===============================================
    `);

    const css = await fs.readFile(ENTRY_POINT);

    const config = getConfig();

    const processor = postcss(config.plugins);
    const result = await processor.process(css, {
        from: ENTRY_POINT,
        to: OUTPUT_FILE,
        map: config.map,
    });

    const destDir = path.dirname(OUTPUT_FILE);

    try {
        await fs.stat(destDir);
    } catch (_e) {
        await fs.mkdir(destDir, {
            recursive: true,
        });
    }

    const binary = fs.writeFile(OUTPUT_FILE, result.css, {
        encoding: 'utf-8',
    });

    let sourcemap;
    if (!!result.map) {
        sourcemap = fs.writeFile(`${OUTPUT_FILE}.map`, result.map.toString(), {
            encoding: 'utf-8',
        });
    } else {
        sourcemap = Promise.resolve();
    }

    await Promise.all([binary, sourcemap]);
})();
