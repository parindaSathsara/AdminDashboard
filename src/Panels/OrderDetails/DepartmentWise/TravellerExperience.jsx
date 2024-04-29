


import React, { useState } from 'react'
import MaterialTable from 'material-table';
import { CButton, CCard, CCardBody, CCol, CFormInput, CFormSelect, CPopover, CRow } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilInfo } from '@coreui/icons';
import Modal from 'react-bootstrap/Modal';
import DeliveryDetails from 'src/Panels/DeliveryDetails/DeliveryDetails';

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



    const QuantityContainer = ({ data }) => {


        console.log(data, "Data Value is")


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


    const columns = [
        { title: 'PID', field: 'pid' },
        { title: 'Delivery Date', field: 'deliveryDate', type: 'date' },
        { title: 'Location', field: 'location', render: rowData => <CButton color="info" style={{ fontSize: 14, color: 'white', }} onClick={() => getMapView(rowData.data)}>Show in Map</CButton> },
        { title: 'Reconfirmation Date', field: 'reconfirmationDate', type: 'date', render: rowData => <CFormInput type="date" value={rowData.reconfirmationDate} onChange={(e) => handleReconfirmationDateChange(e.target.value, rowData)} /> },
        { title: 'Q/C', field: 'qc', render: rowData => <CFormSelect custom>{qcValues.map(qc => <option key={qc} value={qc}>{qc}</option>)}</CFormSelect> },
        { title: 'Delivery Status', field: 'deliveryStatus', render: rowData => <CFormSelect custom>{deliveryStatusValues.map(status => <option key={status} value={status}>{status}</option>)}</CFormSelect> },
        // { title: 'DFeedback', field: 'dFeedback', render: rowData => <CFormSelect custom>{rowData.dFeedback}</CFormSelect> },
    ];

    // Function to handle changes to the Reconfirmation Date
    const handleReconfirmationDateChange = (date, rowData) => {
        // You can handle the date change here, e.g., update rowData.reconfirmationDate
    };

    // Prepare the data for the Material Table
    const data = productData?.map(value => ({
        pid: value?.['PID'],
        deliveryDate: value?.service_date,
        location: value?.location,
        reconfirmationDate: value?.reconfirmationDate,
        qc: <CFormSelect custom>{qcValues.map(qc => <option key={qc} value={qc}>{qc}</option>)}</CFormSelect>,
        deliveryStatus: <CFormSelect custom>{deliveryStatusValues.map(status => <option key={status} value={status}>{status}</option>)}</CFormSelect>,
        data: value
        // dFeedback: <CFormSelect custom>{value?.dFeedback}</CFormSelect>,
    }));


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
                    grouping: true,
                }}


            />
        </>
    )
}
