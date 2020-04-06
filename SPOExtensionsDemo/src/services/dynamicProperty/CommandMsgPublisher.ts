import {
  IDynamicDataPropertyDefinition,
  IDynamicDataCallables
} from '@microsoft/sp-dynamic-data';
import { ICommandMsg } from './ICommandMsg';
import { MessagePublisherBase } from './MessagePublisherBase';

export class CommandMsgPublisher extends MessagePublisherBase<ICommandMsg> {
  public static COMMAND_MSG_ID = 'command';
  protected get propertyDefinitions(): IDynamicDataPropertyDefinition[] {
    return [{
      id: CommandMsgPublisher.COMMAND_MSG_ID,
      title: "Command",
      description: "The command publisher"
    }];
  }

  protected getDynamicPropertyValue(propertyId: string): ICommandMsg {
    let ret: ICommandMsg = null;
    if (propertyId == CommandMsgPublisher.COMMAND_MSG_ID) {
      ret = this._message;
    }
    return ret;

  }
}
