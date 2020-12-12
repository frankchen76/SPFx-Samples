import { IServiceStatus } from "./IServiceStatus";
import { IServiceStatusService } from "./IServiceStatusService";
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export class SPOStatusService implements IServiceStatusService {
  private _listTitle = "M365Monitor-ServiceStatus";

  public getServiceStatus(): Promise<IServiceStatus[]> {
    return sp.web.lists.getByTitle(this._listTitle).items.select("ID", "Title", "Status", "StatusDisplayName", "StatusTime").get();
  }
}
