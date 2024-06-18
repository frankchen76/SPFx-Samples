import * as React from "react";

const MessageParser = ({ children, actions }) => {
    const parse = (message) => {
        if (message.includes('hello')) {
            console.log('hi');
            actions.handleHello(message);
        } else if (message.includes('dog')) {
            actions.handleDog();
            //} //else if (message.includes('custom')) {
            //actions.handleCustom();
        } else {
            //actions.handleDefault(message);
            actions.handleCustom(message);
        }
    };

    return (
        <div>
            {React.Children.map(children, (child) => {
                return React.cloneElement(child, {
                    parse: parse,
                    actions: {},
                });
            })}
        </div>
    );
};

export default MessageParser;