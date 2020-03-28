import { ITaskService } from "./ITaskService";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { ITaskItem } from "./ITaskItem";

import { injectable, inject } from 'inversify';

@injectable()
export class MockTaskService implements ITaskService {
  public webPartContext: WebPartContext;
  public getTasks(): Promise<ITaskItem[]> {
    throw new Error("Method not implemented.");
  }

}
