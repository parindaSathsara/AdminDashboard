import React, { useEffect, useState } from 'react';
import './SupDetails.css';
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import discountTotal from '../dcalculator';
import moment from 'moment';
import MaterialTable from 'material-table';

function SupDetails(props) {

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


    const columns = [
        { field: 'sup_contact', headerName: 'Sup.Contact', align: 'left', },
        { field: 'sup_voucher', headerName: 'Sup.Voucher', align: 'left', },
        { field: 'sup_pay_status', headerName: 'Sup.PayStatus', align: 'left', },
        { field: 'sup_pay_mode', headerName: 'Sup.PayMode', align: 'left', },
        { field: 'sup_pay_amount', headerName: 'Sup.PayAmount', align: 'left', },
    ]

    const rows = {
        data: props.dataset?.filter(id => id.OrderId == props.orderid)?.map((value) => {
            return {
                sup_contact: '-',
                sup_voucher: '-',
                sup_pay_status: '-',
                sup_pay_mode: '-',
                sup_pay_amount: '-',

            }
        })
    }

    const data = {
        columns: [
            // {
            //     title: '#ID', field: 'id', align: 'center', editable: 'never',
            // },
            { field: 'sup_contact', title: 'Sup.Contact', align: 'left', },
            { field: 'sup_voucher', title: 'Sup.Voucher', align: 'left', },
            { field: 'sup_pay_status', title: 'Sup.PayStatus', align: 'left', },
            { field: 'sup_pay_mode', title: 'Sup.PayMode', align: 'left', },
            { field: 'sup_pay_amount', title: 'Sup.PayAmount', align: 'left', },

        ],
        rows: props.dataset?.map((value) => {
            return {
                sup_contact: '-',
                sup_voucher: '-',
                sup_pay_status: '-',
                sup_pay_mode: '-',
                sup_pay_amount: '-',

            }
        })
    }

    return (
        <div>
            <div className='confirmation_container '>
                {/* <div className='expand_bar'>
                    <button type='button' className='btn confirm_details_title mx-2 btn_expand btn-sm' id='btn_expand' onClick={() => setToggle(!toggle)} >Supplier Details {toggle == true ? <i class="bi bi-dash-lg"></i> : <i className="bi bi-plus-lg"></i>}</button>
                </div> */}

                {
                    toggle && (

                        <div className="confirmation_table mt-3 mb-2" id='confirmation_table'>
                            {/* <DataGrid
                                rows={rows.data}
                                columns={columns}
                                encodeHtml={false}
                                getRowClassName={(e) => `type_class${e.row.product_type}`}
                                getRowId={(row) => generateRandom()}
                                pageSizeOptions={[5]}
                                rowHeight={30}
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
                                    rowStyle: { fontSize: "12px", width: "100%", color: "#000" },
                                    editCellStyle: { width: "100%" },
                                    headerStyle: { fontSize: "13px", backgroundColor: '#D8EFFF' }

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

export default SupDetails