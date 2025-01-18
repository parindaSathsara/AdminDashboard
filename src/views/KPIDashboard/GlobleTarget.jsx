import { CCard, CCardBody, CCol, CContainer, CHeader, CRow, CWidgetStatsA } from '@coreui/react';
import React, { useState, useEffect } from 'react';
import { Tab, Tabs } from 'react-bootstrap'
import { DateRangePicker } from 'rsuite'
import 'rsuite/dist/rsuite.css'
import { format } from 'date-fns';


const GlobalTarget = () => {
    const [selectedDates, setSelectedDates] = useState([])


    useEffect(() => {
        
        const currentDate = new Date();
        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 30);
        const formattedStartDate = format(startDate, 'yyyy-MM-dd');
        const formattedEndDate = format(currentDate, 'yyyy-MM-dd');
        setSelectedDates([formattedStartDate, formattedEndDate])
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

    const GlobalTarget = () => {
        return (
            <>
                <br></br>
                <CRow>
                    <CCol >
                        <CCard >
                            <CHeader>
                                All
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
                                        <div style={{}}>
                                            <CWidgetStatsA style={{ height: 160, backgroundColor: '#ff4d4d', color: 'white' }} value={<><h2>
                                                900
                                            </h2>
                                            </>}
                                                title={<>
                                                    <h5 className=" fw-normal">
                                                        Passenger Arrival Count
                                                    </h5>
                                                </>} />
                                        </div>

                                    </CCol>
                                    <CCol sm={6} xl={6} xxl={6}>
                                        <CWidgetStatsA style={{ height: 160, backgroundColor: '#ff4d4d', color: 'white' }} value={<><h2>
                                            36 <span class="fs-5">$</span>
                                        </h2>
                                        </>}
                                            title={<>
                                                <h5 className=" fw-normal">
                                                    Revenue Value
                                                </h5>
                                            </>} />
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