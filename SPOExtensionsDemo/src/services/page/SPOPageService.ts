import { IPageService } from './IPageService';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { injectable, inject } from 'inversify';
import { IPageItem, ISiteItem } from '../';
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

@injectable()
export class SPOPageService implements IPageService {
  private SITEPAGELIB = 'Site Pages';

  public async getSitePages(location: string): Promise<IPageItem[]> {
    const whereClause = location ? `<Query><Where><Eq><FieldRef Name='Location' /><Value Type='Choice'>${location}</Value></Eq></Where></Query>` : `<Query />`;
    const responseResult = await sp.web.lists.getByTitle(this.SITEPAGELIB).renderListDataAsStream({
      ViewXml: `<View>${whereClause}</View>`
    });

    return responseResult.Row.map(result => {
      return {
        id: result["ID"],
        title: result["Title"],
        thumbnailImage: result['BannerImageUrl'],
        url: result['FileRef']
      };
    });

  }
  public getAvailableSites(): Promise<ISiteItem[]> {
    throw new Error("Method not implemented.");
  }
  public webPartContext: WebPartContext;
}
