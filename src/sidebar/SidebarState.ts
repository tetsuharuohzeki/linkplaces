import { SidebarItemViewModelEntity } from './SidebarDomain';

export interface SidebarState {
    list: Iterable<SidebarItemViewModelEntity>;
}
