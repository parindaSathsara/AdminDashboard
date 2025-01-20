import { CCard, CCardBody, CCol, CContainer, CHeader, CRow, CWidgetStatsA } from '@coreui/react';
import React, { useState, useEffect } from 'react';
import { Tab, Tabs } from 'react-bootstrap'
import { DateRangePicker } from 'rsuite'
import 'rsuite/dist/rsuite.css'
import { format } from 'date-fns';
import { getGlobalTargetDetails } from './KpiService'
import Select from "react-select";

const GlobalTarget = () => {
    const [selectedDates, setSelectedDates] = useState([])
    const [globalTargetData, setGlobalTargetData] = useState([])
    const [selectedCurrency, setSelectedCurrency] = useState('USD')
    const currencies = [{ value: 'USD', label: 'USD' }, { value: 'INR', label: 'INR' }, { value: 'LKR', label: 'LKR' }, { value: 'SGD', label: 'SGD' }]

    useEffect(() => {

        const currentDate = new Date();
        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 30);
        const formattedStartDate = format(startDate, 'yyyy-MM-dd');
        const formattedEndDate = format(currentDate, 'yyyy-MM-dd');
        setSelectedDates([formattedStartDate, formattedEndDate])
        // loadData([formattedStartDate, formattedEndDate]);
    }, []);

    useEffect(() => {
        getGlobalTargetDetails(selectedCurrency).then((res) => {
            setGlobalTargetData(res)
        }).catch((err) => { })
    }, [selectedCurrency]);

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

    const GlobalTarget = () => {
        return (
            <>
                <br></br>
                <CRow>
                    <CCol >
                        <CCard >
                            <CHeader>
                                All
                                {/* <DateRangePicker
                                    style={{ marginLeft: 0 }}
                                    format="yyyy/MM/dd"
                                    onChange={handleDateRangeChangeBooking}
                                    value={selectedDates.length > 0 ? [new Date(selectedDates[0]), new Date(selectedDates[1])] : null}
                                /> */}

                                <Select
                                    options={currencies}
                                    defaultValue={{ value: "USD", label: "USD" }}
                                    value={selectedCurrency}
                                    onChange={(selectedOption) => setSelectedCurrency(selectedOption?.value)}
                                    placeholder="Select Currency"
                                    isClearable
                                />

                            </CHeader>
                            <CCardBody>
                                <CRow>
                                    <CCol sm={3} xl={3} xxl={3}>
                                        <div style={{}}>
                                            <CWidgetStatsA style={{ height: 160, backgroundColor: '#ff4d4d', color: 'white' }} value={<><h3>
                                                {globalTargetData?.total_orders}
                                            </h3>
                                            </>}
                                                title={<>
                                                    <h5 className=" fw-normal">
                                                       Total Orders
                                                    </h5>
                                                </>} />
                                        </div>

                                    </CCol>
                                    <CCol sm={3} xl={3} xxl={3}>
                                        <CWidgetStatsA style={{ height: 160, backgroundColor: '#ff4d4d', color: 'white' }} value={<><h3>
                                            {globalTargetData?.total_selling_products}
                                        </h3>
                                        </>}
                                            title={<>
                                                <h5 className=" fw-normal">
                                                    Total Selling Products
                                                </h5>
                                            </>} />
                                    </CCol>
                                    <CCol sm={3} xl={3} xxl={3}>
                                        <div style={{}}>
                                            <CWidgetStatsA style={{ height: 160, backgroundColor: '#ff4d4d', color: 'white' }} value={<><h3>
                                                {globalTargetData?.total_revenue_amount}
                                            </h3>
                                            </>}
                                                title={<>
                                                    <h5 className=" fw-normal">
                                                        Total Revenue Amount ({selectedCurrency})
                                                    </h5>
                                                </>} />
                                        </div>

                                    </CCol>
                                    <CCol sm={3} xl={3} xxl={3}>
                                        <CWidgetStatsA style={{ height: 160, backgroundColor: '#ff4d4d', color: 'white' }} value={<><h3>
                                            {globalTargetData?.total_paid_amount}
                                        </h3>
                                        </>}
                                            title={<>
                                                <h5 className=" fw-normal">
                                                    Total Paid Amount ({selectedCurrency})
                                                </h5>
                                            </>} />
                                    </CCol>
                                </CRow>
                                <br></br>
                                <CRow>
                                    <CCol sm={3} xl={3} xxl={3}>
                                        <div style={{}}>
                                            <CWidgetStatsA style={{ height: 160, backgroundColor: '#ff4d4d', color: 'white' }} value={<><h3>
                                                {globalTargetData?.total_pending_amount}
                                            </h3>
                                            </>}
                                                title={<>
                                                    <h5 className=" fw-normal">
                                                        Total Pending Amount ({selectedCurrency})
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
                                Global Targets
                            </h4>
                        </CCol>

                    </CRow>

                    <GlobalTarget />
                </CCardBody>

            </CCard>
        </CContainer>

    );
};

export default GlobalTarget;