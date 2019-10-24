import React from 'react';

export interface PanelListItemProps {
    children: React.ReactNode;
    disabled?: boolean;
    onClick?: React.MouseEventHandler;
}

export function PanelListItem(props: PanelListItemProps): JSX.Element {
    const {
        disabled = false,
    } = props;

    const className = disabled ?
        'shared-com-PanelListItem__container disabled' :
        'shared-com-PanelListItem__container';

    return (
        <React.StrictMode>
            <div className={className} onClick={props.onClick}>
                {props.children}
            </div>
        </React.StrictMode>
    );
}

export interface PanelListItemIconProps {
    children: React.ReactNode;
}

export function PanelListItemIcon(props: PanelListItemIconProps): JSX.Element {
    return (
        <React.StrictMode>
            <div className={'shared-com-PanelListItem__icon'}>
                {props.children}
            </div>
        </React.StrictMode>
    );
}

export interface PanelListItemTextProps {
    children: React.ReactNode;
}

export function PanelListItemText(props: PanelListItemTextProps): JSX.Element {
    return (
        <React.StrictMode>
            <div className={'shared-com-PanelListItem__text'}>
                {props.children}
            </div>
        </React.StrictMode>
    );
}
