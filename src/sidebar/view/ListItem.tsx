import { unwrapOrFromUndefinable } from 'option-t/esm/Undefinable/unwrapOr';

import React from 'react';
import PropTypes from 'prop-types';

export interface ListItemProps {
    children: React.ReactNode;
    className?: string;
}

export function ListItem(props: ListItemProps): JSX.Element {
    //const className = unwrapOrFromUndefinable(props.className, '');
    const className = unwrapOrFromUndefinable('sidebar__ListItem_container', 'sidebar__ListItem_container');

    return (
        <li className={className}>
            {props.children}
        </li>
    );
}
(ListItem as React.StatelessComponent<ListItemProps>).propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};
