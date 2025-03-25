import {
    CCard,
    CCardBody,
    CCardImage,
    CCardText,
    CCardTitle,
    CCol,
    CContainer,
    CRow,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CButton,
    CSpinner,
    CBadge,
    CAlert
} from '@coreui/react'
import axios from 'axios'
import MaterialTable from 'material-table'
import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import bridgifyData from '../../Data/Bridgify-Lifestyle.json'
import { utils, writeFile } from 'xlsx';
import { saveAs } from 'file-saver';

const Bridgify = () => {
    const [cartItems, setCartItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedCart, setSelectedCart] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [modalLoading, setModalLoading] = useState(false)
    const [cancellationInfo, setCancellationInfo] = useState({})
    const [cancellationLoading, setCancellationLoading] = useState({})

    useEffect(() => {
        fetchCartItems()
        console.log("Bridgify", bridgifyData);


    }, [])

    // Create a separate function for Excel export
    // Function to export Bridgify attractions data to Excel
  // Function to export Bridgify attractions data to Excel
const exportToExcel = () => {
    try {
        // Show loading state
        Swal.fire({
            title: 'Processing',
            text: 'Preparing Excel file...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading()
            }
        });

        // Use bridgifyData instead of making an API call
        const data = bridgifyData;
        
        // Check if data exists and has attractions property
        if (!data || !data.attractions) {
            Swal.fire({
                icon: 'error',
                title: 'Data Error',
                text: 'The required data structure is not available in the imported JSON file.'
            });
            return;
        }

        // Extract attractions data
        const attractions = data.attractions;

        // Create a flattened array for Excel export
        const flattenedData = attractions.map(attraction => {
            // Extract categories as comma-separated strings
            const categoriesMain = attraction.categories_main?.map(cat => cat.name).join(', ') || '';
            const categoriesSubcategory = attraction.categories_subcategory?.map(cat => cat.name).join(', ') || '';
            const features = attraction.features?.map(feature => feature.name).join(', ') || '';

            // Process address to remove HTML tags
            const cleanAddress = attraction.address?.replace(/<[^>]*>/g, '') || '';

            // Create a flattened object for Excel
            return {
                'Title': attraction.title || '',
                'Description': attraction.description || '',
                'Category': categoriesMain,
                'Subcategory': categoriesSubcategory,
                'Features': features,
                'Price': attraction.price || 0,
                'Currency': attraction.currency || '',
                'Duration (seconds)': attraction.duration || '',
                'Rating': attraction.rating || 'N/A',
                'Reviews': attraction.number_of_reviews || 0,
                'Address': cleanAddress,
                'City': attraction.external_city_name || '',
                'Country': attraction.external_country_name || '',
                'Is Free': attraction.is_free ? 'Yes' : 'No',
                'Free Cancellation': attraction.free_cancellation ? 'Yes' : 'No',
                'Cancellation Policy': attraction.cancellation_policy || '',
                'Instant Booking': attraction.instant_booking ? 'Yes' : 'No',
                'Hotel Pickup': attraction.hotel_pickup ? 'Yes' : 'No',
                'Supplier': attraction.inventory_supplier || '',
                'Product ID': attraction.external_id || '',
                'UUID': attraction.uuid || '',
                'URL': attraction.order_webpage || '',
                'Last Updated': attraction.last_updated || '',
                'Latitude': attraction.geolocation?.lat || '',
                'Longitude': attraction.geolocation?.lng || ''
            };
        });

        // Create worksheet with the prepared data
        const worksheet = utils.json_to_sheet(flattenedData);

        // Set column widths for better readability
        const columnWidths = [
            { wch: 40 }, // Title
            { wch: 50 }, // Description
            { wch: 20 }, // Category
            { wch: 20 }, // Subcategory
            { wch: 20 }, // Features
            { wch: 10 }, // Price
            { wch: 8 },  // Currency
            { wch: 15 }, // Duration
            { wch: 8 },  // Rating
            { wch: 10 }, // Reviews
            { wch: 40 }, // Address
            { wch: 15 }, // City
            { wch: 15 }, // Country
            { wch: 8 },  // Is Free
            { wch: 8 },  // Free Cancellation
            { wch: 40 }, // Cancellation Policy
            { wch: 8 },  // Instant Booking
            { wch: 8 },  // Hotel Pickup
            { wch: 15 }, // Supplier
            { wch: 15 }, // Product ID
            { wch: 36 }, // UUID
            { wch: 50 }, // URL
            { wch: 20 }, // Last Updated
            { wch: 12 }, // Latitude
            { wch: 12 }  // Longitude
        ];

        worksheet['!cols'] = columnWidths;

        // Create workbook and add the worksheet
        const workbook = {
            Sheets: {
                'Attractions': worksheet
            },
            SheetNames: ['Attractions']
        };

        // Generate Excel file
        const excelBuffer = writeFile(workbook, 'bridgify_attractions.xlsx', {
            bookType: 'xlsx',
            type: 'array'
        });

        // Save the file using FileSaver.js
        const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(dataBlob, 'bridgify_attractions.xlsx');

        // Close loading indicator and show success message
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Attractions data exported to Excel successfully!'
        });
    } catch (error) {
        console.error("Excel export error:", error);
        Swal.fire({
            icon: 'error',
            title: 'Export Failed',
            text: 'There was an error exporting the data: ' + error.message
        });
    }
};

    

    const getStatusBadge = (status) => {
        switch (status) {
            case 'paid':
                return <CBadge color="success">Paid</CBadge>
            case 'pending':
                return <CBadge color="warning">Pending</CBadge>
            case 'cancelled':
                return <CBadge color="danger">Cancelled</CBadge>
            case 'FAL':
                return <CBadge color="danger">Failed</CBadge>
            default:
                return <CBadge color="info">{status}</CBadge>
        }
    }

    const data = {
        columns: [
            { title: 'Short UUID', field: 'cart_short_uuid', align: 'left' },
            { title: 'Payment Status', field: 'status', align: 'left' },
            { title: 'Transaction Amount', field: 'transaction_amount', align: 'left' },
            { title: 'Product Title', field: 'product_details', align: 'left' },
            { title: 'Selected Timeslot', field: 'timeslots', align: 'left' },
            { title: 'Ticket Details', field: 'tickets', align: 'left' },
            { title: 'Customer Name', field: 'customer', align: 'left' },
            { title: 'Email & Phone', field: 'email_phone', align: 'left' },
            { title: 'View More', field: 'actions', align: 'left' }
        ],
        rows: cartItems.map((item) => {
            const productDetails = item?.data?.product_details?.title || 'N/A'
            const seletedTimeslot = item?.data?.requires?.timeslots?.selected_value || 'N/A'
            const customerDetails = item?.data?.requires?.['customer-info']?.selected_value || []

            return {
                cart_short_uuid: item?.cart_short_uuid,
                status: getStatusBadge(item.status),
                transaction_amount: item?.data?.save_cart?.selected_value?.transaction_amount,
                product_details: productDetails,
                timeslots: seletedTimeslot,
                tickets:
                    item?.data?.requires?.tickets?.selected_value
                        ?.map((ticket) => `${ticket.product_id}: ${ticket.quantity}`)
                        .join(', ') || 'N/A',
                customer:
                    customerDetails.length > 0
                        ? customerDetails.map((customer, index) => (
                            <div key={index}>{`${customer.FirstName || ''} ${customer.LastName || ''}`}</div>
                        ))
                        : 'N/A',
                email_phone:
                    customerDetails.length > 0
                        ? customerDetails.map((customer, index) => (
                            <div key={index}>{`${customer.Email || ''} ${customer.Phoneno || ''}`}</div>
                        ))
                        : 'N/A',
                actions: <CButton color="primary" onClick={() => handleRowClick(item?.cart_short_uuid)}>View More</CButton>
            }
        }),
    }

    const fetchCartItems = async () => {
        try {
            setLoading(true)
            const response = await axios.get('/bridgify/carts')
            if (response.data.success && response.data.data) {
                setCartItems(response.data.data)
                console.log('Cart Items:', response.data.data);

            } else {
                throw new Error('Failed to fetch cart items')
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error fetching cart items!',
            })
            console.error('Error fetching cart items:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchCartDetails = async (shortUuid) => {
        try {
            setModalLoading(true)
            const response = await axios.get(`/bridgify/carts/order-info/${shortUuid}`)

            if (response.data.success && response.data.data) {
                setSelectedCart(response.data.data)
                setShowModal(true)
                console.log('Cart Items:', response.data.data)
            } else {
                console.log('API Response:', response.data)
                setSelectedCart(null)
                setShowModal(true)
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error fetching cart details!',
            })
            console.error('Error fetching cart details:', error)
            setSelectedCart(null)
            setShowModal(true)
        } finally {
            setModalLoading(false)
        }
    }

    const fetchCancellationInfo = async (shortUuid, index) => {
        try {
            setCancellationLoading(prevState => ({
                ...prevState,
                [index]: true
            }))

            const response = await axios.get(`/bridgify/carts/cancelation/${shortUuid}`)

            if (response.data.success && response.data.data) {
                setCancellationInfo(prevState => ({
                    ...prevState,
                    [shortUuid]: response.data.data['cancellation-info']
                }))
                console.log('Cancellation Info:', response.data.data)
            } else {
                console.log('API Response:', response.data)
                setCancellationInfo(prevState => ({
                    ...prevState,
                    [shortUuid]: []
                }))
            }
        } catch (error) {
            console.error('Error fetching cancellation info:', error)
            setCancellationInfo(prevState => ({
                ...prevState,
                [shortUuid]: []
            }))
        } finally {
            setCancellationLoading(prevState => ({
                ...prevState,
                [index]: false
            }))
        }
    }

    const handleCancellationRequest = async (shortUuid, cartItemUuid) => {
        try {
            Swal.fire({
                title: 'Request Cancellation',
                text: 'Are you sure you want to cancel this booking?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, cancel it!',
                cancelButtonText: 'No, keep it'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        // Show loading state
                        Swal.fire({
                            title: 'Processing',
                            text: 'Submitting cancellation request...',
                            allowOutsideClick: false,
                            didOpen: () => {
                                Swal.showLoading()
                            }
                        })

                        // Make cancellation request
                        const response = await axios.post(`/bridgify/carts/cancelation/${shortUuid}/${cartItemUuid}`)

                        if (response.data.success) {
                            Swal.fire(
                                'Cancellation Requested!',
                                'Your cancellation request has been submitted successfully.',
                                'success'
                            )
                            // Refresh data as needed
                            fetchCartDetails(shortUuid)
                        } else {
                            throw new Error(response.data.message || 'Cancellation request failed')
                        }
                    } catch (error) {
                        Swal.fire(
                            'Error',
                            error.message || 'Failed to process cancellation request.',
                            'error'
                        )
                    }
                }
            })
        } catch (error) {
            console.error('Error handling cancellation request:', error)
        }
    }

    const handleRowClick = (shortUuid) => {
        fetchCartDetails(shortUuid)
    }

    const toggleCancellationInfo = (shortUuid, index) => {
        const collapseElement = document.getElementById(`cancellationInfo${index}`)
        if (collapseElement) {
            const isShowing = collapseElement.classList.contains('show')
            collapseElement.classList.toggle('show')

            // Fetch cancellation info if opening and haven't fetched it yet
            if (!isShowing && !cancellationInfo[shortUuid]) {
                fetchCancellationInfo(shortUuid, index)
            }
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        const date = new Date(dateString)
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
    }

    // Helper to generate mock cancellation data based on the item
    const getMockCancellationInfo = (item) => {
        // This is just example data - in reality, this would come from the API
        if (!item) return null;

        return {
            cancellation_eligible: item.status === 'paid',
            cancellation_deadline: item.attraction_date
                ? new Date(new Date(item.attraction_date).getTime() - 48 * 60 * 60 * 1000).toISOString().split('T')[0]
                : 'N/A',
            refund_amount: item.merchant_total_price
                ? (parseFloat(item.merchant_total_price) * 0.75).toFixed(2)
                : 'N/A',
            refund_percentage: '75%',
            cancellation_fee: item.merchant_total_price
                ? (parseFloat(item.merchant_total_price) * 0.25).toFixed(2)
                : 'N/A',
            cancellation_fee_percentage: '25%',
            cancellation_policy: 'Standard 48-hour cancellation policy applies. Cancellations made less than 48 hours before the scheduled date are subject to a 25% cancellation fee.',
            currency: item.currency || ''
        };
    };

    return (
        <CContainer className="mt-4">
            <CCard>
                <CCardBody>

                    <CCardTitle className="mb-4">Bridgify Cart Items</CCardTitle>

                    {loading ? (
                        <div className="text-center my-4">
                            <CSpinner color="primary" />
                            <p className='mt-3 font-weight-bold'>Loading cart items...</p>
                            <p className='text-muted mt-2'>This may take a while</p>
                        </div>
                    ) : (
                        <MaterialTable
                            title="Traveller Experience"
                            columns={data.columns}
                            data={data.rows}
                            options={{
                                headerStyle: { fontSize: '14px' },
                                cellStyle: { fontSize: '14px' },
                                paging: false,
                                search: false,
                                columnsButton: true,
                                exportButton: true,
                                grouping: true,
                                rowStyle: {
                                    backgroundColor: '#f5f5f5',
                                },
                            }}
                        />
                    )}

                    <CCardTitle className="mb-4">
                        <div className="d-flex justify-content-between align-items-center">
                            <span>Bridgify Cart Items</span>
                            <CButton
                                color="success"
                                onClick={exportToExcel}
                            >
                                Export to Excel
                            </CButton>
                        </div>
                    </CCardTitle>
                </CCardBody>
            </CCard>

            <CModal visible={showModal} onClose={() => setShowModal(false)} size="lg">
                <CModalHeader closeButton>
                    <CModalTitle>Cart Details</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {modalLoading ? (
                        <div className="text-center my-4">
                            <CSpinner color="primary" />
                        </div>
                    ) : selectedCart ? (
                        <>
                            {Object.keys(selectedCart).map((orderId) => {
                                const orderItems = selectedCart[orderId]
                                return orderItems.map((item, index) => (
                                    <CCard key={index} className="mb-3">
                                        <CCardBody>
                                            <CCardTitle>{item.attraction_title || 'N/A'}</CCardTitle>

                                            <CRow className="mt-4">
                                                <CCol sm={6}>
                                                    <p>
                                                        <strong>Status:</strong> {getStatusBadge(item.status)}
                                                    </p>
                                                    <p>
                                                        <strong>Price:</strong> {item.merchant_total_price || 'N/A'}{' '}
                                                        {item.currency || ''}
                                                    </p>
                                                    <p>
                                                        <strong>Supplier:</strong> {item.inventory_supplier || 'N/A'}
                                                    </p>
                                                </CCol>
                                                <CCol sm={6}>
                                                    <p>
                                                        <strong>Date:</strong> {formatDate(item.external_created_at)}
                                                    </p>
                                                    <p>
                                                        <strong>Order ID:</strong> {item.external_order_id}
                                                    </p>
                                                    <p>
                                                        <strong>Booking ID:</strong> {item.order_item_uuid}
                                                    </p>
                                                </CCol>
                                            </CRow>

                                            {(item.attraction_date || item.attraction_time) && (
                                                <CRow className="mt-3">
                                                    <CCol>
                                                        <h5>Selected Time & Date:</h5>
                                                        <p>
                                                            {item.attraction_time || 'N/A'}
                                                            {item.attraction_date ? ` on ${item.attraction_date}` : ''}
                                                        </p>
                                                    </CCol>
                                                </CRow>
                                            )}

                                            {item.customer && (
                                                <CRow className="mt-3">
                                                    <CCol>
                                                        <h5>Customer Details:</h5>
                                                        <p>
                                                            <strong>Name:</strong> {item.customer.first_name}{' '}
                                                            {item.customer.last_name}
                                                        </p>
                                                        <p>
                                                            <strong>Email:</strong> {item.customer.email}
                                                        </p>
                                                        <p>
                                                            <strong>Phone:</strong> {item.customer.phone}
                                                        </p>
                                                    </CCol>
                                                </CRow>
                                            )}

                                            {item.tickets && item.tickets.length > 0 && (
                                                <CRow className="mt-3">
                                                    <CCol>
                                                        <h5>Tickets:</h5>
                                                        <CTable small bordered>
                                                            <CTableHead>
                                                                <CTableRow>
                                                                    <CTableHeaderCell>Ticket ID</CTableHeaderCell>
                                                                    <CTableHeaderCell>Title</CTableHeaderCell>
                                                                    <CTableHeaderCell>Quantity</CTableHeaderCell>
                                                                    <CTableHeaderCell>Actions</CTableHeaderCell>
                                                                </CTableRow>
                                                            </CTableHead>
                                                            <CTableBody>
                                                                {item.tickets.map((ticket, i) => (
                                                                    <CTableRow key={i}>
                                                                        <CTableDataCell>{ticket.external_ticket_id}</CTableDataCell>
                                                                        <CTableDataCell>{ticket.title}</CTableDataCell>
                                                                        <CTableDataCell>{ticket.quantity}</CTableDataCell>
                                                                        <CTableDataCell>
                                                                            <div className="d-flex gap-2">
                                                                                {ticket.voucher_url && ticket.voucher_url.length > 0 ? (
                                                                                    <CButton
                                                                                        size="sm"
                                                                                        color="primary"
                                                                                        href={ticket.voucher_url[0]}
                                                                                        target="_blank"
                                                                                    >
                                                                                        View Voucher
                                                                                    </CButton>
                                                                                ) : (
                                                                                    <CBadge color="light" textColor="dark">
                                                                                        No Voucher
                                                                                    </CBadge>
                                                                                )}
                                                                            </div>
                                                                        </CTableDataCell>
                                                                    </CTableRow>
                                                                ))}
                                                            </CTableBody>
                                                        </CTable>
                                                    </CCol>
                                                </CRow>
                                            )}

                                            {/* Cancellation Information Dropdown */}
                                            <CRow className="mt-3">
                                                <CCol>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <CButton
                                                            color="info"
                                                            variant="outline"
                                                            className="text-left"
                                                            onClick={() => toggleCancellationInfo(orderId, index)}
                                                        >
                                                            Cancellation Information
                                                        </CButton>
                                                        <CButton
                                                            color="danger"
                                                            size="sm"
                                                            onClick={() => handleCancellationRequest(orderId, item.order_item_uuid)}
                                                        // disabled={item.status !== 'paid'}
                                                        >
                                                            Request Cancellation
                                                        </CButton>
                                                    </div>

                                                    <div className="collapse mt-2" id={`cancellationInfo${index}`}>
                                                        <CCard className="border-0 bg-light">
                                                            <CCardBody>
                                                                {cancellationLoading[index] ? (
                                                                    <div className="text-center py-3">
                                                                        <CSpinner color="primary" size="sm" />
                                                                        <p className="mt-2 mb-0">Loading cancellation information...</p>
                                                                    </div>
                                                                ) : cancellationInfo[orderId] && cancellationInfo[orderId].length > 0 ? (
                                                                    // Render actual cancellation info from API
                                                                    <CRow>
                                                                        {cancellationInfo[orderId].map((info, infoIndex) => (
                                                                            <CCol sm={12} key={infoIndex}>
                                                                                <p><strong>Cancellation Policy:</strong> {info.policy || 'Standard policy applies'}</p>
                                                                                <p><strong>Refund Amount:</strong> {info.refund_amount || 'N/A'} {info.currency || ''}</p>
                                                                                <p><strong>Deadline:</strong> {info.deadline || 'N/A'}</p>
                                                                                {/* Add more fields as per your API response */}
                                                                            </CCol>
                                                                        ))}
                                                                    </CRow>
                                                                ) : cancellationInfo[orderId] && cancellationInfo[orderId].length === 0 ? (
                                                                    // Show not found message
                                                                    <CAlert color="warning">
                                                                        <div className="d-flex align-items-center">
                                                                            <i className="cil-warning mr-2" style={{ fontSize: '1.5rem', marginRight: '10px' }}></i>
                                                                            <div>
                                                                                <h6 className="mb-1">No Cancellation Information Available</h6>
                                                                                <p className="mb-0">Cancellation details could not be found for this booking.</p>
                                                                            </div>
                                                                        </div>
                                                                    </CAlert>
                                                                ) : (
                                                                    // Show mock data if API hasn't been called yet
                                                                    <CRow>
                                                                        {(() => {
                                                                            // Generate mock data based on the current item
                                                                            const mockData = getMockCancellationInfo(item);
                                                                            return (
                                                                                <>
                                                                                    <CCol sm={6}>
                                                                                        <p><strong>Cancellation Deadline:</strong> {mockData.cancellation_deadline}</p>
                                                                                        <p><strong>Refund Amount:</strong> {mockData.refund_amount} {mockData.currency} ({mockData.refund_percentage})</p>
                                                                                        <p><strong>Cancellation Fee:</strong> {mockData.cancellation_fee} {mockData.currency} ({mockData.cancellation_fee_percentage})</p>
                                                                                    </CCol>
                                                                                    <CCol sm={6}>
                                                                                        <p><strong>Eligibility:</strong> {mockData.cancellation_eligible ? 'Eligible for cancellation' : 'Not eligible for cancellation'}</p>
                                                                                    </CCol>
                                                                                    <CCol sm={12} className="mt-2">
                                                                                        <h6>Policy:</h6>
                                                                                        <p>{mockData.cancellation_policy}</p>
                                                                                    </CCol>
                                                                                </>
                                                                            );
                                                                        })()}
                                                                    </CRow>
                                                                )}
                                                            </CCardBody>
                                                        </CCard>
                                                    </div>
                                                </CCol>
                                            </CRow>
                                        </CCardBody>
                                    </CCard>
                                ))
                            })}
                        </>
                    ) : (
                        <p>No cart details available</p>
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>
        </CContainer>
    )
}

export default Bridgify