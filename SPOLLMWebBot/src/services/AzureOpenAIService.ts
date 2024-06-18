import { ApiKeyAuthHeader, HttpClientService } from "./HttpClientService";
import { IBotSettings } from "./SettingService";
import { info } from "./log";

interface IMessage {
    role: string;
    content: string;
}
export interface IAIService {
    setDocuments: (documents: string[]) => void;
    clearMessages: () => void;
    getAnswer: (question: string) => Promise<string>;
}
class AzureOpenAIService extends HttpClientService {
    public _documents: string[] = [];
    private _messages: IMessage[] = [];

    constructor(private botSettings: IBotSettings) {
        super(new ApiKeyAuthHeader(botSettings.aiServiceKey));
    }
    public setDocuments = (documents: string[]): void => {
        this._documents = [];
        documents.forEach((doc) => { this._documents.push(doc) });
        //also need to clear messages
        this._messages = [];
    }
    public clearMessages = (): void => {
        this._messages = [];
    }
    public getAnswer = async (question: string): Promise<string> => {
        const { aiSearchConfig, aiSearchIndex, aiSearchKey, aiSearchUrl, aiServiceUrl } = this.botSettings;
        // "metadata_spo_item_name eq 'Power Platform product licensing FAQ.docx'"
        const filter = this._documents.length === 0 ? "" : this._documents.map((doc) => `metadata_spo_item_name eq '${doc}'`).join(" or ");
        this._messages.push({ role: "user", content: question });
        const body = {
            "data_sources": [
                {
                    "type": "azure_search",
                    "parameters": {
                        "endpoint": aiSearchUrl,
                        "index_name": aiSearchIndex,
                        "semantic_configuration": aiSearchConfig,
                        "query_type": "semantic",
                        "fields_mapping": {},
                        "in_scope": true,
                        "role_information": "You are an AI assistant that helps people find information.",
                        "filter": filter,
                        "strictness": 3,
                        "top_n_documents": 5,
                        "authentication": {
                            "type": "api_key",
                            "key": aiSearchKey
                        }
                    }
                }
            ],
            "messages": this._messages
        };
        info("getAnswer-body:", body, "getAnswer-body-messages:", body.messages.length);
        const response = await this.post(aiServiceUrl, body);
        info("getAnswer-response:", response);
        this._messages.push({ role: "assistant", content: response.choices[0].message.content });
        return response.choices[0].message.content;
    }
}
let _aiServiceInstance: AzureOpenAIService;
export const getAzureOpenAIService = (botSettings?: IBotSettings): AzureOpenAIService => {
    if (!_aiServiceInstance) {
        _aiServiceInstance = new AzureOpenAIService(botSettings);
    }
    return _aiServiceInstance;
}