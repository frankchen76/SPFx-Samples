import * as React from 'react';
import { useState, useEffect } from "react";
import { Dropdown, IDropdownOption, PrimaryButton, Stack, Toggle } from 'office-ui-fabric-react';
import { ReactChatBot } from './ReactChatBot/ReactChatBot';
import { getSPOService } from '../services/SPOService';
import { info } from '../services/log';
import { useServiceContext } from '../services/ServiceContext';


export interface WebBotPanelComponentProps {
}
export const WebBotPanelComponent = (props: WebBotPanelComponentProps) => {
    const serviceContext = useServiceContext();
    const [botOptions, setBotOptions] = useState<IDropdownOption[]>([]);
    const [botEnabled, setBotEnabled] = useState<boolean>(serviceContext.settingService.settings.enabled);
    const [selectedDocuments, setSelectedDocuments] = useState<string[]>(serviceContext.settingService.settings.selectedDocuments);
    const [isAdmin, setIsAdmin] = useState<boolean>(true);
    //const aiService = getAzureOpenAIService();
    //aiService.setDocuments(props.selectedDocuments);
    info("WebBotPanelComponent");

    useEffect(() => {
        const loadDocuments = async (): Promise<void> => {
            const { spoSiteUrl, spoDocLib } = serviceContext.settingService.settings;
            const options: IDropdownOption[] = [];
            const spoService = getSPOService();
            const documents = await spoService.getDocuments(spoSiteUrl, spoDocLib)
            documents.forEach((doc) => {
                options.push({ key: doc.title, text: doc.title });
            });
            setBotOptions(options);
        }

        loadDocuments();
    }, []);

    const _onBotEnabledChange = (ev, checked) => {
        setBotEnabled(checked);
    };
    const _onBotOptionsChange = (event, option?: IDropdownOption, index?: number) => {
        const { aiService } = serviceContext.settingService;

        if (option) {
            const newDocs = option.selected ? [...selectedDocuments, option.key as string] : selectedDocuments.filter(key => key !== option.key);
            setSelectedDocuments(newDocs);
            aiService.setDocuments(newDocs);
        }
    };
    const _onApplyClick = () => {
        //props.webBotService.updateCurrentUserCustomAction(botId, botEnabled);
        //alert("Updated");
    };

    return (
        <Stack tokens={{ childrenGap: 5 }}>
            {isAdmin && <Toggle
                label="Enabled Web Bot for extension"
                checked={botEnabled}
                onText="On"
                offText="Off" onChange={_onBotEnabledChange} />}
            {isAdmin && <Dropdown
                placeholder="Select an Bot"
                label="Select a web bot"
                options={botOptions}
                multiSelect
                selectedKeys={selectedDocuments}
                onChange={_onBotOptionsChange}
            />}
            {isAdmin && <PrimaryButton text='Apply' onClick={_onApplyClick} />}
            <ReactChatBot />
        </Stack>
    );
};

