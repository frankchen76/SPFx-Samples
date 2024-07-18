import * as React from "react";

import { DirectLine } from 'botframework-directlinejs';
// import ReactWebChat from 'botframework-webchat';
import { Components } from 'botframework-webchat-component';
import * as ReactWebChatLib from 'botframework-webchat';
import { DefaultButton, Dialog, DialogType, IconButton, IStackItemStyles, IStackStyles, Spinner, Stack, TextField } from "office-ui-fabric-react";
import { useEffect, useState } from "react";
import { useBoolean, useId } from "@uifabric/react-hooks";
import MSALWrapper from "./MSALWrapper";
import { Dispatch } from 'redux';
// import { hooks } from 'botframework-webchat-component';
//const { useActivities, useSendMessage } = hooks;


export interface IWebChatViewProps {
    botURL: string;
    buttonLabel?: string;
    botName?: string;
    userEmail: string;
    userFriendlyName: string;
    botAvatarImage?: string;
    botAvatarInitials?: string;
    greet?: boolean;
    customScope: string;
    clientID: string;
    authority: string;
}

const SendMessageCtrl = () => {
    const [prompt, setPrompt] = React.useState<string>("");

    const sendMessage = ReactWebChatLib.hooks.useSendMessage();
    const onPromptChange = (event: React.FormEvent<HTMLInputElement>, newValue: string) => {
        setPrompt(newValue);
    }
    const onPromptSend = () => {
        sendMessage(prompt);
        setPrompt("");
    }
    const nonShrinkingStackItemStyles: IStackItemStyles = {
        root: {
            alignItems: 'center',
            display: 'flex',
            height: 32,
            justifyContent: 'center',
            overflow: 'hidden',
            width: 40
        }
    };
    const stackStyles: IStackStyles = {
        root: {
            width: `100%`,
        },
    };

    return (
        <Stack horizontal tokens={{ childrenGap: 5 }} verticalAlign="end" styles={stackStyles}>
            <Stack.Item grow>
                <TextField title="Type your question" label="Type your message" value={prompt} onChange={onPromptChange} />
            </Stack.Item>
            <Stack.Item disableShrink styles={nonShrinkingStackItemStyles}>
                <IconButton iconProps={{ iconName: 'Send' }} onClick={onPromptSend} />
            </Stack.Item>
        </Stack>

    );
}

