import React, { useEffect, useState, useMemo } from 'react';
import './AccountsDetails.css';
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import discountTotal from '../dcalculator';
import moment from 'moment';
import { PaymentStatusChange } from '../../service/api_calls';
import MaterialTable from 'material-table';


function AccountsDetails(props) {
    const [toggle, setToggle] = useState(true);

    // useMemo(() => {
    //     props.dataset
    // }, [])



    function generateRandom() {
        var length = 8,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    }

    const handlePaymentProof = async (e) => {

        await props.paymentproof(e)
    }

    const handlePaymentStatusChange = (e, val) => {
        console.log(val.target.value)

        var user = sessionStorage.getItem('user');
        var username = JSON.parse(user)
        var active_user = username.name;

        if (window.confirm('Are you sure to change payment status?')) {
            PaymentStatusChange(e.oid, val.target.value, active_user)
        }

        // updateDeliveryStatus(e.row.id, val.target.value, e.row.category)

        // props.relord();
    }

    const columns = [
        // { field: 'order', headerName: 'Payment Status', align: 'center', },
        {
            field: 'pay_status', headerName: 'Payment Status', editable: true, align: 'left', renderEditCell: (e) => {
                return (
                    <>
                        <select className='form-select required' name='pay_status' onChange={(value) => handlePaymentStatusChange(e, value)}>
                            <option value="">--</option>
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                        </select>
                    </>
                )
            }
        },
        { field: 'pay_mode', headerName: 'PaymentMode', align: 'left', },
        { field: 'pay_type', headerName: 'PaymentType', align: 'left', },
        { field: 'receivable_amount', headerName: 'ReceivableAmount', align: 'left', },
        { field: 'paid_amount', headerName: 'PaidAmount', align: 'left', },
        { field: 'balance_amount', headerName: 'BalanceAmount', align: 'left', },
        { field: 'receivable_dead', headerName: 'ReceivableDeadline', align: 'left', },
        { field: 'payment_proof', headerName: 'PaymentProof', align: 'left', renderCell: (e) => (<><button type='button' className='btn btn_payment_proof_view' onClick={() => handlePaymentProof(e)}>View Details</button></>) },
    ]

    const rows = {
        data: props.dataset?.filter(id => id.OrderId == props.orderid)?.map((value) => {
            return {
                id: value.MainTId,
                oid: value.OrderId,
                pay_status: value.MainPayStatus,
                pay_mode: value.payment_type,
                pay_type: value.pay_category,
                receivable_amount: value.ItemCurrency + parseFloat(value.TotalAmount).toFixed(2),
                paid_amount: value.ItemCurrency + parseFloat(value.PaidAmount).toFixed(2),
                balance_amount: value.ItemCurrency + parseFloat(value.BalanceAmount).toFixed(2),
                receivable_dead: 'N/A',
                payment_proof: '-',

            }
        })
    }


    const data = {
        columns: [
            // {
            //     title: '#ID', field: 'id', align: 'center', editable: 'never',
            // },
            {
                field: 'pay_status', title: 'Payment Status', editable: true, align: 'left', render: (e) => {

                    return (
                        <>
                            <select className='form-select required' name='delivery_status' onChange={(value) => handlePaymentStatusChange(e, value)}>
                                {e.del_status == "Pending" ?
                                    <option value="Pending" selected>Pending</option>
                                    :
                                    <option value="Pending">Pending</option>
                                }
                                {e.del_status == "Confirmed" ?
                                    <option value="Confirmed" selected>Confirmed</option>
                                    :
                                    <option value="Confirmed">Confirmed</option>
                                }
                            </select>
                        </>
                    )
                }
            },
            { field: 'pay_mode', title: 'PaymentMode', align: 'left', },
            { field: 'pay_type', title: 'PaymentType', align: 'left', },
            { field: 'receivable_amount', title: 'ReceivableAmount', align: 'left', },
            { field: 'paid_amount', title: 'PaidAmount', align: 'left', },
            { field: 'balance_amount', title: 'BalanceAmount', align: 'left', },
            { field: 'receivable_dead', title: 'ReceivableDeadline', align: 'left', },
            { field: 'payment_proof', title: 'PaymentProof', align: 'left', render: (e) => (<><button type='button' className='btn btn_payment_proof_view' onClick={() => handlePaymentProof(e)}>View Details</button></>) },


        ],
        rows: props.dataset?.map((value) => {
            return {
                id: value.MainTId,
                oid: value.OrderId,
                pay_status: value.MainPayStatus,
                pay_mode: value.payment_type,
                pay_type: value.pay_category,
                receivable_amount: value.ItemCurrency + parseFloat(value.TotalAmount).toFixed(2),
                paid_amount: value.ItemCurrency + parseFloat(value.PaidAmount).toFixed(2),
                balance_amount: value.ItemCurrency + parseFloat(value.BalanceAmount).toFixed(2),
                receivable_dead: 'N/A',
                payment_proof: '-',

            }
        })
    }


    return (
        <>
            <div className='confirmation_container'>
                {/* <div className='expand_bar'>
                    <button type='button' className='btn confirm_details_title mx-2 btn_expand btn-sm' id='btn_expand' onClick={() => setToggle(!toggle)} >Accounts Details {toggle == true ? <i class="bi bi-dash-lg"></i> : <i className="bi bi-plus-lg"></i>}</button>
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

         
        </>
    )
}

export default AccountsDetails