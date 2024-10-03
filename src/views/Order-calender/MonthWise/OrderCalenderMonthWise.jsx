import { useEffect, useState } from "react";
import './OrderCalenderMonthWise.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';


const OrderCalenderMonthWise = ({ orders = [] }) => {

    const getLastDayOfMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate(); // Gets the last day of the month
    };

    // Get orders for a specific day
    const getOrdersForDay = (day, month, year) => {
        const formattedDate = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        return orders.filter(order => order.date === formattedDate);
    };

    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [daysInMonth, setDaysInMonth] = useState([]);

    // Dynamically calculate days in the current month
    useEffect(() => {
        const days = Array.from({ length: getLastDayOfMonth(selectedYear, selectedMonth) }, (_, i) => i + 1);
        setDaysInMonth(days);
    }, [selectedMonth, selectedYear]);

    // Change month function (optional)
    const handleMonthChange = (data) => {
        setSelectedMonth(parseInt(data, 10));
    };

    const incrementYear = () => {
        setSelectedYear(prevYear => prevYear + 1);
    };

    const decrementYear = () => {
        setSelectedYear(prevYear => prevYear - 1);
    };

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
        <div>
            <div className="col-12 d-flex align-items-center justify-content-between mb-3 px-0 border-bottom pb-2">
                <FontAwesomeIcon icon={faChevronLeft} onClick={decrementYear} />
                <h6 className="m-0 p-0">{months[selectedMonth]} - {selectedYear}</h6>
                <FontAwesomeIcon icon={faChevronRight} onClick={incrementYear} />
            </div>
            <div className="col-12 d-flex align-items-center justify-content-between mb-3 px-3">
                {
                    months.map((value, key) => (
                        <button onClick={() => handleMonthChange(key)} style={{ fontSize: 11, color: 'white', fontStyle: 'italic', textTransform: 'uppercase' }} className={value === months[selectedMonth] ? 'btn btn-primary' : 'btn btn-secondary'}>{value}</button>
                    ))
                }
            </div>
            <div className="month-wise-order-details-main-container">
                {daysInMonth.map(day => (
                    <div key={day} className="monthwiseorder-daywise">
                        <h6> {months[selectedMonth].slice(0, 3)} {day}</h6>
                        {
                            getOrdersForDay(day, selectedMonth, selectedYear).map((order, key) => (
                                key < 3 &&
                                <p key={order.id} className="monthwise-order-summary">
                                    {order.title} - {order.items.join(', ')} to: {order.serviceLocation} | on: {order.time}
                                </p>
                            ))
                        }
                        {
                            getOrdersForDay(day, selectedMonth, selectedYear).length >= 3 ? <button className="monthwise-order-summary-viewmore">View more</button>
                                : getOrdersForDay(day, selectedMonth, selectedYear).length == 0 ? <span>No order for the day</span>
                                    : null
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}

export default OrderCalenderMonthWise;