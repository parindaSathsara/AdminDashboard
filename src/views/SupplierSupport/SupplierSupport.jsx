import React from 'react'
import { CCard, CCardHeader, CCardBody } from '@coreui/react'
import { DocsLink } from 'src/components'
import { Icon, ThemeProvider, createTheme } from '@mui/material'
import MaterialTable from 'material-table'
import { useState, useEffect } from 'react'
import axios from 'axios'
import {getAllHelps} from './service/SupplierService'

const SupplierSupport = () => {
  const defaultMaterialTheme = createTheme();
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
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <>
      <ThemeProvider theme={defaultMaterialTheme}>
        <MaterialTable
          title="Supplier Queries"
          data={data.rows}
          columns={[
            { title: 'Id', field: 'id', width: '5%' },
            { title: 'Name', field: 'user_name', width: '10%' },
            { title: 'Email', field: 'user_email', width: '15%' },
            {
                title: 'Status',
                field: 'status',
                width: '10%',
                render: rowData => rowData?.status === "1" ? 'Seen' : 'Pending',
                customFilterAndSearch: (term, rowData) => {
                  const value = rowData.status === "1" ? 'Seen' : 'Pending'
                  return value.toLowerCase().includes(term.toLowerCase())
                }
            },
            { title: 'User Type', field: 'user_type', width: '10%' },
            // { title: 'Title', field: 'title', width: '15%',    cellStyle: {
            //     whiteSpace: 'nowrap',
            //     overflow: 'hidden',
            //     textOverflow: 'ellipsis',
            //     maxWidth: 400
            //   },
            //   headerStyle: {
            //     width: '35%'
            //   } },
            {
  title: 'Title',
  field: 'title',
  width: '10%',
  cellStyle: {
    whiteSpace: 'normal',      // ✅ allows wrapping
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: 150,
    wordBreak: 'break-word'    // ✅ breaks long words if needed
  },
  headerStyle: {
    width: '35%'
  }
},

            { 
              title: 'Reason', 
              field: 'reason', 
              width: '35%',
              cellStyle: {
                // whiteSpace: 'nowrap',
                // overflow: 'hidden',
                // textOverflow: 'ellipsis',
                maxWidth: 600
              },
              headerStyle: {
                width: '65%'
              }
            },
          ]}
          options={{
            sorting: true,
            search: true,
            headerStyle: {
              fontSize: '15px',
              backgroundColor: '#626f75',
              color: '#FFF'
            },
            cellStyle: {
              fontSize: '14px',
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