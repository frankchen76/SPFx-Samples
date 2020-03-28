import { ITaskItem } from "./ITaskItem";
import { IServiceBase } from "@ezcode/spfx-di";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ITaskService extends IServiceBase<WebPartContext> {
  getTasks(): Promise<ITaskItem[]>;
}
