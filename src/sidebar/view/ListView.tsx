import React from 'react';
import PropTypes from 'prop-types';

import { PanelSectionList } from '../../shared/component/PanelSectionList';

export interface ListItemViewProps {
    children: React.ReactNode;
}

export function ListItemView(props: ListItemViewProps): JSX.Element {
    return (
        <PanelSectionList>
            {props.children}
        </PanelSectionList>
    );
}
(ListItemView as React.StatelessComponent<ListItemViewProps>).propTypes = {
    children: PropTypes.node.isRequired,
};
