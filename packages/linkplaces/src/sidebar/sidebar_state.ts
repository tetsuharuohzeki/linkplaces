import type { SidebarItemViewModelEntity } from './sidebar_domain.js';

export interface SidebarState {
    list: Iterable<SidebarItemViewModelEntity>;
}

export function createInitialSidebarState(source: Iterable<SidebarItemViewModelEntity> = []): SidebarState {
    const initialState: Readonly<SidebarState> = {
        list: source,
    };
    return initialState;
}
