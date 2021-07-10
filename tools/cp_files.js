/** env node */
import fs from 'node:fs/promises';
import path from 'node:path';
import util from 'node:util';

import globOriginal from 'glob';

import { parseArgs } from './parse_argv.js';

const glob = util.promisify(globOriginal);

async function createSourceToDestinationMapList(baseDir, sourceList, destinationDir) {
    const normalizedDest = path.normalize(destinationDir);
    const candidate = sourceList.map(async (source) => {
        const normalizedSource = path.normalize(source);
        const actualSourcePath = path.resolve(baseDir, normalizedSource);

        const sourceStat = await fs.stat(actualSourcePath);
        if (sourceStat.isDirectory()) {
            return null;
        }

        const relativePath = normalizedSource.replace(baseDir, '');
        const dest = path.join(normalizedDest, relativePath);

        const entry = {
            source: actualSourcePath,
            dest,
        };

        return entry;
    });

    const candidateItems = await Promise.all(candidate);
    const fileList = candidateItems.filter((entry) => entry !== null);
    return fileList;
}

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
    const argv = parseArgs(process.argv.slice(2));

    const isVerbose = argSet.has('--verbose');
    const isDebug = argSet.has('--debug');
    if (isDebug) {
        console.log(`process.argv: ${JSON.stringify(argv)}`);
    }

    const baseDir = argv.get('--basedir');
    if (!baseDir) {
        throw new Error('no baseDir');
    }

    const source = argv.get('--source');
    if (!source) {
        throw new Error('no source');
    }

    const destinationDir = argv.get('--destination');
    if (!destinationDir) {
        throw new Error('no destinationDir');
    }

    const sourceList = await glob(source, {
        cwd: baseDir,
    });
    if (isDebug) {
        console.dir(sourceList);
    }

    const pairList = await createSourceToDestinationMapList(baseDir, sourceList, destinationDir);
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
