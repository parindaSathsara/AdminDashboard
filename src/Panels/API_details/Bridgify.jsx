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
    }, [])

    const getStatusBadge = (status) => {
        switch (status) {
            case "paid":
                return <CBadge color="success">Paid</CBadge>
            case "pending":
                return <CBadge color="warning">Pending</CBadge>
            case "cancelled":
                return <CBadge color="danger">Cancelled</CBadge>
            case "FAL":
                return <CBadge color="danger">Failed</CBadge>
            default:
                return <CBadge color="info">{status}</CBadge>
        }
    }

    // Function to truncate text for better display and export
    const truncateText = (text, maxLength = 50) => {
        if (!text) return 'N/A';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    // Function to format currency values consistently
    const formatCurrency = (amount, currency = '') => {
        if (!amount) return 'N/A';
        return `${currency} ${parseFloat(amount).toFixed(2)}`;
    }

    const data = {
        columns: [
            { 
                title: 'View More', 
                field: 'actions', 
                align: 'center',
                export: false,
                width: '10%',
                cellStyle: {
                    textAlign: 'center',
                    padding: '8px',
                    minWidth: '100px'
                },
                headerStyle: {
                    textAlign: 'center',
                    fontWeight: 'bold',
                    backgroundColor: '#f8f9fa',
                    minWidth: '100px'
                }
            },
            { 
                title: 'Order ID', 
                field: 'order_id', 
                align: 'left',
                width: '12%',
                cellStyle: {
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '120px',
                    padding: '8px',
                    fontSize: '12px'
                },
                headerStyle: {
                    fontWeight: 'bold',
                    backgroundColor: '#f8f9fa',
                    minWidth: '120px',
                    fontSize: '12px'
                }
            },
            { 
                title: 'Total Amount', 
                field: 'total_amount', 
                align: 'right',
                width: '10%',
                cellStyle: {
                    textAlign: 'right',
                    padding: '8px',
                    fontWeight: '500',
                    minWidth: '100px',
                    fontSize: '12px'
                },
                headerStyle: {
                    textAlign: 'right',
                    fontWeight: 'bold',
                    backgroundColor: '#f8f9fa',
                    minWidth: '100px',
                    fontSize: '12px'
                }
            },
            { 
                title: 'Paid Amount', 
                field: 'paid_amount', 
                align: 'right',
                width: '10%',
                cellStyle: {
                    textAlign: 'right',
                    padding: '8px',
                    fontWeight: '500',
                    minWidth: '100px',
                    fontSize: '12px'
                },
                headerStyle: {
                    textAlign: 'right',
                    fontWeight: 'bold',
                    backgroundColor: '#f8f9fa',
                    minWidth: '100px',
                    fontSize: '12px'
                }
            },
            { 
                title: 'Balance Amount', 
                field: 'balance_amount', 
                align: 'right',
                width: '10%',
                cellStyle: {
                    textAlign: 'right',
                    padding: '8px',
                    fontWeight: '500',
                    minWidth: '100px',
                    fontSize: '12px'
                },
                headerStyle: {
                    textAlign: 'right',
                    fontWeight: 'bold',
                    backgroundColor: '#f8f9fa',
                    minWidth: '100px',
                    fontSize: '12px'
                }
            },
            { 
                title: 'Product Title', 
                field: 'product_details', 
                align: 'left',
                width: '15%',
                cellStyle: {
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '150px',
                    padding: '8px',
                    fontSize: '12px'
                },
                headerStyle: {
                    fontWeight: 'bold',
                    backgroundColor: '#f8f9fa',
                    minWidth: '150px',
                    fontSize: '12px'
                }
            },
            { 
                title: 'Selected Timeslot', 
                field: 'timeslots', 
                align: 'left',
                width: '12%',
                cellStyle: {
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '120px',
                    padding: '8px',
                    fontSize: '12px'
                },
                headerStyle: {
                    fontWeight: 'bold',
                    backgroundColor: '#f8f9fa',
                    minWidth: '120px',
                    fontSize: '12px'
                }
            },
            { 
                title: 'Ticket Details', 
                field: 'tickets', 
                align: 'left',
                width: '15%',
                cellStyle: {
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '150px',
                    padding: '8px',
                    fontSize: '12px'
                },
                headerStyle: {
                    fontWeight: 'bold',
                    backgroundColor: '#f8f9fa',
                    minWidth: '150px',
                    fontSize: '12px'
                }
            },
            { 
                title: 'Customer Name', 
                field: 'customer',
                align: 'left',
                width: '12%',
                cellStyle: {
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '120px',
                    padding: '8px',
                    fontSize: '12px'
                },
                headerStyle: {
                    fontWeight: 'bold',
                    backgroundColor: '#f8f9fa',
                    minWidth: '120px',
                    fontSize: '12px'
                }
            },
            { 
                title: 'Email', 
                field: 'email', 
                align: 'left',
                width: '15%',
                cellStyle: {
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '150px',
                    padding: '8px',
                    fontSize: '12px'
                },
                headerStyle: {
                    fontWeight: 'bold',
                    backgroundColor: '#f8f9fa',
                    minWidth: '150px',
                    fontSize: '12px'
                }
            },
            { 
                title: 'Phone', 
                field: 'phone', 
                align: 'left',
                width: '10%',
                cellStyle: {
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '100px',
                    padding: '8px',
                    fontSize: '12px'
                },
                headerStyle: {
                    fontWeight: 'bold',
                    backgroundColor: '#f8f9fa',
                    minWidth: '100px',
                    fontSize: '12px'
                }
            }
        ],
        rows: cartItems.map((item) => {
            console.log('Item:', item)
            const productDetails = item?.data?.product_details?.title || 'N/A'
            const selectedTimeslot = item?.data?.requires?.timeslots?.selected_value || 'N/A'
            const customerDetails = item?.data?.requires?.['customer-info']?.selected_value || []

            return {
                order_id: item?.order_id || 'N/A',
                status: item?.status || 'N/A',
                balance_amount: formatCurrency(item?.balance_amount),
                paid_amount: formatCurrency(item?.paid_amount),
                total_amount: formatCurrency(item?.total_amount),
                transaction_amount: formatCurrency(item?.data?.save_cart?.selected_value?.transaction_amount),
                product_details: truncateText(productDetails, 40),
                timeslots: truncateText(selectedTimeslot, 30),
                tickets: truncateText(
                    item?.data?.requires?.tickets?.selected_value
                        ?.map((ticket) => `${ticket.product_id}: ${ticket.quantity}`)
                        .join(', ') || 'N/A',
                    40
                ),
                customer: truncateText(
                    customerDetails.length > 0
                        ? customerDetails.map((customer) => `${customer.FirstName || ''} ${customer.LastName || ''}`).join(', ')
                        : 'N/A',
                    30
                ),
                email: truncateText(
                    customerDetails.length > 0
                        ? customerDetails.map((customer) => `${customer.Email || ''}`).join(', ')
                        : 'N/A',
                    35
                ),
                phone: truncateText(
                    customerDetails.length > 0
                        ? customerDetails.map((customer) => `${customer.Phoneno || ''}`).join(', ')
                        : 'N/A',
                    20
                ),
                actions: <CButton color="primary" size="sm" onClick={() => handleRowClick(item?.cart_short_uuid)}>View More</CButton>
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
                                headerStyle: { 
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    backgroundColor: '#f8f9fa',
                                    color: '#333',
                                    padding: '8px',
                                    textAlign: 'center'
                                },
                                cellStyle: { 
                                    fontSize: '12px',
                                    padding: '8px',
                                    borderBottom: '1px solid #dee2e6'
                                },
                                paging: true,
                                pageSize: 10,
                                pageSizeOptions: [],
                                search: true,
                                columnsButton: true,
                                exportButton: true,
                                exportAllData: true,
                                grouping: true,
                                filtering: true,
                                sorting: true,
                                rowStyle: {
                                    backgroundColor: '#fff',
                                    '&:hover': {
                                        backgroundColor: '#f5f5f5'
                                    }
                                },
                                exportCsv: (columns, data) => {
    try {
        // Create a workbook
        const wb = XLSX.utils.book_new();
        
        // Prepare the data
        const wsData = [
            columns.map(col => col.title), // Header row
            ...data.map(row => columns.map(col => {
                const value = row[col.field] || '';
                return typeof value === 'string' ? value.replace(/"/g, '""') : value;
            }))
        ];
        
        // Create worksheet
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        
        // Style the header row (bold)
        if (!ws['!cols']) ws['!cols'] = [];
        for (let i = 0; i < columns.length; i++) {
            ws['!cols'][i] = { width: 15 }; // Set column width
            const cellRef = XLSX.utils.encode_cell({ r: 0, c: i });
            if (!ws[cellRef]) continue;
            ws[cellRef].s = { font: { bold: true } }; // Make header bold
        }
        
        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, "Cart Items");
        
        // Generate file and download
        XLSX.writeFile(wb, `bridgify-cart-items-${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
        console.error('Error generating Excel file:', error);
        // Fallback to CSV if XLSX fails
        const csvContent = [
            columns.map(col => col.title).join(','),
            ...data.map(row => 
                columns.map(col => {
                    const value = row[col.field] || '';
                    return typeof value === 'string' 
                        ? `"${value.replace(/"/g, '""')}"` 
                        : value;
                }).join(',')
            )
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bridgify-cart-items-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }
},
                                // Enhanced PDF export options
                                exportPdf: (columns, data) => {
                                    import('jspdf').then(({ jsPDF }) => {
                                        import('jspdf-autotable').then(() => {
                                            const doc = new jsPDF('landscape');
                                            
                                            // Title
                                            doc.setFontSize(16);
                                            doc.text('Bridgify Cart Items Report', 20, 20);
                                            
                                            // Date
                                            doc.setFontSize(10);
                                            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
                                            
                                            // Table
                                            doc.autoTable({
                                                head: [columns.filter(col => col.export !== false).map(col => col.title)],
                                                body: data.map(row => 
                                                    columns
                                                        .filter(col => col.export !== false)
                                                        .map(col => {
                                                            const value = row[col.field] || 'N/A';
                                                            return typeof value === 'string' 
                                                                ? value.replace(/<[^>]*>/g, '') // Remove HTML tags
                                                                : value;
                                                        })
                                                ),
                                                startY: 40,
                                                styles: {
                                                    fontSize: 8,
                                                    cellPadding: 3,
                                                    overflow: 'linebreak',
                                                    cellWidth: 'wrap'
                                                },
                                                headStyles: {
                                                    fillColor: [66, 139, 202],
                                                    textColor: 255,
                                                    fontSize: 9,
                                                    fontStyle: 'bold',
                                                    halign: 'center'
                                                },
                                                bodyStyles: {
                                                    textColor: 50,
                                                    fontSize: 8,
                                                    cellPadding: 3
                                                },
                                                alternateRowStyles: {
                                                    fillColor: [245, 245, 245]
                                                },
                                                columnStyles: {
                                                    0: { cellWidth: 25 }, // Order ID
                                                    1: { cellWidth: 20, halign: 'right' }, // Total Amount
                                                    2: { cellWidth: 20, halign: 'right' }, // Paid Amount
                                                    3: { cellWidth: 20, halign: 'right' }, // Balance Amount
                                                    4: { cellWidth: 35 }, // Product Title
                                                    5: { cellWidth: 25 }, // Timeslot
                                                    6: { cellWidth: 30 }, // Tickets
                                                    7: { cellWidth: 25 }, // Customer
                                                    8: { cellWidth: 35 }, // Email
                                                    9: { cellWidth: 20 } // Phone
                                                },
                                                margin: { top: 10, right: 10, bottom: 10, left: 10 },
                                                tableWidth: 'auto'
                                            });
                                            
                                            doc.save(`bridgify-cart-items-${new Date().toISOString().split('T')[0]}.pdf`);
                                        });
                                    });
                                }
                            }}
                        />
                    )}
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