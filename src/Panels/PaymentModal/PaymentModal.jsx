import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { getPaymentStatusById } from '../../service/api_calls';
import toggler from './toggle';
import './min.css';

function PaymentModal(props) {

    const [dataset, setDataset] = useState([])

    // console.log(props.dataset)

    useEffect(() => {
        toggler();
        if (props.dataset.length != 0) {
            getPaymentStatusById(props?.dataset?.id, props?.dataset?.oid, props?.dataset?.pay_mode, props?.dataset?.pay_type).then((res) => {
                setDataset(res.data[0])
            })
        }
    }, [props.dataset])

    return (
        <div>
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Payment Proof
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        dataset?.['pay_category'] == 'Online Transfer' ?
                            <>
                                <table className='table table-bordered table__PayentProf'>
                                    <tr>
                                        <td>Order No</td>
                                        <td>#{dataset['checkout_id']}</td>
                                    </tr>
                                    <tr>
                                        <td>Reference No</td>
                                        <td><b>{dataset['reference_no']}</b></td>
                                    </tr>
                                    <tr>
                                        <td>Reference E-mail</td>
                                        <td>{dataset['reference_email']}</td>
                                    </tr>
                                    <tr>
                                        <td>Reference Image</td>
                                        <td>
                                            <img src={'https://api.aahaas.com/' + dataset['reference_Image']} width="200" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Checkout Date</td>
                                        <td>{dataset['checkout_date']}</td>
                                    </tr>

                                </table>
                            </>
                            :
                            dataset?.['pay_category'] == 'Card Payment' ?
                                <>
                                    <table className='table table-bordered table__PayentProf'>
                                        <tr>
                                            <td>Payment Status</td>
                                            <td>{dataset['payment_status']}</td>
                                        </tr>
                                        <tr>
                                            <td>Payment Result</td>
                                            {
                                                dataset['result'] == 'SUCCESS' ?
                                                    <td className='status_success'>{dataset['result']}</td>
                                                    :
                                                    <td>{dataset['result']}</td>
                                            }
                                        </tr>
                                        <tr>
                                            <td>Transaction Token</td>
                                            <td>{dataset['trans_token']}</td>
                                        </tr>
                                        <tr>
                                            <td>Authentication Status</td>
                                            <td>{dataset['auth_status']}</td>
                                        </tr>
                                        {/* <tr>
                                            <td>Transaction Time</td>
                                            <td>{dataset['created_at']}</td>
                                        </tr> */}
                                        <tr>
                                            <td>Checkout Date</td>
                                            <td>{dataset['checkout_date']}</td>
                                        </tr>
                                    </table>
                                </>
                                :
                                null
                    }

                    {/* <table className='table table-bordered'>
                        <tr>
                            <td>Payment Status</td>
                            <td>SUCCESS</td>
                        </tr>
                        <tr>
                            <td>Reference No</td>
                            <td>SUCCESS</td>
                        </tr>
                        <tr>
                            <td>Reference E-mail</td>
                            <td>SUCCESS</td>
                        </tr>
                        <tr>
                            <td>Reference Image</td>
                            <td>SUCCESS</td>
                            <td>
                                Img
                            </td>
                        </tr>
                        <tr>
                            <td>Authentication Status</td>
                            <td>SUCCESS</td>
                        </tr>
                        <tr>
                            <td>Transaction Token</td>
                            <td>ABCDS</td>
                        </tr>
                        <tr>
                            <td>Payment Time</td>
                            <td>22:10</td>
                        </tr>
                    </table> */}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default PaymentModal