import * as ReactDOM from 'react-dom';
import * as React from 'react';

import { BasePanel, SelectLocationComponent, ISelectLocationPanelOption } from "../";
import { ChoiceGroup, IChoiceGroupOption, autobind, Spinner } from 'office-ui-fabric-react';

export class SelectLocationPanel extends BasePanel<ISelectLocationPanelOption> {

  constructor(option?: ISelectLocationPanelOption) {
    super(option);
  }

  @autobind
  private _onSelected(location: string): void {
    this._option.location = location;
  }

  public render(): JSX.Element {
    return (
      <SelectLocationComponent onSelected={this._onSelected} />
    );
  }

}

