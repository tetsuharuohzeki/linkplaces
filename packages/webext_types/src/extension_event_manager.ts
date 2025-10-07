// See https://searchfox.org/mozilla-central/source/dom/webidl/ExtensionEventManager.webidl

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export interface ExtensionEventManager<TFunc extends Function = Function> {
    addListener(callback: TFunc, listenerOptions?: object): void;
    removeListener(callback: TFunc): void;
    hasListener(callback: TFunc): boolean;
    hasListeners(): boolean;
}
