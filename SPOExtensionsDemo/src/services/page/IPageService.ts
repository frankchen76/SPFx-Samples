import { IServiceBase } from '@ezcode/spfx-di/lib';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { ISiteItem, IPageItem } from '../';

export interface IPageService extends IServiceBase<WebPartContext> {
  getSitePages(location: string): Promise<IPageItem[]>;
  getAvailableSites(): Promise<ISiteItem[]>;
}
