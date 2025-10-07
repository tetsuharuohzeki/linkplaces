import { PopupItemIconElement, PopupItemIcon } from './popup_icon_element.js';

export function registerComponents(): void {
    window.customElements.define(PopupItemIcon, PopupItemIconElement);
}
