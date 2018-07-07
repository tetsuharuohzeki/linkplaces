import React from 'react';
import PropTypes from 'prop-types';

export interface ListItemViewProps {
    children: React.ReactNode;
}

export function ListItemView(props: ListItemViewProps): JSX.Element {
    return (
        <div>
            <ul className={'sidebar__ListView_container'}>
                {props.children}
            </ul>
        </div>
    );
}
(ListItemView as React.StatelessComponent<ListItemViewProps>).propTypes = {
    children: PropTypes.node.isRequired,
};
