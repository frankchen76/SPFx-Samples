import * as React from "react";
import { getAzureOpenAIService } from "../../services/AzureOpenAIService";
import { info } from "../../services/log";
import { createChatBotMessage, createCustomMessage } from "react-chatbot-kit";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
    const handleHello = (message: string) => {
        //const botMessage = createChatBotMessage('Hello. Nice to meet you.');
        const botMessage = createChatBotMessage(`Hello. Echo your message "${message}" .`, null);

        setState((prev) => ({
            ...prev,
            messages: [...prev.messages, botMessage],
        }));
    };
    const handleCustom = async (message: string) => {
        //const botMessage = createChatBotMessage('Hello. Nice to meet you.');
        let botMessage = null;
        try {
            const aoaiService = getAzureOpenAIService();
            const response = await aoaiService.getAnswer(message);

            //botMessage = createCustomMessage(response, "custom", { payload: response });
            botMessage = createChatBotMessage(<ReactMarkdown children={response}
                remarkPlugins={[remarkGfm]} ></ReactMarkdown>
            );

        } catch (error) {
            botMessage = createChatBotMessage(`Something were wrong. ${error}`);
        }

        setState((prev) => ({
            ...prev,
            messages: [...prev.messages, botMessage],
        }));
    };
    const handleDog = () => {
        //info(message);
        const botMessage = createChatBotMessage(
            "Here's a nice dog picture for you!",
            {
                widget: 'dogPicture',
                payload: 123
            }
        );

        setState((prev) => ({
            ...prev,
            messages: [...prev.messages, botMessage],
        }));
    };
    const handleDefault = async (message: string) => {
        let botMessage = null;
        try {
            const aoaiService = getAzureOpenAIService();
            const response = await aoaiService.getAnswer(message);
            botMessage = createChatBotMessage(`${response}`);

        } catch (error) {
            botMessage = createChatBotMessage(`Something were wrong. ${error}`);
        }

        setState((prev) => ({
            ...prev,
            messages: [...prev.messages, botMessage],
        }));

    }
    return (
        <div>
            {React.Children.map(children, (child) => {
                return React.cloneElement(child, {
                    actions: {
                        handleHello,
                        handleDog,
                        handleCustom,
                        handleDefault
                    },
                });
            })}
        </div>
    );
};

export default ActionProvider;