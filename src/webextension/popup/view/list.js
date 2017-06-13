/* eslint-env browser, webextensions */

// http://design.firefox.com/StyleGuide/#/navigation
export function createPanel(childFragment) {
    const outercontainer = document.createElement('div');
    outercontainer.className = 'panel';
    document.body.appendChild(outercontainer);

    const middle = document.createElement('div');
    middle.className = 'panel-section panel-section-list';
    outercontainer.appendChild(middle);

    middle.appendChild(childFragment);

    return middle;
}

export function createListItem({ icon, text, shortcut }) {
    const c = document.createElement('div');
    c.className = 'panel-list-item';

    const iconDom = document.createElement('div');
    iconDom.className = 'icon';
    iconDom.textContent = icon;
    c.appendChild(iconDom);

    const textDom = document.createElement('div');
    textDom.className = 'text';
    textDom.textContent = text;
    c.appendChild(textDom);

    const shortcutDom = document.createElement('div');
    shortcutDom.className = 'text-shortcut';
    shortcutDom.textContent = shortcut;
    c.appendChild(shortcutDom);

    return c;
}
