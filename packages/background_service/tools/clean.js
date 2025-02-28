/** env node */
import { Remover } from '@linkplaces/tools';
import { isNotNull } from 'option-t/nullable';

const { isDryRun, isForce, isVerbose } = Remover.parseArgs(process);
const [deletedFilePaths, error] = await Remover.deleteAsync(
    [
        // @prettier-ignore
        '__dist/',
        'tsconfig.tsbuildinfo',
    ],
    {
        cwd: process.cwd(),
        isDryRun,
        isVerbose,
        isForce,
    }
);

console.log('Deleted files:\n', deletedFilePaths.join('\n '));
if (isNotNull(error)) {
    console.error(error);
}
