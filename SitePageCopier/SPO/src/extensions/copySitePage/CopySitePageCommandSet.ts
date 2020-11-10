import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseListViewCommandSet,
  Command,
  IListViewCommandSetListViewUpdatedParameters,
  IListViewCommandSetExecuteEventParameters
} from '@microsoft/sp-listview-extensibility';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'CopySitePageCommandSetStrings';
import { CopyPagePanel } from '../../components/Panel/CopyPagePanel';
import { SPOPageServices } from '../../services/SPOPageServices';
import { sp } from '@pnp/sp';
import { IPage } from '../../services/IPage';


/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ICopySitePageCommandSetProperties {
  // This is an example; replace with your own properties
  sampleTextOne: string;
  sampleTextTwo: string;
}

const LOG_SOURCE: string = 'CopySitePageCommandSet';

export default class CopySitePageCommandSet extends BaseListViewCommandSet<ICopySitePageCommandSetProperties> {

  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, 'Initialized CopySitePageCommandSet');
    sp.setup({
      spfxContext: this.context
    });

    return Promise.resolve();
  }

  @override
  public onListViewUpdated(event: IListViewCommandSetListViewUpdatedParameters): void {
    const compareOneCommand: Command = this.tryGetCommand('COMMAND_COPYPAGE');
    if (compareOneCommand) {
      // This command should be hidden unless exactly one row is selected.
      compareOneCommand.visible = window.location.href.toLowerCase().indexOf('sitepages') != -1 && event.selectedRows.length > 0;
    }
  }

  @override
  public async onExecute(event: IListViewCommandSetExecuteEventParameters): Promise<void> {
    const selectedPages: IPage[] = event.selectedRows.map(row => { return { ID: +row.getValueByName("ID"), FileRef: row.getValueByName("FileRef") }; });
    console.log(event.selectedRows[0].getValueByName("FileRef"));
    switch (event.itemId) {
      case 'COMMAND_COPYPAGE':
        //Dialog.alert(`${this.properties.sampleTextOne}`);
        let panel = new CopyPagePanel({
          selectedPages: selectedPages,
          iPageService: new SPOPageServices(this.context),
          headerText: '',
          closeButtonAriaLabel: 'Close',
          isFooterAtBottom: false,
          hideFooter: true
        });
        let result = await panel.show();

        break;
      default:
        throw new Error('Unknown command');
    }
  }
}
