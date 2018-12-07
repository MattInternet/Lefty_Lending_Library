import * as React from 'react';

import { Helmet } from 'react-helmet';

const DEFAULT_TITLE = 'LLL 📖';
const DEFAULT_DESCRIPTION = 'Customizable livestream application for YouTube Live.';

export interface IDocumentHeadProps {
    title?: string
    subtitle?: string;
    description?: string;
}

export default class DocumentHead extends React.Component<IDocumentHeadProps, {}> {
    public render() {
        const { title, subtitle, description } = this.props;

        const docTitle = `${subtitle ? `${subtitle} | ` : ''}${title || DEFAULT_TITLE} `;

        return (
            <Helmet>
                <title>{docTitle}</title>
                <meta name="description" content={description || DEFAULT_DESCRIPTION} />
            </Helmet>
        )
    }
}