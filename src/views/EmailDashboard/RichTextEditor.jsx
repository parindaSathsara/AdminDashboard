import React, { useState } from 'react'

import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';

import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CContainer,
    CFormLabel,
    CButton,
    CRow
} from '@coreui/react';

import './RichText.css'


import Select from 'react-select';


import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

export default function RichTextEditor() {


    const [editorState, setEditorState] = React.useState(
        () => EditorState.createEmpty(),
    );




    const customerEmails = [
        { value: 'products_report', label: 'Products Report' },
        { value: 'orders_report', label: 'Orders Report' }
    ];


    const [customerEmail, setCustomerEmail] = useState(null)

    const options = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
    ]


    return (
        <CCol xs={12}>
            <CCard className="mb-4">
                <CCardHeader>
                    <strong>Draft Emails</strong>
                </CCardHeader>






                <CCardBody>

                    <CRow className="align-items-end mb-5">


                        <CCol xs={12} sm={6} lg={4}>
                            <CFormLabel htmlFor="category">Customer Emails</CFormLabel>
                            <br></br>
                            <Select

                                options={options}

                                value={customerEmail}

                                onChange={(selectedOption) => {
                                    // setReportType(selectedOption)
                                    setCustomerEmail(selectedOption)
                                    // setCategory([])
                                }}

                                placeholder="Select Customer Emails"

                            />
                        </CCol>


                        <CCol xs={12} sm={6} lg={4}>
                            <CFormLabel htmlFor="category">Sender Email</CFormLabel>
                            <br></br>
                            <Select

                                options={options}

                                value={customerEmail}

                                onChange={(selectedOption) => {
                                    // setReportType(selectedOption)
                                    setCustomerEmail(selectedOption)
                                    // setCategory([])
                                }}

                                placeholder="Select Sender Emails"

                            />
                        </CCol>


                        <CCol xs={12} sm={6} lg={2} className="d-flex justify-content-end mt-3">
                            <CButton color="dark" className='full-width'>
                                Send Emails
                            </CButton>
                        </CCol>

                    </CRow>

                    <Editor
                        editorState={editorState}
                        onEditorStateChange={setEditorState}
                    />
                </CCardBody>
            </CCard>
        </CCol>
    )
}
