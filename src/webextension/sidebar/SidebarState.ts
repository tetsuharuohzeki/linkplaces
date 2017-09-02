import { SidebarItemViewValue } from './SidebarDomain';

export interface SidebarState {
    list: ReadonlyArray<SidebarItemViewValue>;
}
