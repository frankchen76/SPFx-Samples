import { IServiceBase } from '@ezcode/spfx-di/lib';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface ISPListService extends IServiceBase<WebPartContext> {
  getListItems(listTitle: string): Promise<any[]>;
}
