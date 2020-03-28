import { IUserItem } from "./IUserItem";
import { IServiceBase } from "@ezcode/spfx-di";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IUserService extends IServiceBase<WebPartContext> {
  getSuggestedUsers(): Promise<IUserItem[]>;
  findUsers(searchText: string): Promise<IUserItem[]>;
}
