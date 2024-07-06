import React from 'react';
import './ChatBubble.css';

const ChatBubble = ({ message, time, sender, imgSrc, reactions, direction }) => {
    return (
        <div className={`chat-bubble ${direction}-chat`}>
            <div className="chat-header">
                {/* {imgSrc && <img src={imgSrc} alt={sender} className="avatar" />} */}

                <div className="default-img">{sender[0]}</div>

                <div className="message-info">
                    <span className="sender-name">{sender}</span>
                    <span className="message-time">{time}</span>
                </div>
            </div>
            <div className="message-content">
                <p>{message}</p>
                {reactions && (
                    <div className="reactions">
                        {reactions.map((reaction, index) => (
                            <span key={index} className="reaction">
                                {reaction.emoji} {reaction.count}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatBubble;
