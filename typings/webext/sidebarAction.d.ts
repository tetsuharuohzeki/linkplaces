export interface WebExtSidebarActionService {
    open(): Promise<void>;
    close(): Promise<void>;
}
