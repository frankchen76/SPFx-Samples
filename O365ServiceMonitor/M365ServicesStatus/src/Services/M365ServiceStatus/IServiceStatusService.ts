import { IServiceStatus } from "./IServiceStatus";

export interface IServiceStatusService {
  getServiceStatus(): Promise<IServiceStatus[]>;
}
