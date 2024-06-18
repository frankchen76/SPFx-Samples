import * as React from 'react';
import { createChatBotMessage, createCustomMessage } from 'react-chatbot-kit';
import DogPicture from './DogPicture';
import CustomMessage from './CustomMessage';

const config = {
    initialMessages: [
        createChatBotMessage(`Welcome Azure AI bot`, null)
        //createCustomMessage('Test', 'custom', null),
    ],
    botName: "Test bot",
    customMessages: {
        custom: (props) => <CustomMessage {...props} />,
    },
    widgets: [
        {
            widgetName: 'dogPicture',
            widgetFunc: (props) => <DogPicture {...props} />,
            mapStateToProps: null,
            props: null
        }
    ]
};

export default config;