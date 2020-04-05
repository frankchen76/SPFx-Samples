import * as React from 'react';
import * as ReactDom from 'react-dom';
import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer, PlaceholderContent, PlaceholderName
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';
import {
  IDynamicDataPropertyDefinition,
  IDynamicDataCallables
} from '@microsoft/sp-dynamic-data';

import * as strings from 'SpFxCustomizerApplicationCustomizerStrings';
import { autobind } from 'office-ui-fabric-react';
import { IHeaderProps } from './components/IHeaderProps';
// import { Header } from './components/Header';
import SPFxHeader from './components/Header';
import {
  ILocationMsg,
  ICommandMsg,
  CommandMsgPublisher,
  SingleMessageSubscriber,
  LocationMsgPublisher
} from '../../services';

import { SelectLocationPanel, ISelectLocationPanelOption, PanelResultEnum } from '../../components';
const LOG_SOURCE: string = 'SpFxCustomizerApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ISpFxCustomizerApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
}

export interface ILocation {
  address: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class SpFxCustomizerApplicationCustomizer
  extends BaseApplicationCustomizer<ISpFxCustomizerApplicationCustomizerProperties>{
  //extends BaseApplicationCustomizer<ISpFxCustomizerApplicationCustomizerProperties> implements IDynamicDataCallables {
  private EVENT_SOURCEID = "157f840d-246a-4044-a6fe-09d51c7940c5";
  private _currentSourceId: string;
  private _element: React.ReactElement<IHeaderProps>;
  private _elem1: React.Component<IHeaderProps, React.ComponentState, any>;

  private _headerPlaceholder: PlaceholderContent | undefined;
  private _location: ILocation = undefined;

  private _locationPublisher: LocationMsgPublisher;
  private _commandSubscriber: SingleMessageSubscriber<ICommandMsg>;

  @override
  public onInit(): Promise<void> {
    return super.onInit()
      .then(() => {
        Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

        let message: string = this.properties.testMessage;
        if (!message) {
          message = '(No properties were provided.)';
        }
        this.context.placeholderProvider.changedEvent.add(this, this._renderHeader);

        this._locationPublisher = new LocationMsgPublisher(this.context.dynamicDataSourceManager);
        this._commandSubscriber = new SingleMessageSubscriber<ICommandMsg>(this.context.dynamicDataProvider,
          this.context.manifest.alias,
          this.EVENT_SOURCEID,
          CommandMsgPublisher.COMMAND_MSG_ID,
          this._commandChangedHandler);

      });
  }

  @autobind
  private _commandChangedHandler(message: ICommandMsg) {
    if (message.command == "showPanel") {
      this._showLocationPanel();
    }
  }

  @autobind
  private _renderHeader(): void {
    if (!this._headerPlaceholder) {
      this._headerPlaceholder = this.context.placeholderProvider.tryCreateContent(PlaceholderName.Top, { onDispose: this._onDispose });

      if (this._headerPlaceholder == null) {
        console.error("Cannot find expected placeholder TOP");
      } else {
        this._renderSpfxHeader();
      }
    }
  }
  @autobind
  private _renderSpfxHeader(showPanel?: boolean): void {
    this._element = React.createElement(
      SPFxHeader,
      {
        showLocationPanel: this._showLocationPanel
      }
    );

    this._elem1 = ReactDom.render(this._element, this._headerPlaceholder.domElement) as React.Component<IHeaderProps, React.ComponentState, any>;

  }
  @autobind
  private _showLocationPanel() {
    const option: ISelectLocationPanelOption = {
      location: undefined
    };
    const panel = new SelectLocationPanel(option);
    panel.show().then(result => {
      if (result == PanelResultEnum.Ok) {
        this._locationPublisher.message = {
          location: option.location,
          message: 'location is selected'
        };
      }
    });

  }
  private _onDispose(): void {

  }
}
