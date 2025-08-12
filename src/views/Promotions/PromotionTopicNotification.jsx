import NotificationCreate from './components/NotificationCreate'
import NotificationList from './components/NotificationList'

function PromotionTopicNotification() {
  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <NotificationCreate />
      </div>
      <NotificationList />
    </div>
  )
}

export default PromotionTopicNotification
