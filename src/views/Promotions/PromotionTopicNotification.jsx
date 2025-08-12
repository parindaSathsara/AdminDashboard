import NotificationCreate from './components/NotificationCreate'
import NotificationList from './components/NotificationList'
import React, { useState } from 'react'

function PromotionTopicNotification() {
  const [isNotificationCreated, setIsNotificationCreated] = useState(false)

  const handleNotificationCreated = () => {
    if (isNotificationCreated) {
      setIsNotificationCreated(true)
    } else {
      setIsNotificationCreated(true)
    }
  }
  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <NotificationCreate onNotificationCreated={handleNotificationCreated} />
      </div>
      <NotificationList isNotificationCreated={isNotificationCreated} />
    </div>
  )
}

export default PromotionTopicNotification
