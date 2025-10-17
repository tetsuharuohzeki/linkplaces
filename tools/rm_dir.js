/** env node */
import * as path from 'node:path';
import { Remover } from '@linkplaces/tools';

const { isDryRun, isForce, isVerbose } = Remover.parseArgs(process);
const target = Remover.getTargetFromArgv(process);

const targetAbsPath = path.resolve(process.cwd(), target);

const deleted = await Remover.deleteFile({
    target: targetAbsPath,
    isDryRun,
    isVerbose,
    isForce,
});

console.log('Deleted files:\n', deleted);
