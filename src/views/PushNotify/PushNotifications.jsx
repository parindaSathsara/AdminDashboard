import React, { useEffect, useState } from 'react';
import CIcon from '@coreui/icons-react';
import { cilSearch, cilPencil, cilXCircle, cilX } from '@coreui/icons';

import sampleimagefornotificaion from '../../assets/sampleimagefornotificaion.jpg';
import { Modal } from 'react-bootstrap';
import axios from 'axios';

function PushNotifications() {

    const [notifications, setNotifications] = useState([])
    const [notificationsCopy, setNotificationsCopy] = useState([])

    const [userSearch, setUserSearch] = useState([]);

    const handleUerSearch = (value) => {
        setUserSearch(value)
        let filterbyValue = notifications.filter((data) => { return data.title.toLowerCase().includes(value.toLowerCase()) })
        if (value === '') {
            setNotificationsCopy(notifications)
        } else {
            setNotificationsCopy(filterbyValue)
        }
    }


    const [openCreateNotificationsModal, setopenCreateNotificationsModal] = useState(false);

    const [newNotificationData, setNewNotificationData] = useState({
        title: '',
        description: '',
        redirectLink: '',
        image: ''
    })

    const handleClose = () => {
       
    }

    const getNotifications = async () => {
        await axios.get('http://192.168.1.23:8000/api/push_notifications').then((response) => {
            console.log(response);
            if (response.status === 200) {
                setNotifications(response.data);
                setNotificationsCopy(response.data);
            }
        })
    }

    useEffect(() => {
        getNotifications()
    }, [])


    const handleImage = (e) => {
        const fileUploaded = e.target.files[0];
        setNewNotificationData({
            ...newNotificationData,
            image: URL.createObjectURL(fileUploaded)
        })
    }

    const handleNavigate = (link) => {
        window.open(link, '_blank')
    }

    const [updatingNotification, setupdateNotification] = useState({
        id: '',
        status: false
    })

    const handleTrigggerUpdate = (value) => {
        setopenCreateNotificationsModal(true);
        setupdateNotification({
            id: value.id,
            status: true
        })
        setNewNotificationData({
            title: value.title,
            description: value.description,
            redirectLink: value.redirectLink,
            image: value.image
        })
       
    }


    const handleUpdatePushNotifications = async () => {
        const dateset = {
            title: newNotificationData.title,
            description: newNotificationData.description,
            redirectLink: newNotificationData.redirectLink,
            image: newNotificationData.image
        }
        if (updatingNotification.status) {
            await axios.put(`http://192.168.1.23:8000/api/push_notifications/${updatingNotification.id}`, dateset).then(async (response) => {
                console.log(response);
                if (response.status === 200) {
                    await getNotifications()
                    handlecloseModal()
                }
            })
        } else {
            await axios.post('http://192.168.1.23:8000/api/push_notifications', dateset).then(async (response) => {
                if (response.status === 201) {
                    await getNotifications()
                    handlecloseModal()
                }
            })
        }
    }


    const handlecloseModal = () => {
        setopenCreateNotificationsModal(false)
        setupdateNotification({
            id: '',
            status: false
        })
        setNewNotificationData({
            title: '',
            description: '',
            redirectLink: '',
            image: ''
        })
        setDeleteNotification({
            notificatioID: '',
            status: false
        })
    }

    const [deleteNotification, setDeleteNotification] = useState({
        notificatioID: '',
        status: false
    })

    const handleDeleteNofitications = async () => {
        await axios.delete(`http://192.168.1.23:8000/api/push_notifications/${deleteNotification.notificatioID}`).then(async (response) => {
            console.log(response);
            if (response.status === 204) {
                await getNotifications()
                handlecloseModal()
            }
        })
    }


    return (
        <div className='p-3' style={{ minHeight: '100vh', backgroundColor: 'white' }}>

            <div className='d-flex container-fluid align-items-center p-0'>
                <h6 className='p-0 m-0'>Manage notifications</h6>
                <div className='d-flex border rounded-2 ms-auto mx-3 col-3'>
                    <input type="text" className='px-3 col-10 rounded-2' value={userSearch} onChange={(e) => handleUerSearch(e.target.value)} style={{ border: 'none', outline: 'none', fontSize: 13 }} placeholder='Search notifications...' />
                    <button className='btn col-2'><CIcon icon={cilSearch} /></button>
                </div>
                <button className='btn btn-secondary py-2' onClick={() => setopenCreateNotificationsModal(true)} style={{ color: 'white', fontSize: 13, textTransform: 'uppercase' }}>New Notification</button>
            </div>

            <div className='d-flex flex-column gap-3 p-2 mt-3 col-12'>
                {
                    notificationsCopy.length === 0 ?
                        <div className='container p-5 border rounded-3'>
                            <h5 className='text-center p-0 m-0' style={{ fontWeight: 600, }}>Opps! sorry</h5>
                            <p className='text-center p-0 m-0'>No notifications are there at the moment !</p>
                        </div>
                        :
                        notificationsCopy.map((value, key) => (
                            <div className='d-flex border p-2 gap-4 ' key={key}>
                                <img src={value.image} alt="sampleimagefornotificaion" className='rounded-3' style={{ width: '100px', height: '100px', }} />
                                <div className='d-flex flex-column w-100'>
                                    <div className='d-flex align-items-center col-12'>
                                        <h6 className='m-0 p-0' style={{ fontSize: 18, fontWeight: 600 }}>{value.title}</h6>
                                        <button className='ms-auto btn' onClick={() => handleTrigggerUpdate(value)}><CIcon icon={cilPencil} /> Edit</button>
                                        <button className='btn' onClick={() => setDeleteNotification({ notificatioID: value.id, status: true })}> <CIcon icon={cilXCircle} /> Delete</button>
                                    </div>
                                    <p className='m-0 p-0' style={{ color: 'gray', fontSize: 14 }}>{value.description}  </p>
                                    <span className='m-0 p-0 mt-auto' style={{ color: 'blue', fontSize: 14, cursor: 'pointer' }} onClick={() => handleNavigate(value.redirectLink)}>{value.redirectLink}</span>
                                </div>
                            </div>
                        ))
                }
            </div>

            <Modal show={openCreateNotificationsModal} size='lg' onHide={handlecloseModal}>

                <div className='p-5'>

                    <div className='d-flex justify-content-between align-items-center border-bottom p-1 mb-3'>
                        <h6>Create a new notification</h6>
                        <button className='btn' onClick={handlecloseModal}><CIcon icon={cilX} /></button>
                    </div>

                    <div className='d-flex'>

                        <div className='col-8'>
                            <label className='' htmlFor="title">Title</label>
                            <input type="text" name='title' value={newNotificationData.title} onChange={(e) => setNewNotificationData({ ...newNotificationData, [e.target.name]: e.target.value })} className='form-control' />
                            <label className='mt-3' htmlFor="description">Description</label>
                            <input type="text" name='description' value={newNotificationData.description} onChange={(e) => setNewNotificationData({ ...newNotificationData, [e.target.name]: e.target.value })} className='form-control' />
                            <label className='mt-3' htmlFor="redirectLink">Redirect Link</label>
                            <input type="text" name='redirectLink' value={newNotificationData.redirectLink} onChange={(e) => setNewNotificationData({ ...newNotificationData, [e.target.name]: e.target.value })} className='form-control' />
                        </div>

                        <div className='col-4 d-flex align-items-center justify-content-center'>
                            {
                                newNotificationData.image !== '' ?
                                    <img src={newNotificationData.image} alt="" style={{ width: "200px", height: '200px' }} /> :
                                    <div className='col-10 border h-100 m-3 d-flex align-items-center justify-content-center px-4'>
                                        <h6 className='text-center text-muted'>please choose the image</h6>
                                    </div>
                            }
                        </div>

                    </div>


                    <label className='mt-3' htmlFor="image">Referecne Image</label>
                    <input type="file" className='form-control' onChange={handleImage} />

                    <button className='mt-4 col-3 btn btn-primary' onClick={handleUpdatePushNotifications}>Create</button>
                    <button className='mt-4 mx-3 col-3 btn btn-secondary' onClick={() => handlecloseModal()}>Cancel</button>

                </div>

            </Modal>

            <Modal show={deleteNotification.status} onHide={handlecloseModal}>
                <div className='d-flex flex-column align-items-center py-5'>
                    <h6>Are you to delete this notifications ?</h6>
                    <div className='d-flex gap-3 my-3'>
                        <button className='btn btn-primary px-4' onClick={handleDeleteNofitications}>Yes</button>
                        <button className='btn btn-danger px-4' style={{ color: 'white' }} onClick={() => handlecloseModal()}>Cancel</button>
                    </div>
                </div>
            </Modal>

        </div >
    )
}

export default PushNotifications