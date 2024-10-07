import React, { useEffect, useState } from 'react'
import MaterialTable from 'material-table';
import { CBadge, CButton, CCard, CCardBody, CCol, CFormInput, CFormSelect, CPopover, CRow } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCheckCircle, cilInfo } from '@coreui/icons';
import Modal from 'react-bootstrap/Modal';
import DeliveryDetails from 'src/Panels/DeliveryDetails/DeliveryDetails';
import axios from 'axios';
import Swal from 'sweetalert2'
import rowStyle from '../Components/rowStyle';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import Tooltip from '@mui/material/Tooltip';

import './TravellerExperience.css';

export default function TravellerExperience(props) {

    const customPopoverStyle = {
        '--cui-popover-max-width': '400px',
        '--cui-popover-border-color': '#0F1A36',
        '--cui-popover-header-bg': '#0F1A36',
        '--cui-popover-header-color': 'var(--cui-white)',
        '--cui-popover-body-padding-x': '1rem',
        '--cui-popover-body-padding-y': '.5rem',
    }

    const productData = props.dataset;

    // console.log(productData, "Productttttttt")

    const [driverAllocationStatus, setDriverAllocationStatus] = useState({
        status: false,
        data: []
    });

    const [travellerData, setTravellerData] = useState({
        pid: '',
        delivery_date: '',
        reconfirmation_date: '',
        qc: '',
        delivery_status: '',
        location1: ''
    })

    const handleInputFields = (name, value) => {
        // console.log([name, value], 'hjhjhjhjhjh');
        setTravellerData({ ...travellerData, [name]: value })
        // console.log(travellerData.reconfirmationDate);
    }

    // const createTravellerExperience = async (travellerData) => {

    //     // console.log(travellerData, 'traveller new data');
    //     var returnData = []

    //     await axios.post(`/create_traveller_experience`, travellerData).then((res) => {
    // console.log(res, 'traveller Experience')
    //         if (res.data.status === 200) {
    //             returnData = res.data
    //         }

    //     }).catch((err) => {
    //         throw new Error(err);
    //     })

    //     // return returnData

    // }

    const createTravellerExperience = async (rowData) => {
        // console.log(rowData?.data?.checkoutID, "ROWWW");

        travellerData["pid"] = rowData?.data?.checkoutID


        // console.log(travellerData, "Travellll")

        try {
            Swal.showLoading()
            const response = await axios.post(`/create_traveller`, travellerData);
            if (response.data.status == 200) {


                await axios.post(`https://gateway.aahaas.com/api/sendConfirmationMail/${rowData?.data?.checkoutID}/${"CompletedDelivery"}`).then((res) => {
                    Swal.hideLoading()
                    // console.log(res)

                    if (res.data.status === 200) {
                        Swal.fire({
                            title: "Traveller Details Updated Successfully",
                            text: "",
                            icon: "success"
                        });

                    }

                }).catch((err) => {

                    Swal.fire({
                        title: "Traveller Details Updated Successfully",
                        text: "",
                        icon: "success"
                    });

                    throw new Error(err);
                })

                props.reload()
            }
            else if (response.data.status == 400) {
                Swal.fire({
                    text: "Please Fill All Details",
                    icon: "error"
                });
            }

            else if (response.data.status == 410) {
                Swal.fire({
                    text: "Failed to Proceed the Order",
                    icon: "error"
                });
            }

        } catch (error) {
            // console.error('Error creating traveller experience:', error);
            throw error; // Rethrow the error to handle it at a higher level if necessary
        }
    };



    const QuantityContainer = ({ data }) => {


        // // console.log(data, "Data Value is")


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


    const qcValues = ['Approved', 'Pending'];
    const deliveryStatusValues = ['Delivered', 'Pending'];


    const [mapView, setMapView] = useState(false)

    const [mapViewData, setMapViewData] = useState([])

    const getMapView = async (data) => {


        setMapView(true)
        setMapViewData(data)




    }


    const handleClickDriverAllocation = (dataset) => {
        if (dataset.data.category === 'Lifestyles') {
            setDriverAllocationStatus({ status: true, data: dataset });
        } else {
            alert('Driver allocation is avaliable only for lifestyle products');
        }
    }


    const getDisableStatus = (rowData) => {
        // console.log(rowData, "Rowwwww")

        if (rowData?.data?.status == "Cancel" || rowData?.data?.status == "CustomerOrdered" || rowData?.data?.status == "Completed") {
            return true
        }

        if (rowData?.data?.status == "Cancel" || rowData?.data?.status == "CustomerOrdered" || rowData?.data?.status == "Completed") {
            return true
        }

        return false
    }

    // console.log(value, 'fgf');
    const columns = [
        { title: 'PID', field: 'pid' },
        { title: 'Delivery Date', field: 'delivery_date', type: 'date' },
        { title: 'Location', field: 'location1', render: rowData => <CButton color="info" style={{ fontSize: 14, color: 'white', }} onClick={() => getMapView(rowData.data)}>Show in Map</CButton> },
        { title: 'Reconfirmation Date', field: 'reconfirmation_date', type: 'date', render: rowData => <CFormInput disabled={getDisableStatus(rowData)} type="date" value={rowData.reconfirmation_date} onChange={e => handleInputFields('reconfirmation_date', e.target.value)} /> },
        { title: 'QC', field: 'qc', render: rowData => <CFormSelect disabled={getDisableStatus(rowData)} custom onChange={e => handleInputFields('qc', e.target.value)} ><option>Select QC</option>{qcValues.map(qc => <option key={qc} value={qc}>{qc}</option>)}</CFormSelect> },
        {
            title: 'Delivery Status', field: 'delivery_status', render: rowData => {


                return (
                    <CFormSelect custom onChange={e => handleInputFields('delivery_status', e.target.value)} disabled={getDisableStatus(rowData)}>
                        <option>Select Status</option>{deliveryStatusValues.map(status => <option key={status} value={status}>{status}</option>)}
                    </CFormSelect>
                )


            }
        },
        {
            title: 'Driver allocation', field: 'Driver allocation', render: rowData =>
                <Tooltip title={rowData.data.category === 'Lifestyles' ? 'Allocate driver' : 'Driver allocation is not avalible'}>
                    <CButton color="info" style={{ fontSize: 14, color: 'white', backgroundColor: rowData.data.category === 'Lifestyles' ? '' : 'gray' }}
                        onClick={() => handleClickDriverAllocation(rowData)}
                        className='btn btn-primary'>
                        {
                            rowData.data.vehicle_allocation == 1 ? 'Driver allocated' : 'Allocate driver'
                        }
                    </CButton>
                </Tooltip>
        },
        {
            title: '',
            render: rowData => {
                if (rowData?.data.status == "Approved") {
                    return (
                        <div onClick={() => createTravellerExperience(rowData)}>
                            <CButton color="success" style={{ fontSize: 14, color: 'white' }}>Submit</CButton>
                        </div>
                    )
                } else if (rowData?.data.status == "Completed") {
                    return (
                        <CIcon icon={cilCheckCircle} size="xxl" />
                    )
                } else if (rowData?.data.status == "Cancel") {
                    return (
                        <CBadge color="danger" style={{ padding: 5, fontSize: 12 }}>Order Cancelled</CBadge>
                    )
                } else {
                    return (
                        <CBadge color="danger" style={{ padding: 5, fontSize: 12 }}>Waiting For Approval</CBadge>
                    )
                }
            }
        }
        // { title: 'DFeedback', field: 'dFeedback', render: rowData => <CFormSelect custom>{rowData.dFeedback}</CFormSelect> },
    ];

    // Prepare the data for the Material Table
    const data = productData?.map(value => ({
        pid: value?.['PID'],
        delivery_date: value?.service_date,
        location: value?.location,
        reconfirmationDate: value?.reconfirmationDate,
        qc: <CFormSelect custom>{qcValues.map(qc => <option key={qc} value={qc}>{qc}</option>)}</CFormSelect>,
        deliveryStatus: <CFormSelect custom>{deliveryStatusValues.map(status => <option key={status} value={status}>{status}</option>)}</CFormSelect>,
        data: value
        // dFeedback: <CFormSelect custom>{value?.dFeedback}</CFormSelect>,
    }));





    const [formData, setFormData] = useState({})

    // Function to handle changes to the Reconfirmation Date
    const handleReconfirmationDateChange = (date, rowData) => {
        // You can handle the date change here, e.g., update rowData.reconfirmationDate


    };

    const [driverDetailsLoading, setDriverDetailsLoading] = useState(true);
    const [driverDetails, setDriverDetails] = useState([]);

    const getAllExistingDeivers = async () => {
        setDriverDetailsLoading(true);
        await axios.get('/vehicle-drivers').then((response) => {
            setDriverDetailsLoading(false);
            setDriverDetails(response.data.data);
        })
    }

    useEffect(() => {
        getAllExistingDeivers();
    }, [driverAllocationStatus.status]);

    const handleResetAllocationModal = () => {
        setDriverAllocationStatus({
            status: false, data: []
        })
    }

    const handleChooseDriver = async (dataset) => {
        let Prod_ID = driverAllocationStatus.data.data.checkoutID;
        let Veh_ID = dataset.id;
        await axios.post(`/allocate-order-product/${Prod_ID}/vehicle-driver/${Veh_ID}`, { xsrfHeaderName: 'X-CSRF-Token', withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } }).then((response) => {
            if (response.data.message === "success") {
                Swal.fire({
                    title: "Traveller Details Updated Successfully",
                    text: "",
                    icon: "success"
                });
                handleResetAllocationModal();
            }
        })
    }

    return (
        <>
            <Modal show={mapView} onHide={() => setMapView(false)} size="fullscreen">
                <Modal.Header closeButton>
                    <Modal.Title>Location Data</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <DeliveryDetails dataset={mapViewData}></DeliveryDetails>
                </Modal.Body>
                {/* <Modal.Footer></Modal.Footer> */}
            </Modal>

            <Modal show={driverAllocationStatus.status} size='lg' onHide={() => handleResetAllocationModal()}>
                <Modal.Header closeButton>
                    <Modal.Title>Choose the driver</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='driverListModalBody-mainContainer'>
                        {
                            driverDetailsLoading ?
                                <div className='d-flex flex-column align-items-center p-5'>
                                    <FontAwesomeIcon icon={faSpinner} spinPulse />
                                    <h6 className='m-0 p-0 py-2'>Loading...</h6>
                                    <h6 className='m-0 p-0 py-2'>Driver information, one moment please…</h6>
                                </div> :
                                driverDetails.map((value, key) => (
                                    <div key={key} className='driver-vehicle-list'>
                                        <div className='d-flex align-items-center vehicle-details'>
                                            <h6>Vehicle No : {value.vehicle_number}</h6>
                                            <h6>{value.vehicle_province}</h6>
                                        </div>
                                        <div className='d-flex align-items-center driver-details'>
                                            <h6>Type : {value.vehicle_type}</h6>
                                            <h6>Modal : {value.vehicle_model}</h6>
                                            <h6>Color : {value.vehicle_color}</h6>
                                            <h6>Make : {value.vehicle_make}</h6>
                                        </div>
                                        <div className='d-flex align-items-center vehicle-details-secondary'>
                                            <h6>Reg date : {value.vehicle_registered_date}</h6>
                                            <h6>Condition {value.vehicle_vehicle_condition}</h6>
                                            <h6>Vehicle Status : {value.vehicle_status}</h6>
                                        </div>
                                        <div className='d-flex align-items-center driver-details-secondary'>
                                            <h6>Driver name : {value.driver_name}</h6>
                                            <h6>Reg country : {value.driver_registered_country}</h6>
                                            <h6>Type : {value.driver_type}</h6>
                                            <h6>Nic : {value.driver_nic}</h6>
                                            <h6>Reg date : {value.driver_registered_date}</h6>
                                            <h6>Driver Status : {value.driver_status}</h6>
                                        </div>
                                        <button className='btn-submit-button' onClick={() => handleChooseDriver(value)}>Select</button>
                                    </div>
                                ))}
                    </div>
                </Modal.Body>
            </Modal>

            <MaterialTable
                title="Traveller Experience"
                columns={columns}
                data={data}
                options={{
                    headerStyle: { fontSize: '14px', },
                    cellStyle: { fontSize: '14px', },
                    paging: false, search: false, columnsButton: true,
                    exportButton: true, grouping: true,
                    rowStyle: rowStyle,
                }}
            />
        </>
    )
}
