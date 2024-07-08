import React, { useState, useEffect, useMemo } from 'react';
import './MailBox.css';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import EmailPreview from './EmailPreview/EmailPreview';
import { availableHotelProducts, sendHotelConfirmationEmail, sendOrderConfirmationVoucher } from '../../service/api_calls';
import OrderVoucher from './OrderVoucher/OrderVoucher';
import $ from 'jquery';

function MailBox(props) {

    const [showModal, setShowModal] = useState(false);
    const [hotelData, setHotelData] = useState([]);
    const [data, setData] = useState('');
    const [textChange, setTextChange] = useState({
        to_email: '',
        cc_email: '',
        bcc_email: '',
        email_type: ''
    });

    const [errors, setErrors] = useState(false)

    var id = props.orderid

    // console.log(data)

    const handleShowImage = () => {
        setShowModal(true)
    }

    const handleInputChange = (e) => {
        setTextChange({ ...textChange, [e.target.name]: e.target.value });
    }

    const fetchProducts = () => {
        availableHotelProducts(props.orderid).then((res) => {
            setHotelData(res)
        })
    }

    useMemo(() => {
        fetchProducts()
    }, [])

    useEffect(() => {
        fetchProducts()
    }, [props]);

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();

        if (textChange.to_email == '' || textChange.cc_email == '' || textChange.bcc_email == '' || textChange.email_type == '') {
            setErrors(true)
        } else {
            setErrors(false)
            formData.append('to_email', textChange.to_email);
            formData.append('cc_email', textChange.cc_email);
            formData.append('bcc_email', textChange.bcc_email);
            formData.append('email_type', textChange.email_type);
            formData.append('ref_code', textChange.email_type == 'Hotel' ? data.resevation_no : props.orderid)

            // console.log(...formData);

            if (textChange.email_type == 'Hotel') {
                sendHotelConfirmationEmail(formData)
            }
            if (textChange.email_type == 'Customer') {
                sendOrderConfirmationVoucher(formData)
            }
        }


    }

    return (
        <div>
            <Modal
                {...props}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Email Send
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className='mail_box_form' id='mail_box_form'>
                        {/* <div className="form-group">
                            <label htmlFor="from_email" className="form-label fw-semibold">
                                From
                            </label>
                            <input type="email" className="form-control required mail_box_input" name='from_email' id='from_email' />
                            <small className='text-muted muted__text'>From e-mail</small>
                        </div> */}

                        <div className="form-group">
                            <label htmlFor="to_email" className="form-label fw-semibold">
                                To
                            </label>
                            <input type="email" className="form-control required mail_box_input" name='to_email' onChange={handleInputChange} id='to_email' placeholder='SEPERATE BY COMMA' />
                            {errors == true ? <><span className="error">This field is required</span> <br /></> : null}
                            <small className='text-muted muted__text'>To e-mails</small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="cc_email" className="form-label fw-semibold">
                                CC
                            </label>
                            <input type="email" className="form-control required mail_box_input" name='cc_email' onChange={handleInputChange} id='cc_email' placeholder='SEPERATE BY COMMA' />
                            {errors == true ? <><span className="error">This field is required</span> <br /></> : null}
                            <small className='text-muted muted__text'>CC e-mails</small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="bcc_email" className="form-label fw-semibold">
                                BCC
                            </label>
                            <input type="email" className="form-control required mail_box_input" name='bcc_email' onChange={handleInputChange} id='bcc_email' placeholder='SEPERATE BY COMMA' />
                            {errors == true ? <><span className="error">This field is required</span> <br /></> : null}
                            <small className='text-muted muted__text'>BCC e-mails</small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="email_type" className="form-label fw-semibold">
                                Email Type
                            </label>
                            <select className="form-select required mail_box_input" name='email_type' onChange={handleInputChange} id='email_type' >
                                <option value="">--select type--</option>
                                <option value="Hotel">Hotel Voucher</option>
                                <option value="LifeStyle">Life Style Voucher</option>
                                <option value="EssNon">Essential/Non-Essential Voucher</option>
                                <option value="Education">Education Voucher</option>
                                <option value="Customer">Customer Voucher</option>
                            </select>
                            {errors == true ? <><span className="error">This field is required</span> <br /></> : null}
                            <small className='text-muted muted__text'>Select an email type</small>
                        </div>

                        {
                            textChange.email_type == 'Hotel' ?
                                <div className="form-group mt-4">
                                    {
                                        hotelData?.map((val, idx) => {
                                            return (
                                                <div key={idx}>
                                                    <input type="radio" className='form-check-input mx-1' name='hotel_name' value={val.HotelName} onClick={(e) => setData(val)} />
                                                    <label htmlFor="" className="form-check-labe">{val.HotelName}</label><br />
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                :
                                null
                        }

                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button size='sm' variant='outline-secondary' onClick={props.onHide}>Close</Button>
                    <Button size='sm' variant='outline-secondary' onClick={handleShowImage} disabled={textChange.email_type == '' || textChange.email_type == null ? true : false}>Preview</Button>
                    <Button type='submit' size='sm' onClick={handleFormSubmit} variant='primary'>Send</Button>
                </Modal.Footer>
            </Modal>

            <EmailPreview
                show={showModal}
                onHide={() => setShowModal(false)}
                refid={id}
                dataset={hotelData}
                type={data}
                vouchertype={textChange.email_type}
            />
        </div>
    )
}

export default MailBox