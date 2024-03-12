import React, { useEffect, useState, useMemo } from 'react';
import './AccountsDetails.css';
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import discountTotal from '../dcalculator';
import moment from 'moment';
import { PaymentStatusChange, getPaymentStatusById } from '../../service/api_calls';
import MaterialTable from 'material-table';
import { CCol } from '@coreui/react';


function AccountsDetails(props) {
    const [toggle, setToggle] = useState(true);

    // useMemo(() => {
    //     props.dataset
    // }, [])

    console.log(props.dataset, "Dataset data value is 1233333")

    const [dataset, setDataSet] = useState([])


    useEffect(() => {
        getPaymentStatusById(props.dataset?.oid, props.dataset?.oid, props.dataset?.pay_type, props.dataset?.pay_category).then((res) => {
            setDataSet(res.data[0])

        })

    }, [props.dataset])



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


    // const data = {
    //     columns: [
    //         // {
    //         //     title: '#ID', field: 'id', align: 'center', editable: 'never',
    //         // },
    //         {
    //             field: 'pay_status', title: 'Payment Status', editable: true, align: 'left', render: (e) => {

    //                 return (
    //                     <>
    //                         <select className='form-select required' name='delivery_status' onChange={(value) => handlePaymentStatusChange(e, value)}>
    //                             {e.del_status == "Pending" ?
    //                                 <option value="Pending" selected>Pending</option>
    //                                 :
    //                                 <option value="Pending">Pending</option>
    //                             }
    //                             {e.del_status == "Confirmed" ?
    //                                 <option value="Confirmed" selected>Confirmed</option>
    //                                 :
    //                                 <option value="Confirmed">Confirmed</option>
    //                             }
    //                         </select>
    //                     </>
    //                 )
    //             }
    //         },
    //         { field: 'pay_mode', title: 'PaymentMode', align: 'left', },
    //         { field: 'pay_type', title: 'PaymentType', align: 'left', },
    //         { field: 'receivable_amount', title: 'ReceivableAmount', align: 'left', },
    //         { field: 'paid_amount', title: 'PaidAmount', align: 'left', },
    //         { field: 'balance_amount', title: 'BalanceAmount', align: 'left', },
    //         { field: 'receivable_dead', title: 'ReceivableDeadline', align: 'left', },
    //         { field: 'payment_proof', title: 'PaymentProof', align: 'left', render: (e) => (<><button type='button' className='btn btn_payment_proof_view' onClick={() => handlePaymentProof(e)}>View Details</button></>) },


    //     ],
    //     rows: props.dataset?.map((value) => {
    //         return {
    //             id: value.MainTId,
    //             oid: value.OrderId,
    //             pay_status: value.MainPayStatus,
    //             pay_mode: value.payment_type,
    //             pay_type: value.pay_category,
    //             receivable_amount: value.ItemCurrency + parseFloat(value.TotalAmount).toFixed(2),
    //             paid_amount: value.ItemCurrency + parseFloat(value.PaidAmount).toFixed(2),
    //             balance_amount: value.ItemCurrency + parseFloat(value.BalanceAmount).toFixed(2),
    //             receivable_dead: 'N/A',
    //             payment_proof: '-',

    //         }
    //     })



    // }


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


                            {console.log(dataset, "Dataset manage data is")}
                            <CCol xs={12} sm={12} lg={12}>
                                <div className='mainContainerTables'>
                                    <div className="col-md-12 mb-4 sub_box materialTableDP">

                                        <h6 className="cardHeader">Payment Type - {dataset?.['pay_category']}</h6>
                                        {
                                            dataset?.['pay_category'] == 'Online Transfer' ?
                                                <>

                                                    <table class="table">
                                                        <thead className="thead-dark">
                                                            <tr>
                                                                <th scope="col">Reference No</th>
                                                                <th scope="col">Reference E-mail</th>
                                                                <th scope="col">Reference Image</th>
                                                                <th scope="col">Checkout Date</th>
                                                            </tr>
                                                        </thead>

                                                        {console.log(dataset, "DataSet data is ")}
                                                        <tbody>
                                                            <tr>
                                                                <td><b>{dataset['reference_no']}</b></td>
                                                                <td>{dataset['reference_email']}</td>
                                                                <td><a target="_blank" href={'https://gateway.aahaas.com/' + dataset['reference_Image']}>
                                                                    <img src={'https://gateway.aahaas.com/' + dataset['reference_Image']} width="150"
                                                                        height="150"
                                                                        style={{ objectFit: 'cover' }} />
                                                                </a></td>
                                                                <td>{dataset['checkout_date']}</td>
                                                            </tr>

                                                        </tbody>
                                                    </table>


                                                </>
                                                :
                                                dataset?.['pay_category'] == 'Card Payment' ?
                                                    <>
                                                        <table className='table table-bordered table__PayentProf'>
                                                            <thead>
                                                                <tr>
                                                                    <th scope="col">Payment Status</th>
                                                                    <th scope="col">Payment Result</th>
                                                                    <th scope="col">Transaction Token</th>
                                                                    <th scope="col">Authentication Status</th>
                                                                    <th scope="col">Checkout Date</th>

                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    {
                                                                        dataset['result'] == 'SUCCESS' ?
                                                                            <td className='status_success'>{dataset['result']}</td>
                                                                            :
                                                                            <td>{dataset['result']}</td>
                                                                    }
                                                                    <td>{dataset['trans_token']}</td>
                                                                    <td>{dataset['auth_status']}</td>
                                                                    <td>{dataset['checkout_date']}</td>
                                                                </tr>

                                                            </tbody>

                                                        </table>
                                                    </>
                                                    :
                                                    null
                                        }

                                    </div>
                                </div>
                            </CCol>
                        </div>
                    )
                }
            </div>


        </>
    )
}

export default AccountsDetails