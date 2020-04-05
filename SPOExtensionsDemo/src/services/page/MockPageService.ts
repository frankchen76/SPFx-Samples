import { IPageService } from './IPageService';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { injectable, inject } from 'inversify';
import { IPageItem, ISiteItem } from '../';

@injectable()
export class MockPageService implements IPageService {
  public webPartContext: WebPartContext;

  constructor() {
  }
  public getSitePages(location: string): Promise<IPageItem[]> {
    throw new Error("Method not implemented.");
  }
  public getAvailableSites(): Promise<ISiteItem[]> {
    throw new Error("Method not implemented.");
  }
}
