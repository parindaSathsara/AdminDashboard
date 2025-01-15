import { CCard, CCardBody, CCol, CContainer, CHeader, CRow, CWidgetStatsA, CFormSelect } from '@coreui/react';
import React, { useState, useEffect } from 'react';
import { Tab, Tabs } from 'react-bootstrap'
import { DateRangePicker } from 'rsuite'
import 'rsuite/dist/rsuite.css'
import { format } from 'date-fns';
import Select from "react-select"

const KpiDashboard = () => {
    const [selectedDates, setSelectedDates] = useState([])
    const [selectedDatesTraveler, setSelectedDatesTraveler] = useState([])


    useEffect(() => {
        setSelectedDatesTraveler
        const currentDate = new Date();
        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 30);
        const formattedStartDate = format(startDate, 'yyyy-MM-dd');
        const formattedEndDate = format(currentDate, 'yyyy-MM-dd');
        setSelectedDates([formattedStartDate, formattedEndDate])
        setSelectedDatesTraveler([formattedStartDate, formattedEndDate])
        // loadData([formattedStartDate, formattedEndDate]);
    }, []);

    const handleDateRangeChangeBooking = (value) => {
        if (value) {
            const formattedStartDate = format(value[0], 'yyyy-MM-dd')
            const formattedEndDate = format(value[1], 'yyyy-MM-dd')
            setSelectedDates([formattedStartDate, formattedEndDate])
            console.log(formattedStartDate, formattedEndDate)
        } else {
            setSelectedDates([])
        }
    }
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
                                    onChange={handleDateRangeChangeBooking}
                                    value={selectedDates.length > 0 ? [new Date(selectedDates[0]), new Date(selectedDates[1])] : null}
                                />
                            </CHeader>
                            <CCardBody>
                                <CRow>
                                    <CCol sm={6} xl={6} xxl={6}>
                                        <CWidgetStatsA style={{ height: 160, backgroundColor: '#ff4d4d', color: 'white' }} value={<><h2>
                                            6 <span class="fs-5">min</span>
                                        </h2>
                                        </>}
                                            title={<>
                                                <h5 className=" fw-normal">
                                                    Order Confirmation
                                                </h5>
                                            </>} />
                                    </CCol>
                                    <CCol sm={6} xl={6} xxl={6}>
                                        <CWidgetStatsA style={{ height: 160, backgroundColor: '#ff4d4d', color: 'white' }} value={<><h2>
                                            5 <span class="fs-5">min</span>
                                        </h2>
                                        </>}
                                            title={<>
                                                <h5 className=" fw-normal">
                                                    Order Cancellation
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
                                    <CCol sm={6} xl={6} xxl={6}>
                                        <CWidgetStatsA style={{ height: 160, backgroundColor: '#ff4d4d', color: 'white' }} value={<><h2>
                                            <span class="fs-5">min</span>
                                        </h2>
                                        </>}
                                            title={<>
                                                <h5 className=" fw-normal">
                                                    Order Confirmation
                                                </h5>
                                            </>} />
                                    </CCol>
                                    <CCol sm={6} xl={6} xxl={6}>
                                        <CWidgetStatsA style={{ height: 160, backgroundColor: '#ff4d4d', color: 'white' }} value={<><h2>
                                            2 <span class="fs-5">min</span>
                                        </h2>
                                        </>}
                                            title={<>
                                                <h5 className=" fw-normal">
                                                    1 Order Cancellation
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
                    <CCol >
                        <CCard sm={6} xl={4} xxl={3} style={{ borderColor: '#d4cec1', borderWidth: 3 }}>
                            <CHeader>By User
                                <Select
                                    // id={id}
                                    options={categories.map((option) => ({
                                        value: option.value,
                                        label: option.name,
                                    }))}
                                    defaultValue={{ value: "0", label: "All User" }}
                                    // value={options.find((option) => option.origin_rate_id === `${value}`)}
                                    // onChange={(selectedOption) =>
                                    //     onChange({
                                    //         name,
                                    //         value: selectedOption ? selectedOption.value : "",
                                    //     })
                                    // }
                                    placeholder="Select an User"
                                    isClearable
                                />
                            </CHeader>
                            <CCardBody>
                                <CRow>
                                    <CCol sm={6} xl={6} xxl={6}>
                                        <CWidgetStatsA style={{ height: 160, backgroundColor: '#ff4d4d', color: 'white' }} value={<><h2>
                                            3 <span class="fs-5">min</span>
                                        </h2>
                                        </>}
                                            title={<>
                                                <h5 className=" fw-normal">
                                                    Order Confirmation
                                                </h5>
                                            </>} />
                                    </CCol>
                                    <CCol sm={6} xl={6} xxl={6}>
                                        <CWidgetStatsA style={{ height: 160, backgroundColor: '#ff4d4d', color: 'white' }} value={<><h2>
                                            1  <span class="fs-5">min</span>
                                        </h2>
                                        </>}
                                            title={<>
                                                <h5 className=" fw-normal">
                                                    Order Cancellation
                                                </h5>
                                            </>} />
                                    </CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>
                    </CCol>
                    <CCol >

                    </CCol>
                </CRow>
                <br></br></>
        )
    }

    const Traveler = () => {

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

                <CRow>
                    <CCol sm={12} xl={12} xxl={12} >
                        <CCard>
                            <CHeader>Feedbacks</CHeader>
                            <CCardBody>
                                <CRow>
                                    {/* <CCol sm={6} xl={6} xxl={6}>
                    <CWidgetStatsA style={{ height: 160, backgroundColor: '#ff4d4d', color: 'white' }} value={<><h2>
                      3 Min
                    </h2>
                    </>}
                        title={<>
                            <h5 className=" fw-normal">
                              Order Confirmation (min)
                            </h5>
                        </>} />
                </CCol>
                <CCol sm={6} xl={6} xxl={6}>
                    <CWidgetStatsA style={{ height: 160, backgroundColor: '#ff4d4d', color: 'white' }} value={<><h2>
                      1  Min
                    </h2>
                    </>}
                        title={<>
                            <h5 className=" fw-normal">
                            Order Cancellation (min)
                            </h5>
                        </>} />
                </CCol> */}
                                </CRow>
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
                    <CCol >
                        <CCard >
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
                        </CCard>
                    </CCol>

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