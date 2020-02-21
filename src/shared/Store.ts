import type { Observable } from 'rxjs';

export interface Store<T> {
    compose(initial: Readonly<T>): Observable<T>;
}
