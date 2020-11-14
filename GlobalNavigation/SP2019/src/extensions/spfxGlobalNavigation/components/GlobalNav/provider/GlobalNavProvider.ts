import IGlobalNavItem from "../model/IGlobalNavItem";
import ISPGlobalNavItem from "../model/ISPGlobalNavItem";
import "@pnp/polyfill-ie11";
import { sp, Web } from "@pnp/sp";

export default class GlobalNavProvider {
  constructor(private siteUrl: string) {
    // sp.setup({
    //   sp: {
    //     headers: {
    //       Accept: "application/json;odata=verbose"
    //     }
    //     //baseUrl: `${window.location.protocol}//${window.location.hostname}`
    //   }
    // });
  }

  public async getGlobalNavigation(): Promise<IGlobalNavItem[]> {
    console.log("URL:" + this.siteUrl);
    let web = new Web(this.siteUrl);
    const results = await web.lists
      .getByTitle("Global Nav List")
      .items.select(
        "Title",
        "Id",
        "GlobalNavUrl",
        "GlobalNavOpenInNewWindow",
        "GlobalNavParent/Title"
      )
      .top(2000)
      .expand("GlobalNavParent")
      .orderBy("GlobalNavOrder")
      .get();
    console.log(results);
    return await this.parseGlobalNavigationNodes(results);
  }

  private parseGlobalNavigationNodes(spGlobalNavItems: ISPGlobalNavItem[]): Promise<IGlobalNavItem[]> {
    return new Promise((resolve, reject) => {
      const depth: number = 0;
      let globalNavItems: IGlobalNavItem[] = [];
      spGlobalNavItems.forEach(
        (item: ISPGlobalNavItem): void => {
          if (!item.GlobalNavParent) {
            globalNavItems.push({
              title: item.Title,
              id: item.Id,
              url: item.GlobalNavUrl,
              openInNewWindow: item.GlobalNavOpenInNewWindow,
              subNavItems: this.getSubNavItems(spGlobalNavItems, item.Title, depth + 1),
              level: depth
            });
            console.log("pushed a item.");
          }
        }
      );
      console.log("globalNavItems");
      console.log(globalNavItems);
      resolve(globalNavItems);
    });
  }

  private getSubNavItems(
    spNavItems: ISPGlobalNavItem[],
    filter: string,
    depth: number
  ): IGlobalNavItem[] {
    let subNavItems: IGlobalNavItem[] = [];
    spNavItems.forEach(
      (item: ISPGlobalNavItem): void => {
        if (item.GlobalNavParent && item.GlobalNavParent.Title === filter) {
          subNavItems.push({
            title: item.Title,
            id: item.Id,
            url: item.GlobalNavUrl,
            openInNewWindow: item.GlobalNavOpenInNewWindow,
            subNavItems: this.getSubNavItems(spNavItems, item.Title, depth + 1),
            level: depth
          });
        }
      }
    );
    return subNavItems.length > 0 ? subNavItems : null;
  }
}
