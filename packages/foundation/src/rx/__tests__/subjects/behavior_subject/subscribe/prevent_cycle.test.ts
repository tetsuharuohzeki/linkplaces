import test from 'ava';
import { BehaviorSubject } from '../../../../mod.js';

test('prevent cycle myself', (t) => {
    const target = new BehaviorSubject<number>(1);

    t.throws(
        () => {
            target.subscribe(target);
        },
        {
            instanceOf: Error,
            message: 'recursive subscription happens',
        }
    );
});
