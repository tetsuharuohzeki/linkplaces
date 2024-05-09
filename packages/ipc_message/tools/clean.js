/** env node */
// eslint-disable-next-line import/no-unresolved
import { Remover } from '@linkplaces/tools';
import { isNotNull } from 'option-t/Nullable';

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
