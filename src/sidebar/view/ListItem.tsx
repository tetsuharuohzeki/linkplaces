import React from 'react';
import PropTypes from 'prop-types';

import {
    PanelListItem,
    PanelListItemText,
} from '../../shared/component/PanelListItem';

export interface ListItemProps {
    isOpening: boolean;
    children: React.ReactNode;
}

export function ListItem(props: ListItemProps): JSX.Element {
    const className = !props.isOpening ?
        'sidebar-com-ListItem__container' :
        'sidebar-com-ListItem__container--is-opening';

    return (
        <div className={className}>
            <PanelListItem>
                <PanelListItemText>
                    {props.children}
                </PanelListItemText>
            </PanelListItem>
        </div>
    );
}
(ListItem as React.StatelessComponent<ListItemProps>).propTypes = {
    children: PropTypes.node.isRequired,
    isOpening: PropTypes.bool.isRequired,
};
