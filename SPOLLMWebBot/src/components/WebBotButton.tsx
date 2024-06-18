import * as React from 'react';
import { useState } from "react";
import { DefaultButton } from "office-ui-fabric-react";
import styles from './WebBotButton.module.scss';
import { WebBotPanel } from './Panel/WebBotPanel';
import { ServiceContext, IServiceContext } from '../services/ServiceContext';

export interface WebBotButtonProps {
    serviceContext: IServiceContext;
}
export const WebBotButton = (props: WebBotButtonProps): JSX.Element => {
    // const [isCalloutVisible, setIsCalloutVisible] = useState<Boolean>(false);
    //const [serviceContext, setServiceContext] = useState<IServiceContext>(props.serviceContext);

    const _onBtnHandler = async (): Promise<void> => {
        const panel = new WebBotPanel({
            serviceContext: props.serviceContext,
            headerText: 'Bot',
            closeButtonAriaLabel: 'Close',
            isFooterAtBottom: false,
            hideFooter: true
        });
        await panel.show();
        // setIsCalloutVisible(!isCalloutVisible);
    };
    return (
        <div className={styles.webbotdiv}>
            {/* {isCalloutVisible && <div style={{ pointerEvents: "auto" }}><AzureOpenAIBot /></div>} */}
            <DefaultButton
                className={`${styles.webbotBtn} ${styles.hidetab}`}
                text="WebBot"
                iconProps={{ iconName: 'ChatBot' }}
                onClick={_onBtnHandler}
                allowDisabledFocus />
        </div>
    );
};

