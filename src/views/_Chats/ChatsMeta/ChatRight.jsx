import React from 'react'

import { CButton, CCol, CRow, CTooltip  } from '@coreui/react'
import { useContext, useEffect, useRef, useState } from 'react'

import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  writeBatch,
  where,
  getDocs,
} from 'firebase/firestore'
// import { assignEmployeeToChat,getAllEmployees} from 'src/service/order_allocation_services';
import {
  assignEmployeeToChat,
  checkUpdateDoc,
  dialogUtils,
  firebaseOperations,
  getAllEmployees,
  handleChatControl,
  handleOperation,
} from './services/chatServices'
import Select from 'react-select'
import axios from 'axios'

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
  faMagic,
  faMagicWandSparkles,
  faMagnifyingGlassLocation,
  faMagnet,
  faCog,
  faUser,
  faBoxArchive,
  faEye,
  faStop,
  faPause,
  faStore,
  faPlay,
  faInfo,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons'

import { Tooltip } from '@material-ui/core'
import { UserLoginContext } from 'src/Context/UserLoginContext'
import { faThinkPeaks } from '@fortawesome/free-brands-svg-icons'
import SuggestionModal from './Components/SuggestionsModal'
import sendPushNotificationsOnChats from './functions/sendPushNotificationsOnChats'
import ProductSuggestionModal from './Components/ProductSuggestionModal'
import { Modal } from 'react-bootstrap'
import Swal from 'sweetalert2'
import {
  CCardImage,
  CBadge,
  CAlert,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash } from '@coreui/icons'
import MoreProductView from 'src/views/Products/MoreProductView/MoreProductView'
import moment from 'moment'
import AiSuggestionModal from './AiSuggestionModal'
import ChatAnalyticsModal from './ChatAnalyticsModal'

