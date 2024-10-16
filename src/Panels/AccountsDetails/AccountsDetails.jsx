import React, { useEffect, useState, useMemo } from 'react';
import './AccountsDetails.css';
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import discountTotal from '../dcalculator';
import moment from 'moment';
import { PaymentStatusChange, getPaymentStatusById } from '../../service/api_calls';
import MaterialTable from 'material-table';
import { CButton, CCol } from '@coreui/react';
import { Modal } from 'react-bootstrap';
import axios from 'axios';


function AccountsDetails(props) {
    const [toggle, setToggle] = useState(true);

    // useMemo(() => {
    //     props.dataset
    // }, [])

    // console.log(props.dataset, "Dataset data value is 1233333")

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
        // console.log(val.target.value)

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

    const [pnlReportLoading, setpnlReportLoading] = useState(false);
    const [PNLVoucherView, setPNLVoucherView] = useState(false);
    const [currenctOrdeId, setCurrenctOrderId] = useState('');
    const [productPNLReport, setProductPNLReport] = useState([]);

    const handlePNLReport = async (id) => {
        setpnlReportLoading(true);
        await axios.get(`/pnl/order/${id}`).then((response) => {
            setPNLVoucherView(true);
            setCurrenctOrderId(id);
            setProductPNLReport(response.data)
            setpnlReportLoading(false);
        })
    }

    const downloadPdf = async () => {
        try {
            const response = await axios.get(`/pnl/order/${currenctOrdeId}/pdf`, {
                responseType: 'blob',
            });
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `PNL_report-OrderId-${currenctOrdeId}.pdf`;
            link.click();
        } catch (error) {
            console.error('Error downloading the PDF:', error);
        }
    };

    const handleCLosePNRLReportModal = () => {
        setPNLVoucherView(false);
        setCurrenctOrderId('');
        setProductPNLReport([]);
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
                                                                <th scope="col">PNL report</th>
                                                            </tr>
                                                        </thead>

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
                                                                <td><CButton color="info" style={{ fontSize: 16, color: 'white', marginLeft: 20, alignContent: 'center' }}
                                                                    onClick={() => handlePNLReport(dataset.checkout_id)}
                                                                // onClick={() => console.log(dataset)}
                                                                >Show PNL report</CButton></td>
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
                                                                    <th scope="col">Gateway</th>

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
                                                                    <td>{dataset['gateway_type']}</td>
                                                                    <td>{dataset['created_at']}</td>
                                                                    <td><CButton color="info" style={{ fontSize: 16, color: 'white', marginLeft: 20, alignContent: 'center' }}
                                                                        onClick={() => handlePNLReport(dataset.checkout_id)}
                                                                    // onClick={() => console.log(dataset)}
                                                                    >Show PNL report</CButton></td>
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

            <Modal show={PNLVoucherView} size="xl" onHide={handleCLosePNRLReportModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Supplier Voucher</Modal.Title>
                    {
                        (productPNLReport.status !== 'fail' && productPNLReport.message !== 'No data to display') &&
                        <CButton color="info" style={{ fontSize: 16, color: 'white', marginLeft: 20, alignContent: 'center' }} onClick={downloadPdf}>Download Voucher</CButton>
                    }
                </Modal.Header>
                <Modal.Body>
                    {
                        (productPNLReport.status === 'fail' && productPNLReport.message === 'No data to display') ?
                            <div className='d-flex flex-column align-items-center my-5'>
                                <h6>Oops! Sorry</h6>
                                <p>The product has been yet to be approved !</p>
                            </div>
                            :
                            <div dangerouslySetInnerHTML={{ __html: productPNLReport }} />
                    }
                </Modal.Body>
            </Modal>


        </>
    )
}

export default AccountsDetails