/** env node */
import fs from 'node:fs/promises';
import path from 'node:path';
import { reflinkFile } from '@reflink/reflink';

import { getAllGlobMatchedFiles } from './glob.js';
import { parseCliOptions } from './parse_argv.js';

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

// eslint-disable-next-line no-bitwise
const FS_FILE_COPY_MODE = fs.constants.COPYFILE_EXCL | fs.constants.COPYFILE_FICLONE;

const IS_DARWIN = process.platform === 'darwin';

async function copyFile(source, dest, { isDebug: _isDebug, isVerbose: _isVerbose }) {
    const dirname = path.dirname(dest);

    try {
        await fs.stat(dirname);
    } catch {
        await fs.mkdir(dirname, {
            recursive: true,
        });
    }

    // libuv still lack the support for this kind of modern file operation.
    //  - https://github.com/libuv/libuv/issues/2936
    //
    // To such enhancment operation, we use pnpm's alternative approach.
    //  - https://github.com/pnpm/pnpm/issues/5001
    //  - https://github.com/pnpm/pnpm/pull/7031
    //
    // But their relink implementation still has some issues.
    // We use this approach only for APFS.
    //  - https://github.com/pnpm/pnpm/issues/7186
    if (IS_DARWIN) {
        await reflinkFile(source, dest);
    } else {
        await fs.copyFile(source, dest, FS_FILE_COPY_MODE);
    }
}

(async function main() {
    const argv = parseCliOptions();

    const isVerbose = argv.isVerbose;
    const isDebug = argv.isDebug;
    if (isDebug) {
        console.log(`process.argv: ${JSON.stringify(argv)}`);
    }

    const baseDir = argv.baseDir;
    if (!baseDir) {
        throw new Error('no baseDir');
    }

    const source = argv.source;
    if (!source) {
        throw new Error('no source');
    }

    const destinationDir = argv.destinationDir;
    if (!destinationDir) {
        throw new Error('no destinationDir');
    }

    const baseDirFullPath = path.resolve(process.cwd(), baseDir);
    const sourceList = await getAllGlobMatchedFiles(baseDirFullPath, source);
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
