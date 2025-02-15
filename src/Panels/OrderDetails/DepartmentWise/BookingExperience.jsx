


import React, { useContext, useState, useEffect } from 'react'
import MaterialTable from 'material-table';
import { CBadge, CButton, CCard, CCardBody, CCardSubtitle, CCardText, CCardTitle, CCloseButton, CCol, CContainer, CDropdown, CDropdownDivider, CDropdownItem, CDropdownMenu, CDropdownToggle, CImage, COffcanvas, COffcanvasBody, COffcanvasHeader, COffcanvasTitle, CPopover, CRow } from '@coreui/react';
import Swal from 'sweetalert2';
import { updateDeliveryStatus, candelOrder } from 'src/service/api_calls';
import rowStyle from '../Components/rowStyle';
import { cilCloudDownload, cilEyedropper, cilInfo } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { Modal, Carousel } from 'react-bootstrap';
import CancellationModal from '../CancelationModal/CancellationModal';
import StarRating from '../Components/StarRating';
import CurrencyConverter from 'src/Context/CurrencyConverter';
import { UserLoginContext } from 'src/Context/UserLoginContext';
import { render } from '@testing-library/react';
import axios from 'axios';
import DiscountView from '../DiscountView.jsx';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const mapContainerStyle = {
    width: '40vw',
    height: '40vh',
};

const libraries = ['places'];




