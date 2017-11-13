import { SidebarItemViewModelEntity } from './SidebarDomain';

export interface SidebarState {
    list: ReadonlyArray<SidebarItemViewModelEntity>;
}
