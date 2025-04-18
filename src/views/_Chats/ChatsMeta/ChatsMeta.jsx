import { CButton, CCol, CRow } from '@coreui/react'
import { useContext, useEffect, useRef, useState } from 'react'
import { Pagination } from 'react-bootstrap';


import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  writeBatch,
} from 'firebase/firestore'

import { db } from 'src/firebase'
import aahaaslogo from '../../../assets/brand/aahaslogo.png'
import { LazyLoadImage } from 'react-lazy-load-image-component'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faXmark,
  faFilter,
  faPaperPlane,
  faClipboard,
  faLink,
  faMagnifyingGlass,
  faCircleInfo,
  faComment,
  faThumbtack,
} from '@fortawesome/free-solid-svg-icons'

import { UserLoginContext } from 'src/Context/UserLoginContext'
import { Tooltip } from '@material-ui/core'

import './chatsMeta.css'
import ChatRight from './ChatRight'
import { useLocation } from 'react-router-dom'
import { Tab, Tabs } from 'react-bootstrap'
import { assignEmployeeToChat, getAllEmployees } from './services/chatServices'

function ChatsMeta() {
  const chatRefs = useRef([])
  const messageContailerRef = useRef(null)

  const { userData } = useContext(UserLoginContext)

  const [chatOpened, setChatOpened] = useState(false)
  const [openFilter, setOpenFilter] = useState(false)
  const [clipBoardStatus, setClipBoardStatus] = useState(false)
  const [messageClipBoard, setMessageClipBoard] = useState(false)

  const [searchBarStatus, setSearchBarStatus] = useState({
    status: false,
    searchKeyword: '',
    searchResuts: false,
    searchResultChats: [],
  })

  const [pinnedChats, setPinnedChats] = useState([])
  const [filterTypes, setFilterTypes] = useState([])

  const [filterCheckBoxes, setFilterCheckBoxes] = useState([])
  const [chatOpenDetails, setChatOpenDetails] = useState([])

  console.log(filterCheckBoxes, "Filter Check Boxessssss")

  const [messages, setMessages] = useState([])
  const [chatList, setchatList] = useState([])

  const [chatListFiltered, setchatListFiltered] = useState([])

  const [clickedMssage, setclickedMssage] = useState('')
  const [searchChat, setSearchChat] = useState('')
  const [adminMessage, setAdminMessage] = useState('')

  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0
  });

  const getPaginatedChats = (chats) => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    return chats.slice(startIndex, endIndex);
  };

  const handleFilterchat = (value, dataset) => {
    setSearchChat(value)
    // if (value === '') {
    //     setchatListFiltered(chatList);
    // } else {
    //     let filtered = dataset.filter((chatValue) => { return (chatValue.chat_name + " " + chatValue.customer_name).toString().toLowerCase().includes(value.toLowerCase()) })
    //     setchatListFiltered(filtered);
    // }
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000)
    return date.toISOString().split('T')[0]
  }

  const getDateAndtime = (value) => {
    const totalSeconds = value.seconds + value.nanoseconds / 1e9
    const dateTime = new Date(totalSeconds * 1000)

    const currentDate = new Date()
    const formattedTime = dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    let formattedDateTime
    const isSameDay = dateTime.toDateString() === currentDate.toDateString()
    const isYesterday =
      new Date(currentDate.setDate(currentDate.getDate() - 1)).toDateString() ===
      dateTime.toDateString()

    if (isSameDay) {
      formattedDateTime = `Today, ${formattedTime}`
    } else if (isYesterday) {
      formattedDateTime = `Yesterday, ${formattedTime}`
    } else {
      formattedDateTime = dateTime.toLocaleString()
    }

    return formattedDateTime
  }

  const handleCloseChat = async () => {
    setChatOpened(false)
    setChatOpenDetails([])
    await removeExisting({ chatID: chatOpenDetails.id, adminId: userData.name })
  }

  const updatePinnedChats = () => {
    const existingPinnedChats = localStorage.getItem('myPinned')
    if (!existingPinnedChats) {
      setPinnedChats([])
    } else {
      setPinnedChats(JSON.parse(existingPinnedChats))
    }
  }

  const handlePinChats = (chatData) => {
    const existingPinnedChats = localStorage.getItem('myPinned')
    let newPinnedChats
    if (!existingPinnedChats) {
      newPinnedChats = [chatData.id]
    } else {
      newPinnedChats = JSON.parse(existingPinnedChats)
      const chatIndex = newPinnedChats.indexOf(chatData.id)
      if (chatIndex !== -1) {
        newPinnedChats.splice(chatIndex, 1)
      } else {
        newPinnedChats.push(chatData.id)
      }
    }
    localStorage.setItem('myPinned', JSON.stringify(newPinnedChats))
    updatePinnedChats()
  }

  const handleSearchBar = ({ status }) => {
    setSearchBarStatus({
      ...searchBarStatus,
      status: status,
    })
  }

  // const handleUpdateAdminStats = async ({ chatID, customerStatus, adminStatus, supplierStatus, adminId, updateState }) => {
  //     const chatDocRef = doc(db, "customer-chat-lists/", chatID);
  //     const chatDocSnap = await getDoc(chatDocRef);
  //     if (chatDocSnap.exists()) {
  //         const updateData = {
  //             notifyCustomer: customerStatus,
  //             notifyAdmin: adminStatus,
  //             notifySupplier: supplierStatus,
  //         };
  //         if (updateState === false) {
  //             updateData.admin_reading = arrayUnion(adminId);
  //         } else {
  //             updateData.admin_reading = arrayRemove(adminId);
  //             updateData.admin_included = arrayUnion(adminId);
  //         }
  //         await updateDoc(chatDocRef, updateData);
  //     }
  // }

  const removeExisting = async ({ chatID, adminId }) => {
    if (chatID !== undefined) {
      const chatDocRef = doc(db, 'customer-chat-lists/', chatID)
      const chatDocSnap = await getDoc(chatDocRef)
      if (chatDocSnap.exists()) {
        const updateData = {
          admin_reading: arrayRemove(adminId),
        }
        await updateDoc(chatDocRef, updateData)
      }
    }
  }

  const handleOpenChat = async (chatData) => {
    console.log('handleOpenChat function calledopened', chatData)
    setChatOpened(true)
    setChatOpenDetails(chatData)
  }

  const location = useLocation()

  useEffect(() => {
    console.log(location?.state?.createdChatData, 'Created Chat data isss')

    if (location?.state?.createdChatData) {
      setChatOpened(true)
      setChatOpenDetails(location?.state?.createdChatData)
    }
  }, [location?.state?.createdChatData])

  const handleOpenClipBoardOpen = () => {
    setClipBoardStatus(!clipBoardStatus)
  }

  // const handleKeyUp = (event) => {
  //     if (event.key === "Enter" && !clipBoardStatus) {
  //         handleSendMessage(adminMessage);
  //     }
  // };

  const handleFilterBoxes = (name, value) => {
    const newItem = { name, value }
    console.log('Filter boxes', name, value)
    setFilterCheckBoxes((prev) => {
      const exists = prev.some((item) => item.name === name && item.value === value)
      if (exists) {
        return prev.filter((item) => item.name !== name || item.value !== value)
      } else {
        return [...prev, newItem]
      }
    })
  }

  const getChatRelatedtypes = async (dataset) => {
    const result = []
    dataset.forEach((value) => {
      const existingItem = result.find((item) => item.label_name === value.chat_related)
      if (existingItem) {
        existingItem.items += 1
      } else {
        result.push({
          filtertype: 'chat_related',
          label_name: value.chat_related,
          items: 1,
        })
      }
    })
    return result
  }

  const getChatsStatus = async (dataset) => {
    const result = []
    dataset.forEach((value) => {
      const existingItem = result.find((item) => item.label_name === value.status)
      if (existingItem) {
        existingItem.items += 1
      } else {
        result.push({
          filtertype: 'status',
          label_name: value.status,
          items: 1,
        })
      }
    })
    return result
  }

  const getChatlists = async () => {
    const q = query(collection(db, 'customer-chat-lists'), orderBy('updatedAt', 'desc'))
    const getmessages = onSnapshot(q, async (QuerySnapshot) => {
      const fetchedMessages = []
      QuerySnapshot.forEach((doc) => {
        fetchedMessages.push({ ...doc.data(), id: doc.id })
      })

      if (JSON.stringify(fetchedMessages) !== JSON.stringify(chatList)) {
        setchatList(fetchedMessages)
        // console.log('Fetched messagesssssss', fetchedMessages)
        setchatListFiltered(fetchedMessages)

        let relatedResposne = await getChatRelatedtypes(fetchedMessages)
        let statusResponse = await getChatsStatus(fetchedMessages)
        setFilterTypes(relatedResposne.concat(statusResponse))
      }
    })
    return () => getmessages()
  }

  const handleScrollToMessage = (index, dataset) => {
    if (chatRefs.current[index]) {
      chatRefs.current[index].scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    setclickedMssage(dataset.id)
    setTimeout(() => {
      setclickedMssage('')
    }, 2000)
  }

  useEffect(() => {
    if (messageContailerRef.current) {
      messageContailerRef.current.scrollTop = messageContailerRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    updatePinnedChats()
  }, [chatList])

  // useEffect(() => {
  //   if (chatList.length > 0 && filterCheckBoxes.length > 0) {
  //     const filteredChatList = chatList.filter((chat) =>
  //       filterCheckBoxes.some((filter) => chat[filter.name] === filter.value),
  //     )
  //     if (searchChat === '') {
  //       setchatListFiltered(filteredChatList)
  //     } else {
  //       handleFilterchat(searchChat, filteredChatList)
  //     }
  //   } else {
  //     handleFilterchat(searchChat, chatList)
  //   }
  // }, [filterCheckBoxes, chatList])


  useEffect(() => {
    if (chatList.length > 0) {
      let filteredChatList = chatList;

      if (filterCheckBoxes.length > 0) {
        filteredChatList = chatList.filter((chat) =>
          filterCheckBoxes.some((filter) => chat[filter.name] === filter.value)
        );
      }

      if (searchChat === '') {
        setchatListFiltered(filteredChatList);
      } else {
        handleFilterchat(searchChat, filteredChatList);
      }
    } else {
      handleFilterchat(searchChat, chatList);
    }
  }, [filterCheckBoxes, chatList, searchChat]);

  useEffect(() => {
    const handleBeforeUnload = async (event) => {
      await removeExisting({ chatID: chatOpenDetails.id, adminId: userData.name })
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  useEffect(() => {
    getChatlists()
  }, [])

  const [lentChatList, setLentChatList] = useState(0)

  const getFilteredChats = (filterType) => {
    // Handle pinned chats
    if (filterType === 'pinned') {
      return chatListFiltered
        .filter((value) => pinnedChats.includes(value.id))
        .filter(
          (value) =>
            !searchChat ||
            `${value.chat_name} by ${value.customer_name}`
              .toLowerCase()
              .includes(searchChat.toLowerCase()),
        );
    }
    // Handle assigned chats
    else if (filterType === 'assigned') {
      return chatListFiltered
        .filter((value) => !pinnedChats.includes(value.id))
        .filter(
          (value) =>
            !searchChat ||
            `${value.chat_name} by ${value.customer_name}`
              .toLowerCase()
              .includes(searchChat.toLowerCase()),
        )
        .filter((value) => value?.assign_employee === userData.id);
    }
    // Handle pending chats
    else if (filterType === 'Pending') {
      return chatListFiltered
        .filter((value) => !pinnedChats.includes(value.id))
        .filter(
          (value) =>
            !searchChat ||
            `${value.chat_name} by ${value.customer_name}`
              .toLowerCase()
              .includes(searchChat.toLowerCase()),
        )
        .filter((value) => value.status === 'Pending' || !value.status);
    }
    // Handle ended chats
    else if (filterType === 'End') {
      return chatListFiltered
        .filter((value) => !pinnedChats.includes(value.id))
        .filter(
          (value) =>
            !searchChat ||
            `${value.chat_name} by ${value.customer_name}`
              .toLowerCase()
              .includes(searchChat.toLowerCase()),
        )
        .filter((value) => value.status === 'End');
    }
    // Handle all other chats (not pinned)
    else {
      return chatListFiltered
        .filter((value) => !pinnedChats.includes(value.id))
        .filter(
          (value) =>
            !searchChat ||
            `${value.chat_name} by ${value.customer_name}`
              .toLowerCase()
              .includes(searchChat.toLowerCase()),
        );
    }
  };

  //   const getFilteredChats = (pinState) => {
  //     if (pinState == 'pinned') {
  //       return chatListFiltered
  //         .filter((value) => pinnedChats.includes(value.id))
  //         .filter(
  //           (value) =>
  //             !searchChat ||
  //             `${value.chat_name} by ${value.customer_name}`
  //               .toLowerCase()
  //               .includes(searchChat.toLowerCase()),
  //         )
  //     } else if (pinState == 'assigned') {
  //       const data = chatListFiltered
  //         .filter((value) => !pinnedChats.includes(value.id))
  //         .filter(
  //           (value) =>
  //             !searchChat ||
  //             `${value.chat_name} by ${value.customer_name}`
  //               .toLowerCase()
  //               .includes(searchChat.toLowerCase()),
  //         )
  //         .filter((value) => value?.assign_employee === userData.id)

  //       return data
  //     } else {
  //       return chatListFiltered
  //         .filter((value) => !pinnedChats.includes(value.id))
  //         .filter(
  //           (value) =>
  //             !searchChat ||
  //             `${value.chat_name} by ${value.customer_name}`
  //               .toLowerCase()
  //               .includes(searchChat.toLowerCase()),
  //         )
  //     }
  //   }

  const [currentFilters, setCurrentFilters] = useState('All')
  const handleSelect = (key) => {
    setCurrentFilters(key)
  }

  const clearAllFilters = () => {
    console.log('Clear all filters')
    getChatlists()
  }

  return (
    <div className="container-fluid chat_main_row_container">
      <CRow className="h-100">
        <CCol lg={3} className="chat-list-left-sidebar">
          <div className="chat-search-input-main">
            <input
              placeholder="Search chats"
              className="chat-search-input"
              value={searchChat}
              onChange={(e) => handleFilterchat(e.target.value, chatList)}
            />
            {searchChat !== '' && (
              <FontAwesomeIcon
                className="chat-search-input-main-icon"
                icon={faXmark}
                onClick={() => handleFilterchat('', chatList)}
              />
            )}
            <FontAwesomeIcon
              icon={faFilter}
              className="chat-search-input-main-icon"
              onClick={() => setOpenFilter(!openFilter)}
            />
          </div>
          <div className={openFilter ? 'filter-open' : 'filter-close'}>
            <div className="d-flex justify-content-between align-items-center">
              <p className="mb-0">Filter by groups</p>
              {/* <CButton size="sm" onClick={()=>{clearAllFilters()}}>Clear all</CButton> */}
            </div>

            <div className="d-flex flex-wrap">
              {filterTypes.map((value, key) => (
                <>
                  {value?.items != 1 ? (
                    <div key={key} className="filter-types">
                      <input
                        value="Product-support"
                        onChange={() => handleFilterBoxes(value.filtertype, value.label_name)}
                        type="checkbox"
                      />
                      <label htmlFor="Product-support">
                        {value.label_name} x {value.items}
                      </label>
                    </div>
                  ) : null}
                </>
              ))}
            </div>
          </div>
          <div className="chat-lists">
            <p className="chatWise-heading">My pinned chats</p>
            {getPaginatedChats(getFilteredChats('pinned').map((value, key) => (
              <div
                key={key}
                className="chat-head"
                style={{
                  backgroundColor:
                    value.id === chatOpenDetails.id
                      ? '#f2f2f2'
                      : value?.admin_unreads
                        ? '#b9e4ff'
                        : '',
                }}
                onClick={() => handleOpenChat(value)}
              >
                <LazyLoadImage
                  className="chat-avatar"
                  placeholderSrc={aahaaslogo}
                  src={aahaaslogo}
                />
                <h6 className="chat-name ellipsis-2-lines">
                  {value.chat_name}
                  {value.customer_name ? ` by ${value.customer_name}` : ''}
                  {value?.assign_employee_name ? `( handle by ${value?.assign_employee_name})` : ''}
                </h6>

                <p className="chat-created-date">
                  Initiate at {formatDate(value.createdAt)} -{' '}
                  {value?.admin_included?.length === undefined
                    ? 'No active admins'
                    : `Active admins x ${value?.admin_included?.length}`}
                </p>
                <div className="reading-admins">
                  {value?.admin_included === undefined || value?.admin_included?.length == 0 ? (
                    <span className="chat-admin">Yet to be replied</span>
                  ) : (
                    <span className="chat-admin">
                      {value?.admin_included?.length} admin are in chat
                    </span>
                  )}
                  <span>-</span>
                  {value?.admin_reading === undefined || value?.admin_reading?.length === 0 ? (
                    <span className="read-admin">No is is reading</span>
                  ) : (
                    <span className="read-admin">{value?.admin_reading?.length} are reading</span>
                  )}
                </div>
                <div className="chat-notify">
                  {value.notifyAdmin.toString() === 'true' && <FontAwesomeIcon icon={faComment} />}
                </div>
              </div>
            )))}
            {/* <p className="chatWise-heading">All chats</p> */}

            {/* Responsive Pagination */}
            {getFilteredChats('pinned').length > pagination.itemsPerPage && (
                  <div className="d-flex justify-content-center mt-3">
                    <Pagination className="flex-wrap justify-content-center">
                      <Pagination.Prev
                        onClick={() => setPagination(prev => ({
                          ...prev,
                          currentPage: Math.max(1, prev.currentPage - 1)
                        }))}
                        disabled={pagination.currentPage === 1}
                        className="mx-1"
                      />

                      {/* First Page */}
                      {pagination.currentPage > 2 && (
                        <Pagination.Item
                          key={1}
                          onClick={() => setPagination(prev => ({ ...prev, currentPage: 1 }))}
                          className="mx-1 d-none d-sm-block"
                        >
                          1
                        </Pagination.Item>
                      )}

                      {/* Ellipsis for far pages */}
                      {pagination.currentPage > 3 && (
                        <Pagination.Ellipsis className="mx-1 d-none d-md-block" />
                      )}

                      {/* Current page and neighbors */}
                      {Array.from({ length: Math.ceil(getFilteredChats('notPinned').length / pagination.itemsPerPage) })
                        .map((_, index) => {
                          const page = index + 1;
                          // Show only current page and adjacent pages on mobile
                          if (
                            page === 1 ||
                            page === Math.ceil(getFilteredChats('notPinned').length / pagination.itemsPerPage) ||
                            (page >= pagination.currentPage - 1 && page <= pagination.currentPage + 1)
                          ) {
                            return (
                              <Pagination.Item
                                key={page}
                                active={page === pagination.currentPage}
                                onClick={() => setPagination(prev => ({ ...prev, currentPage: page }))}
                                className="mx-1"
                              >
                                {page}
                              </Pagination.Item>
                            );
                          }
                          return null;
                        })}

                      {/* Ellipsis for far pages */}
                      {pagination.currentPage < Math.ceil(getFilteredChats('notPinned').length / pagination.itemsPerPage) - 2 && (
                        <Pagination.Ellipsis className="mx-1 d-none d-md-block" />
                      )}

                      {/* Last Page */}
                      {pagination.currentPage < Math.ceil(getFilteredChats('notPinned').length / pagination.itemsPerPage) - 1 && (
                        <Pagination.Item
                          key={Math.ceil(getFilteredChats('notPinned').length / pagination.itemsPerPage)}
                          onClick={() => setPagination(prev => ({
                            ...prev,
                            currentPage: Math.ceil(getFilteredChats('notPinned').length / pagination.itemsPerPage)
                          }))}
                          className="mx-1 d-none d-sm-block"
                        >
                          {Math.ceil(getFilteredChats('notPinned').length / pagination.itemsPerPage)}
                        </Pagination.Item>
                      )}

                      <Pagination.Next
                        onClick={() => setPagination(prev => ({
                          ...prev,
                          currentPage: Math.min(
                            Math.ceil(getFilteredChats('notPinned').length / pagination.itemsPerPage),
                            prev.currentPage + 1
                          )
                        }))}
                        disabled={
                          pagination.currentPage ===
                          Math.ceil(getFilteredChats('notPinned').length / pagination.itemsPerPage)
                        }
                        className="mx-1"
                      />
                    </Pagination>
                  </div>
                )}
            <Tabs
              defaultActiveKey="All"
              id="uncontrolled-tab-example"
              className="mt-4"
              style={{
                fontSize: 14,
              }}
              onSelect={handleSelect}
            >
              <Tab
                eventKey="All"
                title={<span className="custom-tab-all">All Chats</span>}
                itemID="tabAll"
              >
                {searchChat !== '' && chatListFiltered.length === 0 ? (
                  <p className="chat-lists-note">
                    There are no chats with your search keywords try with different keywords
                  </p>
                ) : searchChat === '' && chatListFiltered.length === 0 ? (
                  <p className="chat-lists-note">There are no chats initiated from customer</p>
                ) : (
                  getPaginatedChats(getFilteredChats('notPinned').map((value, key) => (
                    <div
                      key={key}
                      className="chat-head"
                      style={{
                        backgroundColor:
                          value.id === chatOpenDetails.id
                            ? '#f2f2f2'
                            : value?.admin_unreads
                              ? '#b9e4ff'
                              : '',
                      }}
                      onClick={() => handleOpenChat(value)}
                    >
                      <LazyLoadImage
                        className="chat-avatar"
                        placeholderSrc={aahaaslogo}
                        src={aahaaslogo}
                      />
                      <h6 className="chat-name ellipsis-2-lines">
                        {value.chat_name}
                        {value.customer_name ? ` by ${value.customer_name}` : ''}
                        {value?.assign_employee_name
                          ? `( handle by ${value?.assign_employee_name})`
                          : ''}
                      </h6>

                      <p className="chat-created-date">
                        Initiate at {formatDate(value.createdAt)} -{' '}
                        {value?.admin_included?.length === undefined
                          ? 'No active admins'
                          : `Active admins x ${value?.admin_included?.length}`}
                      </p>

                      <div className="reading-admins">
                        {value?.admin_included === undefined ||
                          value?.admin_included?.length == 0 ? (
                          <span className="chat-admin">Yet to be replied</span>
                        ) : (
                          <span className="chat-admin">
                            {value?.admin_included?.length} admin are in chat
                          </span>
                        )}
                        <span>-</span>
                        {value?.admin_reading === undefined ||
                          value?.admin_reading?.length === 0 ? (
                          <span className="read-admin">No one is reading</span>
                        ) : (
                          <span className="read-admin">
                            {value?.admin_reading?.length} are reading
                          </span>
                        )}
                      </div>
                      <div className="chat-notify">
                        {value?.admin_unreads != 0 ? (
                          <h6
                            style={{
                              backgroundColor: '#616161',
                              borderRadius: 50,
                              paddingRight: 5,
                              paddingLeft: 5,
                              fontSize: 12,
                              color: 'white',
                              paddingTop: 3,
                              paddingBottom: 3,
                            }}
                          >
                            {value?.admin_unreads}
                          </h6>
                        ) : null}
                      </div>
                    </div>
                  ))
                  ))}
                {/* Pagination controls */}
                {/* Responsive Pagination */}
                {getFilteredChats('notPinned').length > pagination.itemsPerPage && (
                  <div className="d-flex justify-content-center mt-3">
                    <Pagination className="flex-wrap justify-content-center">
                      <Pagination.Prev
                        onClick={() => setPagination(prev => ({
                          ...prev,
                          currentPage: Math.max(1, prev.currentPage - 1)
                        }))}
                        disabled={pagination.currentPage === 1}
                        className="mx-1"
                      />

                      {/* First Page */}
                      {pagination.currentPage > 2 && (
                        <Pagination.Item
                          key={1}
                          onClick={() => setPagination(prev => ({ ...prev, currentPage: 1 }))}
                          className="mx-1 d-none d-sm-block"
                        >
                          1
                        </Pagination.Item>
                      )}

                      {/* Ellipsis for far pages */}
                      {pagination.currentPage > 3 && (
                        <Pagination.Ellipsis className="mx-1 d-none d-md-block" />
                      )}

                      {/* Current page and neighbors */}
                      {Array.from({ length: Math.ceil(getFilteredChats('notPinned').length / pagination.itemsPerPage) })
                        .map((_, index) => {
                          const page = index + 1;
                          // Show only current page and adjacent pages on mobile
                          if (
                            page === 1 ||
                            page === Math.ceil(getFilteredChats('notPinned').length / pagination.itemsPerPage) ||
                            (page >= pagination.currentPage - 1 && page <= pagination.currentPage + 1)
                          ) {
                            return (
                              <Pagination.Item
                                key={page}
                                active={page === pagination.currentPage}
                                onClick={() => setPagination(prev => ({ ...prev, currentPage: page }))}
                                className="mx-1"
                              >
                                {page}
                              </Pagination.Item>
                            );
                          }
                          return null;
                        })}

                      {/* Ellipsis for far pages */}
                      {pagination.currentPage < Math.ceil(getFilteredChats('notPinned').length / pagination.itemsPerPage) - 2 && (
                        <Pagination.Ellipsis className="mx-1 d-none d-md-block" />
                      )}

                      {/* Last Page */}
                      {pagination.currentPage < Math.ceil(getFilteredChats('notPinned').length / pagination.itemsPerPage) - 1 && (
                        <Pagination.Item
                          key={Math.ceil(getFilteredChats('notPinned').length / pagination.itemsPerPage)}
                          onClick={() => setPagination(prev => ({
                            ...prev,
                            currentPage: Math.ceil(getFilteredChats('notPinned').length / pagination.itemsPerPage)
                          }))}
                          className="mx-1 d-none d-sm-block"
                        >
                          {Math.ceil(getFilteredChats('notPinned').length / pagination.itemsPerPage)}
                        </Pagination.Item>
                      )}

                      <Pagination.Next
                        onClick={() => setPagination(prev => ({
                          ...prev,
                          currentPage: Math.min(
                            Math.ceil(getFilteredChats('notPinned').length / pagination.itemsPerPage),
                            prev.currentPage + 1
                          )
                        }))}
                        disabled={
                          pagination.currentPage ===
                          Math.ceil(getFilteredChats('notPinned').length / pagination.itemsPerPage)
                        }
                        className="mx-1"
                      />
                    </Pagination>
                  </div>
                )}

              </Tab>
              {userData.roles.includes('SuperAdmin') ? null : userData.roles.includes(
                'Admin',
              ) ? null : (
                <Tab
                  eventKey="CustomerOrdered"
                  title={<span className="custom-tab-pending">Assigned Chats</span>}
                  itemID="tabPending"
                >
                  {searchChat !== '' && chatListFiltered.length === 0 ? (
                    <p className="chat-lists-note">
                      There are no chats with your search keywords try with different keywords
                    </p>
                  ) : searchChat === '' && chatListFiltered.length === 0 ? (
                    <p className="chat-lists-note">There are no chats initiated from customer</p>
                  ) : getFilteredChats('assigned').length === 0 ? (
                    <p className="chat-lists-note">There are no chats assigned</p>
                  ) : (
                    getFilteredChats('assigned').map((value, key) => (
                      <div
                        key={key}
                        className="chat-head"
                        style={{
                          backgroundColor:
                            value.id === chatOpenDetails.id
                              ? '#f2f2f2'
                              : value?.admin_unreads
                                ? '#b9e4ff'
                                : '',
                        }}
                        onClick={() => handleOpenChat(value)}
                      >
                        <LazyLoadImage
                          className="chat-avatar"
                          placeholderSrc={aahaaslogo}
                          src={aahaaslogo}
                        />
                        <h6 className="chat-name ellipsis-2-lines">
                          {value.chat_name}
                          {value.customer_name ? ` by ${value.customer_name}` : ''}
                          {value?.assign_employee_name
                            ? `( handle by ${value?.assign_employee_name})`
                            : ''}
                        </h6>

                        <p className="chat-created-date">
                          Initiate at {formatDate(value.createdAt)} -{' '}
                          {value?.admin_included?.length === undefined
                            ? 'No active admins'
                            : `Active admins x ${value?.admin_included?.length}`}
                        </p>

                        <div className="reading-admins">
                          {value?.admin_included === undefined ||
                            value?.admin_included?.length == 0 ? (
                            <span className="chat-admin">Yet to be replied</span>
                          ) : (
                            <span className="chat-admin">
                              {value?.admin_included?.length} admin are in chat
                            </span>
                          )}
                          <span>-</span>
                          {value?.admin_reading === undefined ||
                            value?.admin_reading?.length === 0 ? (
                            <span className="read-admin">No one is reading</span>
                          ) : (
                            <span className="read-admin">
                              {value?.admin_reading?.length} are reading
                            </span>
                          )}
                        </div>
                        <div className="chat-notify">
                          {value?.admin_unreads != 0 ? (
                            <h6
                              style={{
                                backgroundColor: '#616161',
                                borderRadius: 50,
                                paddingRight: 5,
                                paddingLeft: 5,
                                fontSize: 12,
                                color: 'white',
                                paddingTop: 3,
                                paddingBottom: 3,
                              }}
                            >
                              {value?.admin_unreads}
                            </h6>
                          ) : null}
                        </div>
                      </div>
                    ))
                  )}
                </Tab>
              )}

              <Tab eventKey="Pending" title="Pending Chats" itemID="tabPending">
                {/* Content for Pending Chats can be added later */}
                {searchChat !== '' && chatListFiltered.length === 0 ? (
                  <p className="chat-lists-note">
                    There are no chats with your search keywords try with different keywords
                  </p>
                ) : searchChat === '' && chatListFiltered.length === 0 ? (
                  <p className="chat-lists-note">There are no chats initiated from customer</p>
                ) : (
                  getPaginatedChats(getFilteredChats('Pending').map((value, key) => (
                    <div
                      key={key}
                      className="chat-head"
                      style={{
                        backgroundColor:
                          value.id === chatOpenDetails.id
                            ? '#f2f2f2'
                            : value?.admin_unreads
                              ? '#b9e4ff'
                              : '',
                      }}
                      onClick={() => handleOpenChat(value)}
                    >
                      <LazyLoadImage
                        className="chat-avatar"
                        placeholderSrc={aahaaslogo}
                        src={aahaaslogo}
                      />
                      <h6 className="chat-name ellipsis-2-lines">
                        {value.chat_name}
                        {value.customer_name ? ` by ${value.customer_name}` : ''}
                        {value?.assign_employee_name
                          ? `( handle by ${value?.assign_employee_name})`
                          : ''}
                      </h6>

                      <p className="chat-created-date">
                        Initiate at {formatDate(value.createdAt)} -{' '}
                        {value?.admin_included?.length === undefined
                          ? 'No active admins'
                          : `Active admins x ${value?.admin_included?.length}`}
                      </p>

                      <div className="reading-admins">
                        {value?.admin_included === undefined ||
                          value?.admin_included?.length == 0 ? (
                          <span className="chat-admin">Yet to be replied</span>
                        ) : (
                          <span className="chat-admin">
                            {value?.admin_included?.length} admin are in chat
                          </span>
                        )}
                        <span>-</span>
                        {value?.admin_reading === undefined ||
                          value?.admin_reading?.length === 0 ? (
                          <span className="read-admin">No one is reading</span>
                        ) : (
                          <span className="read-admin">
                            {value?.admin_reading?.length} are reading
                          </span>
                        )}
                      </div>
                      <div className="chat-notify">
                        {value?.admin_unreads != 0 ? (
                          <h6
                            style={{
                              backgroundColor: '#616161',
                              borderRadius: 50,
                              paddingRight: 5,
                              paddingLeft: 5,
                              fontSize: 12,
                              color: 'white',
                              paddingTop: 3,
                              paddingBottom: 3,
                            }}
                          >
                            {value?.admin_unreads}
                          </h6>
                        ) : null}
                      </div>
                    </div>
                  ))
                  ))}
                {/* Pagination controls */}
                {/* Responsive Pagination */}
                {getFilteredChats('notPinned').length > pagination.itemsPerPage && (
                  <div className="d-flex justify-content-center mt-3">
                    <Pagination className="flex-wrap justify-content-center">
                      <Pagination.Prev
                        onClick={() => setPagination(prev => ({
                          ...prev,
                          currentPage: Math.max(1, prev.currentPage - 1)
                        }))}
                        disabled={pagination.currentPage === 1}
                        className="mx-1"
                      />

                      {/* First Page */}
                      {pagination.currentPage > 2 && (
                        <Pagination.Item
                          key={1}
                          onClick={() => setPagination(prev => ({ ...prev, currentPage: 1 }))}
                          className="mx-1 d-none d-sm-block"
                        >
                          1
                        </Pagination.Item>
                      )}

                      {/* Ellipsis for far pages */}
                      {pagination.currentPage > 3 && (
                        <Pagination.Ellipsis className="mx-1 d-none d-md-block" />
                      )}

                      {/* Current page and neighbors */}
                      {Array.from({ length: Math.ceil(getFilteredChats('notPinned').length / pagination.itemsPerPage) })
                        .map((_, index) => {
                          const page = index + 1;
                          // Show only current page and adjacent pages on mobile
                          if (
                            page === 1 ||
                            page === Math.ceil(getFilteredChats('notPinned').length / pagination.itemsPerPage) ||
                            (page >= pagination.currentPage - 1 && page <= pagination.currentPage + 1)
                          ) {
                            return (
                              <Pagination.Item
                                key={page}
                                active={page === pagination.currentPage}
                                onClick={() => setPagination(prev => ({ ...prev, currentPage: page }))}
                                className="mx-1"
                              >
                                {page}
                              </Pagination.Item>
                            );
                          }
                          return null;
                        })}

                      {/* Ellipsis for far pages */}
                      {pagination.currentPage < Math.ceil(getFilteredChats('notPinned').length / pagination.itemsPerPage) - 2 && (
                        <Pagination.Ellipsis className="mx-1 d-none d-md-block" />
                      )}

                      {/* Last Page */}
                      {pagination.currentPage < Math.ceil(getFilteredChats('notPinned').length / pagination.itemsPerPage) - 1 && (
                        <Pagination.Item
                          key={Math.ceil(getFilteredChats('notPinned').length / pagination.itemsPerPage)}
                          onClick={() => setPagination(prev => ({
                            ...prev,
                            currentPage: Math.ceil(getFilteredChats('notPinned').length / pagination.itemsPerPage)
                          }))}
                          className="mx-1 d-none d-sm-block"
                        >
                          {Math.ceil(getFilteredChats('notPinned').length / pagination.itemsPerPage)}
                        </Pagination.Item>
                      )}

                      <Pagination.Next
                        onClick={() => setPagination(prev => ({
                          ...prev,
                          currentPage: Math.min(
                            Math.ceil(getFilteredChats('notPinned').length / pagination.itemsPerPage),
                            prev.currentPage + 1
                          )
                        }))}
                        disabled={
                          pagination.currentPage ===
                          Math.ceil(getFilteredChats('notPinned').length / pagination.itemsPerPage)
                        }
                        className="mx-1"
                      />
                    </Pagination>
                  </div>
                )}
              </Tab>
              <Tab eventKey="End" title="End Chats" itemID="tabEnd">
                {/* Content for End Chats can be added later */}
                {searchChat !== '' && chatListFiltered.length === 0 ? (
                  <p className="chat-lists-note">
                    There are no chats with your search keywords try with different keywords
                  </p>
                ) : searchChat === '' && chatListFiltered.length === 0 ? (
                  <p className="chat-lists-note">There are no chats initiated from customer</p>
                ) : (
                  getPaginatedChats(getFilteredChats('End').map((value, key) => (
                    <div
                      key={key}
                      className="chat-head"
                      style={{
                        backgroundColor:
                          value.id === chatOpenDetails.id
                            ? '#f2f2f2'
                            : value?.admin_unreads
                              ? '#b9e4ff'
                              : '',
                      }}
                      onClick={() => handleOpenChat(value)}
                    >
                      <LazyLoadImage
                        className="chat-avatar"
                        placeholderSrc={aahaaslogo}
                        src={aahaaslogo}
                      />
                      <h6 className="chat-name ellipsis-2-lines">
                        {value.chat_name}
                        {value.customer_name ? ` by ${value.customer_name}` : ''}
                        {value?.assign_employee_name
                          ? `( handle by ${value?.assign_employee_name})`
                          : ''}
                      </h6>

                      <p className="chat-created-date">
                        Initiate at {formatDate(value.createdAt)} -{' '}
                        {value?.admin_included?.length === undefined
                          ? 'No active admins'
                          : `Active admins x ${value?.admin_included?.length}`}
                      </p>

                      <div className="reading-admins">
                        {value?.admin_included === undefined ||
                          value?.admin_included?.length == 0 ? (
                          <span className="chat-admin">Yet to be replied</span>
                        ) : (
                          <span className="chat-admin">
                            {value?.admin_included?.length} admin are in chat
                          </span>
                        )}
                        <span>-</span>
                        {value?.admin_reading === undefined ||
                          value?.admin_reading?.length === 0 ? (
                          <span className="read-admin">No one is reading</span>
                        ) : (
                          <span className="read-admin">
                            {value?.admin_reading?.length} are reading
                          </span>
                        )}
                      </div>
                      <div className="chat-notify">
                        {value?.admin_unreads != 0 ? (
                          <h6
                            style={{
                              backgroundColor: '#616161',
                              borderRadius: 50,
                              paddingRight: 5,
                              paddingLeft: 5,
                              fontSize: 12,
                              color: 'white',
                              paddingTop: 3,
                              paddingBottom: 3,
                            }}
                          >
                            {value?.admin_unreads}
                          </h6>
                        ) : null}
                      </div>
                    </div>
                  ))
                ))}
                {/* Responsive Pagination */}
                {getFilteredChats('notPinned').length > pagination.itemsPerPage && (
                  <div className="d-flex justify-content-center mt-3">
                    <Pagination className="flex-wrap justify-content-center">
                      <Pagination.Prev
                        onClick={() => setPagination(prev => ({
                          ...prev,
                          currentPage: Math.max(1, prev.currentPage - 1)
                        }))}
                        disabled={pagination.currentPage === 1}
                        className="mx-1"
                      />

                      {/* First Page */}
                      {pagination.currentPage > 2 && (
                        <Pagination.Item
                          key={1}
                          onClick={() => setPagination(prev => ({ ...prev, currentPage: 1 }))}
                          className="mx-1 d-none d-sm-block"
                        >
                          1
                        </Pagination.Item>
                      )}

                      {/* Ellipsis for far pages */}
                      {pagination.currentPage > 3 && (
                        <Pagination.Ellipsis className="mx-1 d-none d-md-block" />
                      )}

                      {/* Current page and neighbors */}
                      {Array.from({ length: Math.ceil(getFilteredChats('notPinned').length / pagination.itemsPerPage) })
                        .map((_, index) => {
                          const page = index + 1;
                          // Show only current page and adjacent pages on mobile
                          if (
                            page === 1 ||
                            page === Math.ceil(getFilteredChats('notPinned').length / pagination.itemsPerPage) ||
                            (page >= pagination.currentPage - 1 && page <= pagination.currentPage + 1)
                          ) {
                            return (
                              <Pagination.Item
                                key={page}
                                active={page === pagination.currentPage}
                                onClick={() => setPagination(prev => ({ ...prev, currentPage: page }))}
                                className="mx-1"
                              >
                                {page}
                              </Pagination.Item>
                            );
                          }
                          return null;
                        })}

                      {/* Ellipsis for far pages */}
                      {pagination.currentPage < Math.ceil(getFilteredChats('notPinned').length / pagination.itemsPerPage) - 2 && (
                        <Pagination.Ellipsis className="mx-1 d-none d-md-block" />
                      )}

                      {/* Last Page */}
                      {pagination.currentPage < Math.ceil(getFilteredChats('notPinned').length / pagination.itemsPerPage) - 1 && (
                        <Pagination.Item
                          key={Math.ceil(getFilteredChats('notPinned').length / pagination.itemsPerPage)}
                          onClick={() => setPagination(prev => ({
                            ...prev,
                            currentPage: Math.ceil(getFilteredChats('notPinned').length / pagination.itemsPerPage)
                          }))}
                          className="mx-1 d-none d-sm-block"
                        >
                          {Math.ceil(getFilteredChats('notPinned').length / pagination.itemsPerPage)}
                        </Pagination.Item>
                      )}

                      <Pagination.Next
                        onClick={() => setPagination(prev => ({
                          ...prev,
                          currentPage: Math.min(
                            Math.ceil(getFilteredChats('notPinned').length / pagination.itemsPerPage),
                            prev.currentPage + 1
                          )
                        }))}
                        disabled={
                          pagination.currentPage ===
                          Math.ceil(getFilteredChats('notPinned').length / pagination.itemsPerPage)
                        }
                        className="mx-1"
                      />
                    </Pagination>
                  </div>
                )}
              </Tab>
            </Tabs>
          </div>
        </CCol>

        <ChatRight
          chatOpened={chatOpened}
          chatOpenedData={chatOpenDetails}
          handlePin={handlePinChats}
          chatPinned={pinnedChats?.includes(chatOpenDetails?.id)}
        ></ChatRight>
      </CRow>
    </div>
  )
}

export default ChatsMeta
