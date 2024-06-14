import React, { useEffect, useState } from 'react';
import './CustomerDetails.css';
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import discountTotal from '../dcalculator';
import moment from 'moment';
import MaterialTable from 'material-table';
import { CButton, CCardText, CCloseButton, CFormSelect, CFormTextarea, COffcanvas, COffcanvasBody, COffcanvasHeader, COffcanvasTitle } from '@coreui/react';
import axios from 'axios';
import Swal from 'sweetalert2';

function CustomerDetails(props) {
    const [toggle, setToggle] = useState(true);

    function generateRandom() {
        var length = 8,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    }

    // const columns = [
    //     { field: 'prod_feedback', headerName: 'ProductFeedback', align: 'left', },
    //     { field: 'sup_feedback', headerName: 'Sup.Feedback', align: 'left', },
    // ]

    // const rows = {
    //     data: props.dataset?.filter(id => id.OrderId == props.orderid)?.map((value) => {
    //         return {
    //             prod_feedback: '-',
    //             sup_feedback: '-'

    //         }
    //     })
    // }


    console.log(props.dataset, "Dataset data props value is")

    const data = {
        columns: [
            { field: 'customer_fname', title: 'First Name', align: 'left' },
            { field: 'contact_number', title: 'Contact Number', align: 'left' },
            { field: 'customer_email', title: 'Email', align: 'left' },
            { field: 'customer_nationality', title: 'Nationality', align: 'left' },
            // { field: 'customer_profilepic', title: 'Profile Picture', align: 'left' },
            { field: 'customer_address', title: 'Address', align: 'left' },
            {
                field: 'action', title: '', align: 'left', render: (e) => {
                    return (
                        <>
                            <CButton color="success" style={{ fontSize: 14, color: 'white' }} onClick={() => setVisible(true)}>Reach Customer</CButton>
                        </>
                    );
                }
            },
            // { field: 'customer_status', title: 'Status', align: 'left' },
        ],
        rows: [
            {
                customer_fname: props.dataset?.customer_fname,
                contact_number: props.dataset?.contact_number,
                customer_email: props.dataset?.customer_email,
                customer_nationality: props.dataset?.customer_nationality,
                // customer_profilepic: props.dataset.customer_profilepic,
                customer_address: props.dataset?.customer_address,
                action: props?.dataset
                // customer_status: props.dataset?.customer_status,

            }
        ]
    };


    const [visible, setVisible] = useState(false)



    const [contactDetails, setContactDetail] = useState({
        suggestion: "",
        reach_type: ""
    })

    const handleOnSelect = (e) => {
        console.log(e.target.name)
        setContactDetail({ ...contactDetails, [e.target.name]: e.target.value })
    }


    const handleSendMessage = async () => {
        const dataSet = {
            "customerID": props?.dataset?.customer_id,
            "reach_type": contactDetails?.reach_type,
            "content": contactDetails?.suggestion
        }

        console.log(dataSet)

        await axios.post("sendMesageToCustomer", dataSet).then(result => {
            if (result?.data?.status == 200) {
                Swal.fire({
                    title: "Message Sent to customer",
                    text: "Message Sent",
                    icon: "success"
                });
            }
        }).catch(result => {

        })
    }


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
                            'Select Option',
                            { label: 'For uninterrupted communication, kindly update your email address in your account preferences.', value: 'For uninterrupted communication, kindly update your email address in your account preferences.' },
                            { label: 'To receive timely updates, kindly update your mobile number in your account settings.', value: 'To receive timely updates, kindly update your mobile number in your account settings.' },

                        ]}
                        label="Add Some Suggestions"
                        name='suggestion'
                        onChange={handleOnSelect}
                    />

                    <br></br>

                    <CFormTextarea
                        id="customerText"
                        label="Type Message"
                        rows={5}
                        text="Write something to send to customer"
                        value={contactDetails?.suggestion}
                        name='suggestion'
                        onChange={handleOnSelect}
                    ></CFormTextarea>

                    <br></br>

                    <CFormSelect
                        aria-label="Select Option"
                        options={[
                            'Select Option',
                            { label: "Push Notification", value: "push" },
                            { label: "Send Email", value: "email", disabled: props.dataset?.customer_email ? false : true },
                            { label: "Send Message", value: "message", disabled: props.dataset?.contact_number ? false : true }

                        ]}

                        name='reach_type'
                        label="How to Reach Customer"
                        onChange={handleOnSelect}
                    />

                    <br></br>


                    <CButton color="primary" onClick={handleSendMessage}>Send Message</CButton>




                </COffcanvasBody>
            </COffcanvas>


            <div className='confirmation_container'>
                {/* <div className='expand_bar'>
                    <button type='button' className='btn confirm_details_title mx-2 btn_expand btn-sm' id='btn_expand' onClick={() => setToggle(!toggle)} >Feedback Details {toggle == true ? <i class="bi bi-dash-lg"></i> : <i className="bi bi-plus-lg"></i>}</button>
                </div> */}

                {
                    toggle && (

                        <div className="confirmation_table mt-3" id='confirmation_table'>
                            {/* <DataGrid
                                rows={rows.data}
                                columns={columns}
                                encodeHtml={false}
                                getRowClassName={(e) => `type_class${e.row.product_type}`}
                                getRowId={(row) => generateRandom()}
                                pageSizeOptions={[5]}
                                className='data_grid'
                            // onCellClick={(e) => handleClick(e)}

                            /> */}


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

                                    // fixedColumns: {
                                    //     left: 6
                                    // }
                                }}
                            />
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default CustomerDetails