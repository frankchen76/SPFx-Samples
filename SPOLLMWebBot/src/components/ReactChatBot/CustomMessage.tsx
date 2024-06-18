import * as React from 'react';
import { info } from '../../services/log';
import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const CustomMessage = ({ state, setState }) => {
    info("CustomMessage:", state);
    const markdownTxt = state.messages[state.messages.length - 1].message;
    //info("CustomMessage-markdowntext:", markdownTxt);
    // useEffect(() => {
    //     const init = async()=>{
    //         const userMessage = state.messages[state.messages.length - 1].message;
    //         info("CustomMessage:", state);

    //     };

    //     init();
    // }, []);
    return (
        <div className="react-chatbot-kit-chat-bot-message-container">
            <ReactMarkdown children={markdownTxt!}
                remarkPlugins={[remarkGfm]} ></ReactMarkdown>
            {/* <div className="react-chatbot-kit-chat-bot-avatar">
                <div className="react-chatbot-kit-chat-bot-avatar-container">
                    <p className="react-chatbot-kit-chat-bot-avatar-letter">B</p>
                </div>
            </div>
            <div className="react-chatbot-kit-chat-bot-message">
                <ReactMarkdown children={markdownTxt!}
                    remarkPlugins={[remarkGfm]} ></ReactMarkdown>
                <div className="react-chatbot-kit-chat-bot-message-arrow"></div>
            </div> */}
        </div>

        // <img
        //     src='https://i.pinimg.com/originals/cf/da/fa/cfdafa4dc6aab40eae1c5315c02b9339.jpg'
        //     style={{ width: '100%' }}
        // />
    );
};

export default CustomMessage;