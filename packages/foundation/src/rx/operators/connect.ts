import type { Observable } from '../core/observable.js';
import { OperatorObservable, type OperatorFunction } from '../core/operator.js';
import type { Subscriber } from '../core/subscriber.js';
import type { Subject } from '../mod.js';

type SubjectFactoryFn<T> = () => Subject<T>;

class ConnectObservable<T> extends OperatorObservable<T, T> {
    private _connector: SubjectFactoryFn<T>;

    constructor(source: Observable<T>, connector: SubjectFactoryFn<T>) {
        super(source);
        this._connector = connector;
    }

    protected override onSubscribe(destination: Subscriber<T>): void {
        const connectorSubject = this._connector();
        connectorSubject.asObservable().subscribe(destination);
        const sourceSub = this.source.subscribe(connectorSubject);
        destination.addTeardown(() => {
            sourceSub.unsubscribe();
        });
    }
}

export function connect<T>(subjectFactory: SubjectFactoryFn<T>): OperatorFunction<T, T> {
    const operator: OperatorFunction<T, T> = (source: Observable<T>) => {
        const connected = new ConnectObservable<T>(source, subjectFactory);
        return connected;
    };
    return operator;
}
