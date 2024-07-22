import React, { useState } from 'react';
import './CustomerDetails.css';
import MaterialTable from 'material-table';
import { CButton, CCardText, CCloseButton, CFormSelect, CFormTextarea, COffcanvas, COffcanvasBody, COffcanvasHeader, COffcanvasTitle } from '@coreui/react';
import axios from 'axios';
import Swal from 'sweetalert2';

function CustomerDetails(props) {
    const [toggle, setToggle] = useState(true);
    const [visible, setVisible] = useState(false);
    const [contactDetails, setContactDetail] = useState({
        suggestion: "",
        reach_type: ""
    });

    const handleOnSelect = (e) => {
        setContactDetail({ ...contactDetails, [e.target.name]: e.target.value });
    };

    const handleSendMessage = async () => {
        if (contactDetails.suggestion && contactDetails.reach_type) {
            const dataSet = {
                customerID: props?.dataset?.customer_id,
                reach_type: contactDetails?.reach_type,
                content: contactDetails?.suggestion
            };

            try {
                const result = await axios.post("sendMesageToCustomer", dataSet);
                if (result?.data?.status === 200) {
                    Swal.fire({
                        title: "Message Sent to customer",
                        text: "Message Sent",
                        icon: "success"
                    });
                    setContactDetail({ suggestion: "", reach_type: "" });
                    setVisible(false);
                }
            } catch (error) {
                Swal.fire({
                    title: "Error",
                    text: "Failed to send message",
                    icon: "error"
                });
            }
        } else {
            Swal.fire({
                title: "Error",
                text: "Please fill out all fields",
                icon: "error"
            });
        }
    };

    const data = {
        columns: [
            { title: 'First Name', field: 'customer_fname', align: 'left' },
            { title: 'Contact Number', field: 'contact_number', align: 'left' },
            { title: 'Email', field: 'customer_email', align: 'left' },
            { title: 'Nationality', field: 'customer_nationality', align: 'left' },
            { title: 'Address', field: 'customer_address', align: 'left' },
            {
                title: '', field: 'action', align: 'left', render: (e) => {
                    return (
                        <CButton color="success" style={{ fontSize: 14, color: 'white' }} onClick={() => setVisible(true)}>Reach Customer</CButton>
                    );
                }
            }
        ],
        rows: [
            {
                customer_fname: props.dataset?.customer_fname,
                contact_number: props.dataset?.contact_number,
                customer_email: props.dataset?.customer_email,
                customer_nationality: props.dataset?.customer_nationality,
                customer_address: props.dataset?.customer_address,
                action: props?.dataset
            }
        ]
    };

    return (
        <div>
            <COffcanvas backdrop="static" placement="end" visible={visible} onHide={() => setVisible(false)} >
                <COffcanvasHeader>
                    <COffcanvasTitle>Try to Reach Customer</COffcanvasTitle>
                    <CCloseButton className="text-reset" onClick={() => setVisible(false)} />
                </COffcanvasHeader>
                <COffcanvasBody>
                    <CFormSelect
                        aria-label="Select Option"
                        options={[
                            { label: 'Select Option', value: '' },
                            { label: 'For uninterrupted communication, kindly update your email address in your account preferences.', value: 'For uninterrupted communication, kindly update your email address in your account preferences.' },
                            { label: 'To receive timely updates, kindly update your mobile number in your account settings.', value: 'To receive timely updates, kindly update your mobile number in your account settings.' }
                        ]}
                        label="Add Some Suggestions"
                        name='suggestion'
                        onChange={handleOnSelect}
                        value={contactDetails.suggestion}
                    />
                    <br />
                    <CFormTextarea
                        id="customerText"
                        label="Type Message"
                        rows={5}
                        text="Write something to send to customer"
                        value={contactDetails.suggestion}
                        name='suggestion'
                        onChange={handleOnSelect}
                    />
                    <br />
                    <CFormSelect
                        aria-label="Select Option"
                        options={[
                            { label: 'Select Option', value: '' },
                            { label: "Push Notification", value: "push" },
                            { label: "Send Email", value: "email", disabled: !props.dataset?.customer_email },
                            { label: "Send Message", value: "message", disabled: !props.dataset?.contact_number }
                        ]}
                        name='reach_type'
                        label="How to Reach Customer"
                        onChange={handleOnSelect}
                        value={contactDetails.reach_type}
                    />
                    <br />
                    <CButton color="primary" onClick={handleSendMessage}>Send Message</CButton>
                </COffcanvasBody>
            </COffcanvas>
            <div className='confirmation_container'>
                {toggle && (
                    <div className="confirmation_table mt-3" id='confirmation_table'>
                        <MaterialTable
                            data={data.rows}
                            columns={data.columns}
                            title="Product Details"
                            options={{
                                sorting: true, search: true,
                                searchFieldAlignment: "right", searchAutoFocus: true, searchFieldVariant: "standard",
                                filtering: false, paging: false, pageSize: 3,
                                paginationType: "stepped", showFirstLastPageButtons: false, paginationPosition: "both", exportButton: true,
                                exportAllData: true, exportFileName: "TableData", addRowPosition: "first", actionsColumnIndex: -1, selection: false,
                                showSelectAllCheckbox: false, showTextRowsSelected: false,
                                grouping: false, columnsButton: false,
                                rowStyle: { fontSize: "15px", width: "100%", color: "#000" },
                                editCellStyle: { width: "100%" },
                                headerStyle: { fontSize: "16px", backgroundColor: '#D8EFFF' }
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default CustomerDetails;
