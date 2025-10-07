import type { Observable } from '../core/observable';
import type { OperatorFunction } from '../core/operator.js';
import { Subject } from '../core/subject.js';
import { multicast } from './multicast.js';
import { refCount } from './ref_count.js';

export function share<T>(): OperatorFunction<T, T> {
    const operator: OperatorFunction<T, T> = (source: Observable<T>) => {
        const subject = new Subject<T>();
        const mapped: Observable<T> = source.pipe(multicast(subject)).pipe(refCount());
        return mapped;
    };
    return operator;
}
