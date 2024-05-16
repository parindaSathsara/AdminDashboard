import { CButton, CCardText, CCardTitle, CCol, CContainer, CSpinner } from '@coreui/react'
import React, { useState } from 'react'
import { TagsInput } from 'react-tag-input-component';

import './ResendVoucher.css'
import Swal from 'sweetalert2';
import axios from 'axios';


export default function ResendVoucher({ voucherData, orderID }) {

    const [selected, setSelected] = useState([]);

    const [voucherSending, setVoucherSending] = useState("")

    const sendToSupplierEmail = (type) => {

        setVoucherSending(type)


        var email = `https://gateway.aahaas.com/api/sendOrderIndividualItemMailsVoucher/${voucherData?.checkout_id}/${orderID}`
        const postdata = {
            emails: selected.toString()
        }

        axios.post(`https://gateway.aahaas.com/api/sendOrderIndividualItemMailsVoucher/${voucherData?.checkout_id}/${orderID}/${type}`, postdata, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

            .then(data => {
                setVoucherSending("");

                console.log("Test", data);

                if (data.status === 200) {
                    Swal.fire({
                        title: "Voucher Resent Successfully",
                        text: "Voucher Sent",
                        icon: "success"
                    });
                }
            })
            .catch(error => {
                setVoucherSending("");
                console.error('There was a problem with the Axios request:', error);
            });
    }


    const handleSendToSelected = () => {

    }


    return (

        <>
            <CContainer>
                <CCardTitle>Send to Supplier Email</CCardTitle>
                <CCardText>{voucherData?.email}</CCardText>
                <CButton title='Send to Supplier Origin Email' color='info' style={{ color: 'white' }} onClick={() => sendToSupplierEmail("Supplier")}>
                    Send
                    {voucherSending === "Supplier" ?
                        <CSpinner style={{ height: 18, width: 18, marginLeft: 10 }} />
                        :
                        null
                    }

                </CButton>
            </CContainer>

            <br></br>


            <CContainer>
                <CCardTitle style={{ marginBottom: 10 }}>Type Emails Here</CCardTitle>
                <TagsInput
                    value={selected}
                    onChange={setSelected}
                    name="emails"
                    placeHolder="Enter Email"

                />
                <CButton title='Send to Supplier Origin Email' color='info' style={{ color: 'white', marginTop: 10 }} onClick={() => sendToSupplierEmail("All")}>

                    Send To Selected


                    {voucherSending === "All" ?
                        <CSpinner style={{ height: 18, width: 18, marginLeft: 10 }} />
                        :
                        null
                    }

                </CButton>

            </CContainer>
        </>



    )
}
