import React, { useEffect, useState, useMemo, useCallback } from 'react';
import './EmailPreview.css';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { getCustomerVoucherData, getDataEmailPrev } from '../../../service/api_calls';
import moment from 'moment';

function EmailPreview(props) {

    const [data, setData] = useState([])
    const [customerVoucher, setCustomerVoucher] = useState([]);

    // console.log(customerVoucher)

    const fetchEmailPrev = () => {

        if (props.vouchertype == 'Hotel') {

            getDataEmailPrev(props.type.resevation_no).then((res) => {
                setData(res);
            })
        }
        if (props.vouchertype == 'Customer') {
            getCustomerVoucherData(props.refid).then((res) => {
                setCustomerVoucher(res);
            })
        }
    }

    const HotelNightdays = (date_1, date_2) => {
        let date1 = new Date(date_1)
        let date2 = new Date(date_2)

        let difference = date2.getTime() - date1.getTime();
        let totalDays = Math.ceil(difference / (1000 * 3600 * 24))

        return totalDays;
    }

    useMemo(() => {
        fetchEmailPrev();
    }, [])

    useEffect(() => {
        fetchEmailPrev();
    }, [props])

    return (
        <div>
            <Modal
                {...props}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Preview Email
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <div className="email_prev_container">
                        <div className="prev_top_box">
                            <div className="brand-img">
                                <p>Brand</p>
                            </div>

                            {
                                props.vouchertype === 'Hotel' ?
                                    <div className="prev-invoice-data">
                                        <p className="invoice-text">Invoice #: {data.resevation_no}</p>
                                        <p className="invoice-text">Reservation No #: {data.resevation_no}</p>
                                        <p className="invoice-text">Status #: <span className="invoice-inner-text">Confirmation</span></p>
                                        <p className="invoice-text">Created: {data.resevation_date}</p>
                                        <p className="invoice-text">Client: {data.resevation_name}</p>
                                    </div>
                                    :
                                    <div className="prev-invoice-data">
                                        <p className="invoice-text">Invoice #: {props.refid}</p>
                                        <p className="invoice-text">Reservation No #: {props.refid}</p>
                                        <p className="invoice-text">Status #: <span className="invoice-inner-text">Confirmation</span></p>
                                        <p className="invoice-text">Created: {customerVoucher.orderDate}</p>
                                        <p className="invoice-text">Client: {customerVoucher?.userref?.customer_fname}</p>
                                    </div>
                            }

                        </div>

                        {
                            props.vouchertype === 'Hotel' ?
                                <div className="table_info_box mt-5">
                                    <div className="email_prev_container">

                                        <div className="prev_mid_box">
                                            <div className="address_box">
                                                <p className="address-box-text">No 148,</p>
                                                <p className="address-box-text">Aluthmawathe Road,</p>
                                                <p className="address-box-text">Colombo 15</p>
                                            </div>

                                            <div className="room_info_box">
                                                <span className="box-header">ROOM INFO:</span>
                                                <p className="room-info-text">Check-in: {data.checkin_date}</p>
                                                <p className="room-info-text">Check-out: {data.checkout_time}</p>
                                                <p className="room-info-text">Category: Delux</p>
                                                <p className="room-info-text">Meal: {data.board_code}</p>
                                                <p className="room-info-text">Night(s): {data.nights}</p>
                                            </div>

                                            <div className="pax_info_box">
                                                <span className="box-header">PAX DETAILS:</span>
                                                <p className="pax-info-text">Adults: {data.no_of_adults}</p>
                                                <p className="pax-info-text">CWB: </p>
                                                <p className="pax-info-text">CNB: </p>
                                            </div>

                                            <div className="hotel_info_box">
                                                <p className="hotel-info-text">{data.ResHotelName}</p>
                                            </div>
                                        </div>

                                        <div className="table_info_box mt-5">
                                            <table className="table">
                                                <thead className='table-dark'>
                                                    <tr>
                                                        <th>Pax Type</th>
                                                        <th>Room Type</th>
                                                        <th>Room Count</th>
                                                        <th>Date</th>
                                                        <th>Rate</th>
                                                        <th>Total</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {
                                                        data?.otherdata?.map((val, idx) => {
                                                            return (
                                                                <>
                                                                    <tr>
                                                                        <td>{val.no_of_adults != 0 ? 'Adult' : 'Child'}</td>
                                                                        <td>{val.room_type}</td>
                                                                        <td>{val.no_of_rooms}</td>
                                                                        <td>{val.resevation_date}</td>
                                                                        <td>-</td>
                                                                        <td>{data.total_amount}</td>
                                                                    </tr>
                                                                </>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className="table_info_box mt-5">
                                    {
                                        customerVoucher.categories?.map((value) => {
                                            return (
                                                value === 'Essential' ?
                                                    <>
                                                        <h6>Essential/Non-Essential</h6>
                                                        <table className='table'>
                                                            <thead className='table-dark'>
                                                                <tr>
                                                                    <th>Product Title</th>
                                                                    <th>Product Desc</th>
                                                                    <th>Pref Delivery Date</th>
                                                                    <th>Delivery Address</th>
                                                                    <th>Qty</th>
                                                                    <th>Unit Price</th>
                                                                    <th>Net Price</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    customerVoucher.essData?.map((val, idx) => {
                                                                        return (
                                                                            <>
                                                                                <tr>
                                                                                    <td>{val.MainCat == 'Essential' || val.MainCat == 'Non Essential' ? val.EssNonTitle : null}</td>
                                                                                    <td>{val.MainCat == 'Essential' || val.MainCat == 'Non Essential' ? val.SKU + val.SKUUNIT : null}</td>
                                                                                    <td>{val.MainCat == 'Essential' || val.MainCat == 'Non Essential' ? val.DeliveryDate : null}</td>
                                                                                    <td>{val.MainCat == 'Essential' || val.MainCat == 'Non Essential' ? val.DeliveryAddress : null}</td>
                                                                                    <td>{val.MainCat == 'Essential' || val.MainCat == 'Non Essential' ? val.EssQuantity : null}</td>
                                                                                    <td>{val.MainCat == 'Essential' || val.MainCat == 'Non Essential' ? val.Currency + val.EachPrice : null}</td>
                                                                                    <td>{val.MainCat == 'Essential' || val.MainCat == 'Non Essential' ? val.Currency + (val.EachPrice * val.EssQuantity).toFixed(2) : null}</td>
                                                                                </tr>
                                                                            </>
                                                                        )
                                                                    })
                                                                }
                                                            </tbody>
                                                        </table>
                                                    </>
                                                    :
                                                    value === 'Lifestyle' ?
                                                        <>
                                                            <h6>Life Style</h6>
                                                            <table className='table'>
                                                                <thead className='table-dark'>
                                                                    <tr>
                                                                        <th>Product ID</th>
                                                                        <th>Product Title</th>
                                                                        <th>Event Date</th>
                                                                        <th>Start Time</th>
                                                                        <th>End Time</th>
                                                                        <th>Adult Rate</th>
                                                                        <th>Child Rate</th>
                                                                        <th>Total Price</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {
                                                                        customerVoucher.lsData?.map((val, idx) => {
                                                                            return (
                                                                                <>
                                                                                    <tr>
                                                                                        <td>{val.MainCat == 'Lifestyle' ? val.LsId : null}</td>
                                                                                        <td>{val.MainCat == 'Lifestyle' ? val.LSName : null}</td>
                                                                                        <td>{val.MainCat == 'Lifestyle' ? val.LSBookDate : null}</td>
                                                                                        <td>{val.MainCat == 'Lifestyle' ? val.LSStartEndTime.split('-')[0] : 'N/A'}</td>
                                                                                        <td>{val.MainCat == 'Lifestyle' ? val.LSStartEndTime.split('-')[1] : 'N/A'}</td>
                                                                                        <td>{val.MainCat == 'Lifestyle' ? 'Count: ' + val.LSAdultCount + 'Rate: ' + val.LSAdultRate : null}</td>
                                                                                        <td>{val.MainCat == 'Lifestyle' ? 'Count: ' + val.LSChildCount + 'Rate: ' + val.LSChildRate : null}</td>
                                                                                        <td>{val.MainCat == 'Lifestyle' ? val.TotPrice : null}</td>
                                                                                    </tr>
                                                                                </>
                                                                            )
                                                                        })
                                                                    }
                                                                </tbody>
                                                            </table>
                                                        </>
                                                        :
                                                        value === 'Education' ?
                                                            <>
                                                                <h6>Education</h6>
                                                                <table className='table'>
                                                                    <thead className='table-dark'>
                                                                        <tr>
                                                                            <th>Product ID</th>
                                                                            <th>Product Title</th>
                                                                            <th>Event Date</th>
                                                                            <th>Start Time</th>
                                                                            <th>End Time</th>
                                                                            <th>Student Type</th>
                                                                            <th>Adult Rate</th>
                                                                            <th>Child Rate</th>
                                                                            <th>Total Price</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {
                                                                            customerVoucher.eduData?.map((val, idx) => {
                                                                                return (
                                                                                    <>
                                                                                        <tr key={idx}>
                                                                                            <td>{val.MainCat == 'Education' ? val.EduId : null}</td>
                                                                                            <td>{val.MainCat == 'Education' ? val.course_name : null}</td>
                                                                                            <td>{val.MainCat == 'Education' ? val.EduStartDate : null}</td>
                                                                                            <td>{val.MainCat == 'Education' ? val.EduStartTime : null}</td>
                                                                                            <td>{val.MainCat == 'Education' ? val.EduEndTime : null}</td>
                                                                                            <td>{val.MainCat == 'Education' && val.AdultStuFee != 0.00 ? 'Adult' : 'Child'}</td>
                                                                                            <td>{val.MainCat == 'Education' && val.AdultStuFee != 0.00 ? val.Currency + val.AdultStuFee : 'N/A'}</td>
                                                                                            <td>{val.MainCat == 'Education' && val.ChildStuFee != 0.00 ? val.Currency + val.ChildStuFee : 'N/A'}</td>
                                                                                            <td>{val.MainCat == 'Education' ? val.Currency + val.TotPrice : null}</td>
                                                                                        </tr>
                                                                                    </>
                                                                                )
                                                                            })
                                                                        }
                                                                    </tbody>
                                                                </table>
                                                            </>
                                                            :
                                                            value === 'Hotels' ?
                                                                <>
                                                                    <h6>Hotels</h6>
                                                                    <table className='table'>
                                                                        <thead className='table-dark'>
                                                                            <tr>
                                                                                <th>Product ID</th>
                                                                                <th>Hotel Title</th>
                                                                                <th>Res. Date</th>
                                                                                <th>Check-in</th>
                                                                                <th>Check-out</th>
                                                                                <th>Night(s)</th>
                                                                                <th>Room Type</th>
                                                                                <th>Room Rate</th>
                                                                                <th>Total Rate</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {
                                                                                customerVoucher.hotelData?.map((val, idx) => {
                                                                                    return (
                                                                                        <>
                                                                                            <tr key={idx}>
                                                                                                <td>{val.MainCat == 'Hotels' ? val.HotelId : null}</td>
                                                                                                <td>{val.MainCat == 'Hotels' ? val.HotelName : null}</td>
                                                                                                <td>{val.MainCat == 'Hotels' ? val.HotelBookDate : null}</td>
                                                                                                <td>{val.MainCat == 'Hotels' ? val.CheckInHotel : null}</td>
                                                                                                <td>{val.MainCat == 'Hotels' ? val.CheckOutHotel : null}</td>
                                                                                                <td>{val.MainCat == 'Hotels' ? HotelNightdays(val.CheckInHotel, val.CheckOutHotel) + ' Night(s)' : null}</td>
                                                                                                <td>{val.MainCat == 'Hotels' ? val.HotelRoomType : null}</td>
                                                                                                <td>{val.MainCat == 'Hotels' ? val.TotPrice : null}</td>
                                                                                                <td>{val.MainCat == 'Hotels' ? val.TotPrice : null}</td>
                                                                                            </tr>
                                                                                        </>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </tbody>
                                                                    </table>
                                                                </>
                                                                : null
                                            )
                                        })

                                    }

                                </div>
                        }

                        <table className="table">
                            <tbody>
                                <tr>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>


                    </div>

                </Modal.Body>
                {/* <Modal.Footer>
                  <Button size='sm' variant='outline-secondary' onClick={props.onHide}>Close</Button>
                  <Button size='sm' variant='outline-secondary' onClick={handleShowImage}>Preview</Button>
                  <Button size='sm' variant='primary'>Send</Button>
              </Modal.Footer> */}
            </Modal>
        </div>
    )
}

export default EmailPreview