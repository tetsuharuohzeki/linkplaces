import { landViewContext } from '@linkplaces/foundation/view_ctx';
import { OptionsContext } from './options_context.jsx';

(async function main() {
    const ctx = new OptionsContext();
    await landViewContext(ctx);
})().catch(console.error);
