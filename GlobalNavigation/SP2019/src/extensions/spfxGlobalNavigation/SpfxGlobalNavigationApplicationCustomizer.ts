import * as React from "react";
import * as ReactDom from "react-dom";
import { override } from "@microsoft/decorators";
import { Log } from "@microsoft/sp-core-library";
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from "@microsoft/sp-application-base";
import GlobalNav from "./components/GlobalNav/GlobalNav";
import * as strings from "SpfxGlobalNavigationApplicationCustomizerStrings";
import "@pnp/polyfill-ie11";
import { sp } from "@pnp/sp";

const LOG_SOURCE: string = "SpfxGlobalNavigationApplicationCustomizer";

export interface ISpfxGlobalNavigationApplicationCustomizerProperties { }

export default class SpfxGlobalNavigationApplicationCustomizer extends BaseApplicationCustomizer<
  ISpfxGlobalNavigationApplicationCustomizerProperties
  > {
  private topPlaceholder: PlaceholderContent | undefined;

  @override
  public onInit(): Promise<void> {
    sp.setup({
      spfxContext: this.context
    });

    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    this.context.placeholderProvider.changedEvent.add(
      this,
      this.renderPlaceHolders
    );

    return Promise.resolve();
  }

  private renderPlaceHolders(): void {
    console.log("URL: " + this.context.pageContext.web.absoluteUrl);
    if (!this.topPlaceholder) {
      this.topPlaceholder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Top
      );

      if (!this.topPlaceholder) {
        return;
      }

      if (this.topPlaceholder.domElement) {
        const element: React.ReactElement<{}> = React.createElement(
          GlobalNav,
          { webUrl: this.context.pageContext.web.absoluteUrl }
        );
        ReactDom.render(element, this.topPlaceholder.domElement);
      }
    }
  }
}
