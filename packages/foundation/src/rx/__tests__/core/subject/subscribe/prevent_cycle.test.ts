import test from 'ava';
import { Subject } from '../../../../mod.js';

test('prevent cycle myself', (t) => {
    const target = new Subject<number>();

    t.throws(
        () => {
            target.asObservable().subscribe(target);
        },
        {
            instanceOf: Error,
            message: 'recursive subscription happens',
        }
    );
});
