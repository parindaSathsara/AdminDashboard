import { CBadge, CButton, CCardText, CCardTitle, CCol, CContainer, CSpinner } from '@coreui/react'
import React, { useState } from 'react'
import { TagsInput } from 'react-tag-input-component'

import './ResendVoucher.css'
import Swal from 'sweetalert2'
import axios from 'axios'
import CIcon from '@coreui/icons-react'
import { cilInfo } from '@coreui/icons'


export default function ResendVoucher({ voucherData, orderID }) {
  const [selected, setSelected] = useState([])

  const [voucherSending, setVoucherSending] = useState('')

  const sendToSupplierEmail = (type) => {
    setVoucherSending(type)



    if (selected.length === 0 && type == "All") {
      Swal.fire({
        title: 'Email Addresses Missing',
        text: 'Please enter recipient email addresses to send the voucher.',
        icon: 'error',
      })
      setVoucherSending('')
    } else {
      var email = `https://gateway.aahaas.com/api/sendOrderIndividualItemMailsVoucher/${voucherData?.checkout_id}/${orderID}`
      const postdata = {
        emails: type == "Supplier" ? [voucherData?.email] : selected,
      }


      let orderIdNumber
      if (typeof orderID === 'object' && orderID?.info?.orderID !== undefined) {
        orderIdNumber = orderID.info.orderID
      } else if (typeof orderID === 'number') {
        orderIdNumber = orderID
      } else {
        orderIdNumber = orderID
      }

      let url

      axios
        .post(`supplier-voucher/${voucherData?.checkout_id}/custom-mails`, postdata, {
          headers: {
            'Content-Type': 'application/json',
          },
        })

        .then((data) => {
          setVoucherSending('')

          if (data.status === 200) {
            Swal.fire({
              title: 'Voucher Resent Successfully',
              text: 'Voucher Sent',
              icon: 'success',
            })
            setSelected([])
          }
        })
        .catch((error) => {
          setVoucherSending('')
          // console.error('There was a problem with the Axios request:', error);
        })
    }
  }

  const handleSendToSelected = () => { }

  const validateEmails = (emails) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emails.every((email) => emailPattern.test(email))
  }

  return (
    <>
      <CContainer>
        <CCardTitle>Send to Supplier Email</CCardTitle>
        <CCardText>{voucherData?.email}</CCardText>
        <CButton
          title="Send to Supplier Origin Email"
          color="info"
          style={{ color: 'white' }}
          onClick={() => sendToSupplierEmail('Supplier')}
          disabled={voucherSending != ''}
        >
          Send
          {voucherSending === 'Supplier' ? (
            <CSpinner style={{ height: 18, width: 18, marginLeft: 10 }} />
          ) : null}
        </CButton>
      </CContainer>

      <br></br>

      <CContainer>
        <CCardTitle style={{ marginBottom: 10 }}>Type Emails Here</CCardTitle>
        <div style={{ display: 'flex', alignItems: 'center' }}>

          <h6 style={{ color: "#c3b9b9", fontSize: '14px' }}> <CIcon icon={cilInfo} className="text-info" size="sm" />   Please press enter after adding the email</h6>
        </div>

        {/* <TagsInput
          value={selected} 
          onChange={(e) => setSelected(e)}
          name="emails"
          placeHolder="Enter Email"
         
        /> */}
        <TagsInput
          value={selected}
          onChange={(e) => setSelected(e)}
          name="emails"
          placeHolder="Enter Email"
          classNames={{
            input: 'tags-input-custom',
            tag: 'tag-custom'
          }}
          style={{
            width: '100%',
            overflow: 'hidden',
          }}
        />

        <CButton
          title="Send to Supplier Origin Email"
          color="info"
          style={{ color: 'white', marginTop: 10 }}
          onClick={() => {
            if (validateEmails(selected)) {
              sendToSupplierEmail('All')
            } else {
              Swal.fire({
                title: 'Invalid Email Addresses',
                text: 'Please enter valid email addresses.',
                icon: 'error',
              })
            }
          }}
          disabled={voucherSending != ''}
        >
          Send To Selected
          {voucherSending === 'All' ? (
            <CSpinner style={{ height: 18, width: 18, marginLeft: 10 }} />
          ) : null}
        </CButton>
      </CContainer>
    </>
  )
}
