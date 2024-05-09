import React, { useState } from 'react'
import MaterialTable from 'material-table';
import { CBadge, CButton, CCard, CCardBody, CCol, CFormInput, CFormSelect, CPopover, CRow } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCheckCircle, cilInfo } from '@coreui/icons';
import Modal from 'react-bootstrap/Modal';
import DeliveryDetails from 'src/Panels/DeliveryDetails/DeliveryDetails';
import axios from 'axios';
import Swal from 'sweetalert2'
import rowStyle from '../Components/rowStyle';

export default function TravellerExperience(props) {

    const customPopoverStyle = {
        '--cui-popover-max-width': '400px',
        '--cui-popover-border-color': '#0F1A36',
        '--cui-popover-header-bg': '#0F1A36',
        '--cui-popover-header-color': 'var(--cui-white)',
        '--cui-popover-body-padding-x': '1rem',
        '--cui-popover-body-padding-y': '.5rem',
    }

    const productData = props.dataset

    console.log(productData, "Productttttttt")

    const [travellerData, setTravellerData] = useState({
        pid: '',
        delivery_date: '',
        reconfirmation_date: '',
        qc: '',
        delivery_status: '',
        location1: ''
    })

    const handleInputFields = (name, value) => {
        console.log([name, value], 'hjhjhjhjhjh');
        setTravellerData({ ...travellerData, [name]: value })
        // console.log(travellerData.reconfirmationDate);
    }

    // const createTravellerExperience = async (travellerData) => {

    //     console.log(travellerData, 'traveller new data');
    //     var returnData = []

    //     await axios.post(`/create_traveller_experience`, travellerData).then((res) => {
    //         console.log(res, 'traveller Experience')
    //         if (res.data.status === 200) {
    //             returnData = res.data
    //         }

    //     }).catch((err) => {
    //         throw new Error(err);
    //     })

    //     // return returnData

    // }

    const createTravellerExperience = async (rowData) => {
        console.log(rowData?.data?.checkoutID, "ROWWW");

        travellerData["pid"] = rowData?.data?.checkoutID


        console.log(travellerData, "Travellll")

        try {
            Swal.showLoading()
            const response = await axios.post(`/create_traveller`, travellerData);
            if (response.data.status == 200) {


                await axios.post(`https://gateway.aahaas.com/api/sendConfirmationMail/${rowData?.data?.checkoutID}/${"CompletedDelivery"}`).then((res) => {
                    Swal.hideLoading()
                    console.log(res)

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
            console.error('Error creating traveller experience:', error);
            throw error; // Rethrow the error to handle it at a higher level if necessary
        }
    };



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


    const qcValues = ['Approved', 'Pending'];
    const deliveryStatusValues = ['Delivered', 'Pending'];


    const [mapView, setMapView] = useState(false)

    const [mapViewData, setMapViewData] = useState([])

    const getMapView = async (data) => {


        setMapView(true)
        setMapViewData(data)




    }

    // console.log(value, 'fgf');
    const columns = [
        { title: 'PID', field: 'pid' },
        { title: 'Delivery Date', field: 'delivery_date', type: 'date' },
        { title: 'Location', field: 'location1', render: rowData => <CButton color="info" style={{ fontSize: 14, color: 'white', }} onClick={() => getMapView(rowData.data)}>Show in Map</CButton> },
        { title: 'Reconfirmation Date', field: 'reconfirmation_date', type: 'date', render: rowData => <CFormInput type="date" value={rowData.reconfirmation_date} onChange={e => handleInputFields('reconfirmation_date', e.target.value)} /> },
        { title: 'QC', field: 'qc', render: rowData => <CFormSelect custom onChange={e => handleInputFields('qc', e.target.value)} ><option>Select QC</option>{qcValues.map(qc => <option key={qc} value={qc}>{qc}</option>)}</CFormSelect> },
        {
            title: 'Delivery Status', field: 'delivery_status', render: rowData => {


                return (
                    <CFormSelect custom onChange={e => handleInputFields('delivery_status', e.target.value)} >
                        <option>Select Status</option>{deliveryStatusValues.map(status => <option key={status} value={status}>{status}</option>)}
                    </CFormSelect>
                )


            }
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
                }

                else if (rowData?.data.status == "Completed") {
                    return (
                        <CIcon icon={cilCheckCircle} size="xxl" />
                    )
                }
                else {
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



    return (
        <>

            <Modal show={mapView} onHide={() => setMapView(false)} size="fullscreen">
                <Modal.Header closeButton>
                    <Modal.Title>Location Data</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <DeliveryDetails dataset={mapViewData}></DeliveryDetails>
                </Modal.Body>
                <Modal.Footer>

                </Modal.Footer>
            </Modal>

            <MaterialTable
                title="Traveller Experience"
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
                    grouping: false,
                    rowStyle: rowStyle
                }}

            />
        </>
    )
}
