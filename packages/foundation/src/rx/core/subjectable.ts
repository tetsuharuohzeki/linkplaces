import type { Observable } from './observable';
import type { Observer } from './observer';

export interface Subjectable<T> extends Observer<T> {
    asObservable(): Observable<T>;
}
