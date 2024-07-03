import React from 'react'
import { CCard, CCardHeader, CCardBody } from '@coreui/react'
import { DocsLink } from 'src/components'
import { Icon, ThemeProvider, createTheme } from '@mui/material'
import MaterialTable from 'material-table'
import { useState, useEffect } from 'react'
import loogo from '../../../assets/brand/aahaas.png';
import axios from 'axios'



const Typography = () => {

  const defaultMaterialTheme = createTheme();

  // const [orderData, setOrderData] = useState([])

  const [data, setData] = useState({ rows: [] });

  useEffect(() => {
    // fetch(`http://192.168.1.19:8000/api/customer_orders_count`)
    //   .then(response => {
    //     if (!response.ok) {
    //       throw new Error('Network response was not ok');
    //     }
    //     // console.log(response);
    //     return response.json();
    //   })
    //   .then(data => {
    //     setData({ rows: data });
    //     // console.log("response", data);
    //   })
    //   .catch(error => console.error('Error fetching data:', error));

    axios.get('customer_orders_count')
      .then(response => {
        // // console.log(response.data);  // Access the response data directly
        return response.data
      })
      .then(data => {
        setData({ rows: data });
        // // console.log("response", data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });

  }, []);

  // const data = {
  //   columns: [
  //     // {
  //     //     title: '#ID', field: 'id', align: 'center', editable: 'never',
  //     // },
  //     {
  //       title: 'Order Id', field: 'oid', align: 'left', editable: 'never',
  //     },
  //     {
  //       title: 'Booking Date | Time', field: 'booking_date', align: 'left', editable: 'never',
  //     },
  //     {
  //       title: 'Payment Type', field: 'pay_type', align: 'left', editable: 'never',
  //     },
  //     {
  //       title: 'Payment Category', field: 'pay_category', align: 'left', editable: 'never',
  //     },
  //     {
  //       title: 'Payment Category', field: 'pay_category', align: 'left', editable: 'never',
  //     },

  //     {
  //       title: 'Total Amount', field: 'total_amount', align: 'right', editable: 'never',
  //     },
  //     {
  //       title: 'Paid Amount', field: 'paid_amount', align: 'right', editable: 'never',
  //     },


  //     {
  //       title: 'Discount Amount', field: 'discount_amount', align: 'right', editable: 'never',
  //     },
  //     {
  //       title: 'Delivery Charge', field: 'delivery_charge', align: 'right', editable: 'never',
  //     },
  //     {
  //       title: 'Additional Information', field: 'additional_data', align: 'center', editable: 'never',
  //     },
  //     {
  //       title: 'Actions', field: 'actions', align: 'center', editable: 'never',
  //     },

  //   ],
  //   rows: orderData?.map((value, idx) => {
  //     return {
  //       // id: value.MainTId,
  //       oid: value.OrderId,
  //       booking_date: value.checkout_date,
  //       pay_type: value.payment_type,
  //       pay_category: value.pay_category,
  //       total_amount: value.ItemCurrency + " " + value.total_amount,
  //       paid_amount: value.ItemCurrency + " " + value.paid_amount,
  //       discount_amount: value.ItemCurrency + " " + value.discount_price,
  //       delivery_charge: value.ItemCurrency + " " + value.delivery_charge,
  //       additional_data: <><button className="btn btn-primary btn_aditional_data btn-sm" onClick={(e) => { handleAdditionalModal(value.OrderId) }} ><CIcon icon={cilNoteAdd} size="sm" /></button> | <button type='button' className='btn btn-info view_upload_info btn-sm' onClick={() => { handleAdditionalInfoModal(value.OrderId) }}><CIcon icon={cilViewStream} size="sm" /></button></>,

  //       actions:
  //         <div className='actions_box'>
  //           {/* <NavLink to={"/api/view_order_voucher/" + value.OrderId} target='_blank'><i className='bi bi-printer-fill'></i></NavLink> */}
  //           <button className="btn btn_actions" onClick={(e) => { handleSendMail(value.OrderId) }}><CIcon icon={cibGmail} size="lg" /></button>
  //         </div>

  //     }
  //   })
  // }
  return (
    <>
      {/* <CCard className="mb-4">
        <CCardHeader>
          Headings
          <DocsLink href="https://coreui.io/docs/content/typography/" />
        </CCardHeader>
        <CCardBody>
          <p>
            Documentation and examples for Bootstrap typography, including global settings,
            headings, body text, lists, and more.
          </p>
          <table className="table">
            <thead>
              <tr>
                <th>Heading</th>
                <th>Example</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <p>
                    <code className="highlighter-rouge">&lt;h1&gt;&lt;/h1&gt;</code>
                  </p>
                </td>
                <td>
                  <span className="h1">h1. Bootstrap heading</span>
                </td>
              </tr>
              <tr>
                <td>
                  <p>
                    <code className="highlighter-rouge">&lt;h2&gt;&lt;/h2&gt;</code>
                  </p>
                </td>
                <td>
                  <span className="h2">h2. Bootstrap heading</span>
                </td>
              </tr>
              <tr>
                <td>
                  <p>
                    <code className="highlighter-rouge">&lt;h3&gt;&lt;/h3&gt;</code>
                  </p>
                </td>
                <td>
                  <span className="h3">h3. Bootstrap heading</span>
                </td>
              </tr>
              <tr>
                <td>
                  <p>
                    <code className="highlighter-rouge">&lt;h4&gt;&lt;/h4&gt;</code>
                  </p>
                </td>
                <td>
                  <span className="h4">h4. Bootstrap heading</span>
                </td>
              </tr>
              <tr>
                <td>
                  <p>
                    <code className="highlighter-rouge">&lt;h5&gt;&lt;/h5&gt;</code>
                  </p>
                </td>
                <td>
                  <span className="h5">h5. Bootstrap heading</span>
                </td>
              </tr>
              <tr>
                <td>
                  <p>
                    <code className="highlighter-rouge">&lt;h6&gt;&lt;/h6&gt;</code>
                  </p>
                </td>
                <td>
                  <span className="h6">h6. Bootstrap heading</span>
                </td>
              </tr>
            </tbody>
          </table>
        </CCardBody>
      </CCard>
      <CCard className="mb-4">
        <CCardHeader>Headings</CCardHeader>
        <CCardBody>
          <p>
            <code className="highlighter-rouge">.h1</code> through
            <code className="highlighter-rouge">.h6</code>
            classes are also available, for when you want to match the font styling of a heading but
            cannot use the associated HTML element.
          </p>
          <div className="bd-example">
            <p className="h1">h1. Bootstrap heading</p>
            <p className="h2">h2. Bootstrap heading</p>
            <p className="h3">h3. Bootstrap heading</p>
            <p className="h4">h4. Bootstrap heading</p>
            <p className="h5">h5. Bootstrap heading</p>
            <p className="h6">h6. Bootstrap heading</p>
          </div>
        </CCardBody>
      </CCard>
      <CCard className="mb-4">
        <div className="card-header">Display headings</div>
        <div className="card-body">
          <p>
            Traditional heading elements are designed to work best in the meat of your page content.
            When you need a heading to stand out, consider using a <strong>display heading</strong>
            —a larger, slightly more opinionated heading style.
          </p>
          <div className="bd-example bd-example-type">
            <table className="table">
              <tbody>
                <tr>
                  <td>
                    <span className="display-1">Display 1</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="display-2">Display 2</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="display-3">Display 3</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="display-4">Display 4</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </CCard>
      <CCard className="mb-4">
        <CCardHeader>Inline text elements</CCardHeader>
        <CCardBody>
          <p>
            Traditional heading elements are designed to work best in the meat of your page content.
            When you need a heading to stand out, consider using a <strong>display heading</strong>
            —a larger, slightly more opinionated heading style.
          </p>
          <div className="bd-example">
            <p>
              You can use the mark tag to <mark>highlight</mark> text.
            </p>
            <p>
              <del>This line of text is meant to be treated as deleted text.</del>
            </p>
            <p>
              <s>This line of text is meant to be treated as no longer accurate.</s>
            </p>
            <p>
              <ins>This line of text is meant to be treated as an addition to the document.</ins>
            </p>
            <p>
              <u>This line of text will render as underlined</u>
            </p>
            <p>
              <small>This line of text is meant to be treated as fine print.</small>
            </p>
            <p>
              <strong>This line rendered as bold text.</strong>
            </p>
            <p>
              <em>This line rendered as italicized text.</em>
            </p>
          </div>
        </CCardBody>
      </CCard>
      <CCard className="mb-4">
        <CCardHeader>Description list alignment</CCardHeader>
        <CCardBody>
          <p>
            Align terms and descriptions horizontally by using our grid system’s predefined classes
            (or semantic mixins). For longer terms, you can optionally add a{' '}
            <code className="highlighter-rouge">.text-truncate</code> class to truncate the text
            with an ellipsis.
          </p>
          <div className="bd-example">
            <dl className="row">
              <dt className="col-sm-3">Description lists</dt>
              <dd className="col-sm-9">A description list is perfect for defining terms.</dd>

              <dt className="col-sm-3">Euismod</dt>
              <dd className="col-sm-9">
                <p>
                  Vestibulum id ligula porta felis euismod semper eget lacinia odio sem nec elit.
                </p>
                <p>Donec id elit non mi porta gravida at eget metus.</p>
              </dd>

              <dt className="col-sm-3">Malesuada porta</dt>
              <dd className="col-sm-9">Etiam porta sem malesuada magna mollis euismod.</dd>

              <dt className="col-sm-3 text-truncate">Truncated term is truncated</dt>
              <dd className="col-sm-9">
                Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut
                fermentum massa justo sit amet risus.
              </dd>

              <dt className="col-sm-3">Nesting</dt>
              <dd className="col-sm-9">
                <dl className="row">
                  <dt className="col-sm-4">Nested definition list</dt>
                  <dd className="col-sm-8">
                    Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc.
                  </dd>
                </dl>
              </dd>
            </dl>
          </div>
        </CCardBody>
      </CCard> */}

      {/* <ThemeProvider theme={defaultMaterialTheme}>
                <MaterialTable
                    title=""
                    data={data.rows}
                    columns={[
                        { title: 'Customer Name', field: 'customerName' },
                        { title: 'Order Count', field: 'orderCount' },
                        { title: 'Total Order Amount', field: 'Total Order Amount' },
                        { title: 'Email', field: 'email' }
                    ]}
                    detailPanel={(e) => {
                        return (
                            <div className='mainContainerTables'>
                                <div className="col-md-12 mb-4 sub_box materialTableDP">
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
                // ... other props
                />
            </ThemeProvider> */}

      <ThemeProvider theme={defaultMaterialTheme}>
        <MaterialTable
          title="Best Customers"
          data={data.rows}
          columns={[
            { title: 'Customer Name', field: 'user_name' },
            { title: 'Order Count', field: 'checkouts_count' },
            { title: 'totalprice', field: 'checkouts_sum_total_price' }, // Make sure this matches your API response key
            { title: 'Email', field: 'email' },
            // {
            //   title: 'User Profile',
            //   field: 'customer_profilepic',
            //   render: (rowData) => (
            //     <img
            //       src={rowData?.customer_profilepic || loogo} // Adjust the path accordingly
            //       alt="Profile Pic"
            //       style={{ width: 50, height: 50, borderRadius: '50%' }}
            //     />
            //   ),
            // },
          ]}

          options={{
            sorting: true,
            search: true,
            // ... other options
          }}
        />
      </ThemeProvider>

    </>
  )
}

export default Typography
