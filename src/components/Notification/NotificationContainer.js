import { divide } from "lodash";
import React from "react";
import './NotificationContainer.css';

const NotificationContainer = ({ notifications }) => {
  return (
    <div className="notification-container">
      {notifications.map((notification, index) => (
        <div className="notification-card" key={index}>
          <img src={notification.image} alt="notification" className="notification-image" />
          <div className="notification-content">
            <h4 className="notification-title">{notification.title}</h4>
            <p className="notification-description">{notification.description}</p>
            <p className="message-description">
              {notification.user_name} :
              {notification.message
                ? notification.message.length > 20
                  ? `${notification.message.substring(0, 20)}...`
                  : notification.message
                : ''}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
export default NotificationContainer;
