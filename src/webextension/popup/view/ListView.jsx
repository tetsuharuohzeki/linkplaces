/* eslint-env browser, webextensions */

import * as React from 'react'; // eslint-disable-line no-unused-vars
import * as PropTypes from 'prop-types';

export function BookmarkPanel({ list }) {
    const l = list.map((item, i) => {
        const v = <ListItem key={i} icon={''} text={item.title} shortcut={''} />;
        return v;
    });

    return (
        <div className='panel'>
            <div className='panel-section panel-section-list'>{l}</div>
        </div>
    );
}
BookmarkPanel.propTypes = {
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
