import { Runtime } from './runtime';

declare global {
    const browser: WebExtGlobal;
    const chrome: WebExtGlobal;
}

interface WebExtGlobal {
    runtime: Runtime;
}
