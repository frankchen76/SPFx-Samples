import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'PeoplePickerDemoWebPartStrings';
import PeoplePickerDemo from './components/PeoplePickerDemo';
import { IPeoplePickerDemoProps } from './components/IPeoplePickerDemoProps';

import "reflect-metadata";
import { sp } from '@pnp/sp/presets/all';
import { graph } from "@pnp/graph";
import { mainContainer } from "../../services";

export interface IPeoplePickerDemoWebPartProps {
  description: string;
}

export default class PeoplePickerDemoWebPart extends BaseClientSideWebPart<IPeoplePickerDemoWebPartProps> {

  protected async onInit(): Promise<void> {
    return super.onInit().then(_ => {
      sp.setup({
        spfxContext: this.context
      });
      graph.setup({
        spfxContext: this.context
      });

      mainContainer.registerWebPartContext(this.context);
    });
    // await super.onInit();
    // // other init code may be present
    // //init spfx-di
    // mainContainer.registerWebPartContext(this.context);
    // sp.setup(this.context);
  }

  public render(): void {
    const element: React.ReactElement<IPeoplePickerDemoProps> = React.createElement(
      PeoplePickerDemo,
      {
        description: this.properties.description
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
