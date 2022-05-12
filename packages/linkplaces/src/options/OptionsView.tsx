import {
    Ix,
    createDocFragmentTree,
    createDomElement as element,
    createTextNode as text,
} from '@linkplaces/foundation';

import { BUILD_DATE, GIT_REVISION, RELEASE_CHANNEL } from '@linkplaces/shared/constants';

export type Page = Readonly<{
    url: string;
    title: string;
}>;

export interface OptionsViewProps {
    list: Iterable<Page>;
}
export function createOptionsView(props: Readonly<OptionsViewProps>): DocumentFragment {
    const { list } = props;
    const links: Iterable<Element> = Ix.map(list, (page) => {
        const item = element('li', null, [
            element('a', [
                ['href', page.url],
                ['target', '_blank'],
                ['rel', 'noopener'],
            ], [
                text(page.title),
            ])
        ]);
        return item;
    });

    const fragment = createDocFragmentTree([
        element('div', null, [
            element('h2', null, [
                text('Build Information'),
            ]),
            element('table', null, [
                element('tr', null, [
                    element('th', null, [
                        text('GIT_REVISION'),
                    ]),
                    element('td', null, [
                        text(GIT_REVISION),
                    ]),
                ]),
                element('tr', null, [
                    element('th', null, [
                        text('BUILD_DATE'),
                    ]),
                    element('td', null, [
                        text(BUILD_DATE),
                    ]),
                ]),
                element('tr', null, [
                    element('th', null, [
                        text('RELEASE_CHANNEL'),
                    ]),
                    element('td', null, [
                        text(RELEASE_CHANNEL),
                    ]),
                ]),
            ]),
        ]),
        element('div', null, [
            element('h2', null, [
                text('for debug'),
            ]),
            element('ul', null, links),
        ]),
    ]);

    return fragment;
}
