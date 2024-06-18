import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { Web } from "@pnp/sp/webs";
import { getSP } from "./pnpjsconfig";
import { ApplicationCustomizerContext } from "@microsoft/sp-application-base";

export interface IDocumentInfo {
    title: string;
    url: string;
}

export class SPOService {
    constructor(private context?: ApplicationCustomizerContext) {
    }
    public async getDocuments(siteUrl: string, docLibTitle: string): Promise<IDocumentInfo[]> {
        const sp = getSP();
        const web = Web([sp.web, siteUrl]);
        const items: any[] = await web.lists.getByTitle(docLibTitle).items.select("ID", "FileLeafRef")();
        const ret: IDocumentInfo[] = items.map(item => {
            return {
                title: item.FileLeafRef.split("/")[item.FileLeafRef.split("/").length - 1],
                url: item.FileLeafRef
            };
        });
        return ret;
    }
}
let _instance: SPOService = null;

export const getSPOService = (context?: ApplicationCustomizerContext) => {
    if (_instance == null) {
        _instance = new SPOService(context);
    }
    return _instance;
}