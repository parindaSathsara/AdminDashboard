import React, { useState } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CWidgetStatsB,
} from '@coreui/react'
import { DocsLink } from 'src/components'
import { Icon, ThemeProvider, createTheme } from '@mui/material'
import MaterialTable from 'material-table'


const AccountSystem = () => {
  const data = [
    { id: 1, orderSummary: 'Summary 1', orderName: 'Sprite', orderDate: '2024-01-10', status: 'Pending' },
    { id: 2, orderSummary: 'Summary 2', orderName: 'COCONUT HUSK ELEPHANT', orderDate: '2024-01-11', status: 'Completed' },
    { id: 3, orderSummary: 'Summary 3', orderName: 'Revello Milk', orderDate: '2024-03-11', status: 'refund' },
    { id: 4, orderSummary: 'Summary 4', orderName: 'Laxapana  ', orderDate: '2024-05-11', status: 'Completed' },
    { id: 5, orderSummary: 'Summary 5', orderName: 'MilkRice  ', orderDate: '2024-05-11', status: 'cancellation' },

    // Add more rows as needed
  ];

  const fields = ['id', 'orderSummary', 'orderName', 'orderDate', 'status'];

  const [activeAccordion, setActiveAccordion] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  const handleAccept = (id) => {
    // Implement logic for accepting the order with the given id
    // // console.log(`Order ${id} accepted`);
  };

  const handleDecline = (id) => {
    // Implement logic for declining the order with the given id
    // // console.log(`Order ${id} declined`);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  const handleResetFilter = () => {
    setStatusFilter(null);
  };

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  // const filteredData = statusFilter ? data.filter(item => item.status.toLowerCase() === statusFilter) : data;

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // const filteredData = data.filter(item => {
  //   const orderNameLowerCase = item.orderName.toLowerCase();
  //   const searchTermLowerCase = searchTerm.toLowerCase();
  //   return orderNameLowerCase.includes(searchTermLowerCase);
  // });

  const filteredData = data.filter((item) => {
    const orderNameLowerCase = item.orderName.toLowerCase();
    const searchTermLowerCase = searchTerm.toLowerCase();
    const statusLowerCase = statusFilter ? statusFilter.toLowerCase() : null;

    return (
      orderNameLowerCase.includes(searchTermLowerCase) &&
      (!statusLowerCase || item.status.toLowerCase() === statusLowerCase)
    );
  });

  return (
    <>

      <ThemeProvider theme={defaultMaterialTheme}>
        <MaterialTable
          title="Order Details"
          data={data.rows}
          columns={[
            { title: 'No.', field: 'No.' },
            { title: ' Order Summary', field: 'Order Summary' },
            { title: 'Order Name', field: 'Order Name' },
            { title: 'orderDate', field: 'orderDate' }, // Make sure this matches your API response key
            { title: 'Status', field: 'status' }

          ]}
          detailPanel={(e) => {
            return (
              <div className='mainContainerTables'>
                <div className="col-md-12 mb-4 sub_box materialTableDP">
                  {/* Assuming ProductDetails is a component that takes orderDataIDWise and orderid as props */}
                  <ProductDetails dataset={orderDataIDWise} orderid={e.oid} hideStatus={true} />
                </div>
              </div>
            )
          }}
          options={{
            sorting: true,
            search: true,
            // ... other options
          }}
        />
      </ThemeProvider>


      <div className="card card-body">
        <table className='table table-striped'>
          <thead>
            <tr>
              <th scope='col'>No.</th>
              <th scope='col'>Order Summary</th>
              <th scope='col'>Order Name</th>
              <th scope='col'>Order Date</th>
              <th scope='col'>Status</th>
            </tr>
          </thead>
          {/* <tbody>

            {
              allOrder.filter(id => id.checkout_id == value.OrderId).map((val) => {
                return (
                  <>
                    <tr>
                      <td>{val.MainTId}</td>
                      <td>{val.CategoryType == 'Essential' ? val.listing_title : val.CategoryType == 'Non Essential' ? val.listing_title :
                        val.CategoryType == 'Lifestyle' ? val.lifestyle_name : val.CategoryType == 'Education' ? val.course_name : val.CategoryType == 'Hotels' ? val.hotel_name : null}</td>
                      <td>{val.CategoryType}</td>
                      <td>{val.CategoryType == 'Essential' || val.CategoryType == 'Non Essential' ? val.ReqQTy : '-'}</td>
                      <td>{val.CategoryType == 'Essential' || val.CategoryType == 'Non Essential' ? CurrencyConverter(val.ItemCurrency, val.each_item_price, props.currency) : '-'}</td>
                      <td>{val.CategoryType == 'Hotels' ? val.HotelTotAmount : CurrencyConverter(val.ItemCurrency, val.total_price, props.currency)}</td>
                      <td>{val.CategoryType == 'Essential' || val.CategoryType == 'Non Essential' ? moment(val.delivery_date).add(parseInt(val.cancellationDay) + 1, 'days').format("YYYY-MM-DD") :
                        val.CategoryType == 'Lifestyle' ? moment(val.LifeStylePrefDate).add(parseInt(val.LifeStyleCancel), 'days').format("YYYY-MM-DD") : val.CategoryType == 'Hotels' ? moment(val.HotelCancelDate).format("YYYY-MM-DD") : '-'}</td>
                      <td>{val.CategoryType == 'Essential' ? val.delivery_status : val.CategoryType == 'Non Essential' ? val.delivery_status : val.CategoryType == 'Lifestyle' ? val.LifeStyleBookStatus : val.CategoryType == 'Education' ? val.EduBookStatus : val.CategoryType === 'Hotels' ? val.HotelResStatus : val.FlightBookStat}</td>

                      {
                        val.CategoryType == 'Hotels' ?
                          <>
                            <td>
                              {
                                moment(val.HotelCancelDate).format("YYYY-MM-DD") > moment().format("YYYY-MM-DD") && val.HotelResStatus !== 'CANCELLED' ?
                                  <button type="button" className='btn btn-danger btn-sm btn__OrderAction' onClick={() => handleCancelModalShow(value.OrderId, val.MainTId, 'Cancel', val.CategoryType, val.resevation_platform, val.resevation_no)}>Cancel Booking</button> : null
                              }
                            </td>
                          </> :
                          val.CategoryType == 'Essential' || val.CategoryType == 'Non Essential' ?
                            <>
                              <td>
                                {
                                  moment(val.EssPrefDelDate).add(parseInt(val.cancellationDay) + 1, 'days').format("YYYY-MM-DD") > moment().format("YYYY-MM-DD") && val.delivery_status !== 'Cancel' ?
                                    <button type="button" className='btn btn-danger btn-sm btn__OrderAction' onClick={() => handleCancelModalShow(value.OrderId, val.MainTId, 'Cancel', val.CategoryType, 'Other', 'No data')}>Cancel Item</button> : null
                                }
                              </td>
                            </> : <></>
                      }


              
                    </tr>

                  </>
                )
              })
            }

            <tr>
              <td colSpan="9" style={{ textAlign: "right" }}>
                <button className="btn btn-primary btn__SendFeedBack btn-sm" type="button" data-toggle="collapse" data-target={"#feedBackform" + index} aria-expanded="false" aria-controls={"feedBackform" + index}>
                  Send Order Feedback
                </button>
              </td>
            </tr>

          </tbody> */}

        </table>
      </div>
    </>
  );
};

export default AccountSystem;
