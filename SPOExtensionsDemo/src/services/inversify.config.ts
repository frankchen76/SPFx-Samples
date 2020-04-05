import { EnvironmentType, Environment } from '@microsoft/sp-core-library';
import { WebPartContext } from '@microsoft/sp-webpart-base';

import 'reflect-metadata';
import { SPFxContainer } from '@ezcode/spfx-di/lib';
import { MockPageService, SPOPageService } from '.';

export const TYPES = {
  IPageService: 'IPageService'
};

export const mainContainer = new SPFxContainer<WebPartContext>([
  {
    serviceKey: TYPES.IPageService,
    serviceItems: [
      {
        targetName: EnvironmentType.SharePoint.toString(),
        service: SPOPageService
      },
      {
        targetName: EnvironmentType.Local.toString(),
        service: MockPageService
      }

    ]
  }
], Environment.type.toString());

