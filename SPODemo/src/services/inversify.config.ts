import { EnvironmentType, Environment } from '@microsoft/sp-core-library';
import { WebPartContext } from '@microsoft/sp-webpart-base';

import 'reflect-metadata';
import { SPFxContainer } from '@ezcode/spfx-di/lib';
import {
  MockSPListService,
  SPOSPListService,
  GraphTaskService,
  MockTaskService,
  GraphUserService,
  MockUserService
} from '.';

export const TYPES = {
  SPListService: 'ISPListService',
  GraphTaskService: 'ITaskService',
  GraphUserService: 'IUserService'
};

export const mainContainer = new SPFxContainer<WebPartContext>([
  {
    serviceKey: TYPES.SPListService,
    serviceItems: [
      {
        targetName: EnvironmentType.SharePoint.toString(),
        service: SPOSPListService
      },
      {
        targetName: EnvironmentType.Local.toString(),
        service: MockSPListService
      }

    ]
  },
  {
    serviceKey: TYPES.GraphTaskService,
    serviceItems: [
      {
        targetName: EnvironmentType.SharePoint.toString(),
        service: GraphTaskService
      },
      {
        targetName: EnvironmentType.Local.toString(),
        service: MockTaskService
      }

    ]
  },
  {
    serviceKey: TYPES.GraphUserService,
    serviceItems: [
      {
        targetName: EnvironmentType.SharePoint.toString(),
        service: GraphUserService
      },
      {
        targetName: EnvironmentType.Local.toString(),
        service: MockUserService
      }

    ]
  }

], Environment.type.toString());

