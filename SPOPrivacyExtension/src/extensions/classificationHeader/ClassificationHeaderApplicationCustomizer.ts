import * as React from 'react';
import * as ReactDom from 'react-dom';
import { override } from '@microsoft/decorators';
import { Log, SPEventArgs } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer, PlaceholderContent, PlaceholderName
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'ClassificationHeaderApplicationCustomizerStrings';
import { NotificationHeader } from './components/NotificationHeader';

const LOG_SOURCE: string = 'ClassificationHeaderApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IClassificationHeaderApplicationCustomizerProperties {
  // This is an example; replace with your own property
  message: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class ClassificationHeaderApplicationCustomizer
  extends BaseApplicationCustomizer<IClassificationHeaderApplicationCustomizerProperties> {

  private _topPlaceholder: PlaceholderContent | undefined;

  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    let message: string = this.properties.message;
    if (!message) {
      message = '(No properties were provided.)';
    }

    // Dialog.alert(`Hello from ${strings.Title}:\n\n${message}`);
    this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);
    this.context.application.navigatedEvent.add(this, (args: SPEventArgs) => {
      console.log(`navigatedEvent was called. ${args}`);
    });

    return Promise.resolve();
  }
  private _onDispose(): void {
    console.log('[ClassificationHeaderApplicationCustomizer._onDispose] Disposed custom top and bottom placeholders.');
  }

  private _renderPlaceHolders(): void {
    console.log("ClassificationHeaderApplicationCustomizer._renderPlaceHolders()");
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
        NotificationHeader,
        {
          context: this.context,
          message: this.properties.message
        }
      );

      ReactDom.render(element, this._topPlaceholder.domElement);// as React.Component<IHeaderProps, React.ComponentState, any>;

    } else {
      console.error("The expected placeholder (Top) was not found.");
    }

  }
}
