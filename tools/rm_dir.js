/** env node */
import fs from 'node:fs/promises';

(async function main() {
    const argSet = new Set(process.argv);
    const argv = process.argv;

    const isVerbose = argSet.has('--verbose');
    if (isVerbose) {
        console.log(`process.argv: ${JSON.stringify(argv)}`);
    }

    const target = argv[2];
    if (!target) {
        throw new Error('no target');
    }

    try {
        await fs.stat(target);
    } catch {
        if (isVerbose) {
            console.log(`there is no ${target}`);
        }
        return;
    }

    const isDryRun = argSet.has('--dry-run');
    if (isDryRun) {
        return;
    }

    const isForce = argSet.has('--force');

    await fs.rm(target, {
        force: isForce,
        recursive: true,
    });
})();
