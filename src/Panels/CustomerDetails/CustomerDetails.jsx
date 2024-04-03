import React, { useEffect, useState } from 'react';
import './CustomerDetails.css';
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import discountTotal from '../dcalculator';
import moment from 'moment';
import MaterialTable from 'material-table';

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
            { field: 'customer_status', title: 'Status', align: 'left' },

        ],
        rows: [
            {
                customer_fname: props.dataset?.customer_fname,
                contact_number: props.dataset?.contact_number,
                customer_email: props.dataset?.customer_email,
                customer_nationality: props.dataset?.customer_nationality,
                // customer_profilepic: props.dataset.customer_profilepic,
                customer_address: props.dataset?.customer_address,
                customer_status: props.dataset?.customer_status,

            }
        ]
    };

    return (
        <div>
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