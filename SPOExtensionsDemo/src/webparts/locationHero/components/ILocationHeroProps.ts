import { ILocationMsg } from "../../../services/dynamicProperty/ILocationMsg";
import { CommandMsgPublisher } from "../../../services/dynamicProperty/CommandMsgPublisher";

export interface ILocationHeroProps {
  description: string;
  location: ILocationMsg;
  commandPublisher: CommandMsgPublisher;
}
