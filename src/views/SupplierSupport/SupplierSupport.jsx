import React from 'react'
import { CCard, CCardHeader, CCardBody } from '@coreui/react'
import { DocsLink } from 'src/components'
import { Icon, ThemeProvider, createTheme } from '@mui/material'
import MaterialTable from 'material-table'
import { useState, useEffect } from 'react'
// import loogo from '../../../assets/brand/aahaas.png';
import axios from 'axios'
import {getAllHelps} from './service/SupplierService'



const SupplierSupport = () => {

  const defaultMaterialTheme = createTheme();

  // const [orderData, setOrderData] = useState([])

  const [data, setData] = useState({ rows: [] });

  const [dataRows, setDataRows] = useState({ rows: [] });

  useEffect(() => {
    axios.get('helps/all')
      .then(response => {
        console.log("All supports",response.data);  
        console.log("All supports");  
        return response.data.data
      })
      .then(data => {
        setData({ rows: data });
        // // console.log("response", data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });


    // axios.get("new_customer_joined").then(res => {
    //   if (res.status == 200) {
    //     setDataRows({ rows: res.data })
    //   }
    // })

  }, []);


  return (
    <>

      <ThemeProvider theme={defaultMaterialTheme}>
        <MaterialTable
          title="Supplier Queries"
          data={data.rows}
          columns={[
            { title: 'Id', field: 'id' },
            { title: 'Name', field: 'user_name' },
            { title: 'Email', field: 'user_email' },
            {
                title: 'Status',
                field: 'status',
                render: rowData => rowData?.status === "1" ? 'Seen' : 'Pending'
            },
            { title: 'User Type', field: 'user_type' },
            { title: 'Title', field: 'title' },
            { title: 'reason', field: 'reason' },

          ]}

          options={{
            sorting: true,
            search: true,
            headerStyle: {
              fontSize: '14px', // Adjust the header font size here
                 backgroundColor: '#E5D3FA'
          },
          cellStyle: {
              fontSize: '14px', // Adjust the column font size here

          },
          }}
        />
      </ThemeProvider>

      <br></br>
      <br></br>

    </>
  )
}

export default SupplierSupport
