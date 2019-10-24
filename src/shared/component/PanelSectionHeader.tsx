import React from 'react';

export interface PanelSectionHeaderProps {
    children: React.ReactNode;
}

export function PanelSectionHeader(props: PanelSectionHeaderProps): JSX.Element {
    return (
        <React.StrictMode>
            <header className={'shared-com-PanelSectionHeader__container'}>
                {props.children}
            </header>
        </React.StrictMode>
    );
}

export interface PanelSectionHeaderIconProps {
    children: React.ReactNode;
}

export function PanelSectionHeaderIcon(props: PanelSectionHeaderIconProps): JSX.Element {
    return (
        <React.StrictMode>
            <div className={'shared-com-PanelSectionHeader__icon'}>
                {props.children}
            </div>
        </React.StrictMode>
    );
}

export interface PanelSectionHeaderTextProps {
    children: React.ReactNode;
}

export function PanelSectionHeaderText(props: PanelSectionHeaderTextProps): JSX.Element {
    return (
        <React.StrictMode>
            <div className={'shared-com-PanelSectionHeader__text'}>
                {props.children}
            </div>
        </React.StrictMode>
    );
}
