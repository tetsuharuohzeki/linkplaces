import type { Observable } from 'rxjs';

export interface Repository<T> {
    destroy(): void;
    asObservable(): Observable<T>;
}
