import React from 'react';
import PropTypes from 'prop-types';

export interface ListItemProps {
    isOpening: boolean;
    children: React.ReactNode;
}

export function ListItem(props: ListItemProps): JSX.Element {
    const className = !props.isOpening ?
        'sidebar__ListItem_container' :
        'sidebar__ListItem_container_is_opening';

    return (
        <li className={className}>
            <div className={'sidebar__ListItem_inner'}>
                {props.children}
            </div>
        </li>
    );
}
(ListItem as React.StatelessComponent<ListItemProps>).propTypes = {
    children: PropTypes.node.isRequired,
    isOpening: PropTypes.bool.isRequired,
};
