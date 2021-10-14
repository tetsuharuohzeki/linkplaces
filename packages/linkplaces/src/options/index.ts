import { landViewContext } from '@linkplaces/foundation';
import { OptionsContext } from './OptionsContext';

(async function main() {
    const ctx = new OptionsContext();
    await landViewContext(ctx);
})().catch(console.error);
