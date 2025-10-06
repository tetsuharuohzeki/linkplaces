import type { Observable } from '../core/observable.js';
import { OperatorObservable, type OperatorFunction } from '../core/operator.js';
import type { Subscriber } from '../core/subscriber.js';
import type { Subject } from '../mod.js';

class ConnectObservable<T> extends OperatorObservable<T, T> {
    private _connector: Subject<T>;

    constructor(source: Observable<T>, connector: Subject<T>) {
        super(source);
        this._connector = connector;
    }

    protected override onSubscribe(destination: Subscriber<T>): void {
        this._connector.asObservable().subscribe(destination);
        const sourceSub = this.source.subscribe(this._connector);
        destination.addTeardown(() => {
            sourceSub.unsubscribe();
        });
    }
}

export function connect<T>(subject: Subject<T>): OperatorFunction<T, T> {
    const operator: OperatorFunction<T, T> = (source: Observable<T>) => {
        const connected = new ConnectObservable<T>(source, subject);
        return connected;
    };
    return operator;
}
