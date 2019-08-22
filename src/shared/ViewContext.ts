export interface SyncViewContext {
    onActivate(mountpoint: Element): void;
    onDestroy(mountpoint: Element): void;

    onResume(mountpoint: Element): void;
    onSuspend(mountpoint: Element): void;
}
