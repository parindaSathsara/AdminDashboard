


import React, { useState } from 'react'
import MaterialTable from 'material-table';
import { CButton, CCard, CCardBody, CCol, CPopover, CRow, CSpinner } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilInfo } from '@coreui/icons';
import Modal from 'react-bootstrap/Modal';
import rowStyle from '../Components/rowStyle';
import axios from 'axios';
import Swal from 'sweetalert2';

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
    const [selectedSupplierVoucherData, setSelectedSupplierVoucherData] = useState([])


    const getSupplierVoucher = async (data) => {

        console.log(data, "Voucher ID")

        setSupplierVoucherView(true)
        setSelectedSupplierVoucherData(data)


        var apiUrl = `https://gateway.aahaas.com/api/displaySupplierVoucher/${data.checkout_id}`
        console.log(apiUrl, "Voucher ID")
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const dataVal = await response.text();

            console.log(dataVal, "Index")

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
        { title: 'Email', field: 'email' },
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


    const data = productData?.map(value => ({
        pid: value?.['PID'],
        sid: value?.supplier_id,
        name: value?.['PName'],
        sup_confirm: value?.supplier_status,
        company_name: value?.company_name,
        company_address: value?.address,
        contact: value?.phone,
        checkout_id: value?.checkoutID,
        data: value,
        email: value?.email
    }))


    const [voucherSending, setVoucherSending] = useState(false)


    const resendVoucher = () => {

        console.log("resend calling")
        setVoucherSending(true)



        var email = `https://gateway.aahaas.com/api/sendOrderIndividualItemMailsVoucher/${selectedSupplierVoucherData?.checkout_id}/${props?.orderid}`
        console.log(email, "Supplier Data")


        fetch(`https://gateway.aahaas.com/api/sendOrderIndividualItemMailsVoucher/${selectedSupplierVoucherData?.checkout_id}/${props?.orderid}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Network response was not ok.');
                }
            })
            .then(data => {
                setVoucherSending(false)
                if (data.status === 200) {
                    Swal.fire({
                        title: "Voucher Resent Successfully",
                        text: "Voucher Sent",
                        icon: "success"
                    });
                }
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });



        // axios.post()
    }


    function decodeEmail(encoded) {
        var key = 0x82;
        var decoded = "";
        for (var i = 0; i < encoded.length; i += 2) {
            decoded += String.fromCharCode(parseInt(encoded.substr(i, 2), 16) ^ key);
        }
        return decoded;
    }


    return (
        <>
            <Modal show={supplierVoucherView} onHide={() => setSupplierVoucherView(false)} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Supplier Voucher</Modal.Title>
                    <CButton color="info" style={{ fontSize: 16, color: 'white', marginLeft: 20, alignContent: 'center' }} onClick={() => resendVoucher()}>
                        Resend Voucher



                        {voucherSending === false ?
                            null
                            :
                            <CSpinner style={{ height: 18, width: 18, marginLeft: 10 }} />
                        }

                    </CButton>
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

                    rowStyle: rowStyle
                }}


            />
        </>
    )
}
