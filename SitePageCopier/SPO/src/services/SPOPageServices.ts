import { IDropdownOption } from "office-ui-fabric-react/lib/Dropdown";
import { BaseComponentContext } from "@microsoft/sp-component-base";
import { find } from "@microsoft/sp-lodash-subset";
import { IPageServices } from "./IPageServices";
import { sp } from "@pnp/sp";
import "@pnp/sp/search";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/clientside-pages/web";
import { Web } from "@pnp/sp/webs";

import { ISearchQuery, SearchResults, SearchQueryBuilder } from "@pnp/sp/search";
import { IPage } from "./IPage";
import { IPageCopyProgress } from "./IPageCopyProgress";

//import "@pnp/sp/webs";
//import "@pnp/sp/comments/clientside-page";

export class SPOPageServices implements IPageServices {
  constructor(private spfxContext: BaseComponentContext) {
  }
  // public getCurrentSiteUrl():string{
  //     return this.spfxContext.pageContext.web.absoluteUrl;
  // }
  public async getSites(): Promise<IDropdownOption[]> {
    const query = "contentclass:sts_site";
    const results: SearchResults = await sp.search(<ISearchQuery>{
      Querytext: query,
      RowLimit: 50,
      EnableInterleaving: true,
    });

    let ret = new Array<IDropdownOption>();
    for (let item of results.PrimarySearchResults) {
      ret.push({
        text: item.Title,
        key: item.Path
      });
    }
    return ret;

    // return sp.search(query)
    //   .then((result: SearchResults) => {
    //     let ret = new Array<IDropdownOption>();
    //     for (let item of result.PrimarySearchResults) {
    //       ret.push({
    //         text: item.Title,
    //         key: item.Path
    //       });
    //     }
    //     return ret;
    //   });
  }

  public async copyPages(pages: IPage[], sites: string[], onCopyProgress: (args: IPageCopyProgress) => void): Promise<void> {
    //const url = `${this.spfxContext.pageContext.site.absoluteUrl}/`;
    for (let site of sites) {
      for (let i = 0; i < pages.length; i++) {
        //update progress
        onCopyProgress({
          site: site,
          message: `Copying ${pages[i].FileRef.split("/")[pages[i].FileRef.split("/").length - 1]}`,
          progress: Math.round(i * 100 / pages.length)
        });

        const pageItem: IPage = await sp.web.lists.getByTitle('Site Pages').items.getById(pages[i].ID).select("Title", "FileRef", "CanvasContent1").get();
        const targetWeb = Web(site);
        const page = await targetWeb.addClientsidePage(pageItem.FileRef.split("/")[pageItem.FileRef.split("/").length - 1], pageItem.Title);
        await page.save();
        const targetPageItem = await page.getItem();
        await targetPageItem.update({ CanvasContent1: pageItem.CanvasContent1 });
      }
      //update progress
      onCopyProgress({
        site: site,
        progress: 100,
        message: 'Done.'
      });
    }

  }
  public async copyPagesToSite(pages: IPage[], site: string): Promise<void> {
    for (let p of pages) {
      const pageItem: IPage = await sp.web.lists.getByTitle('Site Pages').items.getById(p.ID).select("Title", "FileRef", "CanvasContent1").get();
      const targetWeb = Web(site);
      const page = await targetWeb.addClientsidePage(pageItem.FileRef.split("/")[pageItem.FileRef.split("/").length - 1], pageItem.Title);
      await page.save();
      const targetPageItem = await page.getItem();
      await targetPageItem.update({ CanvasContent1: pageItem.CanvasContent1 });
    }

  }
}
