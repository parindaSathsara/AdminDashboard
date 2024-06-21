import React, { useState } from 'react';
import CIcon from '@coreui/icons-react';
import { cilSearch, cilPencil, cilXCircle, cilX } from '@coreui/icons';

import sampleimagefornotificaion from '../../assets/sampleimagefornotificaion.jpg';
import { Modal } from 'react-bootstrap';

function PushNotifications() {

    const [notifications, setNotifications] = useState([{ "id": 1, "imageUrl": "https://example.com/image1.jpg", "title": "New Feature Alert: Dark Mode!", "description": "Experience the new Dark Mode feature to reduce eye strain and save battery.", "redirectUrl": "https://example.com/dark-mode" }, { "id": 2, "imageUrl": "https://example.com/image2.jpg", "title": "Summer Sale! Up to 50% Off", "description": "Don't miss out on our Summer Sale with up to 50% off on selected items.", "redirectUrl": "https://example.com/summer-sale" }, { "id": 3, "imageUrl": "https://example.com/image3.jpg", "title": "Exclusive: Early Access to New Collections", "description": "Get early access to our latest collections before anyone else.", "redirectUrl": "https://example.com/new-collections" }, { "id": 4, "imageUrl": "https://example.com/image4.jpg", "title": "Update Available: Version 2.0", "description": "A new update is available for download. Get the latest features and improvements.", "redirectUrl": "https://example.com/update-2-0" }, { "id": 5, "imageUrl": "https://example.com/image5.jpg", "title": "Join Our Webinar on Productivity Tips", "description": "Sign up for our upcoming webinar and learn valuable productivity tips.", "redirectUrl": "https://example.com/webinar" }, { "id": 6, "imageUrl": "https://example.com/image6.jpg", "title": "Special Offer: Free Shipping This Weekend", "description": "Enjoy free shipping on all orders this weekend. Don't miss out!", "redirectUrl": "https://example.com/free-shipping" }, { "id": 7, "imageUrl": "https://example.com/image7.jpg", "title": "Check Out Our New Blog Post", "description": "Read our latest blog post on the best practices for remote work.", "redirectUrl": "https://example.com/blog-post" }, { "id": 8, "imageUrl": "https://example.com/image8.jpg", "title": "Reminder: Complete Your Profile", "description": "Complete your profile to unlock personalized recommendations and features.", "redirectUrl": "https://example.com/complete-profile" }, { "id": 9, "imageUrl": "https://example.com/image9.jg", "title": "Flash Sale: 24 Hours Only", "description": "Hurry! Our flash sale is live for the next 24 hours. Get amazing discounts.", "redirectUrl": "https://example.com/flash-sale" }, { "id": 10, "imageUrl": "https://example.com/image10.jpg", "title": "Congratulations! You've Earned a Reward", "description": "You have earned a reward. Click here to claim it and see your reward details.", "redirectUrl": "https://example.com/reward" }])
    const [notificationsCopy, setNotificationsCopy] = useState([{ "id": 1, "imageUrl": "https://example.com/image1.jpg", "title": "New Feature Alert: Dark Mode!", "description": "Experience the new Dark Mode feature to reduce eye strain and save battery.", "redirectUrl": "https://example.com/dark-mode" }, { "id": 2, "imageUrl": "https://example.com/image2.jpg", "title": "Summer Sale! Up to 50% Off", "description": "Don't miss out on our Summer Sale with up to 50% off on selected items.", "redirectUrl": "https://example.com/summer-sale" }, { "id": 3, "imageUrl": "https://example.com/image3.jpg", "title": "Exclusive: Early Access to New Collections", "description": "Get early access to our latest collections before anyone else.", "redirectUrl": "https://example.com/new-collections" }, { "id": 4, "imageUrl": "https://example.com/image4.jpg", "title": "Update Available: Version 2.0", "description": "A new update is available for download. Get the latest features and improvements.", "redirectUrl": "https://example.com/update-2-0" }, { "id": 5, "imageUrl": "https://example.com/image5.jpg", "title": "Join Our Webinar on Productivity Tips", "description": "Sign up for our upcoming webinar and learn valuable productivity tips.", "redirectUrl": "https://example.com/webinar" }, { "id": 6, "imageUrl": "https://example.com/image6.jpg", "title": "Special Offer: Free Shipping This Weekend", "description": "Enjoy free shipping on all orders this weekend. Don't miss out!", "redirectUrl": "https://example.com/free-shipping" }, { "id": 7, "imageUrl": "https://example.com/image7.jpg", "title": "Check Out Our New Blog Post", "description": "Read our latest blog post on the best practices for remote work.", "redirectUrl": "https://example.com/blog-post" }, { "id": 8, "imageUrl": "https://example.com/image8.jpg", "title": "Reminder: Complete Your Profile", "description": "Complete your profile to unlock personalized recommendations and features.", "redirectUrl": "https://example.com/complete-profile" }, { "id": 9, "imageUrl": "https://example.com/image9.jg", "title": "Flash Sale: 24 Hours Only", "description": "Hurry! Our flash sale is live for the next 24 hours. Get amazing discounts.", "redirectUrl": "https://example.com/flash-sale" }, { "id": 10, "imageUrl": "https://example.com/image10.jpg", "title": "Congratulations! You've Earned a Reward", "description": "You have earned a reward. Click here to claim it and see your reward details.", "redirectUrl": "https://example.com/reward" }])

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
        tittle: '',
        description: '',
        redirectLink: '',
        image: ''
    })

    const handleClose  = () => {
        setopenCreateNotificationsModal(false)
        setNewNotificationData({
            tittle: '',
            description: '',
            redirectLink: '',
            image: ''
        })
    }

    return (
        <div className='p-3' style={{ minHeight: '100vh', backgroundColor: 'white' }}>

            <div className='d-flex container-fluid align-items-center p-0'>
                <h6 className='p-0 m-0'>Manage notifications</h6>
                <div className='d-flex border rounded-2 ms-auto mx-3 col-3'>
                    <input type="text" className='px-3 col-10 rounded-2' value={userSearch} onChange={(e) => handleUerSearch(e.target.value)} style={{  border: 'none', outline: 'none', fontSize: 13 }} placeholder='Search notifications...' />
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
                                <img src={sampleimagefornotificaion} alt="sampleimagefornotificaion" className='rounded-3' style={{ width: '100px', height: '100px', }} />
                                <div className='d-flex flex-column w-100'>
                                    <div className='d-flex align-items-center col-12'>
                                        <h6 className='m-0 p-0' style={{ fontSize: 18, fontWeight: 600 }}>{value.title}</h6>
                                        <button className='ms-auto btn'><CIcon icon={cilPencil} /> Edit</button>
                                        <button className='btn'> <CIcon icon={cilXCircle} /> Delete</button>
                                    </div>
                                    <p className='m-0 p-0' style={{ color: 'gray', fontSize: 14 }}>{value.description}  </p>
                                    <span className='m-0 p-0 mt-auto' style={{ color: 'blue', fontSize: 14 }}>{value.redirectUrl}</span>
                                </div>
                            </div>
                        ))
                }
            </div>

            <Modal show={openCreateNotificationsModal} size='lg' onHide={handleClose}>

                <div className='p-5'>

                    <div className='d-flex justify-content-between align-items-center border-bottom p-1 mb-3'>
                        <h6>Create a new notification</h6>
                        <button className='btn' onClick={handleClose}><CIcon icon={cilX} /></button>
                    </div>

                    <label className='' htmlFor="title">Title</label>
                    <input type="text" name='tittle' value={newNotificationData.tittle} onChange={(e) => setNewNotificationData({ ...newNotificationData, [e.target.name]: e.target.value })} className='form-control' />
                    <label className='mt-3' htmlFor="description">Description</label>
                    <input type="text" name='description' value={newNotificationData.description} onChange={(e) => setNewNotificationData({ ...newNotificationData, [e.target.name]: e.target.value })} className='form-control' />
                    <label className='mt-3' htmlFor="redirectLink">Redirect Link</label>
                    <input type="text" name='redirectLink' value={newNotificationData.redirectLink} onChange={(e) => setNewNotificationData({ ...newNotificationData, [e.target.name]: e.target.value })} className='form-control' />

                    <label className='mt-3' htmlFor="image">Referecne Image</label>
                    <input type="file" className='form-control' />

                    <button className='mt-4 col-3 btn btn-primary'>Create</button>
                    <button className='mt-4 mx-3 col-3 btn btn-secondary'>Cancel</button>

                </div>

            </Modal>

        </div>
    )
}

export default PushNotifications