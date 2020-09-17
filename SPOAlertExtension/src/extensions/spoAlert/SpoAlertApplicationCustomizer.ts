import * as React from 'react';
import * as ReactDom from 'react-dom';
import { override } from '@microsoft/decorators';
import { Log, SPEventArgs } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer, PlaceholderContent, PlaceholderName
} from '@microsoft/sp-application-base';

import * as strings from 'SpoAlertApplicationCustomizerStrings';
import { AlertHeader } from './components/AlertHeader';
import { sp } from '@pnp/sp';

const LOG_SOURCE: string = 'SpoAlertApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ISpoAlertApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class SpoAlertApplicationCustomizer
  extends BaseApplicationCustomizer<ISpoAlertApplicationCustomizerProperties> {

  private _topPlaceholder: PlaceholderContent | undefined;
  private _bottomPlaceholder: PlaceholderContent | undefined;

  @override
  public onInit(): Promise<void> {
    return super.onInit().then(() => {
      sp.setup(this.context);
      Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

      let message: string = this.properties.testMessage;
      if (!message) {
        message = '(No properties were provided.)';
      }

      //Dialog.alert(`Hello from ${strings.Title}:\n\n${message}`);
      this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);
      this.context.application.navigatedEvent.add(this, (args: SPEventArgs) => {
        console.log(`navigatedEvent was called. ${args}`);
      });

    });

    // return Promise.resolve();
  }

  private _onDispose(): void {
    console.log('[HelloWorldApplicationCustomizer._onDispose] Disposed custom top and bottom placeholders.');
  }

  private _renderPlaceHolders(): void {
    console.log("HelloWorldApplicationCustomizer._renderPlaceHolders()");
    console.log(
      "Available placeholders: ",
      this.context.placeholderProvider.placeholderNames
        .map(name => PlaceholderName[name])
        .join(", ")
    );

    if (!this._topPlaceholder) {
      this._topPlaceholder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Top,
        { onDispose: this._onDispose }
      );
    }
    if (this._topPlaceholder) {
      const element = React.createElement(
        AlertHeader,
        {
          text: "(Top property was not defined.)",
          context: this.context
        }
      );

      ReactDom.render(element, this._topPlaceholder.domElement);// as React.Component<IHeaderProps, React.ComponentState, any>;

    } else {
      console.error("The expected placeholder (Top) was not found.");
    }

  }
}
