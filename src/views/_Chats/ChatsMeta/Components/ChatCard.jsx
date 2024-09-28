import React from 'react';
import { CCard, CCardBody, CCardTitle, CCardText } from '@coreui/react';
import './ChatCard.css';

const ChatCard = ({ title, subtitle, time, isPinned, unreadCount, imgSrc, handleClick, selectedIndex, index }) => {

    // console.log(selectedIndex === index, "Index Tally")

    return (
        <CCard className={`conversation-card ${selectedIndex === index ? "conversation-card-active" : ""}`} onClick={() => handleClick(index)}>
            <CCardBody style={{ width: '100%' }}>
                <div className="conversation-header">
                    <div className="conversation-img">
                        {imgSrc ? <img src={imgSrc} alt={title} /> : <div className="default-img">{title?.[0]}</div>}
                    </div>
                    <div className="conversation-info">
                        <h5>{title}</h5>
                        <h6>{subtitle}</h6>
                    </div>
                    <div className="conversation-meta">
                        <div className="conversation-time">{time}</div>
                        {/* {unreadCount > 0 && <div className="conversation-unread">{unreadCount}</div>} */}
                    </div>
                </div>
            </CCardBody>
        </CCard >
    );
};

export default ChatCard;
