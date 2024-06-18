import * as React from 'react';
import { BasePanel, IBasePanelOption } from './BasePanel';
import { WebBotPanelComponent } from '../WebBotPanelComponent';
import { IServiceContext, ServiceContext } from '../../services/ServiceContext';

export interface IWebBotPanelOption extends IBasePanelOption {
    serviceContext: IServiceContext;
}
export class WebBotPanel extends BasePanel {
    public pageTemplate: string;

    constructor(private _configOption: IWebBotPanelOption) {
        super(_configOption);
    }
    public render(): JSX.Element {
        //const closeHandler = this._close.bind(this);
        return (
            <ServiceContext.Provider value={this._configOption.serviceContext} >

                <WebBotPanelComponent />
            </ServiceContext.Provider>
            //   <CopyPageComponent
            //     iPageService={this._configOption.iPageService}
            //     selectedPages={this._configOption.selectedPages}
            //     onClose={closeHandler} />
        );
    }
}
