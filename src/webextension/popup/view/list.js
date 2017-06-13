/* eslint-env browser, webextensions */

import * as React from 'react'; // eslint-disable-line no-unused-vars
import * as PropTypes from 'prop-types';

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

export function Panel({ list }) {
    const l = list.map(({ icon, text, shortcut, }, i) => {
        const v = <ListItem key={i} icon={icon} text={text} shortcut={shortcut} />;
        return v;
    });

    return (
        <div className='panel'>
            <div className='panel-section panel-section-list'>{l}</div>
        </div>
    );
}
Panel.propTypes = {
    list: PropTypes.arrayOf(PropTypes.object).isRequired,
};

function ListItem({ icon, text, shortcut, }) {
    return (
        <div className='panel-list-item'>
            <div className='icon'>{icon}</div>
            <div className='text'>{text}</div>
            <div className='text-shortcut'>{shortcut}</div>
        </div>
    );
}
ListItem.propTypes = {
    icon: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    shortcut: PropTypes.string.isRequired,
};
