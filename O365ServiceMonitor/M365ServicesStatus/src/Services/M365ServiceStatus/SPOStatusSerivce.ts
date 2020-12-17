import { IServiceStatus } from "./IServiceStatus";
import { IServiceStatusService } from "./IServiceStatusService";
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { ICamlQuery } from "@pnp/sp/lists";
import { IBatch } from "./IBatch";
import { sortBy } from "@microsoft/sp-lodash-subset";

export class SPOStatusService implements IServiceStatusService {
  private _statusListTitle = "M365Monitor-ServiceStatus";
  private _batchListTitle = "M365Monitor-Batch";

  public async getServiceStatus(): Promise<IServiceStatus[]> {
    var camlQuery: ICamlQuery = {
      ViewXml: `<View>
      <Query>
         <Where><Geq><FieldRef Name='Created' /><Value Type='DateTime'><Today /></Value></Geq></Where>
      </Query>
       <ViewFields><FieldRef Name='ID' /><FieldRef Name='Title' /></ViewFields>
      <RowLimit>1</RowLimit>
      </View>`
    };
    const batchResult: IBatch[] = await sp.web.lists.getByTitle(this._batchListTitle).getItemsByCAMLQuery(camlQuery);
    if (batchResult.length == 1) {
      camlQuery.ViewXml = `<View>
            <Query>
              <Where><Eq><FieldRef Name='BatchId' /><Value Type='Text'>${batchResult[0].Title}</Value></Eq></Where>
            </Query>
            <ViewFields><FieldRef Name='ID' /><FieldRef Name='Title' /><FieldRef Name='Status' /><FieldRef Name='StatusDisplayName' /><FieldRef Name='Workload' /><FieldRef Name='WorkloadDisplayName' /><FieldRef Name='StatusTime' /><FieldRef Name='JSON' /></ViewFields>
      </View>`;

      const serviceResult = await sp.web.lists.getByTitle(this._statusListTitle).getItemsByCAMLQuery(camlQuery);
      return sortBy(serviceResult, ['Status', 'WorkloadDisplayName']);
    } else {
      return null;
    }

  }
}
