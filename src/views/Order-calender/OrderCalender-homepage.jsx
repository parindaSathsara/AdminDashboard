import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';

import 'react-calendar/dist/Calendar.css';
import './OrderCalenderhomepage.css';
import moment from 'moment';
import OrderCalenderMonthWise from './MonthWise/OrderCalenderMonthWise';
import axios from 'axios';
import testing from './testing';

function OrderCalenderhomepage() {

    const timeSlots = [...Array(24).keys()];

    const [orderLoading, setOrderLoading] = useState(true);
    const [orders, setOrders] = useState([]);

    const [selectedDate, setSelectedDate] = useState(null);
    const [showTimeline, setShowTimeline] = useState(false);
    const [ordersForDate, setordersForDate] = useState([]);

    const getMeetingsForDate = (date) => {
        let formattedDate = moment(date).format('YYYY-MM-DD');
        let response = orders[formattedDate].length
        return response;
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setShowTimeline(true);
    };

    const formatTime = (hour) => {
        return `${hour}:00 ${hour < 12 ? 'AM' : 'PM'}`;
    };

    const getOrderForSelectedDate = (selectedDate) => {
        let chooseDate = moment(selectedDate).format('YYYY-MM-DD');
        const response = orders[chooseDate] || [];
        setordersForDate(response); 
    }

    useEffect(() => {
        if (showTimeline) {
            getOrderForSelectedDate(selectedDate)
        }
    }, [selectedDate, showTimeline]);

    const getAllOrderData = async () => {
        let result = []
        await axios.get('/order-calendar').then((response) => {
            if (response.status === 200) {
                result = response.data.data;
                setOrderLoading(false);
            }
        });
        return result;
    }

    const getResetData = async () => {
        setOrderLoading(true);
        let response = await getAllOrderData();
        setOrders(response);
    }

    useEffect(() => {
        let response = testing();
        console.log(response);
        getResetData();
    }, []);

    return (
        <div className='container-fluid OrderCalenderhomepage-home-container row'>
            {
                orderLoading ?
                    <div>
                        loading...
                    </div> :
                    <>
                        <div className='col-3 d-flex flex-column gap-2 align-items-center'>
                            <Calendar
                                onChange={handleDateChange}
                                value={selectedDate}
                                tileContent={({ date, view }) => {
                                    const dayMeetings = getMeetingsForDate(date);
                                    return view === 'month' && dayMeetings > 0 ? (
                                        <div className="meeting-count">
                                            {dayMeetings} {dayMeetings > 1 ? 'ods' : 'od'}
                                        </div>
                                    ) : null;
                                }}
                            />
                            {showTimeline && selectedDate && (
                                <div className='orders-table'>
                                    <h6 className='m-0 p-0 pt-2'>Orders on {selectedDate.toDateString()}</h6>
                                    <p className='m-0 p-0 border-bottom pb-2 mb-3'>Time & Orders</p>
                                    <div className='order-timeline'>
                                        {timeSlots.map((hour) => (
                                            <div key={hour}>
                                                {ordersForDate.filter(order => {
                                                    // Extract hour and minute from order.time
                                                    const [time, period] = order.time.split(' ');
                                                    let [orderHour, orderMinute] = time.split(':');

                                                    // Convert to 24-hour format if necessary
                                                    if (period === 'PM' && orderHour !== '12') {
                                                        orderHour = parseInt(orderHour, 10) + 12; // Convert PM hour
                                                    }
                                                    if (period === 'AM' && orderHour === '12') {
                                                        orderHour = 0; // Midnight case (12 AM -> 0)
                                                    }

                                                    return parseInt(orderHour, 10) === hour;
                                                }).map(order => (
                                                    <div key={order.id} className='mb-3'>
                                                        <div className='order-timeline-time'>
                                                            <span></span>
                                                            <h6>{formatTime(hour)}</h6>
                                                        </div>
                                                        <div className='order-details'>
                                                            <strong>{order.title}</strong> - {order.items.join(', ')} <br />
                                                            <small>Location: {order.serviceLocation}</small>
                                                            <span>View more</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className='col-9'>
                            {/* <OrderCalenderMonthWise orders={orders} /> */}
                        </div>
                    </>
            }
        </div>
    )
}

export default OrderCalenderhomepage;