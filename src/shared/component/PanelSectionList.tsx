import React from 'react';

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

export interface PanelSectionListSeparatorProps {
    key?: React.Key;
}

export function PanelSectionListSeparator(_props: PanelSectionListSeparatorProps): JSX.Element {
    return (
        <div className={'shared-com-PanelSectionList__separator'}></div>
    );
}
