import { Runtime } from './runtime';

declare global {
    const browser: WebExtGlobal;
    const chrome: WebExtGlobal;
}

export interface WebExtGlobal {
    runtime: Runtime;
}
