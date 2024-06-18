import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Log } from '@microsoft/sp-core-library';
import {
    BaseApplicationCustomizer,
    PlaceholderContent,
    PlaceholderName
} from '@microsoft/sp-application-base';

import * as strings from 'SpollmWebBotApplicationCustomizerStrings';
import { WebBotButton } from '../../components/WebBotButton';
import { getSP } from '../../services/pnpjsconfig';
import { IBotOption } from '../../components/IBotOptioin';
import { getSPOService } from '../../services/SPOService';
import { IServiceContext, ServiceContext } from '../../services/ServiceContext';
import { getAzureOpenAIService } from '../../services/AzureOpenAIService';
import { IBotSettings, SettingService } from '../../services/SettingService';

const LOG_SOURCE: string = 'SpollmWebBotApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ISpollmWebBotApplicationCustomizerProperties extends IBotSettings {
    // This is an example; replace with your own property
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class SpollmWebBotApplicationCustomizer
    extends BaseApplicationCustomizer<ISpollmWebBotApplicationCustomizerProperties> {
    private _topPlaceholder: PlaceholderContent | undefined;
    private _serviceContext: IServiceContext;

    public onInit(): Promise<void> {
        Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

        // Dialog.alert(`Hello from ${strings.Title}:\n\n${message}`).catch(() => {
        //     /* handle error */
        // });

        //Dialog.alert(`Hello from ${strings.Title}:\n\n${message}`);
        getSP(this.context);
        getSPOService(this.context);
        const settingService = SettingService.getSettingService(this.properties);
        this._serviceContext = {
            settingService: settingService
        };

        this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);

        return Promise.resolve();
    }
    private _onDispose(): void {
        console.log('[HelloWorldApplicationCustomizer._onDispose] Disposed custom top and bottom placeholders.');
    }

    private _renderPlaceHolders(): void {
        console.log("HelloWorldApplicationCustomizer._renderPlaceHolders()");
        console.log(
            "Available placeholders: ",
            this.context.placeholderProvider.placeholderNames
                .map(name => PlaceholderName[name])
                .join(", ")
        );

        if (!this._topPlaceholder) {
            this._topPlaceholder = this.context.placeholderProvider.tryCreateContent(
                PlaceholderName.Top,
                { onDispose: this._onDispose }
            );
        }
        if (this._topPlaceholder) {
            const element = React.createElement(
                WebBotButton,
                {
                    serviceContext: this._serviceContext
                }
            );
            ReactDom.render(element, this._topPlaceholder.domElement);// as React.Component<IHeaderProps, React.ComponentState, any>;

        } else {
            console.error("The expected placeholder (Top) was not found.");
        }

    }

}
