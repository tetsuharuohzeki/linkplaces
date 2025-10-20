import { type ReactNode, StrictMode } from 'react';

export interface PanelSectionHeaderProps {
    children: ReactNode;
}

export function PanelSectionHeader({ children }: PanelSectionHeaderProps): ReactNode {
    return (
        <StrictMode>
            <header className={'shared-com-PanelSectionHeader__container'}>{children}</header>
        </StrictMode>
    );
}

export interface PanelSectionHeaderIconProps {
    children: ReactNode;
}

export function PanelSectionHeaderIcon({ children }: PanelSectionHeaderIconProps): ReactNode {
    return (
        <StrictMode>
            <div className={'shared-com-PanelSectionHeader__icon'}>{children}</div>
        </StrictMode>
    );
}

export interface PanelSectionHeaderTextProps {
    children: ReactNode;
}

export function PanelSectionHeaderText({ children }: PanelSectionHeaderTextProps): ReactNode {
    return (
        <StrictMode>
            <div className={'shared-com-PanelSectionHeader__text'}>{children}</div>
        </StrictMode>
    );
}
