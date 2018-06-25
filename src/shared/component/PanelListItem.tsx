import React from 'react';
import PropTypes from 'prop-types';

export interface PanelListItemProps {
    children: React.ReactNode;
    onClick?: React.MouseEventHandler;
}

export function PanelListItem(props: PanelListItemProps): JSX.Element {
    return (
        <div className={'panel-list-item'} onClick={props.onClick}>
            {props.children}
        </div>
    );
}
if (process.env.RELEASE_CHANNEL !== 'production') {
    (PanelListItem as React.StatelessComponent<PanelListItemProps>).propTypes = {
        children: PropTypes.node.isRequired,
        onClick: PropTypes.func,
    };
}
