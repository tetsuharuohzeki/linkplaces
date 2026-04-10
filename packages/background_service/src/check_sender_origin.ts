import type { ExtensionMessageSender, ExtensionRuntime } from '@linkplaces/webext_types';

class OriginCheckError extends Error {
    constructor(message: string, cause?: unknown) {
        super(message, { cause });
        this.name = new.target.name;
    }
}

export function checkSenderOrigin(sender: ExtensionMessageSender, runtime: ExtensionRuntime): boolean {
    const senderId = sender.id;
    const runtimeId = runtime.id;
    if (senderId !== runtimeId) {
        throw new OriginCheckError(`sender id is not a self's one`);
    }

    return true;
}
