import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'Sp2019TestWebPartStrings';
import Sp2019Test from './components/Sp2019Test';
import { ISp2019TestProps } from './components/ISp2019TestProps';

export interface ISp2019TestWebPartProps {
  description: string;
}

export default class Sp2019TestWebPart extends BaseClientSideWebPart<ISp2019TestWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ISp2019TestProps> = React.createElement(
      Sp2019Test,
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
