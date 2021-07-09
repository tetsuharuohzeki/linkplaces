/** env node */
import fs from 'node:fs/promises';
import path from 'node:path';
import util from 'node:util';

import globOriginal from 'glob';

const glob = util.promisify(globOriginal);

async function copyFile(
    source,
    dest,
    { isDebug: _isDebug, isVerbose: _isVerbose }
) {
    const dirname = path.dirname(dest);

    try {
        await fs.stat(dirname);
    } catch {
        await fs.mkdir(dirname, {
            recursive: true,
        });
    }

    const copying = fs.copyFile(source, dest);
    return copying;
}

(async function main() {
    const argSet = new Set(process.argv);
    const argv = process.argv;

    const isVerbose = argSet.has('--verbose');
    const isDebug = argSet.has('--debug');
    if (isDebug) {
        console.log(`process.argv: ${JSON.stringify(argv)}`);
    }

    const baseDir = argv[2];
    if (!baseDir) {
        throw new Error('no baseDir');
    }

    const source = argv[3];
    if (!source) {
        throw new Error('no source');
    }

    const targetDir = argv[4];
    if (!targetDir) {
        throw new Error('no target');
    }

    const sourceList = await glob(source, {
        cwd: baseDir,
    });
    if (isDebug) {
        console.dir(sourceList);
    }

    const normalizedDest = path.normalize(targetDir);

    const pairList = sourceList.map((source) => {
        const normalizedSource = path.normalize(source);
        const relativePath = normalizedSource.replace(baseDir, '');
        const dest = path.join(normalizedDest, relativePath);
        const finalSource = path.resolve(baseDir, normalizedSource);

        return {
            source: finalSource,
            dest,
        };
    });

    if (isVerbose) {
        const debug = pairList.map(({ source, dest }) => {
            return `${source} -> ${dest}`;
        });
        console.log(debug.join('\n'));
    }

    const result = [];
    for (const { source, dest } of pairList) {
        const processing = copyFile(source, dest, {
            isDebug,
            isVerbose,
        });
        result.push(processing);
    }

    await Promise.all(result);
})();
