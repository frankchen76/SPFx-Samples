import { ApplicationCustomizerContext } from "@microsoft/sp-application-base";
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { IGraphGroup } from "./IGraphGroup";
import { IGraphUser } from "./IGraphUser";
import { IPrivacyService } from "./IPrivacyService";

export class SPOPrivacyService implements IPrivacyService {

  constructor(private context: ApplicationCustomizerContext) {
  }

  public async getCurrentUser(): Promise<IGraphUser> {
    let url = `https://graph.microsoft.com/v1.0/me`;
    const graphClient = await this.context.msGraphClientFactory.getClient();
    const result = await graphClient
      .api(url)
      .select(['id', 'displayName', 'userPrincipalName', 'mail'])
      .get();

    return result;
  }
  public async isOwner(): Promise<boolean> {
    const currentUser = await this.getCurrentUser();
    const currentGroup = await this.getCurrentGroup();
    const url = `https://graph.microsoft.com/v1.0/groups/${currentGroup.id}/owners/${currentUser.id}`;
    let ret = false;

    try {
      const graphClient = await this.context.msGraphClientFactory.getClient();
      const result = await graphClient
        .api(url)
        .select(['id'])
        .get();

      ret = true;

    } catch (error) {
      ret = false;
    }
    return ret;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }

  public async getCurrentGroup(delay: number = 3000): Promise<IGraphGroup> {
    let ret: IGraphGroup = null;
    let url = `${this.context.pageContext.web.absoluteUrl}/_api/site`;
    let response = await (await this.context.spHttpClient.get(url, SPHttpClient.configurations.v1)).json();
    const siteId = response['GroupId'];

    if (siteId == "00000000-0000-0000-0000-000000000000") {
      //communication site
    } else {
      //Team Site
      //Sleep as Privacy might not be able to update on time.
      await this.sleep(delay);

      url = `https://graph.microsoft.com/v1.0/groups/${siteId}`;
      const graphClient = await this.context.msGraphClientFactory.getClient();
      ret = await graphClient
        .api(url)
        .select(['visibility', 'displayName', 'id'])
        .get();
    }
    return ret;

  }

}
