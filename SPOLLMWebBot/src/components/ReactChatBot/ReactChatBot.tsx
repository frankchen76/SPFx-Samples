import * as React from "react";
import { PrimaryButton, Spinner, loadTheme } from "@fluentui/react";
import { useEffect } from "react";
import Chatbot from 'react-chatbot-kit'
import 'react-chatbot-kit/build/main.css'
// import { AzureOpenAIService } from "../../services/AzureOpenAIService";
import styles from './ReactChatBot.module.scss';

import config from "./config";
import MessageParser from "./MessageParser";
import ActionProvider from "./ActionProvider";


export interface IAzureOpenAIBotProps {
    // routeProps: RouteComponentProps;
    id?: string;
}
export const ReactChatBot = (props: IAzureOpenAIBotProps) => {
    let has_error = false;

    // example gemini stream
    // you can replace with other LLMs or even have a simulated stream
    return (
        <div>
            <Chatbot
                config={config}
                messageParser={MessageParser}
                actionProvider={ActionProvider}
            />
        </div>
    );
};
