import * as React from 'react';
//import * as PropTypes from 'prop-types';

export interface OptionsViewProps {
    popup: { url: string; title: string; };
}
export function OptionsView(props: Readonly<OptionsViewProps>): JSX.Element {
    const { popup, } = props;

    return (
        <div>
            <h2>{'for debugging'}</h2>
            <ul>
                <li>
                    <a href={popup.url} target={'_blank'}>
                        {popup.title}
                    </a>
                </li>
            </ul>
        </div>
    );
}
