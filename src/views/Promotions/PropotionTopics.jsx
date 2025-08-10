import TopicCreate from './components/TopicCreate'
import TopicList from './components/TopicList'
import React, { useState } from 'react'

function PropotionTopics() {
  const [isTopicCreated, setIsTopicCreated] = useState(false)
  
  const handleTopicCreated = () => {
    setIsTopicCreated(true)
  }
  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <TopicCreate onTopicCreated={handleTopicCreated} />
      </div>
      <TopicList isTopicCreated={isTopicCreated} />
    </div>
  )
}

export default PropotionTopics
