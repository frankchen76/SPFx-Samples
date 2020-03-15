import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
    IPropertyPaneConfiguration,
    PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'SampleWpWebPartStrings';
import SampleWp from './components/SampleWp';
import { ISampleWpProps } from './components/ISampleWpProps';
import { setup as pnpSetup } from "@pnp/common";
import { sp } from "@pnp/sp";

export interface ISampleWpWebPartProps {
    description: string;
}

export default class SampleWpWebPart extends BaseClientSideWebPart<ISampleWpWebPartProps> {
    protected onInit(): Promise<void> {

        return super.onInit().then(_ => {

            // other init code may be present

            pnpSetup({
                spfxContext: this.context
            });
            // sp.setup({
            //     // set ie 11 mode
            //     ie11: true,
            //     // only needed when working within SharePoint Framework
            //     spfxContext: this.context
            // });
        });
    }
    public render(): void {
        const element: React.ReactElement<ISampleWpProps> = React.createElement(
            SampleWp,
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
