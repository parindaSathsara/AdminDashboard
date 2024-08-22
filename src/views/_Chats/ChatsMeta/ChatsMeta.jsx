import { CCard, CCardBody, CCardHeader, CCardTitle, CCol, CContainer, CRow, CListGroup, CListGroupItem, CInputGroup, CInputGroupText, CFormInput, CButton } from '@coreui/react';
import React, { useEffect, useState } from 'react';

import './chatsMeta.css'
import ChatCard from './Components/ChatCard';
import ChatBubble from './Components/ChatBubble';
import CIcon from '@coreui/icons-react';
import { cilBell, cilDelete, cilEnvelopeOpen, cilInfo, cilSend, cilSettings } from '@coreui/icons';
import { fetchConversations } from './services/chatServices';
import moment from 'moment';
import ChatMainSide from './Components/ChatMain/ChatMainSide';
import MessageListDetails from './Components/MessageListDetails';

export default function ChatsMeta() {

    const chatMessages = [
        {
            message: "Hey guys! Important news!",
            time: "09:24",
            sender: "Parinda",
            imgSrc: "https://via.placeholder.com/40",
            direction: "right"
        },
        {
            message: "Our intern @jchurch has successfully completed his probationary period and is now part of our team!",
            time: "09:24",
            sender: "Parinda",
            imgSrc: "https://via.placeholder.com/40",
            direction: "left"

        },
        {
            message: "Jaden, my congratulations! I will be glad to work with you on a new project 😉",
            time: "09:27",
            sender: "Parinda",
            imgSrc: "https://via.placeholder.com/40",
            direction: "right"
        }
    ];


    const chatConversations = [
        {
            title: "Parinda Sathsara",
            chat_content: "Parinda Sathsara Test",
            time: "4m"
        },
        {
            title: "Sathsara Sathsara",
            chat_content: "Parinda Sathsara Test",
            time: "4m"
        },
        {
            title: "Sathsara Sathsara",
            chat_content: "Parinda Sathsara Test",
            time: "4m"
        },

    ]


    const [selectedIndex, setSelectedIndex] = useState(0)
    const [selectedData, setSelectedData] = useState([])

    const handleClick = (val, data) => {
        console.log(val)
        setSelectedIndex(val)
        setSelectedData(data)
    }

    const [conversationsList, setConversationsList] = useState([])


    useEffect(() => {
        fetchConversations().then(response => {
            console.log(response, "Response Data Set Value")
            setConversationsList(response)

            setSelectedIndex(0)
            setSelectedData(response[0])
        })
    }, [])

    const handleMessageDetailsvisibility = () => {

    }


    const [detailsModelVisibility, setDetailsModelVisibility] = useState(false)


    return (

        <>


            <CContainer fluid>
                <CRow className="g-3 chat_main_row_container">
                    <CCol lg={3} className='chat_left_side'>
                        <CCard className='chat_contacts_card'>
                            <CCardTitle style={{ marginBottom: 20 }}>Explore Aahaas</CCardTitle>
                            <CCardBody className='chat_card_body'>

                                {conversationsList?.map((chats, index) => {
                                    return (
                                        <ChatCard
                                            title={chats?.chat_name}
                                            subtitle={moment(chats?.created_at).format('MMMM Do YYYY  h:mm:ss a')}
                                            time={chats?.time}
                                            isPinned={true}
                                            unreadCount={1}
                                            handleClick={() => handleClick(index, chats)}
                                            selectedIndex={selectedIndex}
                                            index={index}
                                            imgSrc={chats?.chat_avatar}
                                        />
                                    )
                                })}



                            </CCardBody>
                        </CCard>
                    </CCol>
                    <CCol lg={9} className='chat_content'>

                        <ChatMainSide selectedData={selectedData}></ChatMainSide>
                    </CCol>





                </CRow>
            </CContainer>
        </>

    );
}
