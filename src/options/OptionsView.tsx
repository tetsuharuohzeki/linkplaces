import { StrictMode } from 'react';

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
    const children: Array<JSX.Element> = [];
    for (const page of list) {
        const element = (
            <li>
                <a href={page.url}
                    target={'_blank'}
                    // eslint-disable-next-line react/jsx-curly-brace-presence
                    rel='noopener'>
                    {page.title}
                </a>
            </li>
        );
        children.push(element);
    }

    return (
        <StrictMode>
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
        </StrictMode>
    );
}
