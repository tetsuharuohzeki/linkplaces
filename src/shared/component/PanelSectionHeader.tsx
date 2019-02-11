import React from 'react';

export interface PanelSectionHeaderProps {
    children: React.ReactNode;
}

export function PanelSectionHeader(props: PanelSectionHeaderProps): JSX.Element {
    return (
        <header className={'shared-com-PanelSectionHeader__container'}>
            {props.children}
        </header>
    );
}

export interface PanelSectionHeaderIconProps {
    children: React.ReactNode;
}

export function PanelSectionHeaderIcon(props: PanelSectionHeaderIconProps): JSX.Element {
    return (
        <div className={'shared-com-PanelSectionHeader__icon'}>
            {props.children}
        </div>
    );
}

export interface PanelSectionHeaderTextProps {
    children: React.ReactNode;
}

export function PanelSectionHeaderText(props: PanelSectionHeaderTextProps): JSX.Element {
    return (
        <div className={'shared-com-PanelSectionHeader__text'}>
            {props.children}
        </div>
    );
}
