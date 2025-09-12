import React, { useEffect, useState, useCallback, useRef } from 'react';
import CIcon from '@coreui/icons-react';
import { cilSearch, cilX, cilBell } from '@coreui/icons';
import { Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';
import { CButton, CFormSelect, CSpinner } from '@coreui/react';
import SentNotifications from './SentNotifications';
// import './PushNotifications.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDeleteLeft } from '@fortawesome/free-solid-svg-icons';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { app } from "firebase/app";


const data = {
    "navigators": [
        {
            "name": "HomeNavigator",
            "screens": []
        },
        {
            "name": "LoginNavigator",
            "screens": [
                { "name": "LoginMainPage", "component": "LoginMainPage" },
                { "name": "LoginPage", "component": "LoginNew" },
                { "name": "SignInUsingPassword", "component": "SignInUsingPassword" },
                { "name": "MobileLogin", "component": "MobileLogin" },
                { "name": "OneTimePass", "component": "OneTimePass" },
                { "name": "MobileNumberLogin", "component": "MobileNumberLogin" },
                { "name": "ForgotPassword", "component": "ForgotPassword" },
                { "name": "VerifyCodeAndResetPass", "component": "VerifyCodeAndResetPass" },
                { "name": "ProfileLogin", "component": "ProfileLogin" },
                { "name": "OnboardingScreen", "component": "OnboardingScreen" }
            ]
        },
        {
            "name": "MessageNavigator",
            "screens": [
                { "name": "CustomerChatMain", "component": "CustomerChatMain" },
                { "name": "ChatPage", "component": "ChatPage" }
            ]
        },
        {
            "name": "MainNavigatorStack",
            "screens": [
                { "name": "Home", "component": "HomeMeta" },
                { "name": "Order Edit", "component": "OrderEdit" },
                { "name": "WebXMainPortal", "component": "WebXMainPortal" },
                { "name": "Lets Plan...", "component": "LetsPlanHome" },
                { "name": "OnboardingScreen", "component": "OnboardingScreen" },
                { "name": "FlightOrderCard", "component": "FlightOrderCard" },
                { "name": "SearchMeta", "component": "SearchMeta" },
                { "name": "NotificationPage", "component": "NotificationMainPage" },
                { "name": "VoiceRecognitionComponent", "component": "VoiceRecognitionComponent" },
                { "name": "DataSorter", "component": "DataSorters" },
                { "name": "HotelRoomAllocation", "component": "HotelRoomAllocation" },
                { "name": "ItineraryPage", "component": "ItineraryPage" },
                { "name": "EssentialDetailsMeta", "component": "EssentialDetailsMeta" },
                { "name": "MyCalendar", "component": "MyCalendar" },
                { "name": "SelectLocation", "component": "SelectLocation" },
                { "name": "FlightsMainPageMeta", "component": "FlightsMainPageMeta" },
                { "name": "FlightsBookingReviewMeta", "component": "FlightsBookingReviewMeta" },
                { "name": "FlightsDetailsPage", "component": "FlightsDetailsPage" },
                { "name": "FlightsPassengerDetails", "component": "FlightsPassengerDetails" },
                { "name": "PaymentSuccess", "component": "PaymentSuccessMeta" },
                { "name": "FlightsMainCard", "component": "FlightsMainCard" },
                { "name": "SeatMapping", "component": "SeatMapping" },
                { "name": "Cart", "component": "Cart" },
                { "name": "CustomerMainPage", "component": "CustomerMainPage" },
                { "name": "HotelsSearch", "component": "HotelsSearch" },
                { "name": "HotelMainForm", "component": "HotelMainForm" },
                { "name": "HotelDetails", "component": "HotelDetails" },
                { "name": "BudgetPage", "component": "BudgetPage" },
                { "name": "LifestyleMain", "component": "LifestyleMain" },
                { "name": "DatePage", "component": "DatePage" },
                { "name": "ToPage", "component": "ToPage" },
                { "name": "PaxCount", "component": "PaxCount" },
                { "name": "Completed Orders", "component": "CompletedPage" },
                { "name": "VoiceSearch", "component": "VoiceInput" },
                { "name": "OnlineTransfer", "component": "OnlineTransferPage" },
                { "name": "HotelsMainSearchResults", "component": "HotelsMainSearchResults" },
                { "name": "HotelsMainPage", "component": "HotelsMainPage" },
                { "name": "SplashScreenLogout", "component": "SplashScreenLogout" },
                { "name": "JoinClass", "component": "Joinclass" },
                { "name": "MainProfile", "component": "MainProfile" },
                { "name": "FlightsMainPage", "component": "FlightsMainPage" },
                { "name": "MoreAddress", "component": "MoreAddress" },
                { "name": "StripeScreen", "component": "StripeScreen" },
                { "name": "EssentialDetails", "component": "EssentialDetails" },
                { "name": "FlightsBookingReviewPage", "component": "FlightsBookingReviewPage" },
                { "name": "ZoomSDK", "component": "ZoomLessons" },
                { "name": "Deals", "component": "Deals" },
                { "name": "CartSelectContainer", "component": "CartSelectContainer" },
                { "name": "PaymentSelection", "component": "PaymentsSelectionPage" },
                { "name": "Summary", "component": "Summary" },
                { "name": "OrderHistory", "component": "OrderHistory" },
                { "name": "MainSearch", "component": "MainSearch" },
                { "name": "VendorStore", "component": "VendorStore" },
                { "name": "LifestyleDetail", "component": "LifestyleDetail" },
                { "name": "EducationDetail", "component": "EducationDetail" },
                { "name": "Login", "component": "Login" },
                { "name": "HotelDetail", "component": "HotelDetail" },
                { "name": "HotelAvailabilityCheck", "component": "HotelAvailabilityCheck" },
                { "name": "Register", "component": "Register" },
                { "name": "EssentialDetail", "component": "EssentialDetail" },
                { "name": "FlightSearchComponent", "component": "FlightSearchComponent" },
                { "name": "FlightsSearchPage", "component": "FlightsSearchPage" },
                { "name": "FlightSearch", "component": "FlightSearch" },
                { "name": "FlightsPackagesPage", "component": "FlightsPackagesPage" },
                { "name": "flightsMoreDetails", "component": "FlightsMoreDetailsPage" },
                { "name": "multiCityRoundTripDetails", "component": "MultiCityRoundTripMoreDetails" },
                { "name": "About", "component": "About" },
                { "name": "NewOrder", "component": "NewOrder" },
                { "name": "Notifications", "component": "Notifications" },
                { "name": "NonEssentials", "component": "NonEssentials" },
                { "name": "Essentials", "component": "Essentials" },
                { "name": "Education", "component": "Education" },
                { "name": "Lifestyle", "component": "Lifestyle" },
                { "name": "Hotels", "component": "Hotels" },
                { "name": "Flights", "component": "Flights" }
            ]
        },
        {
            "name": "CartNavigatorStack",
            "screens": [
                { "name": "My Carts", "component": "MyCartHome" }
            ]
        }
    ]
};


function PushNotifications() {
    const [receivers, setReceiver] = useState('1');
    const [mostOrderedCount, setMostOrderedCount] = useState(25);
    const [notifications, setNotifications] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [openCreateNotificationsModal, setOpenCreateNotificationsModal] = useState(false);
    const [sending, setSending] = useState(false);
    const [errors, setErrors] = useState({});
    const [previewImage, setPreviewImage] = useState(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [expandInputGroup, setExpandInputGroup] = useState(false);
    const [stack, setStack] = useState(
        data.navigators.find((navigator) => navigator.name === "HomeNavigator") || null
    );

    const [selectedScreen, setSelectedScreen] = useState(
        data.navigators.find((navigator) => navigator.name === "HomeNavigator")?.screens[0] || null
    );
       useEffect(() => {
        const initializeFCM = async () => {
            try {
                if (!('Notification' in window)) {
                    console.log('This browser does not support notifications');
                    return;
                }

                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    console.log('Notification permission granted');

                    const messaging = getMessaging(app);
                    
                    // ✅ REMOVED VAPID KEY - Firebase will handle it automatically
                    const token = await getToken(messaging);
                    
                    if (token) {
                        await axios.post('/save-fcm-token', { 
                            token,
                            token_status: "LoggedIn"
                        });
                        console.log('FCM token saved to server');
                    } else {
                        console.log('No registration token available.');
                    }

                    onMessage(messaging, (payload) => {
                        console.log('Message received:', payload);
                        const { title, body } = payload.notification;
                        new Notification(title, { body });
                    });
                } else {
                    console.log('Unable to get permission to notify');
                }
            } catch (error) {
                console.error('Error initializing FCM:', error);
            }
        };

        initializeFCM();
    }, []);

    // Add refs for intersection observer
    const loadingRef = useRef(null);
    const observerRef = useRef(null);

    // Memoize fetchInAppNotifications to prevent unnecessary re-renders
    const fetchInAppNotifications = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const response = await axios.get(`/getNotifications?page=${page}`);
            const newNotifications = response.data.notifications;

            setNotifications(prevNotifications => {
                const existingIds = new Set(prevNotifications.map(n => n.id));
                const uniqueNewNotifications = newNotifications.filter(n => !existingIds.has(n.id));
                return [...prevNotifications, ...uniqueNewNotifications];
            });

            setHasMore(response.data.hasMore);
            setPage(prev => prev + 1);
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load notifications. Please try again.',
                confirmButtonColor: '#dc3545'
            });
        } finally {
            setLoading(false);
        }
    }, [page, loading, hasMore]);

    // Initial load
    useEffect(() => {
        fetchInAppNotifications();
    }, []);


    useEffect(() => {
        setExpandInputGroup(receivers === "4");
    }, [receivers]);


    // Setup Intersection Observer for infinite scrolling
    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '20px',
            threshold: 1.0
        };

        observerRef.current = new IntersectionObserver((entries) => {
            const [entry] = entries;
            if (entry.isIntersecting) {
                fetchInAppNotifications();
            }
        }, options);

        const currentLoader = loadingRef.current;
        if (currentLoader) {
            observerRef.current.observe(currentLoader);
        }

        return () => {
            if (currentLoader && observerRef.current) {
                observerRef.current.unobserve(currentLoader);
            }
        };
    }, [fetchInAppNotifications]);

    // Modal body scroll lock
    useEffect(() => {
        document.body.style.overflow = openCreateNotificationsModal ? 'hidden' : 'auto';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [openCreateNotificationsModal]);

    const validateForm = (formData) => {
        const newErrors = {};

        if (!formData.get('title')?.trim() || formData.get('title').trim().length < 5) {
            newErrors.title = 'Title must be at least 5 characters';
        }

        if (!formData.get('description')?.trim() || formData.get('description').trim().length < 5) {
            newErrors.description = 'Description must be at least 5 characters';
        }

        // Add customer count validation for "Most ordered customers" option
        if (receivers === "4") {
            const count = parseInt(mostOrderedCount);
            if (isNaN(count) || count <= 0) {
                newErrors.customerCount = 'Please enter a valid number greater than 0';
            } else if (count > 1000) { // You can adjust this maximum limit
                newErrors.customerCount = 'Customer count cannot exceed 1000';
            }
        }

        const imageFile = formData.get('image');
        if (imageFile && imageFile instanceof File && imageFile.size > 0) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(imageFile.type)) {
                newErrors.image = 'Please select a JPEG, PNG, or GIF image file';
            } else if (imageFile.size > 2 * 1024 * 1024) {
                newErrors.image = 'Image size cannot exceed 2MB';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleStackChange = (e) => {
        const selectedStack = data.navigators.find((navigator) => navigator.name === e.target.value);
        setStack(selectedStack);
        // Set the selectedScreen to the first screen of the newly selected stack
        setSelectedScreen(selectedStack.screens[0] || null);
    };

    const handleCustomerCountChange = (event) => {
        const value = event.target.value;
        const count = parseInt(value);

        if (isNaN(count) || count <= 0) {
            setErrors(prev => ({
                ...prev,
                customerCount: 'Please enter a valid number greater than 0'
            }));
        } else {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.customerCount;
                return newErrors;
            });
        }

        setMostOrderedCount(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);

        const formData = new FormData(e.target);

        if (validateForm(formData)) {
            try {
                const submitData = new FormData();
                submitData.append('title', formData.get('title'));
                submitData.append('description', formData.get('description'));
                submitData.append('redirectLink', formData.get('redirectLink') || '');
                submitData.append('receivers', receivers);
                submitData.append('mostOrderedCount', mostOrderedCount);
                submitData.append('selectedStack', stack && stack.name ? stack.name : '');
                submitData.append('selectedScreen', selectedScreen && selectedScreen.name ? selectedScreen.name : '');


                const imageFile = formData.get('image');
                if (imageFile && imageFile instanceof File && imageFile.size > 0) {
                    submitData.append('image', imageFile);
                }

                await axios.post('/pushNotification', submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Notification created successfully!',
                    confirmButtonColor: '#198754'
                });

                handleCloseModal();
                setPage(1);
                setNotifications([]);
                fetchInAppNotifications();
            } catch (error) {
                const errorMessage = error.response?.data?.message ||
                    'Failed to create notification. Please try again.';

                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: errorMessage,
                    confirmButtonColor: '#dc3545'
                });
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please check all required fields and try again.',
                confirmButtonColor: '#dc3545'
            });
        }
        setSending(false);
    };

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    const applySearch = (val) => {
        setNotifications([]);
        setPage(1);
        setLoading(true);
        setHasMore(true);

        const fetchData = async () => {
            try {
                const response = await axios.get(`/getNotifications?page=${1}&searchTerm=${val}`);
                const newNotifications = response.data.notifications;
                setNotifications(newNotifications);
                setHasMore(response.data.hasMore);
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to load notifications. Please try again.',
                    confirmButtonColor: '#dc3545'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    };

    const handleCloseModal = () => {
        if (previewImage) {
            URL.revokeObjectURL(previewImage);
        }
        setPreviewImage(null);
        setMostOrderedCount(25);
        setErrors({});
        setOpenCreateNotificationsModal(false);
    };

    const clearSearch = () => {
        setSearchTerm('');
        applySearch('');
    }




    return (
        <div className="notifications-container">
            <div className="notifications-header">
                <h6>Manage Notifications</h6>
                <div className="search-container">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search notifications..."
                        className="search-input"
                    />
                    <FontAwesomeIcon icon={faDeleteLeft} className='backSpaceIcon' onClick={clearSearch} />
                    <button className="search-button" onClick={() => applySearch(searchTerm)}>
                        <CIcon icon={cilSearch} style={{ color: 'white' }} />
                    </button>
                </div>
                <button
                    className="new-notification-button"
                    onClick={() => setOpenCreateNotificationsModal(true)}
                >
                    New Notification
                </button>
            </div>

            <div className="notifications-list">
                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <SentNotifications key={notification.id} data={notification} />
                    ))
                ) : (
                    <div className="empty-state">
                        <CIcon icon={cilBell} size="3xl" className="empty-icon" />
                        <h5>No Notifications</h5>
                        <p>There are no notifications at the moment.</p>
                    </div>
                )}

                {hasMore && (
                    <div
                        ref={loadingRef}
                        className="loading-container"
                    >
                        {loading && <CSpinner color="danger" />}
                    </div>
                )}
            </div>

            <Modal
                show={openCreateNotificationsModal}
                size="lg"
                onHide={handleCloseModal}
                backdrop="static"
                keyboard={!sending}
            >
                <div className="modal-content-wrapper">
                    <div className="modal-header">
                        <h6>Create New Notification</h6>
                        {!sending && (
                            <button className="close-button" onClick={handleCloseModal}>
                                <CIcon icon={cilX} />
                            </button>
                        )}
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="receiver-selection-container">
                            <CFormSelect
                                className="receiver-selection"
                                value={receivers}
                                onChange={(e) => setReceiver(e.target.value)}
                                disabled={sending}
                            >
                                <option value="1">All Customers</option>
                                <option value="2">Last month joined customers</option>
                                <option value="3">Last 3 month joined customers</option>
                                <option value="4">Most ordered customers</option>
                            </CFormSelect>
                            {receivers === "4" && (
                                <div className={`input-group-count ${expandInputGroup ? 'expanded' : ''}`}>
                                    <input
                                        type="number"
                                        id="customer-count"
                                        name="customer-count"
                                        value={mostOrderedCount}
                                        onChange={handleCustomerCountChange}
                                        className={errors.customerCount ? 'error-input' : ''}
                                        placeholder="Enter top customer count"
                                        disabled={sending || receivers !== "4"}
                                        min="1"
                                    />
                                    {errors.customerCount && (
                                        <span className="error-text">{errors.customerCount}</span>
                                    )}
                                </div>
                            )}

                        </div>

                        <div className="modal-body">
                            <div className="form-section">
                                <div className="input-group">
                                    <label htmlFor="title">Title *</label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        className={errors.title ? 'error-input' : ''}
                                        placeholder="Enter notification title"
                                        disabled={sending}
                                    />
                                    {errors.title && (
                                        <span className="error-text">{errors.title}</span>
                                    )}
                                </div>

                                <div className="input-group">
                                    <label htmlFor="description">Description *</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        className={errors.description ? 'error-input' : ''}
                                        placeholder="Enter notification description"
                                        rows={3}
                                        disabled={sending}
                                    />
                                    {errors.description && (
                                        <span className="error-text">{errors.description}</span>
                                    )}
                                </div>


                            </div>

                            <div className={`image-preview ${errors.image ? 'error-border' : ''}`}>
                                {previewImage ? (
                                    <img src={previewImage} alt="Preview" />
                                ) : (
                                    <div className="image-placeholder">
                                        <h6>Pick</h6>
                                        <h6>an</h6>
                                        <h6>Image</h6>
                                        <h6>(Optional)</h6>
                                    </div>
                                )}
                            </div>
                            <div className="input-group">
                                <CFormSelect
                                    className="receiver-selection"
                                    value={stack ? stack.name : ""}
                                    onChange={handleStackChange} // Use the new handler
                                >
                                    {data.navigators.map((option) => (
                                        <option key={option.name} value={option.name}>
                                            {option.name}
                                        </option>
                                    ))}
                                </CFormSelect>

                                <CFormSelect
                                    className="receiver-selection"
                                    value={selectedScreen ? selectedScreen.name : ""}
                                    onChange={(e) => {
                                        const selectedScreen = stack.screens.find(
                                            (screen) => screen.name === e.target.value
                                        );
                                        setSelectedScreen(selectedScreen);
                                    }}
                                >
                                    {stack.screens.map((option) => (
                                        <option key={option.name} value={option.name}>
                                            {option.name}
                                        </option>
                                    ))}
                                </CFormSelect>
                            </div>

                            <div className="input-group">
                                <label htmlFor="image">Reference Image (Optional)</label>
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    accept="image/jpeg,image/png,image/gif"
                                    onChange={handleImage}
                                    className={errors.image ? 'error-input' : ''}
                                    disabled={sending}
                                />
                                {errors.image && (
                                    <span className="error-text">{errors.image}</span>
                                )}
                            </div>

                            <div className="modal-actions">
                                {!sending ? (
                                    <CButton type="submit" className="create-button">
                                        Create Notification
                                    </CButton>
                                ) : (
                                    <CButton
                                        className="create-button"
                                        disabled
                                        style={{ backgroundColor: '#004e64' }}
                                    >
                                        <CSpinner as="span" size="sm" className="me-2" />
                                        Sending...
                                    </CButton>
                                )}
                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={handleCloseModal}
                                    disabled={sending}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}

export default PushNotifications;   