import { CBadge, CButton, CCardImage, CCol } from '@coreui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Icon, ThemeProvider, createTheme } from '@mui/material'
import MaterialTable from 'material-table';
import CIcon from '@coreui/icons-react';
import { cilInfo } from '@coreui/icons';
import MoreOrderView from 'src/Panels/OrderDetails/MoreOrderView/MoreOrderView';
import OrderDetails from 'src/Panels/OrderDetails/OrderDetails';
import moment from 'moment';
import LoaderPanel from 'src/Panels/LoaderPanel';
import { Tab, Tabs } from 'react-bootstrap';


import './ProductWiseOrders.css'

export default function ProductWiseOrders() {
    const defaultMaterialTheme = createTheme();



    const [allOrdersProducts, setAllOrdersProducts] = useState([])
    const [customerData, setCustomerData] = useState([])


    const [loading, setLoading] = useState(false)

    const getAllProductsOrders = async () => {

        setLoading(true)
        await axios.get("fetch_all_orders_product_wise").then(res => {
            if (res.data.status == 200) {
                setAllOrdersProducts(res.data.productData)
                setCustomerData(res.data.customerData)
                console.log(res.data)
                setLoading(false)
            }
        }).catch(response => {
            setLoading(false)
        })
    }


    useEffect(() => {
        getAllProductsOrders()
    }, [])


    const [moreOrderModal, setMoreOrderModal] = useState(false)
    const [moreOrderModalCategory, setMoreOrderModalCategory] = useState("")
    const [moreOrderDetails, setMoreOrderDetails] = useState("")


    const [currentFilters, setCurrentFilters] = useState("All")
    const [allProductsFiltered, setAllProductsFiltered] = useState([])


    const fetchFilteredProducts = () => {
        var arrayData = [];
        if (currentFilters == "All") {
            arrayData = allOrdersProducts
        }
        else {
            arrayData = allOrdersProducts.filter(filterData => filterData.status == currentFilters)
        }
        return arrayData;
    }

    const [mainDataSet, setMainDataSet] = useState([])

    const handleMoreInfoModal = (row) => {

        console.log(row)

        setMoreOrderModalCategory(row?.info.catid)
        if (row?.info.catid == 3) {
            setMoreOrderDetails(row?.info.lifestyle_booking_id)
            setMoreOrderModal(true)
        }
        else if (row?.info.catid == 1) {
            setMoreOrderDetails(row?.info.essential_pre_order_id)
            setMoreOrderModal(true)
        }

        else if (row?.info.catid == 5) {
            setMoreOrderDetails(row?.info.booking_id)
            setMoreOrderModal(true)
        }

        setMainDataSet(row)

    }




    const data = {
        columns: [



            {
                title: 'Info', field: 'info', render: rowData => (
                    <CButton style={{ backgroundColor: 'transparent', padding: 0, borderWidth: 0 }} onClick={() => handleMoreInfoModal(rowData)}>
                        <CIcon icon={cilInfo} className="text-info" size="xl" />
                    </CButton>
                ),
                filtering: false
            },
            {
                title: 'Order ID', field: 'order_id', filtering: false
            },

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
                title: 'Product ID', field: 'product_id', filtering: false
            },
            { title: 'Name', field: 'product_title', filtering: false },
            { title: 'Category', field: 'category', filtering: false },

            { title: 'Service Location', field: 'service_location', filtering: false },
            { title: 'Service Date', field: 'service_date', type: 'date', filterPlaceholder: "Select Date" },
            { title: 'Total Amount', field: 'total_amount', filtering: false },
            { title: 'Paid Amount', field: 'paid_amount', filtering: false },
            { title: 'Balance Amount', field: 'balance_amount', filtering: false },

            { title: 'Booked Date', field: 'booked_date', filtering: false },
            {
                title: 'Status', field: 'status', render: rowData => {
                    if (rowData?.status == "Cancel") {
                        return (
                            <CBadge color="danger" shape="rounded-pill">Cancelled</CBadge>
                        )
                    }

                },
                filtering: false,
                hidden: currentFilters == "All" ? false : true
            },

        ],
        rows: fetchFilteredProducts()?.map((result, index) => ({
            product_id: result?.PID,
            product_image: result?.product_image,
            service_location: result?.location,
            product_title: result?.product_title,
            category: result?.category,
            service_date: result?.service_date,
            balance_amount: result?.balance_amount,
            paid_amount: result?.currency + " " + result?.paid_amount,
            balance_amount: result?.currency + " " + result?.balance_amount,
            total_amount: result?.currency + " " + result?.total_amount,
            booked_date: result?.checkout_date,
            info: result,
            customerData: result?.customerData,
            order_id: "AHS_" + result?.orderID,
            status: result?.status

        }))
    };


    const rowStyle = (data) => {

        console.log(data)

        return {
            fontSize: "15px",
            width: "100%",
            color: "#000",
            fontWeight: 'normal',
            backgroundColor: 'white',
        }

    }


    console.log(allOrdersProducts, "ALLLLLL")





    const handleSelect = (key) => {
        setCurrentFilters(key)
    };

    return (
        <>
            <MoreOrderView
                show={moreOrderModal}
                onHide={() => setMoreOrderModal(false)}
                preID={moreOrderDetails}
                category={moreOrderModalCategory}
                productViewData
                productViewComponent={<OrderDetails orderid={mainDataSet} orderData={mainDataSet} hideStatus={false} productViewData />}
            >
            </MoreOrderView>



            <Tabs
                defaultActiveKey="All"
                id="uncontrolled-tab-example"
                className="mt-4"
                style={{
                    fontSize: 16,
                }}
                onSelect={handleSelect}
            >
                <Tab eventKey="All" title={<span className="custom-tab-all">All Orders</span>} itemID='tabAll'>

                </Tab>
                <Tab eventKey="CustomerOrdered" title={<span className="custom-tab-pending">Pending</span>} itemID='tabPending'>

                </Tab>
                <Tab eventKey="Approved" title={<span className="custom-tab-ongoing">Ongoing</span>} itemID='tabApproved'>

                </Tab>
                <Tab eventKey="Completed" title={<span className="custom-tab-completed">Completed</span>} itemID='tabCompleted'>

                </Tab>
                <Tab eventKey="Cancel" title={<span className="custom-tab-cancel">Cancelled</span>} itemID='tabCompleted'>

                </Tab>
            </Tabs >

            {
                loading == true ?
                    <LoaderPanel message={"All orders are being fetched"}></LoaderPanel>
                    :
                    <CCol>
                        <ThemeProvider theme={defaultMaterialTheme}>


                            {/* {React.memo(() => ( */}
                            <MaterialTable
                                title=""
                                // tableRef={tableRef}
                                data={data.rows}
                                columns={data.columns}


                                // detailPanel={(e) => {

                                //     return (
                                //         <div className='mainContainerTables'>
                                //             <div className="col-md-12 mb-4 sub_box materialTableDP">
                                //                 <OrderDetails orderid={e} orderData={e} hideStatus={false} productViewData />
                                //             </div>
                                //         </div>
                                //     )

                                // }}



                                options={{

                                    sorting: true, search: true,
                                    searchFieldAlignment: "right", searchAutoFocus: true, searchFieldVariant: "standard",
                                    filtering: false, paging: true, pageSizeOptions: [20, 25, 50, 100], pageSize: 10,
                                    paginationType: "stepped", showFirstLastPageButtons: false, paginationPosition: "both", exportButton: true,
                                    exportAllData: true, exportFileName: "TableData", addRowPosition: "first", actionsColumnIndex: -1, selection: false,
                                    showSelectAllCheckbox: false, showTextRowsSelected: false,
                                    grouping: true, columnsButton: true,
                                    headerStyle: { background: '#001b3f', color: "#fff", padding: "15px", fontSize: "17px", fontWeight: '500' },
                                    filtering: true,
                                    rowStyle: rowStyle

                                    // fixedColumns: {
                                    //     left: 6
                                    // }
                                }}

                            />

                            {/* ))} */}

                        </ThemeProvider>
                    </CCol>

            }




        </>
    )
}
