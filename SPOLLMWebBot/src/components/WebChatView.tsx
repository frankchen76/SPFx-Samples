import * as React from "react";
// import { PrimaryButton, Spinner } from "office-ui-fabric-react";
// import { useContext, useEffect, useState } from "react";
// import { BaseComponentContext } from "@microsoft/sp-component-base";

export interface IWebChatViewProps {
    botId: string;
}

export const WebChatView = (props: IWebChatViewProps) => {
    return (
        <div className="ms-Grid">
            <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12" >
                    <h2>Web Chat</h2>
                </div>
            </div>
        </div>
    );
};