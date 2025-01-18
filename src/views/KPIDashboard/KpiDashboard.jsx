import { CCard, CCardBody, CCol, CContainer, CHeader, CRow, CWidgetStatsA, CFormSelect } from '@coreui/react';
import React, { useState, useEffect } from 'react';
import { Tab, Tabs } from 'react-bootstrap'
import { DateRangePicker } from 'rsuite'
import 'rsuite/dist/rsuite.css'
import { format } from 'date-fns';
import Select from "react-select"
import { createTheme, ThemeProvider } from '@mui/material'
import MaterialTable from 'material-table'
import { zIndex } from '@mui/material/styles/zIndex';
import { getOrderWiseBookingDetails, getOrderIDs, getAllEmployees, getAllOrdersBooking, getUserWiseOrdersBooking, getOrderWiseOrdersBooking } from './KpiService'
import Swal from 'sweetalert2';

const KpiDashboard = () => {
    const defaultMaterialTheme = createTheme();
    const [selectedDatesAllOrders, setSelectedDatesAllOrders] = useState([])
    const [selectedDatesTraveler, setSelectedDatesTraveler] = useState([])
    const handleDateRangeChangeBooking = (value) => {
        if (value) {
            const formattedStartDate = format(value[0], 'yyyy-MM-dd')
            const formattedEndDate = format(value[1], 'yyyy-MM-dd')
            setSelectedDatesAllOrders([formattedStartDate, formattedEndDate])
            console.log(formattedStartDate, formattedEndDate)
        } else {
            setSelectedDatesAllOrders([])
        }
    }

    useEffect(() => {
        // setSelectedDatesTraveler
        const currentDate = new Date();
        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 30);
        const formattedStartDate = format(startDate, 'yyyy-MM-dd');
        const formattedEndDate = format(currentDate, 'yyyy-MM-dd');
        // setSelectedDatesAllOrders([formattedStartDate, formattedEndDate])
        setSelectedDatesTraveler([formattedStartDate, formattedEndDate])
        // loadData([formattedStartDate, formattedEndDate]);
    }, []);


    const handleDateRangeChangeTravel = (value) => {
        if (value) {
            const formattedStartDate = format(value[0], 'yyyy-MM-dd')
            const formattedEndDate = format(value[1], 'yyyy-MM-dd')
            setSelectedDatesTraveler([formattedStartDate, formattedEndDate])
            console.log(formattedStartDate, formattedEndDate)
        } else {
            setSelectedDatesTraveler([])
        }
    }

    const Booking = () => {
        const [orderIds, setOrderIds] = useState([])
        const [selectedOrderID, setSelectedOrderID] = useState(null)
        const [selectedEmployeeId, setSelectedEmployeeId] = useState(null)
        const [availableEmployees, setAvailableEmployees] = useState([]);
        const [selectedDatesUser, setSelectedDatesUser] = useState([])
        const [selectedDatesAllOrders, setSelectedDatesAllOrders] = useState([])
        const [selectedDatesAllOrdersDate, setSelectedDatesAllOrdersDate] = useState([])
        const [selectedDatesUserOrdersDate, setSelectedDatesUserOrdersDate] = useState([])
        const [averageAllOrderData, setAverageAllOrderData] = useState([])
        const [averageUserOrderData, setAverageUserOrderData] = useState([])
        const [averageOrderData, setAverageOrderData] = useState([])
        const [inDetailsOrders, setInDetailsOrders] = useState([])

        useEffect(() => {
            const currentDate = new Date();
            const startDate = new Date(currentDate.getFullYear(), 0, 1);
            const formattedStartDate = format(startDate, 'yyyy-MM-dd');
            const formattedEndDate = format(currentDate, 'yyyy-MM-dd');
            setSelectedDatesAllOrdersDate([formattedStartDate, formattedEndDate])
            // setSelectedDatesUserOrdersDate([formattedStartDate, formattedEndDate])
        }, []);

        useEffect(() => {
            getOrderIDs().then(response => {
                var dataSet = response.map(res => ({
                    value: res?.id,
                    label: `AHS_ORD${res.id}`
                }));
                setOrderIds(dataSet)
            })
            monitorAvailability();
        }, [])

        useEffect(() => {
            if (selectedOrderID) {
                getOrderWiseBookingDetails().then((res) => {

                }).catch((err) => {

                })
            }

            getAllOrdersBooking(selectedDatesAllOrdersDate).then((res) => {
                setAverageAllOrderData(res)
                console.log("All Orders", res)
            }).catch((err) => {
                //  Swal.fire({
                //       icon: 'error',
                //       title: 'Oops...',
                //       text: 'something went wrong!',
                //     });
            })

            getUserWiseOrdersBooking(selectedDatesUserOrdersDate, selectedEmployeeId).then((res) => {
                setAverageUserOrderData(res)
                console.log("All Orders", res)
            }).catch((err) => {
                //  Swal.fire({
                //       icon: 'error',
                //       title: 'Oops...',
                //       text: 'something went wrong!',
                //     });
            })

            getOrderWiseOrdersBooking(selectedOrderID).then((res) => {
                setAverageOrderData(res)
                setInDetailsOrders(res?.order_data)
                console.log("order", res)
            }).catch((err) => {
                //  Swal.fire({
                //       icon: 'error',
                //       title: 'Oops...',
                //       text: 'something went wrong!',
                //     });
            })


        }, [selectedOrderID, selectedEmployeeId, selectedDatesAllOrdersDate, selectedDatesUserOrdersDate, selectedOrderID])

        const monitorAvailability = () => {
            try {
                getAllEmployees().then(response => {
                    var dataSet = response.map(res => ({
                        value: res?.id,
                        label: res?.name
                    }));
                    setAvailableEmployees(dataSet);
                })
            } catch (error) {
                console.error("Error available employee: ", error);
            }
        };

        const handleDateRangeChangeBooking = (value, type) => {
            if (value) {
                const formattedStartDate = format(value[0], 'yyyy-MM-dd')
                const formattedEndDate = format(value[1], 'yyyy-MM-dd')
                setSelectedDatesAllOrdersDate([formattedStartDate, formattedEndDate])
                console.log(formattedStartDate, formattedEndDate)
            } else {
                setSelectedDatesAllOrdersDate([])
            }
        }

        const handleDateRangeChangeBookingByUser = (value, type) => {
            if (value) {
                const formattedStartDate = format(value[0], 'yyyy-MM-dd')
                const formattedEndDate = format(value[1], 'yyyy-MM-dd')
                setSelectedDatesUserOrdersDate([formattedStartDate, formattedEndDate])
                console.log(formattedStartDate, formattedEndDate)
            } else {
                setSelectedDatesUserOrdersDate([])
            }
        }

        return (
            <>
                <CRow>
                    <CCol sm={6} xl={6} xxl={6}>
                           <CCard sm={6} xl={4} xxl={3} style={{ borderColor: '#d4cec1', borderWidth: 3 }}>
                            <CHeader>All Orders
                                <DateRangePicker
                                    style={{ marginLeft: 0 }}
                                    format="yyyy/MM/dd"
                                    onChange={handleDateRangeChangeBooking}
                                    value={selectedDatesAllOrdersDate.length > 0 ? [new Date(selectedDatesAllOrdersDate[0]), new Date(selectedDatesAllOrdersDate[1])] : null}
                                />
                            </CHeader>
                            <CCardBody>
                                <CRow>
                                    <CCol sm={4} xl={4} xxl={4}>
                                        <CWidgetStatsA style={{ height: 160, backgroundColor: '#ff4d4d', color: 'white' }} value={<><h2>
                                            {/* 6 <span class="fs-5">min</span> */}
                                            {averageAllOrderData?.avg_response_time}
                                        </h2>
                                        </>}
                                            title={<>
                                                <h6 className=" fw-normal">
                                                    Average Response Time
                                                </h6>
                                            </>} />
                                    </CCol>
                                    <CCol sm={4} xl={4} xxl={4}>
                                        <CWidgetStatsA style={{ height: 160, backgroundColor: '#ff4d4d', color: 'white' }} value={<><h2>
                                            {/* 6 <span class="fs-5">min</span> */}
                                            {averageAllOrderData?.avg_confirm_time}
                                        </h2>
                                        </>}
                                            title={<>
                                                <h6 className=" fw-normal">
                                                    Average Order Confirmation
                                                </h6>
                                            </>} />
                                    </CCol>
                                    <CCol sm={4} xl={4} xxl={4}>
                                        <CWidgetStatsA style={{ height: 160, backgroundColor: '#ff4d4d', color: 'white' }} value={<><h2>
                                            {averageAllOrderData?.avg_cancel_time}
                                        </h2>
                                        </>}
                                            title={<>
                                                <h6 className=" fw-normal">
                                                    Average Order Cancellation
                                                </h6>
                                            </>} />
                                    </CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>
                    </CCol>
                    <CCol sm={6} xl={6} xxl={6}>
                        <CCard sm={6} xl={4} xxl={3} style={{ borderColor: '#d4cec1', borderWidth: 3 }}>
                            <CHeader>By User

                            <DateRangePicker
                                    style={{ marginLeft: 0 }}
                                    format="yyyy/MM/dd"
                                    onChange={handleDateRangeChangeBookingByUser}
                                    value={selectedDatesUserOrdersDate.length > 0 ? [new Date(selectedDatesUserOrdersDate[0]), new Date(selectedDatesUserOrdersDate[1])] : null}
                                />
                                <Select
                                    options={availableEmployees}
                                    value={availableEmployees?.name}
                                    onChange={(selectedOption) => setSelectedEmployeeId(selectedOption?.value)}
                                    placeholder="Select a Employee"
                                    isClearable
                                />

                                
                            </CHeader>
                            <CCardBody>
                                <CRow>
                                    <CCol sm={6} xl={6} xxl={6}>
                                        <CWidgetStatsA style={{ height: 160, backgroundColor: '#ff4d4d', color: 'white' }} value={<><h2>
                                            {averageUserOrderData?.avg_confirm_time}
                                        </h2>
                                        </>}
                                            title={<>
                                                <h5 className=" fw-normal">
                                                    Average Order Confirmation
                                                </h5>
                                            </>} />
                                    </CCol>
                                    <CCol sm={6} xl={6} xxl={6}>
                                        <CWidgetStatsA style={{ height: 160, backgroundColor: '#ff4d4d', color: 'white' }} value={<><h2>
                                            {averageUserOrderData?.avg_cancel_time}
                                        </h2>
                                        </>}
                                            title={<>
                                                <h5 className=" fw-normal">
                                                    Average Order Cancellation
                                                </h5>
                                            </>} />
                                    </CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
                <br></br>
                <CRow>
                    <CCol sm={12} xl={12} xxl={12}>
                     <CCard sm={6} xl={4} xxl={3} style={{  }}>
                            <CHeader>By Order

                                <Select
                                    options={orderIds}
                                    value={selectedOrderID?.name}
                                    onChange={(selectedOption) => setSelectedOrderID(selectedOption?.value)}
                                    placeholder="Select a Order ID"
                                    isClearable
                                />
                            </CHeader>
                            <CCardBody>
                                <CRow>
                                    <CCol sm={3} xl={3} xxl={3}>
                                        <CWidgetStatsA style={{ height: 160, backgroundColor: '#ff4d4d', color: 'white' }} value={<><h2>
                                            {averageOrderData?.avg_confirm_time}
                                        </h2>
                                        </>}
                                            title={<>
                                                <h5 className=" fw-normal">
                                                    Average Product Confirmation
                                                </h5>
                                            </>} />
                                    </CCol>
                                    <CCol sm={3} xl={3} xxl={3}>
                                        <CWidgetStatsA style={{ height: 160, backgroundColor: '#ff4d4d', color: 'white' }} value={<><h2>
                                            {averageOrderData?.avg_cancel_time}
                                        </h2>
                                        </>}
                                            title={<>
                                                <h5 className=" fw-normal">
                                                    Average Product Cancellation
                                                </h5>
                                            </>} />
                                    </CCol>
                                     <CCol sm={3} xl={3} xxl={3}>
                                        <CWidgetStatsA style={{ height: 160, backgroundColor: '#ff4d4d', color: 'white' }} value={<><h2>
                                            <>
                                            <div><h5 className='fw-normal d-inline'>Order Duration: </h5>{averageOrderData?.order_duration}</div>
                                            <div><h5 className='fw-normal d-inline'>Order Status: </h5> {averageOrderData?.order_status}</div>
                                            {/* <div><h5 className='fw-normal d-inline'>Product Count: </h5> {averageOrderData?.product_count}</div> */}
                                        </>
                                        </h2>
                                        </>}
                                            title={<>
                                                {/* <h5 className=" fw-normal">
                                                    Average Product Cancellation
                                                </h5> */}
                                            </>} />
                                    </CCol>
                                     <CCol sm={3} xl={3} xxl={3}>
                                        <CWidgetStatsA style={{ height: 160, backgroundColor: '#ff4d4d', color: 'white' }} value={<><h2>
                                            {averageOrderData?.avg_response_time}
                                        </h2>
                                        </>}
                                            title={<>
                                                <h5 className=" fw-normal">
                                                    Average Response Time
                                                </h5>
                                            </>} />
                                    </CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>

                        <ThemeProvider theme={defaultMaterialTheme}>
                                <MaterialTable
                                  title="Activity Details"
                                  data={inDetailsOrders}
                                  columns={[
                                    { title: 'User Name', field: 'name' },
                                    { title: 'Email', field: 'email' },
                                    { title: 'Status Type', field: 'status_type' },
                                    { title: 'New Status', field: 'new_status' },
                                    { title: 'Change At', field: 'changed_at' },
                                  ]}
                                  options={{
                                    sorting: true,
                                    search: false,
                                  }}
                                />
                        </ThemeProvider>
                    </CCol>
                </CRow>
                <br></br></>
        )
    }

    const Traveler = () => {
        const [feedbacks, setFeedbacks] = useState([])
        const defaultMaterialTheme = createTheme();
        const data = {
            columns: [
                {
                    title: 'ID', field: 'id', align: 'left', editable: 'never'
                },
                {
                    title: 'Checkout Id', field: 'checkout_id', align: 'left', editable: 'never',
                },
                {
                    title: 'Product', field: 'product_id', align: 'left', editable: 'never',
                },
                {
                    title: 'Category', field: 'category_id', align: 'left', editable: 'never',
                },
                {
                    title: 'Rating on Aahaas', field: 'rating_on_aahaas', align: 'left', editable: 'never',
                },
                {
                    title: 'Rating on Supplier', field: 'rating_on_supplier', align: 'left', editable: 'never',
                },
                {
                    title: 'Rating on Product', field: 'rating_on_product', align: 'left', editable: 'never',
                },
                {
                    title: 'Review Remarks', field: 'review_remarks', align: 'left', editable: 'never',
                },
            ],
            rows: feedbacks?.map((value, idx) => {
                let $category = '';
                if (value.category_id === 1) {
                    $category = 'Essential';
                } else if (value.category_id === 2) {
                    $category = 'Non Essential';
                } else if (value.category_id === 3) {
                    $category = 'Lifestyle';
                } else if (value.category_id === 4) {
                    $category = 'Hotels';
                } else if (value.category_id === 5) {
                    $category = 'Education';
                } else {
                    $category = 'Flight';
                }

                return {
                    id: value.id,
                    checkout_id: value.checkout_id,
                    product_id: value?.product_id,
                    category_id: $category,
                    rating_on_aahaas: value?.rating_on_aahaas,
                    rating_on_supplier: value?.rating_on_supplier,
                    rating_on_product: value?.rating_on_product,
                    review_remarks: value?.review_remarks,
                }
            })
        }

        const categories = [{ value: "0", name: "All Categories" }, { value: "1", name: "Essential" }, { value: "2", name: "NonEssential" }, { value: "3", name: "Lifestyle" }, { value: "4", name: "Hotel" }, , { value: "5", name: "Education" }]

        return (
            <>
                <br></br>
                <CRow>
                    <CCol >
                        <CCard sm={6} xl={4} xxl={3} style={{ borderColor: '#d4cec1', borderWidth: 3 }}>
                            <CHeader>All
                                <DateRangePicker
                                    style={{ marginLeft: 0 }}
                                    format="yyyy/MM/dd"
                                    onChange={handleDateRangeChangeTravel}
                                    value={selectedDatesTraveler.length > 0 ? [new Date(selectedDatesTraveler[0]), new Date(selectedDatesTraveler[1])] : null}

                                />

                            </CHeader>
                            <CCardBody>
                                <CRow>
                                    <CCol sm={6} xl={4} xxl={4}>
                                        <CWidgetStatsA style={{ height: 160, backgroundColor: '#ff4d4d', color: 'white' }} value={<><h2>
                                            {/* 6 <span class="fs-5">min</span> */}
                                        </h2>
                                        </>}
                                            title={<>
                                                <h5 className=" fw-normal">
                                                    Driver Allocation Time
                                                </h5>
                                            </>} />
                                    </CCol>
                                    <CCol sm={6} xl={4} xxl={4}>
                                        <CWidgetStatsA style={{ height: 160, backgroundColor: '#ff4d4d', color: 'white' }} value={<><h2>
                                            {/* 5 <span class="fs-5">min</span> */}
                                        </h2>
                                        </>}
                                            title={<>
                                                <h5 className=" fw-normal">
                                                    Reconfirmation Time
                                                </h5>
                                            </>} />
                                    </CCol>
                                    <CCol sm={6} xl={4} xxl={4}>
                                        <CWidgetStatsA style={{ height: 160, backgroundColor: '#ff4d4d', color: 'white' }} value={<><h2>
                                            {/* 5 <span class="fs-5">min</span> */}
                                        </h2>
                                        </>}
                                            title={<>
                                                <h5 className=" fw-normal">
                                                    Order Completion Time
                                                </h5>
                                            </>} />
                                    </CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>
                    </CCol>
                    <CCol >
                        <CCard sm={6} xl={4} xxl={3} style={{ borderColor: '#d4cec1', borderWidth: 3 }}>
                            <CHeader>By Order
                                <Select
                                    // id={id}

                                    options={categories.map((option) => ({
                                        value: option.value,
                                        label: option.name,
                                    }))}
                                    defaultValue={{ value: "0", label: "All Orders" }}
                                    // value={options.find((option) => option.origin_rate_id === `${value}`)}
                                    // onChange={(selectedOption) =>
                                    //     onChange({
                                    //         name,
                                    //         value: selectedOption ? selectedOption.value : "",
                                    //     })
                                    // }
                                    placeholder="Select an Order"
                                    isClearable
                                />
                            </CHeader>
                            <CCardBody>
                                <CRow>
                                    <CCol >
                                        <CWidgetStatsA style={{ height: 160, backgroundColor: '#ff4d4d', color: 'white' }} value={<><h2>
                                            {/* 6 <span class="fs-5">min</span> */}
                                        </h2>
                                        </>}
                                            title={<>
                                                <h5 className=" fw-normal">
                                                    Driver Allocation Time
                                                </h5>
                                            </>} />
                                    </CCol>
                                    <CCol >
                                        <CWidgetStatsA style={{ height: 160, backgroundColor: '#ff4d4d', color: 'white' }} value={<><h2>
                                            {/* 5 <span class="fs-5">min</span> */}
                                        </h2>
                                        </>}
                                            title={<>
                                                <h5 className=" fw-normal">
                                                    Reconfirmation Time
                                                </h5>
                                            </>} />
                                    </CCol>
                                    <CCol >
                                        <CWidgetStatsA style={{ height: 160, backgroundColor: '#ff4d4d', color: 'white' }} value={<><h2>
                                            {/* 5 <span class="fs-5">min</span> */}
                                        </h2>
                                        </>}
                                            title={<>
                                                <h5 className=" fw-normal">
                                                    Order Completion Time
                                                </h5>
                                            </>} />
                                    </CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
                <br></br>
                <CRow>
                    <CCol sm={12} xl={12} xxl={12} >
                        <CCard>
                            <CHeader>Feedbacks

                                <Select
                                    // id={id}
                                    // styles={{zIndex: 111}}
                                    options={categories.map((option) => ({
                                        value: option.value,
                                        label: option.name,
                                    }))}
                                    defaultValue={{ value: "0", label: "All Orders" }}
                                    // value={options.find((option) => option.origin_rate_id === `${value}`)}
                                    // onChange={(selectedOption) =>
                                    //     onChange({
                                    //         name,
                                    //         value: selectedOption ? selectedOption.value : "",
                                    //     })
                                    // }
                                    placeholder="Select an Order"
                                    isClearable
                                />
                            </CHeader>

                            <CCardBody>
                                <ThemeProvider theme={defaultMaterialTheme}>
                                    <MaterialTable title=""
                                        style={{ zIndex: 0 }}
                                        data={data.rows}
                                        columns={data.columns}
                                        options={{
                                            muiTableContainerProps: { sx: { maxHeight: '200px' } },
                                            enableStickyHeader: true,
                                            sorting: true, search: true,
                                            searchFieldAlignment: "right", searchAutoFocus: true, searchFieldVariant: "standard",
                                            filtering: false, paging: true, pageSizeOptions: [20, 25, 50, 100], pageSize: 10,
                                            paginationType: "stepped", showFirstLastPageButtons: false,
                                            // exportAllData: true, exportFileName: "TableData", addRowPosition: "first", actionsColumnIndex: -1, selection: false,
                                            showSelectAllCheckbox: false, showTextRowsSelected: false,
                                            // grouping: true, columnsButton: true,
                                            headerStyle: { background: '	#9f9393', color: "#fff", padding: "15px", fontSize: "17px", fontWeight: '500' },
                                            rowStyle: { fontSize: "15px", width: "100%", color: "#000" },
                                        }}
                                    />
                                </ThemeProvider>
                            </CCardBody>
                        </CCard>
                    </CCol>
                    <CCol >

                    </CCol>
                </CRow>
                <br></br></>
        )
    }


    const Account = () => {
        return (
            <>
                <br></br>
                <CRow>
                    <CCol sm={6} xl={6} xxl={6}>
                        <CCard sm={6} xl={4} xxl={3} style={{ borderColor: '#d4cec1', borderWidth: 3 }}>
                            <CHeader>Payments
                                <DateRangePicker
                                    style={{ marginLeft: 0 }}
                                    format="yyyy/MM/dd"
                                    onChange={handleDateRangeChangeBooking}
                                    value={selectedDatesAllOrders.length > 0 ? [new Date(selectedDatesAllOrders[0]), new Date(selectedDatesAllOrders[1])] : null}
                                />
                            </CHeader>
                            <CCardBody>
                                <CRow>
                                    <CCol sm={6} xl={6} xxl={6}>
                                        <CWidgetStatsA style={{ height: 160, backgroundColor: '#ff4d4d', color: 'white' }} value={<><h2>
                                            69
                                        </h2>
                                        </>}
                                            title={<>
                                                <h5 className=" fw-normal">
                                                    Received Payments
                                                </h5>
                                            </>} />
                                    </CCol>
                                    <CCol sm={6} xl={6} xxl={6}>
                                        <CWidgetStatsA style={{ height: 160, backgroundColor: '#ff4d4d', color: 'white' }} value={<><h2>
                                            5 <span class="fs-5">%</span>
                                        </h2>
                                        </>}
                                            title={<>
                                                <h5 className=" fw-normal">
                                                    Payment Rejection
                                                </h5>
                                            </>} />
                                    </CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>
                    </CCol>
                    {/* <CCard >
                            <CHeader>
                                Payments
                                <DateRangePicker
                                    style={{ marginLeft: 0 }}
                                    format="yyyy/MM/dd"
                                    onChange={handleDateRangeChangeBooking}
                                    value={selectedDates.length > 0 ? [new Date(selectedDates[0]), new Date(selectedDates[1])] : null}
                                />

                            </CHeader>
                            <CCardBody>
                                <CRow>
                                    <CCol sm={6} xl={6} xxl={6}>
                                        <CWidgetStatsA style={{ height: 160, backgroundColor: '#ff4d4d', color: 'white' }} value={<><h2>
                                            124
                                        </h2>
                                        </>}
                                            title={<>
                                                <h5 className=" fw-normal">
                                                    Recieved Payments
                                                </h5>
                                            </>} />
                                    </CCol>
                                    <CCol sm={6} xl={6} xxl={6}>
                                        <div style={{}}>
                                            <CWidgetStatsA style={{ height: 160, backgroundColor: '#ff4d4d', color: 'white' }} value={<><h2>
                                                12 %
                                            </h2>
                                            </>}
                                                title={<>
                                                    <h5 className=" fw-normal">
                                                        Payment Rejection
                                                    </h5>
                                                </>} />
                                        </div>

                                    </CCol>

                                </CRow>
                            </CCardBody>
                        </CCard> */}
                    {/* </CCol> */}

                </CRow>

                <br></br></>
        )
    }

    const Supplier = () => {

        const categories = [{ value: "0", name: "All Categories" }, { value: "1", name: "Essential" }, { value: "2", name: "NonEssential" }, { value: "3", name: "Lifestyle" }, { value: "4", name: "Hotel" }, , { value: "5", name: "Education" }]
        const supplierDestination = [{ value: "0", name: "All Country" }, { value: "1", name: "Sri Lanka" }, { value: "2", name: "India" }, { value: "3", name: "Vietnam" }]



        return (
            <>
                <br></br>
                <CRow>
                    <CCol >
                        <CCard sm={6} xl={7} xxl={3} style={{ borderColor: '#d4cec1', borderWidth: 3 }}>
                            <CHeader>
                                Products
                                <Select
                                    // id={id}
                                    options={categories.map((option) => ({
                                        value: option.value,
                                        label: option.name,
                                    }))}
                                    defaultValue={{ value: "0", label: "All Categories" }}
                                    // value={options.find((option) => option.origin_rate_id === `${value}`)}
                                    // onChange={(selectedOption) =>
                                    //     onChange({
                                    //         name,
                                    //         value: selectedOption ? selectedOption.value : "",
                                    //     })
                                    // }
                                    placeholder="Select an Category"
                                    isClearable
                                />
                                <DateRangePicker
                                    style={{ marginLeft: 0 }}
                                    format="yyyy/MM/dd"
                                    onChange={handleDateRangeChangeTravel}
                                    value={selectedDatesTraveler.length > 0 ? [new Date(selectedDatesTraveler[0]), new Date(selectedDatesTraveler[1])] : null}

                                />
                            </CHeader>
                            <CCardBody>
                                <CRow>
                                    <CCol sm={6} xl={12} xxl={12}>
                                        <CWidgetStatsA style={{ height: 160, backgroundColor: '#ff4d4d', color: 'white' }} value={<><h2>
                                            3500
                                        </h2>
                                        </>}
                                            title={<>
                                                <h5 className=" fw-normal">
                                                    Total Products
                                                </h5>
                                            </>} />
                                    </CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>
                    </CCol>
                    <CCol >
                        <CCard sm={6} xl={4} xxl={3} style={{ borderColor: '#d4cec1', borderWidth: 3 }}>
                            <CHeader>Supplier

                                <Select
                                    // id={id}
                                    options={supplierDestination.map((option) => ({
                                        value: option.value,
                                        label: option.name,
                                    }))}
                                    defaultValue={{ value: "0", label: "All Counties" }}
                                    // value={options.find((option) => option.origin_rate_id === `${value}`)}
                                    // onChange={(selectedOption) =>
                                    //     onChange({
                                    //         name,
                                    //         value: selectedOption ? selectedOption.value : "",
                                    //     })
                                    // }
                                    placeholder="Select an Country"
                                    isClearable
                                />
                            </CHeader>
                            <CCardBody>
                                <CRow>
                                    <CCol >
                                        <CWidgetStatsA style={{ height: 160, backgroundColor: '#ff4d4d', color: 'white' }} value={<><h2>
                                            465
                                        </h2>
                                        </>}
                                            title={<>
                                                <h5 className=" fw-normal">
                                                    Total Suppliers
                                                </h5>
                                            </>} />
                                    </CCol>

                                </CRow>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>

                <br></br>
            </>
        )
    }

    return (
        <CContainer fluid>
            {/* <div>
            <h4>KPI Dashboard- Team KPI</h4>
        </div> */}
            <CCard className="mb-4">
                <CCardBody>
                    <CRow>
                        <CCol sm={5}>
                            <h4>
                                Team KPI
                            </h4>
                        </CCol>

                    </CRow>

                    <Tabs
                        defaultActiveKey="bookingexperience"
                        id="uncontrolled-tab-example"
                        className="mt-4"
                    >
                        <Tab eventKey="bookingexperience" title="Booking Experience">
                            <Booking />
                        </Tab>

                        <Tab eventKey="travellerExperience" title="Traveller Experience">
                            <Traveler />
                        </Tab>
                        <Tab eventKey="supplierExperience" title="Supplier Experience">
                            <Supplier />
                        </Tab>
                        <Tab eventKey="accountExperience" title="Accounts">
                            <Account />
                        </Tab>
                    </Tabs>






                </CCardBody>

            </CCard>
        </CContainer>

    );
};

export default KpiDashboard;