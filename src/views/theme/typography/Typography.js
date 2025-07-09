import React from 'react'
import { CCard, CCardHeader, CCardBody } from '@coreui/react'
import { DocsLink } from 'src/components'
import { Icon, ThemeProvider, createTheme } from '@mui/material'
import MaterialTable from 'material-table'
import { useState, useEffect } from 'react'
import loogo from '../../../assets/brand/aahaas.png';
import axios from 'axios'
import { Button, Modal } from 'react-bootstrap';
import CartDetailsModal from './CartDetailsModal';



const Typography = () => {

  const defaultMaterialTheme = createTheme();

  // const [orderData, setOrderData] = useState([])

  const [data, setData] = useState({ rows: [] });

  const [dataRows, setDataRows] = useState({ rows: [] });

  const [showModal, setShowModal] = useState(false);
const [selectedCustomer, setSelectedCustomer] = useState(null);

 const [cartData, setCartData] = useState(null);

  const handleShowModal = (rowData) => {
    console.log("Selected Customer Data:", rowData);
    axios.post("getCartByCustomerId", {
      // customer_id: rowData.customer_id || 608
      customer_id: rowData.customer_id
      // customer_id:608
    })
    .then(res => {
      if (res.status === 200) {
        console.log("Cart Data:", res.data);
        setCartData(res.data);
        setSelectedCustomer(rowData);
        setShowModal(true);
      }
    })
    .catch(error => {
      console.error("Error fetching cart data:", error);
    });
  };

const handleCloseModal = () => {
  setShowModal(false);
  setSelectedCustomer(null);
};

  useEffect(() => {

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


    axios.get("new_customer_joined").then(res => {
      if (res.status == 200) {
        setDataRows({ rows: res.data })
      }
    })

  }, []);


  return (
    <>

      <ThemeProvider theme={defaultMaterialTheme}>
        <MaterialTable
          title="Best Customers"
          data={data.rows}
          columns={[
            { title: 'Customer Name', field: 'user_name' },
            { title: 'Order Count', field: 'checkouts_count' },
            { title: 'totalprice', field: 'checkouts_sum_total_price' },
            { title: 'Email', field: 'email' },

          ]}

          options={{
            headerStyle: {
              fontSize: '15px', // Adjust the header font size here
                backgroundColor: '#626f75',
                color: '#FFF'
          },
          cellStyle: {
            fontSize: '14px', // Adjust the column font size here
        },
            onChangePage: () => window.scrollTo({ top: 0, behavior: 'smooth' }),

            sorting: true,
            search: true,

          }}
        />
      </ThemeProvider>

      <br></br>
      <br></br>

      {console.log(dataRows)}

      <ThemeProvider theme={defaultMaterialTheme}>
        <MaterialTable
          title="New Customers"

          data={dataRows.rows}
          columns={[
            { title: 'Customer Name', field: 'username' },
            { title: 'Email', field: 'email' },
            { title: 'Created Date|Time', field: 'created_at' },
            { title: 'Logged Using', field: 'user_type' },
            { title: 'Customer Nationality', field: 'customer_nationality' },
              {
    title: 'Cart Details',
    render: rowData => (
      <Button
        size="sm"
        variant="primary"
        onClick={() => handleShowModal(rowData)}
      >
        View Cart
      </Button>
    )
  }
          ]}

          options={{
            sorting: true,
            search: true,
            headerStyle: {
              fontSize: '15px', // Adjust the header font size here
                backgroundColor: '#626f75',
                color: '#FFF'
          },
          cellStyle: {
            fontSize: '14px', // Adjust the column font size here
        },
            onChangePage: () => window.scrollTo({ top: 0, behavior: 'smooth' }),

          }}
        />
      </ThemeProvider>

       <CartDetailsModal 
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        selectedCustomer={selectedCustomer}
        cartData={cartData}
      />

      {/* <Modal show={showModal} onHide={handleCloseModal} centered>
  <Modal.Header closeButton>
    <Modal.Title>Cart Details</Modal.Title>
  </Modal.Header>
  <Modal.Body>
  
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseModal}>
      Close
    </Button>
  </Modal.Footer>
</Modal> */}


    </>
  )
}

export default Typography
