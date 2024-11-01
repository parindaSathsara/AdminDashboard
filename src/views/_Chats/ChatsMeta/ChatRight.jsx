import React from 'react'

import { CCol, CRow } from '@coreui/react';
import { useContext, useEffect, useRef, useState } from "react";

import { addDoc, arrayRemove, arrayUnion, collection, doc, getDoc, increment, onSnapshot, orderBy, query, serverTimestamp, updateDoc, writeBatch } from "firebase/firestore";



import { db } from "src/firebase";
import aahaaslogo from '../../../assets/brand/aahaslogo.png';
import { LazyLoadImage } from "react-lazy-load-image-component";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faFilter, faPaperPlane, faClipboard, faLink, faMagnifyingGlass, faCircleInfo, faComment, faThumbtack } from '@fortawesome/free-solid-svg-icons';

import { Tooltip } from "@material-ui/core";
import { UserLoginContext } from 'src/Context/UserLoginContext';


export default function ChatRight({ chatOpenedData }) {


    const handleSearchBar = (data) => {

    }

    const handleChatSearch = (data) => {

    }


    const handleCloseChat = () => {

    }


    const getDateAndtime = (data) => {

    }


    const handleScrollToMessage = () => {

    }




    const { userData } = useContext(UserLoginContext);

    const handleSendMessage = async (value) => {
        if (value !== '') {
            setAdminMessage('')
            await addDoc(collection(db, "chat-updated/chats/" + chatOpenDetails.id), {
                text: value,
                name: userData.name,
                createdAt: new Date(),
                role: 'Admin',
                uid: '12',
                customerReadStatus: {
                    status: "Unread",
                    readAt: ""
                },
                adminReadStatus: {
                    status: "Read",
                    readAt: serverTimestamp()
                },
                supplierReadStatus: {
                    status: "Unread",
                    readAt: ""
                }
            });


            const docRef = doc(db, "customer-chat-lists", chatOpenDetails.id);


            await updateDoc(docRef, {
                updatedAt: serverTimestamp(),
                last_message: {
                    name: userData?.name,
                    value: value
                },
                customer_unreads: increment(1),
                supplier_unreads: increment(1),
                admin_unreads: 0
            });

            console.log('handleSendMessage function called');
            await getChatContent({ chatId: chatOpenDetails, updateState: true });
        }
    }


    const getChatContent = async ({ chatId, updateState = false }) => {
        console.log('getChatContent function called');
        const q = query(
            collection(db, "chat-updated/chats/" + chatId.id),
            orderBy("createdAt", "desc"),
        );
        const getmessages = onSnapshot(q, async (QuerySnapshot) => {
            const fetchedMessages = [];

            const batch = writeBatch(db);

            QuerySnapshot.forEach((doc) => {
                const docData = doc.data();


                fetchedMessages.push({ ...docData, id: doc.id });

                if (docData.adminReadStatus?.status === "Unread") {
                    batch.update(doc.ref, {
                        adminReadStatus: {
                            status: "Read",
                            readAt: serverTimestamp()
                        }
                    });
                }

                console.log(doc.id, "Doc ID is");
            });

            await batch.commit();

            const sortedMessages = fetchedMessages.sort(
                (a, b) => a.createdAt - b.createdAt
            );


            console.log(sortedMessages, "Sorted Messages Are")
            setMessages(sortedMessages);

            const docRef = doc(db, "customer-chat-lists", chatId.id);

            await updateDoc(docRef, {
                admin_unreads: 0
            });
        });

        if (updateState === false) {
            await handleUpdateAdminStats({ chatID: chatId.id, customerStatus: chatId.notifyCustomer, adminStatus: 'false', supplierStatus: chatId.notifySupplier, adminId: userData.name, updateState: updateState });
        } else {
            await handleUpdateAdminStats({ chatID: chatId.id, customerStatus: 'true', adminStatus: 'false', supplierStatus: "true", adminId: userData.name, updateState: updateState });
        }
        await removeExisting({ chatID: chatOpenDetails.id, adminId: userData.name });
        return () => getmessages();
    }

    const removeExisting = async ({ chatID, adminId }) => {
        if (chatID !== undefined) {
            const chatDocRef = doc(db, "customer-chat-lists/", chatID);
            const chatDocSnap = await getDoc(chatDocRef);
            if (chatDocSnap.exists()) {
                const updateData = {
                    admin_reading: arrayRemove(adminId)
                };
                await updateDoc(chatDocRef, updateData);
            }
        }
    }


    const handleUpdateAdminStats = async ({ chatID, customerStatus, adminStatus, supplierStatus, adminId, updateState }) => {
        const chatDocRef = doc(db, "customer-chat-lists/", chatID);
        const chatDocSnap = await getDoc(chatDocRef);
        if (chatDocSnap.exists()) {
            const updateData = {
                notifyCustomer: customerStatus,
                notifyAdmin: adminStatus,
                notifySupplier: supplierStatus,
            };
            if (updateState === false) {
                updateData.admin_reading = arrayUnion(adminId);
            } else {
                updateData.admin_reading = arrayRemove(adminId);
                updateData.admin_included = arrayUnion(adminId);
            }
            await updateDoc(chatDocRef, updateData);
        }
    }



    const handlePinChats = (data) => {

    }


    const [adminMessage, setAdminMessage] = useState("")
    const [searchBarStatus, setSearchBarStatus] = useState([])
    const [pinnedChats, setPinnedChats] = useState([])
    const [messages, setMessages] = useState([])

    const [chatOpened, setChatOpened] = useState(false)

    const [chatOpenDetails, setChatOpenDetails] = useState([])

    const messageContailerRef = useRef()


    const handleOpenChat = async (chatData) => {
        console.log('handleOpenChat function called');
        setChatOpened(true);
        setChatOpenDetails(chatData);
        await getChatContent({ chatId: chatData, updateState: false });


    }

    useEffect(() => {
        console.log(chatOpenedData, "Opened Chat Dat ais")

        if (chatOpenedData?.id) {
            handleOpenChat(chatOpenedData)
        }



    }, [chatOpenedData])

    const [clipBoardStatus, setClipBoardStatus] = useState(false);

    const handleKeyUp = (event) => {
        if (event.key === "Enter" && !event.shiftKey && !clipBoardStatus) {
            handleSendMessage(adminMessage);
        }
    };

    const handleOpenClipBoardOpen = () => {
        setClipBoardStatus(!clipBoardStatus);
    }

    const [clickedMssage, setclickedMssage] = useState('');

    const [messageClipBoard, setMessageClipBoard] = useState(false);
    const chatRefs = useRef([]);


    useEffect(() => {
        if (messageContailerRef.current) {
            messageContailerRef.current.scrollTop = messageContailerRef.current.scrollHeight;
        }
    }, [messages]);


    const [isTyping, setIsTyping] = useState(false)

    const handleTyping = async (e) => {
        setAdminMessage(e.target.value)

        if (!isTyping) {
            setIsTyping(true);
        }


    }


    const handleStopTyping = () => {
        setIsTyping(false);
    };


    useEffect(() => {
        let typingTimeout;

        if (isTyping) {

            const docRef = doc(db, 'customer-chat-lists', chatOpenDetails?.id);

            updateDoc(docRef, { admin_typing: true })
                .then(() => {
                    console.log("Admin typing status updated to true");
                })
                .catch((error) => console.error("Error updating admin typing status: ", error));

            typingTimeout = setTimeout(() => {
                handleStopTyping();
                updateDoc(docRef, { admin_typing: false })
                    .then(() => {
                        console.log("Admin typing status updated to false");
                    })
                    .catch((error) => console.error("Error updating admin typing status: ", error));
            }, 1000);
        }

        return () => {
            if (typingTimeout) clearTimeout(typingTimeout);
        };
    }, [adminMessage, isTyping]);

    console.log(chatOpenDetails, "Chat Open Details Are Data is")


    return (
        <CCol lg={9} className='chat-list-right-sidebar'>
            {chatOpened ?

                <>
                    <div className="chat-details-head">
                        <LazyLoadImage className="chat-details-head-avatar mr-2" placeholderSrc={aahaaslogo} src={aahaaslogo} />
                        <div className="d-flex flex-column">
                            <h6 className="chat-details-head-name">{chatOpenDetails?.chat_name}</h6>
                            <h6 className="chat-details-head-related-with">{chatOpenDetails?.chat_related}</h6>
                        </div>
                        <div className={searchBarStatus.status ? 'search-bar-open' : 'search-bar-close'}>
                            <input type="text" placeholder="Search your messages.." value={searchBarStatus.searchKeyword} onChange={(e) => handleChatSearch(e.target.value)} />
                            <FontAwesomeIcon icon={faXmark} onClick={() => handleSearchBar({ status: false })} />
                        </div>
                        <div className={searchBarStatus.status ? 'chat-more-items' : 'chat-more-items ms-auto'}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} style={{ display: searchBarStatus.status ? 'none' : 'block' }} onClick={() => handleSearchBar({ status: true })} />
                            <FontAwesomeIcon icon={faThumbtack} onClick={() => handlePinChats(chatOpenDetails)} style={{ color: pinnedChats.includes(chatOpenDetails.id) ? 'black' : 'gray' }} />
                            <FontAwesomeIcon icon={faXmark} onClick={() => handleCloseChat()} />
                        </div>
                    </div>
                    <div className="chat-details-main-content">
                        <div className="chat-content">
                            <div ref={messageContailerRef} className={searchBarStatus.status ? "chat-message-messages-open" : "chat-message-messages-close"}>
                                <p className="chat-notice">
                                    <FontAwesomeIcon icon={faCircleInfo} /> {chatOpenDetails?.customer_name}, the customer has initiated the chat for {chatOpenDetails?.chat_related}.
                                </p>
                                {
                                    messages?.length === 0 ?
                                        <p className="chat-notice">
                                            <FontAwesomeIcon icon={faCircleInfo} style={{ marginRight: '5px' }} />Please start responding to resolve their issue as soon as possible.
                                        </p>
                                        : messages?.map((value, index) => (
                                            <div className={value.role === 'Admin' ? "textingsfhvflhsjdbx" : ''}>
                                                <div style={{ display: value.role !== 'Admin' ? 'none' : '' }} className="more-items" onClick={() => { messageClipBoard === value.id ? setMessageClipBoard() : setMessageClipBoard(value.id) }}>
                                                    <FontAwesomeIcon icon={faClipboard} className="chat-message-input-icon" style={{ color: clipBoardStatus ? 'black' : 'inherit' }} />
                                                </div>
                                                <div ref={(el) => chatRefs.current[index] = el} key={index} className={` ${value.role === 'Admin' ? 'chat-content-admin' : 'chat-content-customer'} `} style={{ backgroundColor: clickedMssage === value.id ? 'lightgray' : '' }}>
                                                    <LazyLoadImage placeholderSrc={aahaaslogo} src={aahaaslogo} className="chat-content-image" />
                                                    {
                                                        messageClipBoard === value.id ?
                                                            <pre className="chat-content-text">{value.text}</pre>
                                                            : <h6 className="chat-content-text">{value.text}</h6>
                                                    }
                                                    <p className="chat-content-personname">{getDateAndtime(value.createdAt)}</p>
                                                    <p className="chat-content-time">by {value.name.slice(0, 7)}</p>
                                                </div>
                                            </div>
                                        ))
                                }
                            </div>
                            {/* <div className={searchBarStatus.status ? "search-resutls-open" : "search-resutls-close"}>
                                <h6>Your search results</h6>
                                {
                                    searchBarStatus.searchResuts === false ?
                                        <p>enter your keyword to search</p>
                                        : searchBarStatus.searchResultChats.map((value, index) => (
                                            <div className={` ${value.role === 'Admin' ? 'chat-content-admin' : 'chat-content'} `} onClick={() => handleScrollToMessage(index, value)}  >
                                                <LazyLoadImage placeholderSrc={aahaaslogo} src={aahaaslogo} className="chat-content-image" />
                                                <pre className="chat-content-text">{value.text}</pre>
                                                <p className="chat-content-personname">{getDateAndtime(value.createdAt)}</p>
                                                <p className="chat-content-time">by {value.name.slice(0, 7)}</p>
                                            </div>
                                        ))
                                }
                            </div> */}
                        </div>
                        <div className="chat-message-input">
                            {clipBoardStatus && <p className="clipBoard-status">clip borad was on</p>}
                            <FontAwesomeIcon icon={faClipboard} className="chat-message-input-icon" style={{ color: clipBoardStatus ? 'black' : 'inherit' }} onClick={() => handleOpenClipBoardOpen()} />

                            <textarea type="text" value={adminMessage} onKeyUp={handleKeyUp} onChange={(e) => handleTyping(e)} placeholder="Enter your message" className="chat-message-input-form" />

                            <FontAwesomeIcon icon={faPaperPlane} className="chat-message-input-icon-send" onClick={() => handleSendMessage(adminMessage)} />
                            <Tooltip title={'Under developement'}>
                                <FontAwesomeIcon icon={faLink} className="chat-message-input-icon" />
                            </Tooltip>
                        </div>
                    </div>
                </> :
                <div className="chat-not-open-screen">
                    <h6>Please open the chat and engage with the customer to assist them and ensure a smooth conversation.</h6>
                </div>
            }

        </CCol>
    )
}
