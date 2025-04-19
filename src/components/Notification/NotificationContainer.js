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
          </div>
        </div>
      ))}
    </div>
  );
}
export default NotificationContainer;
