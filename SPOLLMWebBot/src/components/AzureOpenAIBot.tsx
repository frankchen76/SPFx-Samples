import * as React from "react";
import ChatBot from "react-chatbotify";
import { getAzureOpenAIService } from "../services/AzureOpenAIService";


export interface IAzureOpenAIBotProps {
    // routeProps: RouteComponentProps;
    id?: string;
}

export const AzureOpenAIBot = (props: IAzureOpenAIBotProps) => {
    let has_error = false;

    // example gemini stream
    // you can replace with other LLMs or even have a simulated stream
    const azureOpenAI_stream = async (params) => {
        try {
            const aoaiService = getAzureOpenAIService();
            const response = await aoaiService.getAnswer(params.userInput);
            params.streamMessage(response);
        } catch (error) {
            await params.injectMessage("Unable to load model, is your API Key valid?");
            has_error = true;
        }
    }
    const flow = {
        start: {
            message: "Welcome to Azure OpenAI bot! I can help you with your questions. Ask me anything!",
            path: "loop"
        },
        loop: {
            message: async (params) => {
                await azureOpenAI_stream(params);
            },
            path: () => {
                if (has_error) {
                    return "start"
                }
                return "loop"
            }
        }
    }
    const botOption = {
        theme: { embedded: true },
        chatHistory: { storageKey: "example_real_time_stream" },
        botBubble: { simStream: true },
        header: { title: "Azure OpenAI Bot" },
        footer: { text: "Power by Azure OpenAI" },
    };
    return (
        <ChatBot options={botOption} flow={flow} />
    );
};
