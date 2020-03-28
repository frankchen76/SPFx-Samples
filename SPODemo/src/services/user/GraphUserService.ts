import { graph } from "@pnp/graph";
import "@pnp/graph/planner";
import "@pnp/graph/users";

import { IUserService } from "./IUserService";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { MSGraphClient } from '@microsoft/sp-http';
import { IUserItem } from "./IUserItem";

import { injectable, inject } from 'inversify';
import { IUser } from "@pnp/graph/users";

@injectable()
export class GraphUserService implements IUserService {
  public webPartContext: WebPartContext;

  public async getSuggestedUsers(): Promise<IUserItem[]> {
    const graphClient = await this.webPartContext.msGraphClientFactory.getClient();
    const url = '/users?$top=5';

    const responseGraphUsers = await graphClient.api(url).get();

    // const graphUsers = await graphClient.api(url).get((error, response: any, rawResponse?: any) => {
    //   return response.value;
    // });
    let ret = new Array<IUserItem>();
    for (let graphUser of responseGraphUsers.value) {
      let userItem: IUserItem = {
        id: graphUser['id'],
        displayName: graphUser['displayName'],
        jobTitle: graphUser['jobTitle'],
        photo: ''
      };
      try {
        userItem.photo = await this._getPhoto(graphClient, userItem.id);
      } catch (error) {
        userItem.photo = '';
        console.log(error);
      }
      ret.push(userItem);
    }
    return ret;
  }

  private async _getPhoto(graphClient: MSGraphClient, id: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const url = `/users/${id}/photos/48x48/$value`;
      graphClient.api(url)
        .responseType('blob')
        .get()
        .then(blob => {
          var reader = new FileReader();
          reader.onloadend = (): void => {
            resolve(reader.result.toString());
            //console.log(base64data);
          };
          reader.readAsDataURL(blob);
        })
        .catch(error => { reject(error); });
    });
  }
  public findUsers(searchText: string): Promise<IUserItem[]> {
    throw Error("not implemented");
  }

}
