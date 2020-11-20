import { IGraphGroup } from "./IGraphGroup";
import { IGraphUser } from "./IGraphUser";

export interface IPrivacyService {
  getCurrentGroup(delay?: number): Promise<IGraphGroup>;
  getCurrentUser(): Promise<IGraphUser>;
  isOwner(): Promise<boolean>;
}
