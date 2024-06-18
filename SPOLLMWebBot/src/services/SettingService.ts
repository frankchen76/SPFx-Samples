import { getSP } from "./pnpjsconfig";
import "@pnp/sp/user-custom-actions";
import { IUserCustomActionUpdateResult } from '@pnp/sp/user-custom-actions';
import { IAIService, getAzureOpenAIService } from "./AzureOpenAIService";
import { SPOService, getSPOService } from "./SPOService";
import { info } from "./log";

interface TypedHash<T> {
    [key: string]: T;
}

export interface IBotSettings {
    spoSiteUrl: string;
    spoDocLib: string;
    enabled: boolean;
    selectedDocuments: string[];
    aiServiceKey: string;
    aiServiceUrl: string;

    aiSearchUrl: string;
    aiSearchIndex: string;
    aiSearchConfig: string;
    aiSearchKey: string;
}
export class SettingService {
    private static _settingService: SettingService;
    private _settings: IBotSettings;
    private _aiService: IAIService;
    private _spoService: SPOService;

    constructor(settings?: IBotSettings) {
        this._settings = settings;
        this._spoService = getSPOService();
        this._aiService = getAzureOpenAIService(this._settings);
    }
    public get settings(): IBotSettings {
        return this._settings;
    }
    public get aiService(): IAIService {
        return this._aiService;
    }
    public get spoService(): SPOService {
        return this._spoService;
    }

    public static getSettingService = (settings?: IBotSettings): SettingService => {
        if (!this._settingService) {
            this._settingService = new SettingService(settings);
        }
        return this._settingService;
    }
    public saveSettings = async (): Promise<void> => {
        const sp = getSP();
        const uca = sp.web.userCustomActions.getById("fc2fe0b6-fdb9-400a-960f-ff1f20ebe786");

        const newValues: TypedHash<string> = {
            "spoSiteUrl": this._settings.spoSiteUrl,
            "spoDocLib": this._settings.spoDocLib,
            "enabled": this._settings.enabled.toString(),
            "selectedDocuments": JSON.stringify(this._settings.selectedDocuments),
            "aiServiceKey": this._settings.aiServiceKey,
            "aiServiceUrl": this._settings.aiServiceUrl
        };

        const response: IUserCustomActionUpdateResult = await uca.update(newValues);
        info("saveSettings-response:", response);

    }
}