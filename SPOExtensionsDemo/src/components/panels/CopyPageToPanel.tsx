import * as ReactDOM from 'react-dom';
import * as React from 'react';

import { BasePanel, ICopyPageToPanelOption } from "../";

import { sp } from "@pnp/sp";
import "@pnp/sp/search";
import { ISearchQuery, SearchResults, SearchQueryBuilder } from "@pnp/sp/search";

export class CopyPageToPanel extends BasePanel<ICopyPageToPanelOption> {
  constructor(option: ICopyPageToPanelOption) {
    super(option);
  }

  public componentDidMount() {
  }

  public render(): JSX.Element {
    return (
      <div>
        {this._option.filename}
      </div>
    );
  }

}
