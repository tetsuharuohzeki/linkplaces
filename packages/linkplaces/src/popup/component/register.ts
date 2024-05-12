import { PopupItemIconElement, LOCAL_NAME_POPUP_ITEM_ICON } from './PopupIconElement.js';

export function registerComponents(): void {
    window.customElements.define(LOCAL_NAME_POPUP_ITEM_ICON, PopupItemIconElement);
}