export default function ChatRight({ chatOpenedData, handlePin, chatPinned }) {
  console.log('Chat Opened Data is', chatOpenedData)
  const [lastMessages, setLastMessages] = useState([])
  const [lastMessageContent, setLastMessageContent] = useState([])
  const [recommenderModalOpen, setRecommenderModalOpen] = useState(false) // Recommender Modal Open State
  const [recommendations, setRecommendations] = useState([]) // Recommendations according to the chat State
  const [loadingRecommendations, setLoadingRecommendations] = useState(false) // Loading State for Recommendations
  const [selectedTab, setSelectedTab] = useState('home')
  const handleSearchBar = ({ status }) => {
    setSearchBarStatus({
      ...searchBarStatus,
      status: status,
    })
  }

  const handleChatSearch = (keyword) => {
    if (keyword == '') {
      setSearchBarStatus({
        ...searchBarStatus,
        searchKeyword: keyword,
        searchResuts: false,
        searchResultChats: [],
      })
    } else {
      let result = messages.filter((value) => {
        return value.text.toString().toLowerCase().includes(keyword.toString().toLowerCase())
      })
      setSearchBarStatus({
        ...searchBarStatus,
        searchKeyword: keyword,
        searchResuts: true,
        searchResultChats: result,
      })
    }
  }

  const handleCloseChat = () => {}

  // const getDateAndtime = (data) => {
  //     console.log("Input",data);
  //     const formattedDate = moment(data.seconds).format('HH:mm:ss');
  //     console.log("Output",formattedDate); // Output: 2025-01-11 16:08:09
  //     return formattedDate;
  // }

  const getDateAndtime = (timestamp) => {
    if (timestamp && timestamp.seconds) {
      return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000)
    }
    return null
  }

  const handleScrollToMessage = () => {}

  const { userData } = useContext(UserLoginContext)
 
  const handleSendMessage = async (value) => {
    if (value === '' || !value.trim()) {
      console.log('Empty message')
      return
    } else {
      setAdminMessage('')

      const adminMsg =  messages?.filter(data=>data?.role == "Admin")
      
  
      await addDoc(collection(db, 'chat-updated/chats/' + chatOpenDetails.id), {
        text: value,
        name: userData.name,
        createdAt: new Date(),
        role: 'Admin',
        uid: '12',
        customerReadStatus: {
          status: 'Unread',
          readAt: '',
        },
        adminReadStatus: {
          status: 'Read',
          readAt: serverTimestamp(),
        },
        supplierReadStatus: {
          status: 'Unread',
          readAt: '',
        },
        adminJoined:adminMsg?.length == 0 ? true : false
      })

      const docRef = doc(db, 'customer-chat-lists', chatOpenDetails.id)

      await updateDoc(docRef, {
        updatedAt: serverTimestamp(),
        last_message: {
          name: userData?.name,
          value: value,
        },
        customer_unreads: increment(1),
        supplier_unreads: increment(1),
        admin_unreads: 0,
      })

      sendPushNotificationsOnChats(chatOpenDetails, value)

      console.log('handleSendMessage function called')
      // await getChatContent({ chatId: chatOpenDetails, updateState: true });
    }
  }

  const getChatContent = async ({ chatId, updateState = false }) => {
    // Clear any existing listener before creating a new one
    if (getChatContent.unsubscribe) {
      getChatContent.unsubscribe() // Unsubscribe from previous snapshot listener
    }

    const q = query(collection(db, 'chat-updated/chats/' + chatId.id), orderBy('createdAt', 'desc'))

    // bimindu code

    const getmessages = onSnapshot(q, async (QuerySnapshot) => {
      const fetchedMessages = []
      const batch = writeBatch(db)

      QuerySnapshot.forEach((doc) => {
        const docData = doc.data()
        fetchedMessages.push({ ...docData, id: doc.id })

        if (docData.adminReadStatus?.status === 'Unread') {
          batch.update(doc.ref, {
            adminReadStatus: {
              status: 'Read',
              readAt: serverTimestamp(),
            },
          })
        }
      })
      setLastMessages(fetchedMessages.slice(0, 10).reverse())

      // Update lastMessageContent with new messages
      const messageContent = fetchedMessages.map((message) => ({
        role: message.role,
        text: message.text,
      }))

      

      setLastMessageContent(messageContent)

      await batch.commit()

      const sortedMessages = fetchedMessages.sort((a, b) => a.createdAt - b.createdAt)
      setMessages(sortedMessages)
      // console.log('Messages:', sortedMessages)
      const docRef = doc(db, 'customer-chat-lists', chatId.id)
      await updateDoc(docRef, { admin_unreads: 0 })
    })


    // Working new code

    // const getmessages = onSnapshot(q, async (QuerySnapshot) => {
    //   const fetchedMessages = []
    //   const batch = writeBatch(db)

    //   QuerySnapshot.forEach((doc) => {
    //     const docData = doc.data()
    //     fetchedMessages.push({ ...docData, id: doc.id })

    //     if (docData.adminReadStatus?.status === 'Unread') {
    //       batch.update(doc.ref, {
    //         adminReadStatus: {
    //           status: 'Read',
    //           readAt: serverTimestamp(),
    //         },
    //       })
    //     }
    //     // console.log(doc.id, "Doc ID is");
    //   })

    //   await batch.commit()

    //   const sortedMessages = fetchedMessages.sort((a, b) => a.createdAt - b.createdAt)
    //   setMessages(sortedMessages)
    //   console.log('Messages:', sortedMessages)
    //   const docRef = doc(db, 'customer-chat-lists', chatId.id)
    //   await updateDoc(docRef, { admin_unreads: 0 })
    // })

    // Save the unsubscribe function to `getChatContent` itself
    getChatContent.unsubscribe = getmessages

    if (!updateState) {
      await handleUpdateAdminStats({
        chatID: chatId.id,
        customerStatus: chatId.notifyCustomer,
        adminStatus: 'false',
        supplierStatus: chatId.notifySupplier,
        adminId: userData.name,
        updateState: updateState,
      })
    } else {
      await handleUpdateAdminStats({
        chatID: chatId.id,
        customerStatus: 'true',
        adminStatus: 'false',
        supplierStatus: 'true',
        adminId: userData.name,
        updateState: updateState,
      })
    }
    await removeExisting({ chatID: chatOpenDetails.id, adminId: userData.name })
  }

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

  const handleUpdateAdminStats = async ({
    chatID,
    customerStatus,
    adminStatus,
    supplierStatus,
    adminId,
    updateState,
  }) => {
    const chatDocRef = doc(db, 'customer-chat-lists/', chatID)
    const chatDocSnap = await getDoc(chatDocRef)
    if (chatDocSnap.exists()) {
      const updateData = {
        notifyCustomer: customerStatus,
        notifyAdmin: adminStatus,
        notifySupplier: supplierStatus,
      }
      if (updateState === false) {
        updateData.admin_reading = arrayUnion(adminId)
      } else {
        updateData.admin_reading = arrayRemove(adminId)
        updateData.admin_included = arrayUnion(adminId)
      }
      await updateDoc(chatDocRef, updateData)
    }
  }

  const handlePinChats = (data) => {
    handlePin(data)
  }

  const [adminMessage, setAdminMessage] = useState('')

  const [searchBarStatus, setSearchBarStatus] = useState({
    status: false,
    searchKeyword: '',
    searchResuts: false,
    searchResultChats: [],
  })

  const [pinnedChats, setPinnedChats] = useState([])

  const [messages, setMessages] = useState([])

  const [chatOpened, setChatOpened] = useState(false)

  const [chatOpenDetails, setChatOpenDetails] = useState([])

  const messageContailerRef = useRef()

  const [loader, setLoader] = useState(false)

  const handleOpenChat = async (chatData) => {
    // console.log('handleOpenChat function called');
    setChatOpened(true)
    setChatOpenDetails(chatData)
    console.log('chatData', chatData)

    setLoader(true)
    await getChatContent({ chatId: chatData, updateState: false })

    setLoader(false)
  }

  const [chatAssignedEmployee, setChatAssignedEmployee] = useState('')

  useEffect(() => {
    if (chatOpenedData?.id) {
      console.log('useEffect function called', chatOpenedData)
      handleOpenChat(chatOpenedData)
      setAssignedEmployee({ id: '', name: '', allotStatus: '' })

      if (chatOpenedData?.assign_employee) {
        setChatAssignedEmployee(chatOpenedData?.assign_employee)
        console.log('chatAssignedEmployee', chatOpenedData?.assign_employee)

        if (chatOpenedData?.assign_employee !== '') {
          const user = availableEmployees.find(
            (employee) => employee.id === chatOpenedData?.assign_employee,
          )
          if (user)
            setAssignedEmployee({
              id: user.id,
              name: user.name,
              allotStatus: 'Allocated',
              chatId: chatOpenedData?.id,
            })
          console.log('Assigned Employee: ', user)
        }
      } else {
        setChatAssignedEmployee(null)
      }
    }

    return () => {
      if (getChatContent.unsubscribe) {
        getChatContent.unsubscribe()
      }
    }
  }, [chatOpenedData])

  const [clipBoardStatus, setClipBoardStatus] = useState(false)

  const handleKeyUp = (event) => {
    if (event.key === 'Enter' && !event.shiftKey && !clipBoardStatus) {
      handleSendMessage(adminMessage)
    }
  }

  const handleOpenClipBoardOpen = () => {
    setClipBoardStatus(!clipBoardStatus)
  }

  const [clickedMssage, setclickedMssage] = useState('')

  const [messageClipBoard, setMessageClipBoard] = useState(false)
  const chatRefs = useRef([])

  useEffect(() => {
    if (messageContailerRef.current) {
      messageContailerRef.current.scrollTop = messageContailerRef.current.scrollHeight
    }
  }, [messages])

  const [isTyping, setIsTyping] = useState(false)

  const handleTyping = async (e) => {
    setAdminMessage(e.target.value)

    if (!isTyping) {
      setIsTyping(true)
    }
  }

  const handleStopTyping = () => {
    setIsTyping(false)
  }

  const suggestions = [
    'Hello! How can I assist you today?',
    'Could you please provide more details?',
    'I’m here to help with any questions.',
    'Let me know if you need further assistance.',
    'Thank you for reaching out!',
    'Feel free to share any specific concerns.',
    "I'll get back to you as soon as possible.",
    "Is there anything else you'd like to know?",
    'Let me check that for you.',
    'I appreciate your patience.',
  ]

  useEffect(() => {
    let typingTimeout
    console.log('Status: ', userData)
    if (isTyping) {
      const docRef = doc(db, 'customer-chat-lists', chatOpenDetails?.id)

      updateDoc(docRef, { admin_typing: true })
        .then(() => {
          console.log('Admin typing status updated to true')
        })
        .catch((error) => console.error('Error updating admin typing status: ', error))

      typingTimeout = setTimeout(() => {
        handleStopTyping()
        updateDoc(docRef, { admin_typing: false })
          .then(() => {
            console.log('Admin typing status updated to false')
          })
          .catch((error) => console.error('Error updating admin typing status: ', error))
      }, 1000)
    }

    return () => {
      if (typingTimeout) clearTimeout(typingTimeout)
    }
  }, [adminMessage, isTyping])

  // console.log(chatOpenDetails, "Chat Open Details Are Data is")

  const [autoSuggestionBox, setAutoSuggestionBox] = useState(false)

  const handleAutoSuggestionModal = () => {
    setAutoSuggestionBox(true)
  }

  const onHide = () => {
    setAutoSuggestionBox(false)
  }

  const onMessageSelect = (data) => {
    setAdminMessage(data)
    setAutoSuggestionBox(false)
  }

  const [productAutoSuggestion, setProductAutoSuggestion] = useState(false)

  const handleProductSuggestions = () => {
    setProductAutoSuggestion(true)
  }

  const onMessageSelectProductSuggest = () => {
    setProductAutoSuggestion(false)
  }

  const [showModal, setShowModal] = useState(false)
  const handleAssignEmployee = (data) => {
    // Implement the function to handle the assignment of the employee
    // // console.log("Assigned Employee:", selectedEmployee, "to Row:", selectedRow);
    // handleCloseModal();

    console.log(data)

    // setSelectedRow(rowData?.info);
    setShowModal(true)
  }
  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedEmployee(null)

    // setSelectedRow([]);
    // setSelectedEmployee(null);
  }

  const [availableEmployees, setAvailableEmployees] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const employeeOptions = availableEmployees.map((response) => ({
    value: response.id,
    label: response.name,
  }))
  const [assignedEmployee, setAssignedEmployee] = useState({
    id: '',
    name: '',
    allotStatus: '',
    chatId: '',
  })

  const monitorAvailability = () => {
    try {
      getAllEmployees()
        .then((response) => {
          setAvailableEmployees(response)

          // console.log("Available Employees: ", response);
        })
        .catch((error) => {
          console.error('Error fetching available employees: ', error)
        })
    } catch (error) {
      console.error('Error available employee: ', error)
    }
  }

  useEffect(() => {
    monitorAvailability()
  }, [])

  const handleAllocateEmployee = async () => {
    // console.log(selectedEmployee, "Selected Employee Name iss");

    // Show confirmation message
    const confirmation = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to assign employees to chat?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    })

    if (confirmation.isConfirmed) {
      console.log('Confirmed', selectedEmployee)
      console.log('chat Id', chatOpenDetails.id)

      assignEmployeeToChat(chatOpenDetails.id, selectedEmployee)
        .then((res) => {
          // getRows();
          // handleCloseModal();
          // console.log("Employee Assigned to Chat: ", res);
          var errorVal = res[0]

          if (errorVal === 400) {
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: res[1],
            })
          } else {
            const docRef = doc(db, 'customer-chat-lists', chatOpenDetails?.id)

            updateDoc(docRef, {
              assign_employee: selectedEmployee?.value,
              assign_employee_name: selectedEmployee?.label,
            })
              .then(() => {
                console.log('Employee assigned to chat successfully')
                setAssignedEmployee({
                  name: selectedEmployee?.label,
                  allotStatus: 'Allocated',
                  chatId: chatOpenedData?.id,
                })
                setSelectedEmployee(null)
                Swal.fire({
                  icon: 'success',
                  title: 'Success!',
                  text: res[1],
                })
              })
              .catch((error) => {
                console.log('chat Id update function', chatOpenDetails.id)
                console.error(' Employee assigned to chat failed : ', error)
              })
          }
        })
        .catch((error) => {
          console.error('Error:', error)

          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Failed to assign employees to chat. Please try again later.',
          })

          Swal.hideLoading()
        })
    }
  }

  const customStyles = {
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  }

  const handleDeleteEmployee = async (value) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to remove this employee?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        // var newDataSet = selectedRow?.allocatedUser?.filter(resFilter => resFilter.allotId !== value);

        // handleDeleteData(selectedRow?.checkoutID, userData?.id)

        // setSelectedRow({
        //     ...selectedRow,
        //     allocatedUser: newDataSet
        // });

        // getRows();

        const docRef = doc(db, 'customer-chat-lists', value)

        updateDoc(docRef, { assign_employee: null, assign_employee_name: null })
          .then(() => {
            setAssignedEmployee({ id: '', name: '', allotStatus: '', chatId: '' })
            setSelectedEmployee(null)

            Swal.fire('Deleted!', 'The employee has been deleted.', 'success')
          })
          .catch((error) => {
            console.log('chat Id update function', chatOpenDetails.id)
            console.error(' Employee assigned to chat failed : ', error)
          })
      }
    })
  }

  const [moreData, setMoreData] = useState([])
  const [moreProductsModal, setMoreProductModal] = useState(false)

  const [chatStatus, setChatStatus] = useState(chatOpenDetails?.status)
  // Fetch chat status when component mounts or chatOpenDetails changes
  useEffect(() => {
    const fetchChatStatus = async () => {
      if (!chatOpenDetails?.id) return

      try {
        const docRef = doc(db, 'customer-chat-lists', chatOpenDetails.id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const data = docSnap.data()
          setChatStatus(data.status)

          // Update parent component if needed
          if (typeof onStatusUpdate === 'function') {
            onStatusUpdate(data)
          }
        }
      } catch (error) {
        console.error('Error fetching chat status:', error)
      }
    }

    fetchChatStatus()
  }, [chatOpenDetails?.id])

  // stop chat status

  const handleChatControl = (data) => {
    console.log('Attempting to control chat with data:', data)

    return new Promise((resolve) => {
      const isStopAction = data.status === 'Active' || data.status === 'Pending'
      const actionText = isStopAction ? 'stop' : 'pause'
      const newStatus = isStopAction ? 'End' : 'Pending'

      Swal.fire({
        title: 'Are you sure?',
        text: `Do you really want to ${actionText} this chat?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: `Yes, ${actionText} it!`,
      }).then(async (result) => {
        if (!result.isConfirmed) {
          console.log('User cancelled the operation.')
          return resolve([400, 'User cancelled the operation'])
        }

        if (!data.id) {
          console.error('Missing required parameters: chat_id.')
          await Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Required data is missing. Unable to control the chat.',
          })
          return resolve([400, 'Missing required parameters'])
        }

        try {
          // const docRef = doc(db, 'customer-chat-lists', data.id)

          // await updateDoc(docRef, {
          //   status: newStatus,
          //   updatedAt: serverTimestamp(),
          // })

          // // Fetch updated status after successful update
          // const updatedDoc = await getDoc(docRef)
          // check the updatedoc 
          const updatedDoc = await checkUpdateDoc(db,data,newStatus)
          console.log(updatedDoc);
          
          if (updatedDoc) {
            setChatStatus(updatedDoc.status)
            
            if (typeof onStatusUpdate === 'function') {
              onStatusUpdate(updatedDoc)
            }
          }
          // if (updatedDoc.exists()) {
          //   const updatedData = updatedDoc.data()
          //   setChatStatus(updatedData.status)

          //   if (typeof onStatusUpdate === 'function') {
          //     onStatusUpdate(updatedData)
          //   }
          // }

          console.log(`Chat ${actionText}ed successfully.`)
          await Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: `The chat has been ${actionText}ed.`,
            showConfirmButton: true,
            timer: 1500,
          })

          return resolve([200, `Chat ${actionText}ed successfully`])
        } catch (error) {
          console.error(`Error occurred while ${actionText}ing chat:`, error)
          await Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: `An error occurred while ${actionText}ing chat.`,
          })
          return resolve([400, `Error occurred while ${actionText}ing chat`])
        }
      })
    })
  }

  //   const handleChatControl = (data) => {
  //     return handleOperation({
  //       operation: async () => {
  //         const isStopAction = data.status === 'Active' || data.status === 'Pending'
  //         const actionText = isStopAction ? 'stop' : 'pause'
  //         const newStatus = isStopAction ? 'End' : 'Pending'

  //         // Show confirmation dialog
  //         const confirmed = await dialogUtils.showConfirmation({
  //           title: 'Are you sure?',
  //           text: `Do you really want to ${actionText} this chat?`,
  //         })

  //         if (!confirmed) {
  //           return [400, 'User cancelled the operation']
  //         }

  //         // Update chat status
  //         const docRef = await firebaseOperations.updateDocument('customer-chat-lists', data.id, {
  //           status: newStatus,
  //         })

  //         // Fetch updated data
  //         const updatedDoc = await firebaseOperations.fetchDocument(docRef)
  //         // Fetch updated status after successful update
  //         // const updatedDoc = await getDoc(docRef)
  //         if (updatedDoc.exists()) {
  //           const updatedData = updatedDoc.data()
  //           setChatStatus(updatedData.status)

  //           if (typeof onStatusUpdate === 'function') {
  //             onStatusUpdate(updatedData)
  //           }
  //         }

  //         return [200, `Chat ${actionText}ed successfully`]
  //       },
  //       validationFn: () => !!data.id,
  //       successMessage: 'Operation completed successfully',
  //       errorMessage: 'Failed to control chat',
  //       onSuccess: async (result) => {
  //         if (typeof onStatusUpdate === 'function') {
  //           onStatusUpdate(result)
  //         }
  //       },
  //     })
  //   }

  const handleOnClick = (data) => {
    // console.log(data, "chamod")
    // console.log(data)

    const categories = [
      { value: '1', name: 'Essentials' },
      { value: '2', name: 'Essentials' },
      { value: '3', name: 'Lifestyles' },
      { value: '4', name: 'Hotels' },
      { value: '5', name: 'Educations' },
    ]

    if (data.category) {
      const category = categories.find((cat) => cat.value === data.category.toString())
      if (category) {
      data.category = category.name
      }
    }
    // console.log(data, 'chamod')
    setMoreProductModal(true)
    // // setMoreData({
    // //     "product_title": "Hompton by the Beach Penang",
    // //     "product_description": "Hompton by the Beach Penang is a 4-star hotel along the strategic Tanjung Tokong seafront that embodies both business and pleasure, offering travellers a home away from home. At Hompton, we set ourselves apart by offering guests an unforgettable experience that reminisce the irreplaceable comfort of home, upped with attentive service and a panoramic vista of the calm turquoise sea.",
    // //     "product_image": "https://lh3.googleusercontent.com/p/AF1QipOzbXb60DfxgJ27Deryvflw4LmYItI4sq2PSL6j=s680-w680-h510",
    // //     "category": "Hotels",
    // //     "created_date": "2025-12-19",
    // //     "product_id": 757,
    // //     "tableData": {
    // //         "id": 0
    // //     }
    // // })

    setMoreData(data)
  }


  async function getRecommendations() {
    setLoadingRecommendations(true)
    setRecommendations([]);
    try {
      const response = await axios.post('/getRecommendations', {
        chats: lastMessageContent,
      })
      setRecommendations(response.data)
      console.log('Recommendations:--------------------------------------------------', response.data)
    } catch (error) {
      console.error('Error fetching recommendations:--------------------------------------------------------', error)
      Swal.fire({
        icon: 'error',
        title: 'Aiyooo...',
        text: 'Failed to fetch recommendations. Please try again later.',
      })
    } finally {
      setLoadingRecommendations(false)
    }
  }

  const handleProductRecommendation = () => {
    try {
      if (lastMessages.length > 0) {
        lastMessages.map((message) => {
          lastMessageContent.push({ role: message.role, text: message.text })
        })
      }
    } catch (error) {
      console.error(error)
    }
    setRecommenderModalOpen(true)
    getRecommendations()
  }


  const [viewChatAnalytics, setViewChatAnalytics] = useState(false)

  const handleChatAnalytics = () => {
    setViewChatAnalytics(true)
  }

  return (
    <>
      {autoSuggestionBox ? (
        <SuggestionModal
          show={autoSuggestionBox}
          onHide={() => onHide()}
          messageList={messages.slice(-5)}
          chatDetails={chatOpenDetails}
          onMessageSelect={onMessageSelect}
        ></SuggestionModal>
      ) : null}

      {productAutoSuggestion ? (
        <ProductSuggestionModal
          show={autoSuggestionBox}
          onHide={() => onHide()}
          messageList={messages.slice(-5)}
          chatDetails={chatOpenDetails}
          onMessageSelect={onMessageSelectProductSuggest}
        ></ProductSuggestionModal>
      ) : null}

      <CCol lg={9} className="chat-list-right-sidebar">
        {chatOpened ? (
          <>
            <>
              <div className="chat-details-head">
                <LazyLoadImage
                  className="chat-details-head-avatar mr-2"
                  placeholderSrc={aahaaslogo}
                  src={aahaaslogo}
                />
                <div className="d-flex flex-column">
                  <h6 className="chat-details-head-name">{chatOpenDetails?.chat_name}</h6>
                  <h6 className="chat-details-head-related-with">
                    {chatOpenDetails?.chat_related}
                  </h6>
                </div>
                {/* <div className={searchBarStatus.status ? 'search-bar-open' : 'search-bar-close'}>
                                    <input type="text" placeholder="Search your messages.." value={searchBarStatus.searchKeyword} onChange={(e) => handleChatSearch(e.target.value)} />
                                    <FontAwesomeIcon icon={faXmark} onClick={() => handleSearchBar({ status: false })} />
                                </div> */}
                <div
                  className={searchBarStatus.status ? 'chat-more-items' : 'chat-more-items ms-auto'}
                >
                  {/* <FontAwesomeIcon icon={faMagnifyingGlass} style={{ display: searchBarStatus.status ? 'none' : 'block', color: 'white' }} onClick={() => handleSearchBar({ status: true })} /> */}
                  <FontAwesomeIcon
                    icon={faThumbtack}
                    onClick={() => handlePinChats(chatOpenDetails)}
                    style={{ color: chatPinned ? '#ffd00f' : 'white' }}
                  />
                  {/* <FontAwesomeIcon icon={faEye} onClick={() => handleOnClick(chatOpenDetails)} style={{ color: '#2bfd3c' }} /> */}
                  {chatOpenedData?.comments?.product_id && (
                    <FontAwesomeIcon
                      icon={faEye}
                      onClick={() => handleOnClick(chatOpenedData?.comments)}
                      style={{ color: '#2bfd3c' }}
                    />
                  )}
                  {/* the end chat icon */}
                  {
                    
                    <CTooltip  
                    content={chatStatus === 'End' ? 'Chat is Stopped' : 'Click to Stop Chat'}
                    placement="auto">
                  
                    <FontAwesomeIcon
                      icon={chatStatus === 'End' ? faStop : faPause}
                      onClick={() => {
                        if (chatStatus !== 'End') {
                          handleChatControl({
                            ...chatOpenDetails,
                            status: chatStatus,
                          })
                        }
                      }}
                      style={{
                        color: chatStatus === 'End' ? '#ff0000' : '#ffe400',
                        cursor: chatStatus === 'End' ? 'pointer' : 'pointer',
                        pointerEvents: chatStatus === 'End' ? 'auto' : 'auto',
                      }}
                    />
                    </CTooltip>

                    // <FontAwesomeIcon icon={faStop} onClick={() => handleStopChat(chatOpenDetails)} style={{ color: '#2bfd3c' }} />
                  }

                  {[
                    'assign employer to chat',
                    'remove employer from chat',
                    'view assign employer chat',
                  ].some((permission) => userData?.permissions?.includes(permission)) && (
                    <FontAwesomeIcon
                      icon={faUser}
                      className="icon-style"
                      onClick={() => {
                        handleAssignEmployee('Employee Asaign')
                      }}
                      style={{ color: '#03e5fd' }}
                    />
                  )}
                   <CTooltip  
                    content={'Chat Analytics'}
                    placement="auto">
                  
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      onClick={() => {
                          handleChatAnalytics()
                      }}
                      style={{
                        color: '#ffff',
                      }}
                    />
                    </CTooltip>
                  {/* <FontAwesomeIcon icon={faXmark} onClick={() => handleCloseChat()} /> */}
                </div>
              </div>
              <div className="chat-details-main-content">
                <div className="chat-content">
                  {!loader ? (
                    <div
                      ref={messageContailerRef}
                      className={
                        searchBarStatus.status
                          ? 'chat-message-messages-open'
                          : 'chat-message-messages-close'
                      }
                    >
                      <p className="chat-notice">
                        <FontAwesomeIcon icon={faCircleInfo} />{' '}
                        {chatOpenDetails?.customer_name !== ''
                          ? chatOpenDetails?.customer_name + ', the customer'
                          : 'The Admin'}{' '}
                        has initiated the chat for {chatOpenDetails?.chat_related}.
                      </p>
                      {messages?.length === 0 ? (
                        <p className="chat-notice">
                          <FontAwesomeIcon icon={faCircleInfo} style={{ marginRight: '5px' }} />
                          Please start responding to resolve their issue as soon as possible.
                        </p>
                      ) : (
                        messages?.map((value, index) => (
                          <div className={value.role === 'Admin' ? 'textingsfhvflhsjdbx' : ''}>
                            {/* <div style={{ display: value.role !== 'Admin' ? 'none' : '' }} className="more-items" onClick={() => { messageClipBoard === value.id ? setMessageClipBoard() : setMessageClipBoard(value.id) }}>
                                                                <FontAwesomeIcon icon={faClipboard} className="chat-message-input-icon" style={{ color: clipBoardStatus ? 'black' : 'inherit' }} />
                                                            </div> */}
                            <div
                              ref={(el) => (chatRefs.current[index] = el)}
                              key={index}
                              className={` ${
                                value.role === 'Admin'
                                  ? 'chat-content-admin'
                                  : 'chat-content-customer'
                              } `}
                              style={{
                                backgroundColor: clickedMssage === value.id ? 'lightgray' : '',
                              }}
                            >
                              <LazyLoadImage
                                placeholderSrc={aahaaslogo}
                                src={aahaaslogo}
                                className="chat-content-image"
                              />
                              {messageClipBoard === value.id ? (
                                <pre className="chat-content-text">{value.text}</pre>
                              ) : (
                                <p className="chat-content-text">{value.text}</p>
                              )}
                              <p className="chat-content-personname">
                                at{' '}
                                {moment(getDateAndtime(value.createdAt)).format(
                                  'MMMM D, YYYY h:mm A',
                                )}
                              </p>
                              <p className="chat-content-time">by {value.name.slice(0, 7)} </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  ) : (
                    <div className={'chat-message-messages-close'}>
                      <p className="chat-notice" style={{ fontSize: 16, marginTop: 20 }}>
                        <FontAwesomeIcon icon={faCircleInfo} style={{ marginRight: '5px' }} />
                        Hold On Your Chat is Loading
                      </p>
                    </div>
                  )}
                </div>

                {!loader ? (
                  <div className="chat-message-input">
                    {clipBoardStatus && <p className="clipBoard-status">clip borad was on</p>}
                    <FontAwesomeIcon
                      icon={faStore}
                      className="chat-message-input-icon auto-suggestion-box"
                      style={{ color: 'black', cursor: 'pointer' }}
                      onClick={() => handleProductRecommendation()}
                    />
                    <FontAwesomeIcon
                      icon={faClipboard}
                      className="chat-message-input-icon"
                      style={{ color: clipBoardStatus ? 'black' : 'inherit' }}
                      onClick={() => handleOpenClipBoardOpen()}
                    />
                    <FontAwesomeIcon
                      icon={faMagicWandSparkles}
                      className="chat-message-input-icon auto-suggestion-box"
                      style={{ color: 'black' }}
                      onClick={() => handleAutoSuggestionModal()}
                    />
                    

                    {/* <FontAwesomeIcon icon={faMagnet} className="chat-message-input-icon auto-suggestion-box" style={{ color: 'black' }} onClick={() => handleProductSuggestions()} /> */}

                    <textarea
                      value={adminMessage}
                      onKeyUp={handleKeyUp}
                      onChange={(e) => handleTyping(e)}
                      placeholder="Enter your message"
                      className="chat-message-input-form"
                      rows={4}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        borderColor: '#ccc',
                        resize: 'vertical',
                        overflowY: 'auto',
                        minHeight: '80px',
                        maxHeight: '200px',
                        fontSize: 15,
                      }}
                    />
                    <FontAwesomeIcon
                      icon={faPaperPlane}
                      className="chat-message-input-icon-send"
                      onClick={() => handleSendMessage(adminMessage)}
                    />
                    <Tooltip title={'Under developement'}>
                      <FontAwesomeIcon icon={faLink} className="chat-message-input-icon" />
                    </Tooltip>
                  </div>
                ) : null}
              </div>
            </>
          </>
        ) : (
          <div className="chat-not-open-screen">
            <h6>
              Please open the chat and engage with the customer to assist them and ensure a smooth
              conversation.
            </h6>
          </div>
        )}
      </CCol>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Assign Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Select
            isSearchable={true}
            options={employeeOptions}
            value={selectedEmployee}
            onChange={(selectedOption) => setSelectedEmployee(selectedOption)}
            menuPortalTarget={document.body}
            styles={customStyles}
          />

          <br></br>

          {assignedEmployee?.id !== '' ? (
            <>
              {/* <CAlert color="info">
                                {selectedRow?.allocatedUser?.length} Employee(s) Already Allocated
                            </CAlert> */}

              <CTable>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Delete</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {/* {selectedRow?.allocatedUser?.map((response, index) => ( */}
                  <CTableRow key={1}>
                    <CTableDataCell>{assignedEmployee.name}</CTableDataCell>
                    <CTableDataCell>{assignedEmployee.allotStatus}</CTableDataCell>
                    <CTableDataCell>
                      {['delete assign employee order'].some((permission) =>
                        userData?.permissions?.includes(permission),
                      ) && (
                        <CButton
                          color="danger"
                          onClick={() => {
                            handleDeleteEmployee(assignedEmployee.chatId)
                          }}
                          style={{ color: 'white', fontSize: 14 }}
                        >
                          Delete <CIcon icon={cilTrash} />
                        </CButton>
                      )}
                    </CTableDataCell>
                  </CTableRow>
                  {/* ))} */}
                </CTableBody>
              </CTable>
            </>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          {['assign employer to chat'].some((permission) =>
            userData?.permissions?.includes(permission),
          ) && assignedEmployee?.allotStatus === 'Allocated' ? null : (
            <CButton onClick={handleAllocateEmployee} color="dark">
              Assign Employee
            </CButton>
          )}
        </Modal.Footer>
      </Modal>

      <MoreProductView
        show={moreProductsModal}
        onHide={() => setMoreProductModal(false)}
        productData={moreData}
      ></MoreProductView>

<ChatAnalyticsModal show={viewChatAnalytics} message={messages} onHide={() => setViewChatAnalytics(false)} />
<AiSuggestionModal show={recommenderModalOpen} loadingRecommendations = {loadingRecommendations} getRecommendations = {getRecommendations} setRecommendations={setRecommendations} recommendations = {recommendations} onHide={() => setRecommenderModalOpen(false)} />
    </>
  )
}
