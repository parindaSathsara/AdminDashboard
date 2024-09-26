import { useEffect, useRef, useState } from "react";
import { CCol, CRow } from '@coreui/react';

import { addDoc, arrayRemove, arrayUnion, collection, doc, getDoc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";

import { db } from "src/firebase";
import aahaaslogo from '../../../assets/brand/aahaslogo.png';
import { LazyLoadImage } from "react-lazy-load-image-component";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faFilter, faPaperPlane, faClipboard, faLink, faMagnifyingGlass, faEllipsisVertical, faCircleInfo } from '@fortawesome/free-solid-svg-icons';

import './chatsMeta.css'

function ChatsMeta() {

    const [chatList, setchatList] = useState([]);
    const [chatListFiltered, setchatListFiltered] = useState([]);
    const [currentAdmin, setCurrentAdmin] = useState('')

    const [searchChat, setSearchChat] = useState('')

    const handleFilterchat = (value, dataset) => {
        setSearchChat(value);
        if (value === '') {
            setchatListFiltered(chatList);
        } else {
            let filtered = dataset.filter((chatValue) => { return chatValue.chat_name.toString().toLowerCase().includes(value.toLowerCase()) })
            setchatListFiltered(filtered);
        }
    }


    const formatDate = (timestamp) => {
        const date = new Date(timestamp.seconds * 1000);
        return date.toISOString().split('T')[0];
    };


    const [chatOpened, setChatOpened] = useState(false);
    const [chatOpenDetails, setChatOpenDetails] = useState([]);

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

    const messageContailerRef = useRef(null);

    const [messages, setMessages] = useState([]);

    const scrollDown = () => {
        if (messageContailerRef.current) {
            messageContailerRef.current.scrollTop = messageContailerRef.current.scrollHeight;
        }
    }

    const [adminMessage, setAdminMessage] = useState('');


    const getChatContent = async ({ chatId = chatId, updateState = false }) => {
        const q = query(
            collection(db, "chat-updated/chats/" + chatId.id),
            orderBy("createdAt", "desc"),
        );
        const getmessages = onSnapshot(q, (QuerySnapshot) => {
            const fetchedMessages = [];
            QuerySnapshot.forEach((doc) => {
                fetchedMessages.push({ ...doc.data(), id: doc.id });
            });
            const sortedMessages = fetchedMessages.toSorted(
                (a, b) => a.createdAt - b.createdAt
            );
            setMessages(sortedMessages);
            scrollDown()
        });
        if (updateState === false) {
            await handleUpdateAdminStats({ chatID: chatId.id, customerStatus: chatId.notifyCustomer, adminStatus: 'false', supplierStatus: chatId.notifySupplier, adminId: currentAdmin, updateState: updateState });
        } else {
            await handleUpdateAdminStats({ chatID: chatId.id, customerStatus: 'true', adminStatus: 'false', supplierStatus: "true", adminId: currentAdmin, updateState: updateState });
        }
        return () => getmessages();
    }

    const handleOpenChat = async (chatData) => {
        setChatOpened(true);
        setChatOpenDetails(chatData);
        await getChatContent({ chatId: chatData, updateState: false });
    }

    const handleSendMessage = async (value) => {
        if (value !== '') {
            setAdminMessage('')
            await addDoc(collection(db, "chat-updated/chats/" + chatOpenDetails.id), {
                text: value,
                name: 'vishnu kumar',
                createdAt: new Date(),
                role: 'Admin',
                uid: '12',
            });
            await getChatContent({ chatId: chatOpenDetails, updateState: true });
        }
    }

    const handleKeyUp = (event) => {
        if (event.key === "Enter") {
            handleSendMessage(adminMessage)
        }
    };

    const [openFilter, setOpenFilter] = useState(false);

    const [filterCheckBoxes, setFilterCheckBoxes] = useState([]);

    const handleFilterBoxes = (name, value) => {
        const newItem = { name, value };
        setFilterCheckBoxes((prev) => {
            const exists = prev.some(item => item.name === name && item.value === value);
            if (exists) {
                return prev.filter(item => item.name !== name || item.value !== value);
            } else {
                return [...prev, newItem];
            }
        });
    };

    const [filterTypes, setFilterTypes] = useState([]);

    const getChatRelatedtypes = async (dataset) => {
        const result = [];
        dataset.forEach((value) => {
            const existingItem = result.find(item => item.label_name === value.chat_related);
            if (existingItem) {
                existingItem.items += 1;
            } else {
                result.push({
                    'filtertype': 'chat_related',
                    'label_name': value.chat_related,
                    'items': 1
                });
            }
        });
        return result;
    }

    const getChatsStatus = async (dataset) => {
        const result = [];
        dataset.forEach((value) => {
            const existingItem = result.find(item => item.label_name === value.status);
            if (existingItem) {
                existingItem.items += 1;
            } else {
                result.push({
                    'filtertype': 'status',
                    'label_name': value.status,
                    'items': 1
                });
            }
        });
        console.log(dataset);
        return result;
    }

    const getChatByMe = (dataset) => {
        const result = [];
        dataset.forEach((value) => {
            const existingItem = result.find(item => item.label_name === value.status);
            if (existingItem) {
                existingItem.items += 1;
            } else {
                result.push({
                    'filtertype': 'status',
                    'label_name': value.status,
                    'items': 1
                });
            }
        });
        return result;
    }

    const getChatlists = async () => {
        const q = query(
            collection(db, "customer-chat-lists"),
            orderBy("createdAt", "desc"),
        );
        const getmessages = onSnapshot(q, async (QuerySnapshot) => {
            const fetchedMessages = [];
            QuerySnapshot.forEach((doc) => {
                fetchedMessages.push({ ...doc.data(), id: doc.id });
            });
            setchatList(fetchedMessages);
            setchatListFiltered(fetchedMessages);
            let relatedResposne = await getChatRelatedtypes(fetchedMessages);
            let statusResponse = await getChatsStatus(fetchedMessages);
            setFilterTypes(relatedResposne.concat(statusResponse))
        });
        return () => getmessages();
    }

    useEffect(() => {
        getChatlists();
    }, []);

    useEffect(() => {
        if (chatList.length > 0 && filterCheckBoxes.length > 0) {
            const filteredChatList = chatList.filter(chat =>
                filterCheckBoxes.some(filter => chat[filter.name] === filter.value)
            );
            if (searchChat === '') {
                setchatListFiltered(filteredChatList);
            } else {
                handleFilterchat(searchChat, filteredChatList);
            }
        } else {
            handleFilterchat(searchChat, chatList);
        }
    }, [filterCheckBoxes, chatList]);


    return (
        <div className='container-fluid chat_main_row_container'>
            <CRow className='h-100'>
                <CCol lg={3} className='chat-list-left-sidebar'>
                    <div className="chat-search-input-main">
                        <input placeholder='Search chats' className='chat-search-input' value={searchChat} onChange={(e) => handleFilterchat(e.target.value, chatList)} />
                        {searchChat !== '' && <FontAwesomeIcon className="chat-search-input-main-icon" icon={faXmark} onClick={() => handleFilterchat('', chatList)} />}
                        <FontAwesomeIcon icon={faFilter} className="chat-search-input-main-icon" onClick={() => setOpenFilter(!openFilter)} />
                    </div>
                    <div className={openFilter ? 'filter-open' : 'filter-close'}>
                        <p>Filter by groups</p>
                        <div className="d-flex flex-wrap">
                            {
                                filterTypes.map((value, key) => (
                                    <div key={key} className="filter-types">
                                        <input value="Product-support" onChange={(e) => handleFilterBoxes(value.filtertype, value.label_name)} type="checkbox" />
                                        <label htmlFor="Product-support">{value.label_name} x {value.items}</label>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <div className="filter-open d-flex justify-content-between">
                        <button onClick={() => setCurrentAdmin(1)} className={currentAdmin.toString() === "1" ? 'btn btn-primary' : 'btn btn-danger'}>1</button>
                        <button onClick={() => setCurrentAdmin(2)} className={currentAdmin.toString() === "2" ? 'btn btn-primary' : 'btn btn-danger'}>2</button>
                        <button onClick={() => setCurrentAdmin(3)} className={currentAdmin.toString() === "3" ? 'btn btn-primary' : 'btn btn-danger'}>3</button>
                        <button onClick={() => setCurrentAdmin(4)} className={currentAdmin.toString() === "4" ? 'btn btn-primary' : 'btn btn-danger'}>4</button>
                        <button onClick={() => setCurrentAdmin(5)} className={currentAdmin.toString() === "5" ? 'btn btn-primary' : 'btn btn-danger'}>5</button>
                        <button onClick={() => setCurrentAdmin(6)} className={currentAdmin.toString() === "6" ? 'btn btn-primary' : 'btn btn-danger'}>6</button>
                    </div>
                    <div className="chat-lists">
                        {
                            searchChat !== '' && chatListFiltered.length === 0 ?
                                <p className="chat-lists-note">There are no chats with your search keywords try with different keywords</p>
                                : searchChat === '' && chatListFiltered.length === 0 ?
                                    <p className="chat-lists-note">There are no chats initiated from customer</p> :
                                    chatListFiltered.map((value, key) => (
                                        <div key={key} className="chat-head" onClick={() => handleOpenChat(value)} onMouseOver={() => console.log(value?.admin_reading)}>
                                            <LazyLoadImage className="chat-avatar" placeholderSrc={aahaaslogo} src={aahaaslogo} />
                                            <h6 className="chat-name ellipsis-1-lines">{value.chat_name}</h6>
                                            <p className="chat-created-date">Initiate at {formatDate(value.createdAt)}</p>
                                            <p className="active-admins"> {value?.admin_included?.length === undefined ? 'No active admins' : `Active admins x ${value?.admin_included?.length}`}</p>
                                            <p className="reading-admins">{value?.admin_reading === undefined ? 'No is is reading' : ` ${value?.admin_reading.join(',')} ${value?.admin_reading.length == 0 ? 'is in the queue' : 'are in the queue'}`}</p>
                                            <p className="included-admins">{value?.admin_included === undefined ? 'Yet to be replied' : ` ${value?.admin_included.join(',')} are replying in this chat`}</p>
                                        </div>
                                    ))
                        }
                    </div>
                </CCol>
                <CCol lg={9} className='chat-list-right-sidebar'>
                    {
                        chatOpened ?
                            <>
                                <div className="chat-details-head">
                                    <LazyLoadImage className="chat-details-head-avatar" placeholderSrc={aahaaslogo} src={aahaaslogo} />
                                    <h6 className="chat-details-head-name">{chatOpenDetails?.chat_name}</h6>
                                    <h6 className="chat-details-head-related-with">{chatOpenDetails?.chat_related}</h6>
                                    <div className="chat-more-items">
                                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                                        <FontAwesomeIcon icon={faEllipsisVertical} />
                                    </div>
                                </div>
                                <div className="chat-details-main-content">
                                    <div className="chat-message-messages">
                                        <p className="chat-notice">
                                            <FontAwesomeIcon icon={faCircleInfo} /> Hi {chatOpenDetails.customer_name}, the customer has initiated the chat for {chatOpenDetails.chat_related}.
                                        </p>
                                        {
                                            messages.length === 0 ?
                                                <p className="chat-notice">
                                                    <FontAwesomeIcon icon={faCircleInfo} style={{ marginRight: '5px' }} />Please start responding to resolve their issue as soon as possible.
                                                </p>
                                                : messages.map((value) => (
                                                    <div className={` ${value.role === 'Admin' ? 'chat-content-admin' : 'chat-content'} `}>
                                                        <LazyLoadImage placeholderSrc={aahaaslogo} src={aahaaslogo} className="chat-content-image" />
                                                        <h6 className="chat-content-text">{value.text}</h6>
                                                        <p className="chat-content-time">{formatDate(value.createdAt)} by {value.name}</p>
                                                    </div>
                                                ))
                                        }
                                    </div>
                                    <div className="chat-message-input">
                                        <input type="text" value={adminMessage} onChange={(e) => setAdminMessage(e.target.value)} onKeyUp={handleKeyUp} placeholder="Enter your message" className="chat-message-input-form" />
                                        <FontAwesomeIcon icon={faPaperPlane} className="chat-message-input-icon-send" onClick={() => handleSendMessage(adminMessage)} />
                                        <FontAwesomeIcon icon={faClipboard} className="chat-message-input-icon" />
                                        <FontAwesomeIcon icon={faLink} className="chat-message-input-icon" />
                                    </div>
                                </div>
                            </> :
                            <div className="chat-not-open-screen">
                                <h6>Please open the chat and engage with the customer to assist them and ensure a smooth conversation.</h6>
                            </div>
                    }
                </CCol>
            </CRow>
        </div >
    );
}

export default ChatsMeta;