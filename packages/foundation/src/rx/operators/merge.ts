import { Observable } from '../observable.js';
import { Subscription } from '../subscription.js';

class MergeAllObservable<T> extends Observable<T> {
    constructor(inputs: ReadonlyArray<Observable<T>>) {
        super((observer) => {
            const sub = new Subscription(null);
            for (const observable of inputs) {
                const s = observable.subscribe(observer);
                sub.add(s);
            }
            return sub;
        });
    }
}

export function mergeAll<T>(...arrays: Array<Observable<T>>): Observable<T> {
    const o = new MergeAllObservable(arrays);
    return o;
}
