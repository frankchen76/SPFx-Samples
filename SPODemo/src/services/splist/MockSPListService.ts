import { ISPListService } from './ISPListService';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { injectable, inject } from 'inversify';
import { ServiceFactory, IServiceFactory } from '@ezcode/spfx-di/lib';
import { IOrderListItem } from './IOrderListItem';

@injectable()
export class MockSPListService implements ISPListService {
  public webPartContext: WebPartContext;

  constructor() {
  }
  public getListItems(listTitle: string): Promise<any[]> {
    return new Promise(resolve => {
      let ret = [{
        ID: 1,
        Title: 'Test',
        Price: 1.99,
        OrderType: 'Meat'
      }];
      resolve(ret);
    });
    // if (this._invnetoryService)
    //   ret.push(this._invnetoryService.getInventory());
  }
}
