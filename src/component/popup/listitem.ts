import {
    createDomElement as dom,
    createDocFragmentTree as fragment,
    createTextNode as text,
} from '../../shared/domfactory';

class LPPopupListItemElement extends HTMLElement {
    constructor() {
        super();

        const shadowRoot = this.attachShadow({
            mode: 'open',
        });

        const tree = fragment([
            dom('style', null, [
                text(`
:host {
    align-items: center;
    display: flex;
    flex-direction: row;
    height: 24px;
    padding: 0 16px;
}

:host(:not([disabled]):hover) {
    background-color: rgba(0, 0, 0, 0.06);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    border-top: 1px solid rgba(0, 0, 0, 0.1);
}

:host(:not([disabled]):hover:active) {
    background-color: rgba(0, 0, 0, 0.1);
}

:host([disabled]) {
    color: #999;
}

.icon {
    flex-grow: 0;
    flex-shrink: 0;
}

.icon::slotted(*) {
    margin-inline-end: var(--icon-margin-inline-end, initial);
}

.text {
    flex-grow: 10;
}

.text-shortcut {
    color: #808080;
    /* stylelint-disable-next-linefont-family-no-missing-generic-family-keyword, font-family-name-quotes */
    font-family: 'Lucida Grande', caption;
    font-size: 0.847em;
    justify-content: flex-end;
}
                `),
            ]),

            dom('slot', [
                ['class', 'icon'],
                ['name', 'icon'],
            ], null),
            dom('slot', [
                ['class', 'text'],
                ['name', 'text'],
            ], null),
            dom('slot', [
                ['class', 'text-shortcut'],
                ['name', 'text-shortcut'],
            ], null),
        ]);

        shadowRoot.appendChild(tree);
    }
}

const LOCAL_NAME = 'lp-popup-list-item';
interface LPPopupListItemElementAttr {}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            // FIXME: Remove this. @typescript-eslint/eslint-plugin cannot works with this pattern correctly
            // eslint-disable-next-line no-undef
            [LOCAL_NAME]: React.DetailedHTMLProps<React.HTMLAttributes<LPPopupListItemElement> & LPPopupListItemElementAttr, LPPopupListItemElement>;
        }
    }
}

export function defineLPPopupListItemElement(): void {
    window.customElements.define(LOCAL_NAME, LPPopupListItemElement);
}
