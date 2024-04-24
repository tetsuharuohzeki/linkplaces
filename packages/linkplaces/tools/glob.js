import * as fs from 'node:fs/promises';

export async function getAllGlobMatchedFiles(rootDir, globPattern) {
    const result = [];
    const enumerator = fs.glob(globPattern, {
        cwd: rootDir,
    });
    for await (const file of enumerator) {
        result.push(file);
    }
    return result;
}
