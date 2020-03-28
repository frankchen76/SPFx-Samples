import { ISPListService } from './ISPListService';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { injectable, inject } from 'inversify';
import { ServiceFactory, IServiceFactory } from '@ezcode/spfx-di/lib';
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

@injectable()
export class SPOSPListService implements ISPListService {
  public webPartContext: WebPartContext;

  public getListItems(listTitle: string): Promise<any[]> {
    return sp.web.lists.getByTitle(listTitle).items.getAll();
    // .then(result => {
    //     return result.map(item => {
    //         return {
    //             Title: item['Title'],
    //             ID: item['ID'],
    //             Price: item['Price'],
    //             OrderType: item['OrderType']
    //         };
    //     });
    // });
  }
}
