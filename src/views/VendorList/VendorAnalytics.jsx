import { ThemeProvider, createTheme } from '@mui/material'
import MaterialTable from 'material-table'
import {
    CCol,
    CRow,
    CCard,
    CCardBody 
} from '@coreui/react'
import { useEffect, useState } from 'react';
import axios from 'axios'

function VendorAnalytics() {
    const defaultMaterialTheme = createTheme();

    const [details, setDetails] = useState([]);

    const getDetails = async() => {
        try{
            const response = await axios.get('get_vendor_analytics');
            // console.log(response.data, 'vendor');
            if(response.status === 200){
                setDetails(response.data);
            }
        }catch(error){
            console.log(error);
        }
    }
    useEffect(() => {
        getDetails()
    }, [])

    const data = {
        columns: [
            {
                title: 'Name', field: 'name', align: 'center', editable: 'never',
            },
            {
                title: 'Address', field: 'address', align: 'center', editable: 'never',
            },
            {
                title: 'Selling Count', field: 'selling_count', align: 'center', editable: 'never',
            },
            {
                title: 'Total Amount', field: 'total_amount', align: 'center', editable: 'never'
            }
        ],
        rows: details.vendors?.flatMap((value, idx) => {
            const rows = [];
            if (value) {
                rows.push({
                    name: value.vendor_name,
                    address: value.vendor_address,
                    selling_count: value.count,
                    total_amount: value.total_amount
                    
                }); 
            }
            return rows;
        })

    }
    return (
        <div>
            <CCard className="mb-4">
                <CCardBody>
                    <CRow>
                        <CCol sm={5}>
                            <h4 id="traffic" className="card-title mb-0">
                                Vendor Analytics
                            </h4>
                        </CCol>

                    </CRow>

                    <ThemeProvider theme={defaultMaterialTheme}>
                        <MaterialTable
                            title=""
                            data={data.rows}
                            columns={data.columns}

                            options={{

                                sorting: true, search: true,
                                searchFieldAlignment: "right", searchAutoFocus: true, searchFieldVariant: "standard",
                                filtering: false, paging: true, pageSizeOptions: [20, 25, 50, 100], pageSize: 10,
                                paginationType: "stepped", showFirstLastPageButtons: false, paginationPosition: "both", exportButton: true,
                                exportAllData: true, exportFileName: "TableData", addRowPosition: "first", actionsColumnIndex: -1, selection: false,
                                showSelectAllCheckbox: false, showTextRowsSelected: false,
                                grouping: true, columnsButton: true,
                                headerStyle: { background: '#001b3f', color: "#fff", padding: "15px", fontSize: "17px", fontWeight: '500' },
                                rowStyle: { fontSize: "15px", width: "100%", color: "#000" },
                            }}


                        />
                    </ThemeProvider>

                </CCardBody>

            </CCard>
        </div>
    )
}

export default VendorAnalytics;