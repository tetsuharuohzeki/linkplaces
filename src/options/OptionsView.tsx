import { IterableX } from '@reactivex/ix-esnext-esm/iterable/iterablex';
import { map } from '@reactivex/ix-esnext-esm/iterable/pipe/map';
import { toArray as toArrayFromIx } from '@reactivex/ix-esnext-esm/iterable/toarray';

import React from 'react';

import { BUILD_DATE, GIT_REVISION } from '../shared/constants';

export type Page = Readonly<{
    url: string;
    title: string;
}>;

export interface OptionsViewProps {
    list: Iterable<Page>;
}
export function OptionsView(props: Readonly<OptionsViewProps>): JSX.Element {
    const { list } = props;

    const elements = IterableX.from(list)
        .pipe(
            map((page: Page): JSX.Element => {
                return (
                    <li>
                        <a href={page.url} target={'_blank'}>
                            {page.title}
                        </a>
                    </li>
                );
            }),
        );

    const children = toArrayFromIx(elements);

    return (
        <React.StrictMode>
            <div>
                <h2>{'Build Information'}</h2>
                <table>
                    <tr>
                        <th>{'GIT_REVISION'}</th>
                        <td>{GIT_REVISION}</td>
                    </tr>
                    <tr>
                        <th>{'BUILD_DATE'}</th>
                        <td>{BUILD_DATE}</td>
                    </tr>
                </table>
                <h2>{'for debugging'}</h2>
                <ul>
                    {children}
                </ul>
            </div>
        </React.StrictMode>
    );
}
