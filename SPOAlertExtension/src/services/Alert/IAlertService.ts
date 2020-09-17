import { IAlert } from "./IAlert";

export interface IAlertService {
  getCurrentAlerts(): Promise<IAlert[]>;
  getCurrentAlertsPnP(): Promise<IAlert[]>;
}
