import { isNull } from 'option-t/esm/Nullable/Nullable';
import { OptionsContext } from './OptionsContext';

(async function main(){
    const mountpoint = document.getElementById('js-mountpoint');
    if (isNull(mountpoint)) {
        throw new TypeError('not found mountpoint');
    }

    const ctx = new OptionsContext();
    ctx.onActivate(mountpoint);
})().catch(console.error);