export const WebChatView = (props: IWebChatViewProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    // const [botName, setBotName] = useState<string>();
    const [directLine, setDirectLine] = useState<DirectLine>();
    const [store, setStore] = useState<any>();
    // const [prompt, setPrompt] = React.useState<string>("");

    // const [botToken, setBotToken] = useState<string>();
    // const [userId, setUserId] = useState<string>();

    const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
    // Dialog properties and states
    const dialogContentProps = {
        type: DialogType.normal,
        title: "TestBot",
        closeButtonAriaLabel: 'Close'
    };
    const labelId: string = useId('dialogLabel');
    const subTextId: string = useId('subTextLabel');
    const modalProps = React.useMemo(
        () => ({
            isBlocking: false,
        }),
        [labelId, subTextId],
    );


    console.log(directLine);

    // A utility function that extracts the OAuthCard resource URI from the incoming activity or return undefined
    const getOAuthCardResourceUri = (activity: any): string | undefined => {
        const attachment = activity?.attachments?.[0];
        if (attachment?.contentType === 'application/vnd.microsoft.card.oauth' && attachment.content.tokenExchangeResource) {
            return attachment.content.tokenExchangeResource.uri;
        }
    }


    useEffect(() => {
        const loadBotToken = async () => {
            setLoading(true);
            try {

                // Your bot's token endpoint
                const botURL = props.botURL;

                // constructing URL using regional settings
                const environmentEndPoint = botURL.slice(0, botURL.indexOf('/powervirtualagents'));
                const apiVersion = botURL.slice(botURL.indexOf('api-version')).split('=')[1];
                const regionalChannelSettingsURL = `${environmentEndPoint}/powervirtualagents/regionalchannelsettings?api-version=${apiVersion}`;

                // Get the regional channel URL
                let regionalChannelURL;

                const regionalResponse = await fetch(regionalChannelSettingsURL);
                if (regionalResponse.ok) {
                    const data = await regionalResponse.json();
                    regionalChannelURL = data.channelUrlsById.directline;
                }
                else {
                    console.error(`HTTP error! Status: ${regionalResponse.status}`);
                }

                // get token: 
                const MSALWrapperInstance = new MSALWrapper(props.clientID, props.authority);
                // Trying to get token if user is already signed-in
                let responseToken = await MSALWrapperInstance.handleLoggedInUser([props.customScope], props.userEmail);
                if (!responseToken) {
                    // Trying to get token if user is not signed-in
                    responseToken = await MSALWrapperInstance.acquireAccessToken([props.customScope], props.userEmail);
                }
                const token = responseToken?.accessToken || null;


                // Create DirectLine object
                let directline: any;

                const response = await fetch(botURL);

                if (response.ok) {
                    const conversationInfo = await response.json();
                    directline = new DirectLine({
                        token: conversationInfo.token,
                        domain: regionalChannelURL + 'v3/directline',
                    });
                    setDirectLine(directline);
                    // directline = ReactWebChat.createDirectLine({
                    //     token: conversationInfo.token,
                    //     domain: regionalChannelURL + 'v3/directline',
                    // });
                    ReactWebChatLib.createStore()

                } else {
                    console.error(`HTTP error! Status: ${response.status}`);
                }

                // create store
                const localStore = ReactWebChatLib.createStore(
                    {},
                    ({ dispatch }: { dispatch: Dispatch }) => (next: any) => (action: any) => {

                        // Checking whether we should greet the user
                        if (props.greet) {
                            if (action.type === "DIRECT_LINE/CONNECT_FULFILLED") {
                                console.log("Action:" + action.type);
                                dispatch({
                                    meta: {
                                        method: "keyboard",
                                    },
                                    payload: {
                                        activity: {
                                            channelData: {
                                                postBack: true,
                                            },
                                            //Web Chat will show the 'Greeting' System Topic message which has a trigger-phrase 'hello'
                                            name: 'startConversation',
                                            type: "event"
                                        },
                                    },
                                    type: "DIRECT_LINE/POST_ACTIVITY",
                                });
                                return next(action);
                            }
                        }

                        // Checking whether the bot is asking for authentication
                        if (action.type === "DIRECT_LINE/INCOMING_ACTIVITY") {
                            const activity = action.payload.activity;
                            if (activity.from && activity.from.role === 'bot' &&
                                (getOAuthCardResourceUri(activity))) {
                                directline.postActivity({
                                    type: 'invoke',
                                    name: 'signin/tokenExchange',
                                    value: {
                                        id: activity.attachments[0].content.tokenExchangeResource.id,
                                        connectionName: activity.attachments[0].content.connectionName,
                                        token
                                    },
                                    "from": {
                                        id: props.userEmail,
                                        name: props.userFriendlyName,
                                        role: "user"
                                    }
                                }).subscribe(
                                    (id: any) => {
                                        if (id === "retry") {
                                            // bot was not able to handle the invoke, so display the oauthCard (manual authentication)
                                            console.log("bot was not able to handle the invoke, so display the oauthCard")
                                            return next(action);
                                        }
                                    },
                                    (error: any) => {
                                        // an error occurred to display the oauthCard (manual authentication)
                                        console.log("An error occurred so display the oauthCard");
                                        return next(action);
                                    }
                                )
                                // token exchange was successful, do not show OAuthCard
                                return;
                            }
                        } else {
                            return next(action);
                        }

                        return next(action);
                    }
                );
                setStore(localStore);


            } catch (error) {
                console.log(error);
            }
            setLoading(false);
        };

        loadBotToken();

    }, []);

    return (
        <>
            <DefaultButton text="Chat01" onClick={toggleHideDialog} />
            <Dialog styles={{
                main: { selectors: { ['@media (min-width: 480px)']: { width: 450, minWidth: 450, maxWidth: '1000px' } } }
            }} hidden={hideDialog} onDismiss={toggleHideDialog} dialogContentProps={dialogContentProps} modalProps={modalProps}>
                <div id="chatContainer" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    {loading ?
                        <Spinner />
                        :
                        directLine ?
                            // <ReactWebChat directLine={directLine} userID={props.userEmail} store={store} /> 
                            <Components.Composer directLine={directLine} store={store} >
                                <Components.BasicTranscript />
                                <SendMessageCtrl />
                            </Components.Composer>
                            :
                            <div>Cannot load web bot</div>}
                </div>

            </Dialog>

        </>

    );
};