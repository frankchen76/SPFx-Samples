import { IUserService } from "./IUserService";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IUserItem } from "./IUserItem";

import { injectable, inject } from 'inversify';

@injectable()
export class MockUserService implements IUserService {
  public webPartContext: WebPartContext;
  public getSuggestedUsers(): Promise<IUserItem[]> {
    throw Error("not implemented");
  }
  public findUsers(searchText: string): Promise<IUserItem[]> {
    throw Error("not implemented");
  }

}
