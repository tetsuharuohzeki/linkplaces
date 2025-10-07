import { isNotNull, isNull, type Nullable } from 'option-t/nullable';
import type { Observable } from '../core/observable.js';
import { ConnectableOperatorObservable, type ConnectableOperatorFunction } from '../core/operator.js';
import { Subject } from '../core/subject.js';
import type { Unsubscribable } from '../core/subscribable.js';
import type { Subscriber } from '../core/subscriber.js';
import { Subscription } from '../core/subscription.js';

class Connection implements Unsubscribable {
    private _sub: Nullable<Subscription>;

    constructor(sub: Subscription) {
        this._sub = sub;
    }

    get closed(): boolean {
        const isClosed = isNull(this._sub);
        return isClosed;
    }

    unsubscribe(): void {
        const sub = this._sub;
        if (isNotNull(sub)) {
            sub.unsubscribe();
            this._sub = null;
        }
    }
}

class MulticastObservable<T> extends ConnectableOperatorObservable<T, T> {
    private _connector: Subject<T>;
    private _connection: Nullable<Connection> = null;

    constructor(source: Observable<T>, connector: Subject<T>) {
        super(source);
        this._connector = connector;
    }

    protected override onSubscribe(destination: Subscriber<T>): void {
        const sub = this._connector.asObservable().subscribe(destination);
        destination.addTeardown(() => {
            sub.unsubscribe();
        });
    }

    override connect(): Unsubscribable {
        let connection = this._connection;
        if (isNull(connection)) {
            const sub = new Subscription(() => {
                this._connection = null;
            });
            sub.add(this.source.subscribe(this._connector));
            connection = new Connection(sub);
            this._connection = connection;
        }
        return connection;
    }
}

export function multicast<T>(subject: Subject<T>): ConnectableOperatorFunction<T, T> {
    const operator: ConnectableOperatorFunction<T, T> = (source: Observable<T>) => {
        const connected = new MulticastObservable<T>(source, subject);
        return connected;
    };
    return operator;
}

export function publish<T>(): ConnectableOperatorFunction<T, T> {
    const operator: ConnectableOperatorFunction<T, T> = (source: Observable<T>) => {
        const subject = new Subject<T>();
        const connected = source.pipe(multicast(subject));
        return connected;
    };
    return operator;
}
