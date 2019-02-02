import React from 'react';
import PropTypes from 'prop-types';

/* global process:readable */

export interface PanelSectionListProps {
    children: React.ReactNode;
}

export function PanelSectionList(props: PanelSectionListProps): JSX.Element {
    return (
        <div className={'shared-com-PanelSectionList__container'}>
            {props.children}
        </div>
    );
}
if (process.env.RELEASE_CHANNEL !== 'production') {
    (PanelSectionList as React.FunctionComponent<PanelSectionListProps>).propTypes = {
        children: PropTypes.node.isRequired,
    };
}

export interface PanelSectionListSeparatorProps {
    key?: React.Key;
}

export function PanelSectionListSeparator(_props: PanelSectionListSeparatorProps): JSX.Element {
    return (
        <div className={'shared-com-PanelSectionList__separator'}></div>
    );
}
