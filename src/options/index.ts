import { landViewContext } from '../foundation/view_ctx/LandingPad';
import { OptionsContext } from './OptionsContext';

(async function main() {
    const ctx = new OptionsContext();
    await landViewContext(ctx);
})().catch(console.error);
