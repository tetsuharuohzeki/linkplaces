import { type ReactNode, StrictMode } from 'react';

export interface PanelSectionHeaderProps {
    children: ReactNode;
}

export function PanelSectionHeader(props: PanelSectionHeaderProps): ReactNode {
    return (
        <StrictMode>
            <header className={'shared-com-PanelSectionHeader__container'}>
                {props.children}
            </header>
        </StrictMode>
    );
}

export interface PanelSectionHeaderIconProps {
    children: ReactNode;
}

export function PanelSectionHeaderIcon(props: PanelSectionHeaderIconProps): ReactNode {
    return (
        <StrictMode>
            <div className={'shared-com-PanelSectionHeader__icon'}>
                {props.children}
            </div>
        </StrictMode>
    );
}

export interface PanelSectionHeaderTextProps {
    children: ReactNode;
}

export function PanelSectionHeaderText(props: PanelSectionHeaderTextProps): ReactNode {
    return (
        <StrictMode>
            <div className={'shared-com-PanelSectionHeader__text'}>
                {props.children}
            </div>
        </StrictMode>
    );
}
