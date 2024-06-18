import { createContext, useContext } from "react";
import { SettingService } from "./SettingService";

export interface IServiceContext {
    settingService: SettingService;
}

export const ServiceContext = createContext<IServiceContext>(null);
export const useServiceContext = (): IServiceContext => useContext(ServiceContext);

