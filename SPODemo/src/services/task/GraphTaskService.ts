import { graph } from "@pnp/graph";
import "@pnp/graph/planner";
import "@pnp/graph/users";

import { ITaskService } from "./ITaskService";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { ITaskItem } from "./ITaskItem";

import { injectable, inject } from 'inversify';

@injectable()
export class GraphTaskService implements ITaskService {
  public webPartContext: WebPartContext;

  public async getTasks(): Promise<ITaskItem[]> {
    const url = `/me/planner/tasks?$expand=details`;
    const graphClient = await this.webPartContext.msGraphClientFactory.getClient();
    const response = await graphClient.api(url).get();
    return response.value.map(val => {
      return {
        id: val['id'],
        title: val['title'],
        details: val['details']['description'],
        dueDateTime: val['dueDateTime']
      };
    });
    // return new Promise(resolve => {
    //   this.webPartContext.msGraphClientFactory.getClient()
    //     .then(client => {
    //       client.api(url).get((error, response: any, rawResponse?: any) => {
    //         resolve(response.value.map(task => {
    //           return {
    //             ID: task['id'],
    //             Title: task['title']
    //           };
    //         }));
    //       });
    //     });
    // });
  }

}
