/** env node */
import { Remover } from '@linkplaces/tools';

const { isDryRun, isForce, isVerbose } = Remover.parseArgs(process);
const target = Remover.getTargetFromArgv(process);

const deleted = await Remover.deleteFile({
    target,
    isDryRun,
    isVerbose,
    isForce,
});

console.log('Deleted files:\n', deleted);