export default function BookingExperience(props) {
    const { userData } = useContext(UserLoginContext);
   
    const customPopoverStyle = {
        '--cui-popover-max-width': '400px',
        '--cui-popover-border-color': '#0F1A36',
        '--cui-popover-header-bg': '#0F1A36',
        '--cui-popover-header-color': 'var(--cui-white)',
        '--cui-popover-body-padding-x': '1rem',
        '--cui-popover-body-padding-y': '.5rem',
    }

    const productData = props.dataset
    console.log(props.dataset, "Product Data issss")

    const [location, setLocation] = useState({ latitude: null, longitude: null });

    // useEffect(() => {
    //     console.log(props?.dataset[0]?.more_info_lat_lon, "More Info Lat Lon");
       
    // }, [props?.dataset]);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: 'AIzaSyA39AkmLbtriHvMJ-uqOV4I_6hpVz-4Pbk',
        libraries,
    });

    const QuantityContainer = ({ data }) => {


        // console.log(data, "Data Value is")


        if (data.category == "Education") {
            return (
                <CCol style={{ width: '320px' }}>
                    <CRow>
                        <CCol style={{ flex: 2 }}><h6>Max Adult Occupancy</h6></CCol>
                        <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data.MaxAdultOccupancy}</h6></CCol>
                    </CRow>
                    <CRow>
                        <CCol style={{ flex: 2 }}><h6>Max Child Occupancy</h6></CCol>
                        <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data.MaxChildOccupancy}</h6></CCol>
                    </CRow>
                    <CRow>
                        <CCol style={{ flex: 2 }}><h6>Total Occupancy</h6></CCol>
                        <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data.TotalOccupancy}</h6></CCol>
                    </CRow>
                </CCol>
            )
        }

        else if (data.category == "Essentials/Non Essentials") {
            return (
                <CCol style={{ width: '320px' }}>
                    <CRow>
                        <CCol style={{ flex: 2 }}><h6>Quantity</h6></CCol>
                        <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data.Quantity}</h6></CCol>
                    </CRow>


                    <CRow>
                        <CCol style={{ flex: 2 }}><h6>SKU</h6></CCol>
                        <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data.SKU} {data.Unit}</h6></CCol>
                    </CRow>


                </CCol>
            )
        }

        else if (data.category == "Lifestyles") {
            return (
                <CCol style={{ width: '320px' }}>

                    <CRow>
                        <CCol style={{ flex: 2 }}><h6>Adult Count</h6></CCol>
                        <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data.AdultCount}</h6></CCol>
                    </CRow>

                    <CRow>
                        <CCol style={{ flex: 2 }}><h6>Child Count</h6></CCol>
                        <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data.ChildCount}</h6></CCol>
                    </CRow>


                    {data.ChildCount > 0 ?
                        <CRow>
                            <CCol style={{ flex: 2 }}><h6>Child Ages</h6></CCol>
                            <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data.Age}</h6></CCol>
                        </CRow>
                        :
                        null
                    }



                    <CRow>
                        <CCol style={{ flex: 2 }}><h6>Total Occupancy</h6></CCol>
                        <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data.TotalOccupancy}</h6></CCol>
                    </CRow>


                    <CRow>
                        <CCol style={{ flex: 2 }}><h6>Max Adult Occupancy</h6></CCol>
                        <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data.MaxAdultOccupancy}</h6></CCol>
                    </CRow>


                    <CRow>
                        <CCol style={{ flex: 2 }}><h6>Max Child Occupancy</h6></CCol>
                        <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data.MaxChildOccupancy}</h6></CCol>
                    </CRow>






                </CCol>
            )
        }

    }




    const FeedbackContainer = ({ data }) => {
        // console.log(data, "Feedback Container data is");

        return (
            <div>
                {data.map((element, index) => (
                    <>
                        <CCol key={index} style={{ width: '320px', borderBottom: 1, borderBottomColor: '#E8E8E8', marginBottom: 20 }}>
                            <CRow>
                                <CCol style={{ flex: 2 }}>
                                    <h6>Rating on Aahaas</h6>
                                </CCol>
                                <CCol style={{ flex: 0.7, textAlign: 'right' }}>
                                    <StarRating rating={parseInt(element?.rating_on_aahaas)} />
                                </CCol>
                            </CRow>

                            <CRow>
                                <CCol style={{ flex: 2 }}>
                                    <h6>Rating on Supplier</h6>
                                </CCol>
                                <CCol style={{ flex: 0.7, textAlign: 'right' }}>
                                    <StarRating rating={parseInt(element?.rating_on_supplier)} />
                                </CCol>
                            </CRow>

                            <CRow>
                                <CCol style={{ flex: 2 }}>
                                    <h6>Rating on Product</h6>
                                </CCol>
                                <CCol style={{ flex: 0.7, textAlign: 'right' }}>
                                    <StarRating rating={parseInt(element?.rating_on_product)} />
                                </CCol>
                            </CRow>

                            <CRow>
                                <CCol style={{ flex: 2 }}>
                                    <h6>{element?.review_remarks}</h6>
                                </CCol>
                            </CRow>
                        </CCol>

                    </>

                ))}
            </div>
        );
    };




    const [cancellationData, setCancellationData] = useState([])
    const handleCancellationData = (data) => {
        setCancellationReasonModal(true)
        setCancellationData(data)

    }

    const [selectedStatusCheckout, setSelectedStatusCheckout] = useState("")

    const handleDelStatusChange = async (e, val) => {
        // console.log(val, "Value Data set is 123")
        // console.log(e.checkoutID, "Target Value is")

        var title = "";

        var targetvalue = val.target.value

        if (val.target.value !== "") {
            if (val.target.value === "Approved") {
                title = "Do You Want to Confirm This Order";
                Swal.fire({
                    title: "Are you sure?",
                    text: title,
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonColor: "#2eb85c",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes"
                }).then((result) => {
                    // console.log(result, "IS Confirmed")

                    if (result.isConfirmed) {
                        Swal.fire({
                            title: "Hold On!",
                            html: "Order is Updating",
                            allowOutsideClick: false,
                            showConfirmButton: false,
                            onBeforeOpen: () => {
                                Swal.showLoading();
                            }
                        });

                        // console.log("Show Loading")
                        updateDeliveryStatus(e.checkoutID, targetvalue, "").then(result => {
                            console.log("resulttt", result)

                            props.reload();

                            setSelectedStatusCheckout("Approved")

                            // Swal.close(); // Close the loading spinner

                        }).catch(error => {


                            console.log(error, "Error Value is 1234")
                            Swal.fire({
                                title: "Error!",
                                text: "Failed to update order",
                                icon: "error"
                            });
                        });
                    }
                });
            } else if (val.target.value === "Cancel") {

                title = "Do You Want to Cancel";



                let data = {
                    reason: "",
                    id: e.checkoutID,
                    value: val.target.value,
                };

                handleCancellationData(data)


                // Swal.fire({
                //     title: title,
                //     text: "Please Enter the reason for cancel",
                //     input: "text",
                //     icon: "question",
                //     inputAttributes: {
                //         autocapitalize: "off"
                //     },
                //     showCancelButton: true,
                //     confirmButtonText: "Yes, Cancel",
                //     cancelButtonText: "No",
                //     confirmButtonColor: "#d33",
                //     showLoaderOnConfirm: true,

                //     preConfirm: async (reason) => {
                //         try {
                //             if (!reason) {
                //                 return Swal.showValidationMessage(`Reason is required`);
                //             }

                //             let data = {
                //                 reason: reason,
                //                 id: e.checkoutID,
                //                 value: val.target.value,
                //             };

                //             await candelOrder(data);
                //             props.reload();

                //         } catch (error) {
                //             Swal.showValidationMessage(`
                //   Request failed: ${error}`);
                //         }
                //     },
                //     allowOutsideClick: () => !Swal.isLoading()
                // });
            }
        }
    }


    const handleOrderCancellation = async (data) => {

        cancellationData["reason"] = data


        Swal.showLoading()
        await candelOrder(cancellationData)
        Swal.hideLoading()
        props?.reload();

        setSelectedStatusCheckout("Cancel")


    }



    const [clickedStatus, setClickedStatus] = useState("")

    const handleButtonClick = (data) => {
        setClickedStatus(data)
        setSelectedStatusCheckout("")
    }


    const [selectedCancellationModal, setSelectedCancellationModal] = useState([])
    const [cancellationModalState, setCancellationModalState] = useState(false)




    const handleMoreCancellationDetails = (data) => {
        // console.log(data, "cancellation")

        setSelectedCancellationModal(data?.data)
        setCancellationModalState(true)
    }



    const [cancellationReasonModal, setCancellationReasonModal] = useState(false)
    // const [documentViewModal, setDocumentViewModal] = useState(false)
    // const [selectedDocument, setSelectedDocument] = useState([])

    // const handleDocment = (data) => {
    //         console.log(data.data.orderMoreInfo, "Document Data issss");

    //         const fileUrls = data.data.orderMoreInfo?.[0]?.file_urls
    //             ? data.data.orderMoreInfo[0].file_urls.split(',').map(url => url.trim())
    //             : [];

    //         console.log(fileUrls, "Extracted File URLs");
    //         setSelectedDocument(fileUrls)
    //         setDocumentViewModal(true);
    //     };4

    const [documentViewModal, setDocumentViewModal] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState([]);
    const [selectedDocumentLocation, setSelectedDocumentLocation] = useState([]);
    const isImage = (url) => /\.(jpg|jpeg|png|gif|webp|heic)$/i.test(url); // Check for image formats
    const isPDF = (url) => /\.pdf$/i.test(url);

    const handleDocment = (data) => {
        console.log(data.data.longitude, "Document Data issss");
        // console.log(data.data.orderMoreInfo, "Document Data issss");
        const fileUrls = data.data.orderMoreInfo?.[0]?.file_urls
            ? data.data.orderMoreInfo[0].file_urls.split(',').map(url => url.trim())
            : [];
        console.log(fileUrls, "Extracted File URLs");

        if (data.data.orderMoreInfo?.[0]?.customer_lat_lon) {
            const [latitude, longitude] = data.data.orderMoreInfo?.[0]?.customer_lat_lon.split(',').map(coord => parseFloat(coord.trim()));
            setLocation({ latitude, longitude });
        }


        setSelectedDocumentLocation(data.data)
        setSelectedDocument(fileUrls);
        setDocumentViewModal(true);
    };

    const [selectedDiscountModal, setSelectedDiscountModal] = useState(false);
    const [selectDiscount, setSelectDiscount] = useState([]);
    const handleDiscount = (data) => {
        console.log(data.data, "Discount Data issss");
        setSelectDiscount(data.data);
        setSelectedDiscountModal(true);
    }


    const columns = [
        { title: 'Product ID', field: 'pid' },

        { title: 'Name', field: 'name' },
        {
            title: 'QTY', field: 'qty', render: rowData => {
                return rowData?.category !== "flights" ? (
                    // <CPopover
                    //     content={<QuantityContainer data={rowData?.data} />}
                    //     placement="right"
                    //     title="Quantity Data"
                    //     style={customPopoverStyle}
                    //     trigger="focus"
                    // >
                    //     <CButton color="info" style={{ fontSize: 14, color: 'white' }}>View</CButton>
                    // </CPopover>
                    <span>{rowData?.data?.Quantity !== null ? rowData?.data?.Quantity : 'Not mention'}</span>
                ) : (
                    <span>{rowData?.qty}</span>
                );
            }

        },
        { title: 'Date', field: 'date' },
        { title: 'Address', field: 'address' },

        { title: 'Total Amount', field: 'total_amount' },
        { title: 'Paid Amount', field: 'paid_amount' },
        { title: 'Balance Amount', field: 'balance_amount' },
        {
            title: 'Feedbacks', field: 'feedbacks', render: rowData => {
                if (rowData?.data?.orderFeedbacks?.length > 0) {
                    return (
                        <CPopover
                            content={<FeedbackContainer data={rowData.data?.orderFeedbacks} />}
                            placement="top"
                            title="Quantity Data"
                            style={customPopoverStyle}
                            trigger="focus"
                        >
                            <CButton color="success" style={{ fontSize: 12, color: 'white' }}>View Feedbacks</CButton>
                        </CPopover>
                    )
                }
                else {
                    return (
                        <CBadge color="danger" style={{ padding: 8, fontSize: 12 }} > No Feedbacks</CBadge>
                    )

                }

            }


        },
        {
            title: 'Supplier Confirmation', field: 'supplier_status', render: rowData => rowData?.supplier_status == "Pending" ?
                <CBadge color="danger" style={{ padding: 8, fontSize: 12 }}>Pending</CBadge> : rowData?.supplier_status == "Cancel" ? <CBadge color="danger" style={{ padding: 8, fontSize: 12 }}>Cancelled</CBadge> : <CBadge color="success" style={{ padding: 8, fontSize: 12 }}>Confirmed</CBadge>
        },
        {
            title: 'View Documents',
            field: 'orderMoreInfo',
            render: (rowData) => {
                return (
                    <CButton color="info" style={{ fontSize: 12, color: 'white' }} onClick={() => handleDocment(rowData)}>View</CButton>
                )
            }
        },
        {
            title: 'View Discount',
            field: 'discountData',
            render: (rowData) => {
                return rowData.data.discountData ? (
                    <CButton color="warning" style={{ fontSize: 12, color: 'white' }} onClick={() => handleDiscount(rowData)}>View</CButton>
                ) : (
                    <CBadge color="secondary" style={{ padding: 8, fontSize: 12 }}>No Discount</CBadge>
                )
            }
        },



        {
            field: 'status',
            title: 'Order Status',
            align: 'left',
            // hidden: rowData => console.log(rowData?.supplier_status, "Row Data"),
            render: (e) => {

                var status = e?.data?.status
                var supplier_status = e?.data?.supplier_status

                var cancel_role = e?.data?.cancel_role

                var edit = e?.data?.edit_status

                // console.log(edit, "Edit Coming Data Is")

                if (edit == "Edited") {
                    return (
                        <CCol style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>



                            <CBadge color='info' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 14, color: 'white' }}>

                                <CCardText>Order Edit Requested</CCardText>
                            </CBadge>


                        </CCol >
                    )
                }
                else {



                    if (cancel_role == "Supplier") {
                        return (
                            <CCol style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

                                <CCardText color='danger' style={{ fontSize: 13, fontWeight: '600', textAlign: 'center' }}>Supplier Cancelled</CCardText>

                                <CButton color='danger' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 14, color: 'white' }} onClick={() => handleMoreCancellationDetails(e)}>
                                    <CIcon icon={cilInfo} size="xl" style={{ color: 'white', marginRight: 10 }} />
                                    <CCardText>More Details</CCardText>
                                </CButton>


                            </CCol >
                        )
                    }

                    else if (cancel_role == "Admin") {
                        return (
                            <CCol style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

                                <CCardText color='danger' style={{ fontSize: 13, fontWeight: '600', textAlign: 'center' }}>Admin Cancelled</CCardText>

                                <CButton color='danger' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 14, color: 'white' }} onClick={() => handleMoreCancellationDetails(e)}>
                                    <CIcon icon={cilInfo} size="xl" style={{ color: 'white', marginRight: 10 }} />
                                    <CCardText>More Details</CCardText>
                                </CButton>


                            </CCol >
                        )
                    }

                    else if (cancel_role == "CUSTOMER") {
                        return (

                            <CCol style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

                                <CCardText color='danger' style={{ fontSize: 13, fontWeight: '600', textAlign: 'center' }}>Customer Cancelled</CCardText>

                                <CButton color='danger' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 14, color: 'white' }} onClick={() => handleMoreCancellationDetails(e)}>
                                    <CIcon icon={cilInfo} size="xl" style={{ color: 'white', marginRight: 10 }} />
                                    <CCardText>More Details</CCardText>
                                </CButton>


                            </CCol >
                        )
                    }
                    else {
                        return (
                            <>



                                {e?.data?.checkoutID == clickedStatus && status == "CustomerOrdered" ?
                                    <select
                                        className='form-select required'
                                        name='delivery_status'
                                        onChange={(value) => handleDelStatusChange(e, value)}
                                        value={selectedStatusCheckout}
                                        defaultValue={e?.data?.status}
                                    // value={e?.data.status} // Set the selected value here
                                    >
                                        <option value="" >Select</option>
                                        <option value="Approved">Confirm</option>
                                        <option value="Cancel">Cancel</option>
                                    </select>
                                    :

                                    <>

                                        {status == "Approved" ?
                                            <CBadge color="success" style={{ padding: 8, fontSize: 12 }}>Admin Confirmed</CBadge> :
                                            status == "Completed" ?
                                                <CBadge color="success" style={{ padding: 8, fontSize: 12 }}>Order Delivered</CBadge>

                                                :
                                                (["change booking order status"].some(permission => userData?.permissions?.includes(permission))) &&
                                                <CButton color={status == "Cancel" ? "danger" : "success"} style={{ fontSize: 14, color: 'white' }} onClick={() => handleButtonClick(e?.data?.checkoutID)}>Change Order Status</CButton>

                                        }


                                    </>

                                }

                            </>
                        );
                    }
                }


            }
        },
    ]




    const data = productData?.map(value => ({
        pid: value?.['PID'],
        name: value?.['PName'],
        qty: value?.['Quantity'],
        date: value?.['DDate'],
        address: value?.['DAddress'],
        total_amount: CurrencyConverter(value.currency, value?.['total_amount']),
        paid_amount: CurrencyConverter(value.currency, value?.['paid_amount']),
        balance_amount: CurrencyConverter(value.currency, value?.['balance_amount']),
        checkoutID: value?.checkoutID,
        supplier_status: value?.supplier_status,
        data: value,
        data: value
    }))


    // console.log(productData, "Product dat avalue is")



    return (
        <>
            <CancellationModal show={cancellationReasonModal} onHide={() => setCancellationReasonModal(!cancellationReasonModal)} onConfirm={handleOrderCancellation}> </CancellationModal>

            <COffcanvas backdrop="static" placement="end" visible={cancellationModalState} onHide={() => setCancellationModalState(false)} >
                <COffcanvasHeader>
                    <COffcanvasTitle style={{ fontWeight: 'bold' }}>Order Cancellation Details</COffcanvasTitle>
                    <CCloseButton className="text-reset" onClick={() => setCancellationModalState(false)} />
                </COffcanvasHeader>
                <COffcanvasBody>

                    <CCol>
                        <CCardTitle>Product Name</CCardTitle>
                        <CCardSubtitle>{selectedCancellationModal?.product_title}</CCardSubtitle>
                    </CCol>

                    <br></br>

                    {selectedCancellationModal?.cancel_order_remarks ?
                        <CCol>
                            <CCardTitle>Cancel Order Remarks</CCardTitle>
                            <CCardSubtitle>{selectedCancellationModal?.cancel_order_remarks}</CCardSubtitle>
                            <br></br>
                        </CCol>
                        :
                        null
                    }



                    <CCol>
                        <CCardTitle>Cancel Order Reason</CCardTitle>
                        <CCardSubtitle>{selectedCancellationModal?.cancel_reason}</CCardSubtitle>
                    </CCol>


                    <br></br>

                    {selectedCancellationModal?.cancel_ref_image != "" ?
                        <CCol>
                            <CCardTitle>Cancellation Reference Image</CCardTitle>


                            <img
                                src={axios.defaults.imageUrl + selectedCancellationModal?.cancel_ref_image}
                                fluid
                                style={{


                                    width: '100%',
                                    height: '50%',
                                    objectFit: 'cover',
                                    marginTop: 10
                                }}
                            />
                        </CCol>
                        :
                        null

                    }

                </COffcanvasBody>
            </COffcanvas>


            <MaterialTable
                title="Booking Experience"
                columns={columns}
                data={data}
                options={{
                    headerStyle: {
                        fontSize: '14px', // Adjust the header font size here
                    },
                    cellStyle: {
                        fontSize: '14px', // Adjust the column font size here
                    },
                    paging: false,
                    search: false,
                    columnsButton: true,
                    exportButton: true,
                    rowStyle: rowStyle,
                    grouping: true
                }}

            />




            <Modal show={documentViewModal} style={{ marginTop: '10%', zIndex: 999999999 }} onHide={() => setDocumentViewModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Document View</Modal.Title>
                    {/* <CButton color="primary" size='sm' style={{ fontSize: 12, color: 'white', marginLeft: "10%" }} onClick={() => console.log('View Map Clicked')}>View Map</CButton> */}
                </Modal.Header>
                <Modal.Body>
                    {selectedDocument && selectedDocument.length > 0 ? (
                        <ul style={{ padding: 0, listStyleType: 'none' }}>
                            {selectedDocument.map((url, index) => {
                                const fileName = url.split('/').pop(); // Extract the file name from the URL
                                return (
                                    <li
                                        key={index}
                                        style={{
                                            marginBottom: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between', // Align file name and icon
                                            borderBottom: '1px solid #ddd', // Add a divider between items
                                            paddingBottom: '5px',
                                        }}
                                    >
                                        <span style={{ fontWeight: '500' }}>{fileName}</span>
                                        <a
                                            href={axios.defaults.imageUrl + url}
                                            download={fileName} // This attribute will prompt a download
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                color: '#007bff',
                                                textDecoration: 'none',
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <CIcon icon={cilInfo} size="lg" />
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p>No documents available to display.</p>
                    )}

                    <div>
                    {location?.latitude && location?.longitude ? (
                    <GoogleMap
                    mapContainerClassName="map-container"
                    mapContainerStyle={mapContainerStyle}
                    center={{ lat: parseFloat(location?.latitude), lng: parseFloat(location?.longitude) }}
                    zoom={10}
                    >
                    <Marker
                        position={{ lat: parseFloat(location?.latitude), lng: parseFloat(location?.longitude) }}
                    >
                    </Marker>
                    </GoogleMap>
                ) : (
                    <p>No shared location available.</p>
                )}
                </div>
                </Modal.Body>
            </Modal>



            <Modal show={selectedDiscountModal} style={{ zIndex: 999999999 }} onHide={() => setSelectedDiscountModal(false)} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Discount Product View</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <DiscountView data={selectDiscount} />
                </Modal.Body>
            </Modal>





        </>
    )
}
