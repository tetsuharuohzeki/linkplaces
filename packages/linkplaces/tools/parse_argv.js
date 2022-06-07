import { parseArgs } from 'node:util';

const CLI_OPTIONS = {
    verbose: {
        type: 'boolean',
    },
    debug: {
        type: 'boolean',
    },
    destination: {
        type: 'string',
    },
    basedir: {
        type: 'string',
    },
    source: {
        type: 'string',
    },
};

export function parseCliOptions() {
    const { values } = parseArgs({
        options: CLI_OPTIONS,
        strict: true,
    });

    const isVerbose = !!values.verbose;
    const isDebug = !!values.debug;

    const baseDir = values.basedir;
    if (!baseDir) {
        throw new Error('no baseDir');
    }

    const source = values.source;
    if (!source) {
        throw new Error('no source');
    }

    const destinationDir = values.destination;
    if (!destinationDir) {
        throw new Error('no destinationDir');
    }

    const result = Object.freeze({
        isVerbose,
        isDebug,
        baseDir,
        source,
        destinationDir,
    });
    return result;
}
