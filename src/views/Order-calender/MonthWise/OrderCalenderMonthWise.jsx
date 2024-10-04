import { useEffect, useState } from "react";
import GetOrderOnTheDay from "../GetOrderOnTheDay/GetOrderOnTheDay";
import './OrderCalenderMonthWise.css';

const OrderCalenderMonthWise = ({ orders = [], currentMonth, currentYear }) => {

    const [daysInMonth, setDaysInMonth] = useState([]);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const getLastDayOfMonth = (year, month) => { return new Date(year, month + 1, 0).getDate() };
    const getDate = (day, month, year) => { return `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}` };

    useEffect(() => {
        const days = Array.from({ length: getLastDayOfMonth(currentMonth, currentYear) }, (_, i) => i + 1);
        setDaysInMonth(days);
    }, [currentMonth, currentYear]);

    return (
        <div className="month-wise-order-details-main-container">
            {daysInMonth.map(day => (
                <div key={day} className="monthwiseorder-daywise">
                    <h6> {months[currentMonth].slice(0, 3)} {day}</h6>
                    <GetOrderOnTheDay orders={orders} date={getDate(day, currentMonth, currentYear)} />
                </div>
            ))}
        </div>
    )
}

export default OrderCalenderMonthWise;