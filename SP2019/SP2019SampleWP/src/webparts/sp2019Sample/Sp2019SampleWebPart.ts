import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'Sp2019SampleWebPartStrings';
import Sp2019Sample from './components/Sp2019Sample';
import { ISp2019SampleProps } from './components/ISp2019SampleProps';

export interface ISp2019SampleWebPartProps {
  description: string;
}

export default class Sp2019SampleWebPart extends BaseClientSideWebPart<ISp2019SampleWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ISp2019SampleProps> = React.createElement(
      Sp2019Sample,
      {
        description: this.properties.description,
        wpContext: this.context
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
