import * as React from 'react';
import styles from './WebBot.module.scss';
import { IWebBotProps } from './IWebBotProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { WebChatView } from './WebChatView';

export default class WebBot extends React.Component<IWebBotProps, {}> {
    public render(): React.ReactElement<IWebBotProps> {
        const {
            description,
            isDarkTheme,
            environmentMessage,
            hasTeamsContext,
            userDisplayName
        } = this.props;

        return (
            <section className={`${styles.webBot} ${hasTeamsContext ? styles.teams : ''}`}>
                <WebChatView botId={this.props.botId} />
            </section>
        );
    }
}
