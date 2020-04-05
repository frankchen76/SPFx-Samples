import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'LocationHeroWebPartStrings';
import LocationHero from './components/LocationHero';
import { ILocationHeroProps } from './components/ILocationHeroProps';

import { autobind } from 'office-ui-fabric-react';
import { IDynamicDataPropertyDefinition, IDynamicDataCallables } from '@microsoft/sp-dynamic-data';
import { SingleMessageSubscriber } from '../../services/dynamicProperty/SingleMessageSubscriber';
import { ILocationMsg } from '../../services/dynamicProperty/ILocationMsg';
import { LocationMsgPublisher } from '../../services/dynamicProperty/LocationMsgPublisher';
import { CommandMsgPublisher } from '../../services/dynamicProperty/CommandMsgPublisher';
import { sp } from "@pnp/sp/presets/all";

import "reflect-metadata";
import { mainContainer } from "../../services";

export interface ILocationHeroWebPartProps {
  description: string;
  location: ILocationMsg;
}

export default class LocationHeroWebPart extends BaseClientSideWebPart<ILocationHeroWebPartProps> {

  private EVENT_SOURCEID = "0c6626f9-6c11-4d8d-82ee-1be30f37f7fc";
  private _currentSourceId: string;
  private _locationSubscriber: SingleMessageSubscriber<ILocationMsg>;
  private _commandPublisher: CommandMsgPublisher;

  protected onInit() {
    return super.onInit()
      .then(() => {
        sp.setup({
          spfxContext: this.context
        });

        mainContainer.registerWebPartContext(this.context);

        //register command dynamic property
        //this.context.dynamicDataSourceManager.initializeSource(this);
        this._commandPublisher = new CommandMsgPublisher(this.context.dynamicDataSourceManager);
        this._locationSubscriber = new SingleMessageSubscriber<ILocationMsg>(this.context.dynamicDataProvider,
          this.context.manifest.alias,
          this.EVENT_SOURCEID,
          LocationMsgPublisher.LOCATION_MSG_ID,
          this._locationSubscriberHandler);

      });
  }

  @autobind
  private _locationSubscriberHandler(val: ILocationMsg): void {
    this.properties.location = val;
    this.render();
  }

  public render(): void {
    const element: React.ReactElement<ILocationHeroProps> = React.createElement(
      LocationHero,
      {
        description: this.properties.description,
        location: this.properties.location,
        commandPublisher: this._commandPublisher
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
