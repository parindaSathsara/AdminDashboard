import 'firebase/analytics';
import '../Chatshome.css'
import React, { useEffect, useRef, useState } from 'react'
import 'firebase/analytics';
import { GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import { addDoc, collection, getDocs, limit, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faGear, faUserPlus, faAngleDown, faUserMinus, faCircleXmark, faFilter, faCircleInfo, faPen, faTrash, faFlag } from '@fortawesome/free-solid-svg-icons'
import logo from '../Components/img/Customer.png';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { auth, db } from 'src/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

function Chatshome() {

    const resetRef = useRef();
    const scrollBoxRef = useRef(null);

    const [user] = useAuthState(auth);
    const [userID, setUSerID] = useState('');
    const [cusData, setData] = useState([]);
    const [customerChatID, setcustomerChatID] = useState('')
    const [userMessage, setUserMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [searchVendor, setSearchVendor] = useState('');
    const [searchCustomer, setSearchCustomer] = useState('');
    const [selectedVedor, setselectedVedor] = useState([]);
    const [infoDetails, setInfoDetails] = useState('');

    const [customer_message_collections, set_customer_message_collections] = useState([]);
    const [vendorDetails, setVendorDetails] = useState([]);

    const [filteredCustomerChats, setFilteredCustomerChats] = useState([...customer_message_collections]);
    const [filteredVendorDetails, setFilteredVendorDetails] = useState([...vendorDetails]);

    const [showModal, setShowModal] = useState({
        addVendor: false,
        removeVendor: false,
        showInfo: false,
        showEdit: false,
        showFlag: false,
        showDelete: false
    });

    const addSelecetedVendor = (customerChatID) => {
        filteredCustomerChats.map((value) => {
            if (customerChatID === value.customer_collection_id) {
                if (value.supplier_id === '' || value.supplier_id === null || value.supplier_id === undefined) {
                    const dataSet = {
                        customer_collection_id: customerChatID,
                        supplier_id: selectedVedor.id,
                        supplier_name: selectedVedor.username,
                        group_chat: true,
                        customer_name: infoDetails.customerChatID.customer_name,
                        status: infoDetails.customerChatID.status,
                        chat_created_date: null,
                        customer_mail_id: infoDetails.customerChatID.customer_mail_id,
                        supplier_mail_id: selectedVedor.email,
                        supplier_added_date: '',
                        comments: null,
                        chat_name: null,
                        customer_id: value.customer_id,
                        chat_id: infoDetails.customerChatID.chat_id
                    }
                    try {
                        axios.post('/updatechat', dataSet).then(res => {
                            if (res.data.status === 200) {
                                alert("suppler added successfully")
                            } else {
                                alert('something got mistake')
                            }
                        })
                    } catch (error) {
                        console.log(error);
                        throw new Error(error)
                    }
                } else {
                    alert('vendor is already existing')
                }
            }
        })
    }

    const removeVendor = (customerChatID) => {
        alert(`vendor removed ${customerChatID}`)
    }

    const searchVendorFun = (e) => {
        const searchVendor = e.target.value.toLowerCase();
        setSearchVendor(searchVendor)
        if (searchVendor === '') {
            setFilteredVendorDetails([...vendorDetails]);
        } else {
            const filteredDetails = vendorDetails.filter(
                (vendor) => vendor.supplier_name.toLowerCase().startsWith(searchVendor)
            );
            setFilteredVendorDetails(filteredDetails);
        }
    };

    const searchCustomerFun = (e) => {
        const searchVendor = e.target.value.toLowerCase();
        setSearchCustomer(searchVendor)
        if (searchVendor === '') {
            setFilteredCustomerChats(customer_message_collections);
        } else {
            const filteredDetails = customer_message_collections.filter(
                (vendor) => vendor.customer_name.toLowerCase().startsWith(searchVendor)
            );
            setFilteredCustomerChats(filteredDetails);
        }
    };

    const getGroupchat = (para) => {
        console.log(customer_message_collections);
        if (para === 'getGrpChat') {
            const filteredDetails = customer_message_collections.filter(
                (vendor) => vendor.group_chat === 'true'
            );
            resetRef.current.style.display = 'block'
            setFilteredCustomerChats(filteredDetails);
        }
        else if (para === 'getPrivateChat') {
            const filteredDetails = customer_message_collections.filter(
                (vendor) => vendor.group_chat === 'false' || null
            );
            resetRef.current.style.display = 'block'
            setFilteredCustomerChats(filteredDetails);
        }
        else {
            setFilteredCustomerChats(customer_message_collections);
            resetRef.current.style.display = 'none'
        }
    };

    const getUserMessages = (value, value3) => {
        setcustomerChatID(value);
        setInfoDetails(value3)
        const q = query(
            collection(db, "chats/chats_dats/" + value),
            orderBy("createdAt", "desc"),
            limit(50)
        );
        const getMessages = onSnapshot(q, (QuerySnapshot) => {
            const fetchedMessages = [];
            QuerySnapshot.forEach((doc) => {
                fetchedMessages.push({ ...doc.data(), id: doc.id });
            });
            const sortedMessages = fetchedMessages.sort(
                (a, b) => a.createdAt - b.createdAt
            );
            setMessages(sortedMessages);
            setUSerID(value)
        });
        return getMessages;
    }

    const sendMessage = async (event) => {
        event.preventDefault();
        if (userMessage.trim() === "") {
            return null;
        }
        const adminUID = 'XIidzTBzhaWAtUoRlTMUvvEnDlz1';
        const { displayName, photoURL } = auth.currentUser;
        await addDoc(collection(db, "chats/chats_dats/" + userID), {
            text: userMessage,
            name: displayName,
            avatar: photoURL,
            createdAt: serverTimestamp(),
            adminUID,
        });
        setUserMessage("");
    }

    const getTime = (value, type) => {
        if (value?.seconds !== undefined && value?.nanoseconds !== undefined) {
            const ts = (value.seconds + value.nanoseconds / 1000000000) * 1000;
            if (type === "value1") {
                return new Date(ts).toLocaleDateString();
            }
            if (type === "value2") {
                return new Date(ts).toDateString();
            }
        }
        return '';
    };

    const fetchData = async () => {
        try {
            const data_promise = filteredCustomerChats.map(async (value) => {
                if (value.customer_collection_id !== null && value.customer_collection_id !== undefined && value.customer_collection_id !== '') {
                    const q = query(
                        collection(db, "chats/chats_dats/" + value.customer_collection_id),
                        orderBy("createdAt", "asc"),
                        limit(50)
                    );
                    const querySnapshot = await getDocs(q);
                    const fetchedMessages = [];
                    querySnapshot.forEach((doc) => {
                        fetchedMessages.push({ ...doc.data(), id: doc.id });
                    });
                    const sortedMessages = fetchedMessages.sort(
                        (a, b) => a.createdAt - b.createdAt
                    );
                    return { customerChatID: value, sortedMessages };
                }

            })
            const allData = await Promise.all(data_promise);
            setData(allData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const scrollDown = () => {
        if (scrollBoxRef.current) {
            scrollBoxRef.current.scrollTop = scrollBoxRef.current.scrollHeight;
        }
    };

    const googleSignIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithRedirect(auth, provider);
    };

    const signOut = () => {
        auth.signOut();
    };

    useEffect(() => {
        fetchData();
    }, [customer_message_collections, filteredCustomerChats]);

    useEffect(() => {
        try {
            axios.get('/getchats').then(res => {
                if (res.data.status === 200) {
                    const result = res.data.data
                    const sorted_result = result.sort(function (a, b) {
                        const dateA = new Date(a.updated_at);
                        const dateB = new Date(b.updated_at);
                        return dateB - dateA;
                    });
                    set_customer_message_collections(sorted_result);
                    setFilteredCustomerChats(sorted_result);
                }
            })
        } catch (error) {
            console.log(error);
        }

        try {
            axios.get('/getvendors').then(res => {
                if (res.data.status === 200) {
                    setVendorDetails(res.data.data);
                    setFilteredVendorDetails(res.data.data);
                }
            })
        } catch (error) {
            console.log(error);
        }
    }, [])

    useEffect(() => {
        scrollDown()
    }, [messages]);

    const [editButtons, setEditButtons] = useState({
        state: false,
        key: ''
    })

    const handleMouseEnter = (value) => {
        setEditButtons({
            state: true,
            key: value
        });
    };

    const handleMouseLeave = (value) => {
        setEditButtons({
            state: false,
            key: ''
        });
    };


    return (
        <div className="d-flex main_container">
            <div className="col-4 user_chat_details">
                <div className="col-11 search_box d-flex align-items-center justify-content-start ">
                    <img draggable='false' src={logo} className='admin_logo' />
                    <input className="col-9 my-2 " value={searchCustomer} placeholder="Search user..." onChange={(e) => searchCustomerFun(e)} />
                </div>
                <div className='d-flex'>
                    <button className='btn filter_buttons' onClick={() => { getGroupchat('getGrpChat') }}>Group chat</button>
                    <button className='btn filter_buttons' onClick={() => { getGroupchat('getPrivateChat') }}>private chat</button>
                    <button className='btn filter_buttons reset_buttons' ref={resetRef} style={{ display: 'none' }} onClick={() => { getGroupchat('') }}>
                        <span className='mx-2'>reset</span>
                        <FontAwesomeIcon icon={faCircleXmark} />
                    </button>
                    {/* <button className='ms-auto mx-4 filter_buttons btn'> */}
                        {/* <FontAwesomeIcon icon={faFilter} size='xl' style={{ color: "#000000", }} /> */}
                    {/* </button> */}
                </div>
                <div className="customer_head">
                    {
                        console.log(cusData)
                    }
                    {
                        cusData.map((value, key) => (
                            value?.sortedMessages.length >= 1 &&
                            <div className="customer_details" key={key} onClick={() => getUserMessages(value.customerChatID.customer_collection_id, value)}>
                                <img draggable='false' className="user_image" src={value?.customerChatID?.chat_avatar || value?.sortedMessages[0]?.avatar} alt='user profile' />
                                <p className='user_name'>{value?.customerChatID.customer_name} {value.customerChatID.group_chat && `collabed with ${value.customerChatID.supplier_name}`}</p>
                                <p className='last_time'>{value?.customerChatID.updated_at.slice(11, 16)}</p>
                                <p className='user_last_msg'>{value?.sortedMessages[value.sortedMessages.length - 1]?.text}</p>
                            </div>
                        ))
                    }
                </div>
            </div>
            {
                messages.length > 0 &&
                <div className="col-8">
                    <div className="main_customer_head">
                        <img draggable='false' className="user_image user_image_main" src={messages[0]?.avatar || logo} />
                        <p className="user_name_main">{messages[0]?.name}</p>
                        <p className="user_last_seen_main">last seen at {getTime(messages[messages.length - 1]?.createdAt, "value2")}</p>
                        <FontAwesomeIcon icon={faUserPlus} className="add_vendor_icon" onClick={() => setShowModal(prevState => ({ ...prevState, addVendor: true }))} />
                        <FontAwesomeIcon icon={faUserMinus} className="close_vendor_icon" onClick={() => setShowModal(prevState => ({ ...prevState, removeVendor: true }))} />
                        <FontAwesomeIcon icon={faGear} className="settings_icon" onClick={() => setShowModal(prevState => ({ ...prevState, showInfo: true }))} />
                        {
                            user ?
                                <button onClick={signOut} className="sign_out_button" type="button">Sign Out</button>
                                :
                                <button className="sign_in_button">
                                    <img draggable='false' onClick={googleSignIn} src={googleSignIn} alt="sign in with google" type="button" />
                                </button>
                        }
                    </div>
                    <div className="chat_msg_update" ref={scrollBoxRef}>
                        <div className='main_chat_container'>
                            {messages.map((value, key) => (
                                <div className={`${value.uid === undefined ? "chat_bubble_main right_side main_chat" : "chat_bubble_main left_side main_chat"}`} key={key}
                                    onMouseEnter={() => { handleMouseEnter(key) }}
                                    onMouseLeave={() => { handleMouseLeave(key) }}
                                >
                                    <img draggable='false' src={value.avatar} className="chat_user_image" />
                                    <p className="chat_context">{value.text} </p>
                                    <span className="chat_time">{getTime(value?.createdAt, "value2")}</span>
                                    <div className='edit_buttons'
                                        style={{ display: editButtons.state && editButtons.key === key ? 'block' : 'none' }}>
                                        <span>
                                            <FontAwesomeIcon icon={faPen} onClick={() => setShowModal(prevState => ({ ...prevState, showEdit: true }))} />
                                        </span>
                                        <span>
                                            <FontAwesomeIcon icon={faTrash} onClick={() => setShowModal(prevState => ({ ...prevState, showDelete: true }))} />
                                        </span>
                                        <span>
                                            <FontAwesomeIcon icon={faFlag} onClick={() => setShowModal(prevState => ({ ...prevState, showFlag: true }))} />
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {/* <FontAwesomeIcon icon={faAngleDown} className="go_down_button" onClick={scrollDown} /> */}
                        </div>
                    </div>



                    <div className="message_send_content d-flex">

                        <input type="text" className="col-9" value={userMessage} placeholder={`chat with user...`} onChange={(e) => setUserMessage(e.target.value)} />
                        <button className="col-1 send_icon_main" onClick={sendMessage}>
                            Send <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                        <button className='col-2 go_down_icon' onClick={scrollDown}>
                            Go down <FontAwesomeIcon icon={faAngleDown} size='xl' />
                        </button>

                    </div>
                </div>
            }

            <Modal show={showModal.addVendor} className="model_popup">
                <div className="container">
                    <div className="">
                        <input className="form-control mb-2 mt-4" placeholder="Search vendor name..."
                            type="text"
                            value={searchVendor}
                            onChange={(e) => { searchVendorFun(e) }}
                        />
                        <p className='mx-2'>Supplier : {selectedVedor.username}</p>
                        <div className="search_main">
                            {filteredVendorDetails.map((brand, index) => (
                                <div className="search_results" key={index}>
                                    <li key={index} onClick={() => setselectedVedor(brand)}>{brand.username}  ({brand.email})</li>
                                    <p>{brand.category || 'no details'}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='container mb-5 mt-4 d-flex justify-content-evenly'>
                        <button className='btn btn-primary' onClick={() => addSelecetedVendor(customerChatID)} >Add</button>
                        <button className='btn btn-danger ' onClick={() => setShowModal(prevState => ({ ...prevState, addVendor: false }))}>Cancel</button>
                    </div>
                </div>
            </Modal>

            <Modal show={showModal.removeVendor} className="model_popup">
                <div className="remove_pop_up container">
                    <p className='text-center border-bottom py-5 fs-4'>Are you sure to remove the supllier.. ?</p>
                    <div className='d-flex justify-content-around col-6 offset-3 my-3'>
                        <button className='btn btn-primary px-3 mx-5 col-4' onClick={() => { removeVendor(customerChatID) }}>Yes</button>
                        <button className='btn btn-danger px-3 mx-5 col-4' onClick={() => setShowModal(prevState => ({ ...prevState, removeVendor: false }))}>No</button>
                    </div>
                </div>
            </Modal>

            <Modal show={showModal.showEdit} className="model_popup">
                <div className="remove_pop_up container">
                    <p className='text-center border-bottom py-4'>Enter your message...</p>
                    <div className='col-10 m-auto'>
                        <input type='text' className='form-control text-center py-4' placeholder='Enter your message...' />
                    </div>
                    <div className='d-flex justify-content-around col-6 offset-3 my-3'>
                        <button className='btn btn-primary px-3 mx-5 col-6' >Yes</button>
                        <button className='btn btn-danger px-3 mx-5 col-6' onClick={() => setShowModal(prevState => ({ ...prevState, showEdit: false }))}>Cancel</button>
                    </div>
                </div>
            </Modal>

            <Modal show={showModal.showDelete} className="model_popup">
                <div className="remove_pop_up container">
                    <p className='text-center border-bottom py-5 fs-4'>Are you sure delete the message ?</p>
                    <div className='d-flex justify-content-around col-6 offset-3 my-3'>
                        <button className='btn btn-primary px-3 mx-5 col-4' >Yes</button>
                        <button className='btn btn-danger px-3 mx-5 col-4' onClick={() => setShowModal(prevState => ({ ...prevState, showDelete: false }))}>No</button>
                    </div>
                </div>
            </Modal>

            <Modal show={showModal.showFlag} className="model_popup">
                <div className="remove_pop_up container">
                    <p className='text-center border-bottom py-4'>Reason why it should be flag ?</p>
                    <div className='col-10 m-auto'>
                        <input type='text' className='form-control text-center py-3' placeholder='Enter your message...' />
                    </div>
                    <div className='d-flex justify-content-around col-6 offset-3 my-3'>
                        <button className='btn btn-primary px-3 mx-5 col-4' >Yes</button>
                        <button className='btn btn-danger px-3 mx-5 col-4' onClick={() => setShowModal(prevState => ({ ...prevState, showFlag: false }))}>No</button>
                    </div>
                </div>
            </Modal>


            <Modal show={showModal.showInfo} className="model_popup">
                <div className="remove_pop_up">
                    <div className='heading border-bottom'>
                        <p className='fs-5 mx-3'><FontAwesomeIcon icon={faCircleInfo} className='info_icon' /></p>
                        <p className='fs-5'>Chat info</p>
                    </div>
                    {infoDetails && showModal.showInfo &&
                        <div className='border p-4'>
                            <p>Chat created : {getTime(infoDetails.sortedMessages[0].createdAt, 'value2')}</p>
                            <p>Chat type : {infoDetails.customerChatID.group_chat || 'private chat'}</p>
                            <p>Supplier added date : {(infoDetails.customerChatID.supplier_added_date) || 'no details'}</p>
                            <p>Supplier mail id : {infoDetails.customerChatID.supplier_mail_id}</p>
                            <p>Supplier name :{infoDetails.customerChatID.supplier_name} </p>
                            <p>Customer mail id :{infoDetails.customerChatID.customer_mail_id} </p>
                            <p>Query status : {infoDetails.customerChatID.status} </p>

                            {/* {console.log(infoDetails)} */}

                            {/* need to add if it is necessary */}

                            {/* <select className='border-0 p-1 outline-0'>
              <option value="select" selected>{infoDetails.customerChatID.status}</option>
              <option value="completed">completed</option>
              <option value="pending">pending</option>
              <option value="rejected">rejected</option>
            </select> */}

                            {/* <p>
              Comments :
              <input className='border-0 border-bottom mx-2' placeholder='Your comments here...' />
            </p> */}
                        </div>
                    }
                    <div className='buttons d-flex justify-content-center m-4'>
                        <button className='btn btn-primary mx-4' onClick={() => { setShowModal(prevState => ({ ...prevState, showInfo: false })) }}>Okay</button>
                        <button className='btn btn-secondary mx-4' onClick={() => { setShowModal(prevState => ({ ...prevState, showInfo: false })) }}>Cancel</button>
                    </div>
                </div>
            </Modal>

        </div>
    )
}

export default Chatshome;