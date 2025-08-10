import TopicCreate from './components/TopicCreate'
import TopicList from './components/TopicList'

function PropotionTopics() {
  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <TopicCreate />
      </div>
      <TopicList></TopicList>
    </div>
  )
}

export default PropotionTopics
