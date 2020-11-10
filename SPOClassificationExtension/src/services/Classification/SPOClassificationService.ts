import { ApplicationCustomizerContext } from "@microsoft/sp-application-base";
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { IClassificationService } from "./IClassificationService";

export class SPOClassificationService implements IClassificationService {

  constructor(private context: ApplicationCustomizerContext) {
  }
  public async getClassification(): Promise<string> {
    let nowString = new Date().toISOString();
    let url = `${this.context.pageContext.web.absoluteUrl}/_api/site?$select=Classification`;
    let response = await this.context.spHttpClient.get(url, SPHttpClient.configurations.v1);
    let ret = await response.json();
    return ret['Classification'];
  }

}
