import { fromEventToObservable, type Unsubscribable } from '@linkplaces/foundation/rx';
import type { SidebarIntent } from '../SidebarIntent';

export function initHandlingPasteEvent(window: Window, intent: SidebarIntent): Unsubscribable {
    const pastEventObservable = fromEventToObservable(window, 'paste');

    const sub = pastEventObservable.subscribeBy({
        onNext(event) {
            if (!(event instanceof ClipboardEvent)) {
                throw new TypeError(`this event should be paste but coming is ${event.type}`);
            }

            intent.pasteItemFromClipboardActionActual(event);
        },
    });

    return sub;
}
