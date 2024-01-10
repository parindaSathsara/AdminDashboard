/* eslint-disable */

import React, { useEffect, useState } from 'react'

import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
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
import loogo from '/Users/Temp 1/Documents/Admin/AdminDashboard/src/assets/brand/logo.png';


const AccountSystem = () => {





  const defaultMaterialTheme = createTheme();
  // const [orderData, setOrderData] = useState([])

  const [data, setData] = useState({ rows: [] });

  // useEffect(() => {
  //   fetch('url')
  //     .then(response => {
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }
  //       return response.json();
  //     })
  //     .then(data => {

  //     })
  //     .catch(error => console.error('Error fetching data:', error));
  // }, []);





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
                  <ProductDetails dataset={orderDataIDWise} orderid={e.oid} />
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
  )
}

export default AccountSystem
