/**
 *  Some operations requires to call it in the async context
 *  and we need to handle it correctly as async operation.
 *  In JavaScript which does not have any thread and we cannot block
 *  main thread, I seem it's compromise approach to return
 *  return `Promise` from lyfecycle methods.
 */
export interface ViewContext {
    destroy(): void;

    onActivate(mountpoint: Element): Promise<void>;
    onDestroy(mountpoint: Element): Promise<void>;

    onResume?(mountpoint: Element): Promise<void>;
    onSuspend?(mountpoint: Element): Promise<void>;
}
