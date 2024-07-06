import { cilDelete, cilInfo, cilSend } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { CButton, CCard, CCardBody, CCol, CFormInput, CInputGroup, CRow } from "@coreui/react";

import { useEffect, useRef, useState } from "react";


import { addDoc, collection, getDocs, limit, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db } from 'src/firebase';
import ChatBubble from "../ChatBubble";
import MessageListDetails from "../MessageListDetails";

const ChatMainSide = ({ selectedData = [] }) => {

    const [chatMessages, setChatMessages] = useState([])

    const chatBodyRef = useRef(null);


    console.log(selectedData, "DataSet Val")
    useEffect(() => {
        fetchMessages(selectedData?.customer_collection_id)


    }, [selectedData])


    const fetchMessages = (id) => {
        const q = query(collection(db, "chats/chats_dats/" + id), orderBy("createdAt", "asc"), limit(50))
        onSnapshot(q, (querySnapshot) => {
            const fetchedMessages = [];
            querySnapshot.forEach(doc => {
                fetchedMessages.push({ ...doc.data(), id: doc.id });
            });

            console.log(fetchedMessages, "Fetched messages")


            if (chatBodyRef.current) {
                chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
            }

            setChatMessages(fetchedMessages)


        })
    }



    const [typeMessage, setTypeMessage] = useState("")
    const handleTextChange = (e) => {
        setTypeMessage(e.target.value)
    }


    const sendMessage = async () => {
        if (typeMessage.trim() == "") {
            typeMessage
        }
        await addDoc(collection(db, "chats/chats_dats/" + selectedData?.customer_collection_id), {
            text: typeMessage,
            name: "Admin",
            avatar: '',
            createdAt: serverTimestamp(),
            role: "Admin",
            readAt: null,
            uid: "admin"
        })

        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
        setTypeMessage('')
    }

    const handleMessageDetailsvisibility = () => {
        setVisibility(!visibility)
    }


    const [visibility, setVisibility] = useState(false)

    const handleChatInfoIcon = () => {
        setVisibility(!visibility)
    }


    return (

        <>
            <MessageListDetails conversation_data={selectedData} visibility={visibility} handleVisibility={handleMessageDetailsvisibility}></MessageListDetails>
            <CCard className='chat_window_card'>

                <CRow className='chat_header_row'>
                    <CCol className='chat_content_header'>
                        <h5 className='chatHeaderTitle'>{selectedData?.chat_name}</h5>
                        <h6 className='chatHeaderSubTitle'>{selectedData?.chat_related_to} Related</h6>
                    </CCol>
                    <CCol className='chat_icon_column d-flex justify-content-end align-items-center'>
                        <CIcon icon={cilInfo} className='chat_icon_right' size='lg' onClick={() => handleChatInfoIcon()} />
                        <CIcon icon={cilDelete} className='chat_icon_right' size='lg' />
                    </CCol>
                </CRow>

                <CCardBody className='chat_body custom-scrollbar' ref={chatBodyRef}>
                    <div className='chat_messages'>
                        {chatMessages.map((msg, index) => (
                            <ChatBubble
                                key={index}
                                message={msg.text}
                                time={msg?.role}
                                sender={msg.name}
                                // imgSrc={msg.imgSrc}
                                // reactions={msg.reactions}
                                direction={msg.role}
                            />
                        ))}
                    </div>
                </CCardBody>

                <div className='chat_footer'>
                    <CInputGroup>
                        <CFormInput placeholder="Type a message..." onChange={handleTextChange} value={typeMessage} onKeyDown={(e) => {
                            if (e.key === 'Enter') {

                                e.preventDefault();
                                sendMessage()

                            }
                        }} />
                        <CButton color="primary" className='chat_send_button' onClick={sendMessage} disabled={typeMessage == ""}> <CIcon icon={cilSend} className='chat_send_icon' size='lg' /></CButton>
                    </CInputGroup>
                </div>

            </CCard>
        </>

    )
}


export default ChatMainSide;