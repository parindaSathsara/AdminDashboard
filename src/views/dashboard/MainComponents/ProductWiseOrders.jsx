import { CCardImage, CCol } from '@coreui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Icon, ThemeProvider, createTheme } from '@mui/material'
import MaterialTable from 'material-table';

export default function ProductWiseOrders() {
    const defaultMaterialTheme = createTheme();



    const [allOrdersProducts, setAllOrdersProducts] = useState([])

    const getAllProductsOrders = async () => {
        await axios.get("fetch_all_orders_product_wise").then(res => {
            if (res.data.status == 200) {
                setAllOrdersProducts(res.data.productData)
                console.log(res.data)
            }
        })
    }


    useEffect(() => {
        getAllProductsOrders()
    }, [])


    const data = {
        columns: [
            {
                title: 'Product Image',
                field: 'product_image',
                align: 'left',
                editable: 'never',
                render: rowData => (
                    <div style={{ width: "100px", height: "100px", borderRadius: 20 }}>
                        <CCardImage
                            src={rowData.product_image?.split(",")[0]?.includes("http") ? rowData.product_image?.split(",")[0] : "https://supplier.aahaas.com/" + rowData.product_image?.split(",")[0]}
                            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 20 }}
                        />
                    </div>
                ),
                filtering: false
            },

            {
                title: 'Product ID', field: 'product_id', width: 500
            },
            { title: 'Name', field: 'product_title' },
            { title: 'Category', field: 'category' },
            { title: 'Service Date', field: 'service_date' },
            { title: 'Service Location', field: 'service_location' },

        ],
        rows: allOrdersProducts?.map(result => ({
            product_id: result?.PID,
            product_image: result?.product_image,
            service_location: result?.location,
            product_title: result?.product_title,
            category: result?.category,
            service_date:result?.service_date
        }))
    };


    //
    return (
        <CCol>
            <ThemeProvider theme={defaultMaterialTheme}>
                <MaterialTable
                    title=""
                    // tableRef={tableRef}
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

                        rowStyle: {
                            fontSize: "15px",
                            width: "100%",
                            color: "#000",
                            fontWeight: 'normal',
                            backgroundColor: 'white', // You can adjust the background color here
                        },

                        // fixedColumns: {
                        //     left: 6
                        // }
                    }}

                />

            </ThemeProvider>
        </CCol>
    )
}
