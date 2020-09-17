import { ApplicationCustomizerContext } from "@microsoft/sp-application-base";
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { IAlert } from "./IAlert";
import { IAlertService } from "./IAlertService";
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

export class SPOAlertService implements IAlertService {
  private readonly ALERTS_LISTTITLE = 'Alerts';

  constructor(private context: ApplicationCustomizerContext) {
  }
  public async getCurrentAlerts(): Promise<IAlert[]> {
    let nowString = new Date().toISOString();
    let url = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getByTitle('${this.ALERTS_LISTTITLE}')/items?$filter=AlertStart le datetime'${nowString}' and AlertEnd ge datetime'${nowString}'&$select=ID,AlertType,AlertMessage,MoreInformation&$orderby=AlertEnd`;
    let response = await this.context.spHttpClient.get(url, SPHttpClient.configurations.v1);
    let ret = await response.json();
    return ret['value'] as IAlert[];
  }
  public async getCurrentAlertsPnP(): Promise<IAlert[]> {
    let nowString = new Date().toISOString();
    let filterClause = `AlertStart le datetime'${nowString}' and AlertEnd ge datetime'${nowString}'`;
    let selectClause = `ID,AlertType,AlertMessage,MoreInformation`;
    let sortClause = `AlertEnd`;

    return sp.web.lists.getByTitle(this.ALERTS_LISTTITLE).items.filter(filterClause).select(selectClause).orderBy(sortClause, true).get<IAlert[]>();
  }

}
