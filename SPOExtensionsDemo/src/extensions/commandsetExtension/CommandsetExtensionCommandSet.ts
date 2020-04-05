import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
    BaseListViewCommandSet,
    Command,
    IListViewCommandSetListViewUpdatedParameters,
    IListViewCommandSetExecuteEventParameters
} from '@microsoft/sp-listview-extensibility';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'CommandsetExtensionCommandSetStrings';
import { autobind } from 'office-ui-fabric-react';
import { CopyPageToPanel } from '../../components/panels/CopyPageToPanel';
import { ICopyPageToPanelOption } from '../../components/panels/ICopyPageToPanelOption';
import { PanelResultEnum } from '../../components/panels/BasePanel';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ICommandsetExtensionCommandSetProperties {
    // This is an example; replace with your own properties
    sampleTextOne: string;
    sampleTextTwo: string;
}

const LOG_SOURCE: string = 'CommandsetExtensionCommandSet';

export default class CommandsetExtensionCommandSet extends BaseListViewCommandSet<ICommandsetExtensionCommandSetProperties> {

    @override
    public onInit(): Promise<void> {
        Log.info(LOG_SOURCE, 'Initialized CommandsetExtensionCommandSet');
        return Promise.resolve();
    }

    @override
    public onListViewUpdated(event: IListViewCommandSetListViewUpdatedParameters): void {
        const compareOneCommand: Command = this.tryGetCommand('COMMAND_COPYPAGETO');
        if (compareOneCommand) {
            // This command should be hidden unless exactly one row is selected.
            compareOneCommand.visible = event.selectedRows.length === 1 && this._showCopyPageToCommandSet();
        }
    }

    @autobind
    private _showCopyPageToCommandSet(): boolean {
        let ret = false;
        ret = window.location.href.indexOf('/SitePages/') != 0;
        return ret;
    }

    @override
    public async onExecute(event: IListViewCommandSetExecuteEventParameters): Promise<void> {
        switch (event.itemId) {
            case 'COMMAND_COPYPAGETO':
                //Dialog.alert(`${this.properties.sampleTextOne}`);
                const pageTitle = event.selectedRows[0].getValueByName('FileLeafRef');
                const panel = new CopyPageToPanel({ filename: pageTitle });
                const panelResult = await panel.show();
                if (panelResult == PanelResultEnum.Ok) {
                    Dialog.alert(`page is copied.`);
                }
                break;
            default:
                throw new Error('Unknown command');
        }
    }
}
