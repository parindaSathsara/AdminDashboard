import { CButton, CCol, CDropdown, CDropdownDivider, CDropdownItem, CDropdownMenu, CDropdownToggle, CFormCheck, CRow, CWidgetStatsA, CWidgetStatsB, CWidgetStatsC, CWidgetStatsD } from "@coreui/react";
import { useEffect, useState } from "react";
import ProductDetails from "src/Panels/ProductDetails/ProductDetails";
import { getPaymentStatusById } from "src/service/api_calls";




function OrderDetailsAccounts(props) {

    const [paymentDataSet, setPaymentDataSet] = useState([])

    const [dataset, setDataset] = useState([])

    useEffect(() => {

        setPaymentDataSet(props.paymentDataSet)

        console.log(props.paymentDataSet, "Payment Data Set")

        getPaymentStatusById(props.paymentDataSet?.id, props.paymentDataSet?.OrderId, props.paymentDataSet?.payment_type, props.paymentDataSet?.pay_category).then((res) => {
            setDataset(res.data[0])
        })



    }, [props.paymentDataSet])


    return (

        <div className="orderDetailsMainContainer">

            <CRow>
                <CCol xs={12} sm={6} lg={4}>
                    <CWidgetStatsC
                        className="mb-4"
                        text="Lorem ipsum dolor sit amet enim."
                        progress={{ color: 'info', value: 100 }}
                        title="Total Amount"
                        value={paymentDataSet.ItemCurrency + " " + paymentDataSet.total_amount}
                    />
                </CCol>
                <CCol xs={12} sm={6} lg={4}>
                    <CWidgetStatsC
                        className="mb-4"

                        title="Paid Amount"
                        progress={{ color: 'success', value: (paymentDataSet.paid_amount / paymentDataSet.total_amount) * 100 }}
                        text="Lorem ipsum dolor sit amet enim."
                        value={paymentDataSet.ItemCurrency + " " + paymentDataSet.paid_amount}
                    />
                </CCol>
                <CCol xs={12} sm={6} lg={4}>
                    <CWidgetStatsC
                        className="mb-4"
                        value={paymentDataSet.ItemCurrency + " " + paymentDataSet.balance_amount}
                        title="Balance Amount"
                        progress={{ color: 'warning', value: (paymentDataSet.balance_amount / paymentDataSet.total_amount) * 100 }}
                        text="Lorem ipsum dolor sit amet enim."
                    />
                </CCol>
            </CRow>


            <div className='mainContainerTables'>


                <div className="col-md-12 mb-4 sub_box materialTableDP">
                    <ProductDetails orderid={props.orderid} accounts />
                </div>
            </div>


            <CRow>
                <CCol xs={9} sm={9} lg={9}>
                    <div className='mainContainerTables'>
                        <div className="col-md-12 mb-4 sub_box materialTableDP">

                            <h5 className="cardHeader">Payment Type - {dataset?.['pay_category']}</h5>
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
                                            <tbody>
                                                <tr>
                                                    <td><b>{dataset['reference_no']}</b></td>
                                                    <td>{dataset['reference_email']}</td>
                                                    <td><a target="_blank" href={'https://api.aahaas.com/' + dataset['reference_Image']}>
                                                        <img src={'https://api.aahaas.com/' + dataset['reference_Image']} width="250"
                                                            height="250"
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

                <CCol xs={3} sm={3} lg={3} style={{ height: "100%" }}>
                    <div className='mainContainerTables col'>
                        <h5 className="cardHeader mb-2">Customer Details</h5>
                        <div>
                            <label className="cardHeader mb-1 cardNormalText">Name - {paymentDataSet.customer_fname}</label>
                        </div>
                        <div>
                            <label className="cardHeader mb-1 cardNormalText">Contact Number - +{paymentDataSet.contact_number}</label>
                        </div>
                        <div>
                            <label className="cardHeader mb-1 cardNormalText">Email - {paymentDataSet.customer_email}</label>
                        </div>
                        <div>
                            <label className="cardHeader mb-1 cardNormalText">Nationality - {paymentDataSet.customer_nationality}</label>
                        </div>
                    </div>
                </CCol>
            </CRow>



        </div>



    )
}

export default OrderDetailsAccounts;