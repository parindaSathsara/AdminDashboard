import { CButton, CCol, CDropdown, CDropdownDivider, CDropdownItem, CDropdownMenu, CDropdownToggle, CFormCheck, CRow, CWidgetStatsA, CWidgetStatsB, CWidgetStatsC, CWidgetStatsD } from "@coreui/react";
import { useEffect, useState } from "react";
import AccountsDetails from "src/Panels/AccountsDetails/AccountsDetails";
import OrderDetails from "src/Panels/OrderDetails/OrderDetails";
import ProductDetails from "src/Panels/ProductDetails/ProductDetails";
import { getDashboardOrdersIdWise, getPaymentStatusById } from "src/service/api_calls";

function OrderDetailsAccounts(props) {
    const [paymentDataSet, setPaymentDataSet] = useState([])
    const [dataset, setDataset] = useState([])
    const [detailedData, setDetailedData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setPaymentDataSet(props.paymentDataSet)
        
        // Fetch detailed data for this specific order
        const fetchDetailedData = async () => {
            try {
                setLoading(true)
                const detailedOrderData = await getDashboardOrdersIdWise(props.orderid)
                setDetailedData(detailedOrderData)
            } catch (error) {
                console.error("Error fetching detailed order data:", error)
            } finally {
                setLoading(false)
            }
        }
        
        if (props.orderid) {
            fetchDetailedData()
        }

        // getPaymentStatusById(props.paymentDataSet?.id, props.paymentDataSet?.OrderId, props.paymentDataSet?.payment_type, props.paymentDataSet?.pay_category).then((res) => {
        //     setDataset(res.data[0])
        //     // console.log("Res Data set  value is", res.data[0])
        // })
    }, [props.paymentDataSet, props.orderid])

    const calculateValues = () => {
        // Get discount amount DIRECTLY from backend response
        const discountAmount = detailedData?.lifestyleData?.[0]?.discount_amount || 
                              detailedData?.essNEssData?.[0]?.discount_amount || 
                              detailedData?.hotelData?.[0]?.discount_amount || 0;

        const totalAmount = parseFloat(paymentDataSet.total_amount) || 0;
        const paidAmount = parseFloat(paymentDataSet.paid_amount) || 0;
        const balanceAmount = parseFloat(paymentDataSet.balance_amount) || 0;
        const deliveryCharge = parseFloat(paymentDataSet.delivery_charge) || 0;
        
        return {
            paidAmount,
            discountAmount: Number(discountAmount) || 0, // Ensure it's a number
            totalAmount,
            balanceAmount,
            deliveryCharge
        }
    }

    const values = calculateValues()

    return (
        <div className="orderDetailsMainContainer">
            <CRow>
                <CCol xs={12} sm={6} lg={3}>
                    <CWidgetStatsC
                        className="mb-4"
                        text="Total order amount before any discounts"
                        progress={{ color: 'info', value: 100 }}
                        title="Total Amount"
                        value={paymentDataSet.ItemCurrency + " " + values.totalAmount.toFixed(2)}
                    />
                </CCol>
                <CCol xs={12} sm={6} lg={3}>
                    <CWidgetStatsC
                        className="mb-4"
                        title="Paid Amount"
                        progress={{ color: 'success', value: values.totalAmount > 0 ? (values.paidAmount / values.totalAmount) * 100 : 0 }}
                        text="Amount paid after discounts applied"
                        value={paymentDataSet.ItemCurrency + " " + values.paidAmount.toFixed(2)}
                    />
                </CCol>
                <CCol xs={12} sm={6} lg={3}>
                    <CWidgetStatsC
                        className="mb-4"
                        value={paymentDataSet.ItemCurrency + " " + values.balanceAmount.toFixed(2)}
                        title="Balance Amount"
                        progress={{ color: 'warning', value: values.totalAmount > 0 ? (values.balanceAmount / values.totalAmount) * 100 : 0 }}
                        text="Remaining amount to be paid"
                    />
                </CCol>
                <CCol xs={12} sm={6} lg={3}>
                    <CWidgetStatsC
                        className="mb-4"
                        value={paymentDataSet.ItemCurrency + " " + values.deliveryCharge.toFixed(2)}
                        title="Delivery Charge"
                        progress={{ color: 'warning', value: values.totalAmount > 0 ? (values.deliveryCharge / values.totalAmount) * 100 : 0 }}
                        text="Delivery or service charge"
                    />
                </CCol>
            </CRow>

            {values.discountAmount > 0 && (
                <CRow>
                    <CCol xs={12}>
                        <div className="alert alert-info">
                            <strong>Discount Applied:</strong> {paymentDataSet.ItemCurrency} {values.discountAmount.toFixed(2)} 
                            ({values.totalAmount > 0 ? ((values.discountAmount / values.totalAmount) * 100).toFixed(2) : 0}% off)
                        </div>
                    </CCol>
                </CRow>
            )}

            <div className='mainContainerTables'>
                <AccountsDetails pnlType={"orders"} dataset={props?.paymentDataSet} orderid={props.orderid} relord={() => reload()} />
                
                <div className="col-md-12 mb-4 sub_box materialTableDP">
                    <OrderDetails 
                        dataset={props?.paymentDataSet} 
                        orderid={props.orderid} 
                        orderData={props?.paymentDataSet} 
                        hideStatus={false} 
                        accounts 
                    />
                </div>
            </div>
        


            {/* <CRow>
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
            </CRow> */}



        </div>



    )
}

export default OrderDetailsAccounts;
