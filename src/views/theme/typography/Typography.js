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

  const [dataRows, setDataRows] = useState({ rows: [] });

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
          }}
        />
      </ThemeProvider>

    </>
  )
}

export default Typography
