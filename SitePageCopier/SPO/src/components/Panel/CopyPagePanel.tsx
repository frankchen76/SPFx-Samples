import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { BasePanel, IBasePanelOption, PanelResultEnum } from './BasePanel';
import { cloneDeep, find } from '@microsoft/sp-lodash-subset';
import { IPageServices } from '../../services/IPageServices';
import { CopyPageComponent } from './CopyPageComponent';
import { IPage } from '../../services/IPage';

export interface ICopyPagePanelOption extends IBasePanelOption {
  selectedPages: IPage[];
  iPageService: IPageServices;
}
export class CopyPagePanel extends BasePanel {
  public pageTemplate: string;

  constructor(private _configOption: ICopyPagePanelOption) {
    super(_configOption);
  }

  // private onColumnSettingsChanged = (settings: IColumnSetting[]) => {
  //   // this.pageTemplate = cloneDeep(this._configOption.pageTemplate);
  //   // this.pageTemplate.columnSettings = settings;
  // }

  public render(): JSX.Element {
    const closeHandler = this._close.bind(this);
    return (
      <CopyPageComponent
        iPageService={this._configOption.iPageService}
        selectedPages={this._configOption.selectedPages}
        onClose={closeHandler} />
    );
  }
}
