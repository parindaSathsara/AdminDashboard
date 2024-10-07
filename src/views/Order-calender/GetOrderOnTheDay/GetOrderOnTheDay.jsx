import React, { useEffect, useState } from 'react'
import MoreOrderView from 'src/Panels/OrderDetails/MoreOrderView/MoreOrderView';
import OrderDetails from 'src/Panels/OrderDetails/OrderDetails';

function GetOrderOnTheDay({ orders, date }) {

    const [ordersList, setOrderList] = useState(0);

    useEffect(() => {
        let response = orders[date] || [];
        setOrderList(response);
    }, [date, orders]);

    const [moreOrderModal, setMoreOrderModal] = useState(false);
    const [moreOrderModalCategory, setMoreOrderModalCategory] = useState("");
    const [moreOrderDetails, setMoreOrderDetails] = useState("");
    const [mainDataSet, setMainDataSet] = useState([]);

    const handleMoreInfoModal = (dataset) => {
        console.log(dataset);
        setMoreOrderModalCategory(dataset.main_category_id);
        setMoreOrderDetails(dataset.sub_order_id);
        setMoreOrderModal(true);
        setMainDataSet(dataset);
    };

    const onHideModal = () => {
        setMoreOrderModal(false);
    }

    const handleUpdateState = () => {

    }

    return (
        <div>
            <MoreOrderView
                show={moreOrderModal}
                onHide={() => onHideModal()}
                preID={moreOrderDetails}
                category={moreOrderModalCategory}
                productViewData
                productViewComponent={<OrderDetails orderid={mainDataSet.order_id} orderData={mainDataSet} hideStatus={false} productViewData updatedData={() => handleUpdateState()} />}
            />
            {
                Object.entries(ordersList).map(([key, order], index) => (
                    index < 3 && (
                        <p key={index} className="monthwise-order-summary" onClick={() => handleMoreInfoModal(order)}>
                            # {order.order_id} - {order.product_name} to: {order?.service_location} | on: {order?.time_slot}
                        </p>
                    )
                ))
            }
            {
                Object.keys(ordersList).length >= 3 ? (
                    <button className="monthwise-order-summary-viewmore">View more</button>
                ) : Object.keys(ordersList).length === 0 ? (
                    <span>No order for the day</span>
                ) : null
            }
        </div>
    )
}

export default GetOrderOnTheDay