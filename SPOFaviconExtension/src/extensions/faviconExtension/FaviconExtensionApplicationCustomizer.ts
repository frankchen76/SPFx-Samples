import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'FaviconExtensionApplicationCustomizerStrings';

const LOG_SOURCE: string = 'FaviconExtensionApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IFaviconExtensionApplicationCustomizerProperties {
  // This is an example; replace with your own property
  faviconUrl: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class FaviconExtensionApplicationCustomizer
  extends BaseApplicationCustomizer<IFaviconExtensionApplicationCustomizerProperties> {
  private _intervalHandler;
  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    // Dialog.alert(`Hello from ${strings.Title}:\n\n${message}`);
    this._intervalHandler = setInterval(this.timerHandler.bind(this), 100, null);

    return Promise.resolve();
  }
  private timerHandler() {
    let xpath = "//link[@rel='shortcut icon']";
    let elemFavicon = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue as HTMLElement;
    if (elemFavicon) {
      clearInterval(this._intervalHandler);
      if (elemFavicon.hasAttribute("href")) {
        elemFavicon.setAttribute("href", "/sites/ContosoAssets/OrgAssets/favicon.ico");
      }
    }
  }
}
