import { IDropdownOption } from 'office-ui-fabric-react';
import { IPage } from './IPage';
import { IPageCopyProgress } from './IPageCopyProgress';

export interface IPageServices {
  getSites(): Promise<IDropdownOption[]>;
  copyPages(pages: IPage[], sites: string[], onCopyProgress: (args: IPageCopyProgress) => void): Promise<void>;
  copyPagesToSite(pages: IPage[], site: string): Promise<void>;
}
