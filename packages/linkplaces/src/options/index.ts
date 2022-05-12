import { landViewContext } from '@linkplaces/foundation/__dist/view_ctx/mod';
import { OptionsContext } from './OptionsContext.js';

(async function main() {
    const ctx = new OptionsContext();
    await landViewContext(ctx);
})().catch(console.error);
