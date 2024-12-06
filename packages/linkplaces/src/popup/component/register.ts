import { PopupItemIconElement, PopupItemIcon } from './PopupIconElement.js';

export function registerComponents(): void {
    window.customElements.define(PopupItemIcon, PopupItemIconElement);
}
