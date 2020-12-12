import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'M365ServicesStatusWebPartStrings';
import M365ServicesStatus from './components/M365ServicesStatus';
import { IM365ServicesStatusProps } from './components/IM365ServicesStatusProps';
import { sp } from "@pnp/sp/presets/all";

export interface IM365ServicesStatusWebPartProps {
  description: string;
}

export default class M365ServicesStatusWebPart extends BaseClientSideWebPart<IM365ServicesStatusWebPartProps> {
  protected onInit(): Promise<void> {

    return super.onInit().then(_ => {

      // other init code may be present

      sp.setup({
        spfxContext: this.context
      });
    });
  }

  public render(): void {
    const element: React.ReactElement<IM365ServicesStatusProps> = React.createElement(
      M365ServicesStatus,
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
