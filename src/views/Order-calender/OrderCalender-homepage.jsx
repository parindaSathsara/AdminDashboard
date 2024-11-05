import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';

import 'react-calendar/dist/Calendar.css';
import './OrderCalenderhomepage.css';
import moment from 'moment';
import OrderCalenderMonthWise from './MonthWise/OrderCalenderMonthWise';
import axios from 'axios';

function OrderCalenderhomepage() {

    const [orderLoading, setOrderLoading] = useState(true);
    const [orders, setOrders] = useState([]);

    const [selectedDate, setSelectedDate] = useState();
    const [showTimeline, setShowTimeline] = useState(false);
    const [ordersForDate, setordersForDate] = useState([]);

    const getMeetingsForDate = (date) => {
        let formattedDate = moment(date).format('YYYY-MM-DD');
        let response = orders[formattedDate];
        return response === undefined ? 0 : orders[formattedDate].length;
    };

    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // Keep
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const getAllOrderData = async () => {
        let result = []
        let getMonth = Number(currentMonth) + Number(1);
        await axios.get(`/order-calendar/${currentYear}/${getMonth}`).then((response) => {
            if (response.status === 200 && response.data.status === "success") {
                result = response.data.data;
            } else {
                result = [];
            }
        });
        setOrderLoading(false);
        return result;
    }

    const getResetData = async () => {
        setOrderLoading(true);
        let response = await getAllOrderData();
        setOrders(response);
    }

    const handleMonthChange = ({ activeStartDate }) => {
        setCurrentMonth(activeStartDate.getMonth());
        setCurrentYear(activeStartDate.getFullYear());
    };

    useEffect(() => {
        getResetData();
    }, [currentMonth, currentYear]);

    const getOrderForSelectedDate = (selectedDate) => {
        let chooseDate = moment(selectedDate).format('YYYY-MM-DD');
        const response = orders[chooseDate] || [];
        setordersForDate(response);
    }

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setShowTimeline(true);
    };

    useEffect(() => {
        if (showTimeline) {
            getOrderForSelectedDate(selectedDate)
        }
    }, [selectedDate, showTimeline]);

    useEffect(() => {
        handleDateChange(new Date())
    }, [orders])

    return (
        <div className='container-fluid OrderCalenderhomepage-home-container row'>
            <div className='col-3 d-flex flex-column gap-2 align-items-center'>
                <Calendar
                    onChange={handleDateChange}
                    value={selectedDate}
                    onActiveStartDateChange={handleMonthChange}
                    tileContent={({ date, view }) => {
                        const dayMeetings = getMeetingsForDate(date);
                        return view === 'month' && dayMeetings > 0 ? (
                            <div className="meeting-count">
                                {dayMeetings} {dayMeetings > 1 ? 'ods' : 'od'}
                            </div>
                        ) : null;
                    }}
                />
                {!orderLoading && selectedDate && (
                    <div className='orders-table'>
                        <h6 className='m-0 p-0 pt-2'>Orders on {selectedDate.toDateString()}</h6>
                        <p className='m-0 p-0 border-bottom pb-2 mb-3'>Time & Orders</p>
                        <div className='order-timeline'>
                            {ordersForDate.map((order, key) => (
                                <div key={key} className='mb-3'>
                                    <div className='order-timeline-time'>
                                        <span></span>
                                        <h6>{(order.product_name)}</h6>
                                    </div>
                                    <div className='order-details'>
                                        <small>Serivce Location: {order.service_location} at {order.time_slot}</small>
                                        <span>View more</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className='col-9'>
                <OrderCalenderMonthWise orders={orders} currentMonth={currentMonth} currentYear={currentYear} />
            </div>
        </div>
    )
}

export default OrderCalenderhomepage;