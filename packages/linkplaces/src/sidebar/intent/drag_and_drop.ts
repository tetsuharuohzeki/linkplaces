import { fromEventToObservable, Subscription, type Unsubscribable } from '@linkplaces/foundation/rx';
import type { SidebarIntent } from '../sidebar_intent';

export function activateDragAndDropTextItemHandling(window: Window, intent: SidebarIntent): Unsubscribable {
    const rootSubscription = new Subscription(null);

    rootSubscription.add(
        fromEventToObservable(window, 'dragover').subscribeBy({
            onNext(event) {
                // This is required to allow to customize on drop event.
                event.preventDefault();
            },
        })
    );

    const dropEventObservable = fromEventToObservable(window, 'drop');
    rootSubscription.add(
        dropEventObservable.subscribeBy({
            onNext(event) {
                if (!(event instanceof DragEvent)) {
                    throw new TypeError(`this event should be paste but coming is ${event.type}`);
                }

                event.preventDefault();

                intent.dropItemLikeHyperLink(event);
            },
        })
    );

    return rootSubscription;
}
