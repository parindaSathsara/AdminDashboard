


import React, { useState } from 'react'
import MaterialTable from 'material-table';
import { CButton, CCard, CCardBody, CCol, CPopover, CRow } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilInfo } from '@coreui/icons';
import Modal from 'react-bootstrap/Modal';

export default function SupplierExperience(props) {

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



    const [supplierVoucherView, setSupplierVoucherView] = useState(false)

    const [supplierVoucherData, setSupplierVoucherData] = useState('')

    const getSupplierVoucher = async (data) => {

        console.log(data,"Voucher ID")

        setSupplierVoucherView(true)

        
        var apiUrl = `https://gateway.aahaas.com/api/displaySupplierVoucher/${data.checkout_id}`

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const dataVal = await response.text();

            setSupplierVoucherData(dataVal)
        } catch (error) {
            console.error('Error fetching data:', error);
        }


    }

    const columns = [
        { title: 'Product ID', field: 'pid' },
        { title: 'Supplier ID', field: 'sid' },
        { title: 'Name', field: 'name' },
        { title: 'Supplier Confirmation', field: 'sup_confirm' },
        { title: 'Company Name', field: 'company_name' },
        { title: 'Company Address', field: 'company_address' },
        { title: 'Contact', field: 'contact' },

        {
            field: 'suppliervoucher', width: 5, title: 'Supplier Voucher', align: 'left', render: (e) => {
                return (
                    <>


                        <CButton color="info" style={{ fontSize: 14, color: 'white', }} onClick={() => getSupplierVoucher(e)}>View Voucher</CButton>

                    </>
                );
            }
        },
    ]


    const data = productData.map(value => ({
        pid: value?.['PID'],
        sid: value?.supplier_id,
        name: value?.['PName'],
        sup_confirm: value?.supplier_status,
        company_name: value?.company_name,
        company_address: value?.address,
        contact: value?.phone,
        checkout_id: value?.checkoutID
    }))


    return (
        <>
            <Modal show={supplierVoucherView} onHide={() => setSupplierVoucherView(false)}     size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Supplier Voucher</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <div dangerouslySetInnerHTML={{ __html: supplierVoucherData }} />
                </Modal.Body>
                <Modal.Footer>

                </Modal.Footer>
            </Modal>



            <MaterialTable
                title="Supplier Experience"
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
