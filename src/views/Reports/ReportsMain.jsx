import React, { useCallback, useEffect, useState } from 'react';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CContainer,
    CFormLabel,
    CButton,
    CRow
} from '@coreui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';

import './ReportsMain.css'
import OrderCheckoutsReport from './OrderCheckouts/OrderCheckoutsReport';
import axios from 'axios';
import { getReports } from './services/reportingServices';
import moment from 'moment';
import LifestylesCategoryData from './CategoryData/LifestylesCategoryData';
import LoaderPanel from 'src/Panels/LoaderPanel';
import EssentialsCategoryData from './CategoryData/EssentialsCategoryData';
import EducationCategoryData from './CategoryData/EducationCategoryData';



const ReportGenerationPage = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [category, setCategory] = useState({ value: 0 });

    const [reportType, setReportType] = useState(null)
    const [reportDataSet, setReportDataSet] = useState([])


    const [searchData, setSearchData] = useState([])


    const [loading, setLoading] = useState(false)



    // const categories = [
    //     { value: '0', label: 'All Categories', visible: false },
    //     { value: '1', label: 'Essentials' },
    //     { value: '2', label: 'Non Essentials' },
    //     { value: '3', label: 'Lifestyles' },
    //     { value: '5', label: 'Education' },
    //     { value: '4', label: 'Hotels' },
    // ];

    const [categories, setCategories] = useState([
        { value: '0', label: 'All Categories' },
        { value: '1', label: 'Essentials' },
        { value: '2', label: 'Non Essentials' },
        { value: '3', label: 'Lifestyles' },
        { value: '5', label: 'Education' },
        { value: '4', label: 'Hotels' },
    ])

    const reportTypes = [
        { value: 'products_report', label: 'Products Report' },
        { value: 'orders_report', label: 'Orders Report' }
    ];


    useEffect(() => {
        if (reportType?.value == "orders_report") {
            setCategories(
                [
                    { value: '0', label: 'All Categories' },
                    { value: '1', label: 'Essentials' },
                    { value: '2', label: 'Non Essentials' },
                    { value: '3', label: 'Lifestyles' },
                    { value: '5', label: 'Education' },
                    { value: '4', label: 'Hotels' },
                ]
            )
        }
        else {
            setCategories(
                [

                    { value: '1', label: 'Essentials' },
                    { value: '2', label: 'Non Essentials' },
                    { value: '3', label: 'Lifestyles' },
                    { value: '5', label: 'Education' },
                    { value: '4', label: 'Hotels' },
                ]
            )
        }
    }, [reportType])



    const handleGenerateReport = () => {
        // Implement the logic to fetch and display the report
        // console.log('Generating report for:', { startDate, endDate, category });
        const dataSet = {
            startDate: moment(startDate).format("YYYY-MM-DD"),
            endDate: moment(endDate).format("YYYY-MM-DD"),
            category: category["value"],
            reportType: reportType["value"]
        }

        setLoading(true)
        getReports(dataSet).then(response => {
            setReportDataSet(response)

            setLoading(false)
        }).catch(response => {
            setLoading(false)
        })

    };



    useEffect(() => {

        setReportDataSet([])

    }, [startDate, endDate, reportType, category])

    return (
        <CContainer fluid>

            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Report Generation</strong>
                    </CCardHeader>
                    <CCardBody>
                        <CRow className="align-items-end">
                            <CCol xs={12} sm={6} lg={3}>
                                <CFormLabel htmlFor="start-date">Start Date</CFormLabel>
                                <br></br>
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    className="form-control full-width"
                                    placeholderText="Select start date"
                                    id="start-date"
                                />
                            </CCol>
                            <CCol xs={12} sm={6} lg={3}>
                                <CFormLabel htmlFor="end-date">End Date</CFormLabel>
                                <br></br>
                                <DatePicker
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    className="form-control full-width"
                                    placeholderText="Select end date"
                                    id="end-date"
                                />
                            </CCol>


                            <CCol xs={12} sm={6} lg={2}>
                                <CFormLabel htmlFor="category">Report Type</CFormLabel>
                                <br></br>
                                <Select
                                    options={reportTypes}
                                    value={reportType}
                                    onChange={(selectedOption) => {
                                        setReportType(selectedOption)

                                        setCategory([])
                                    }}
                                    placeholder="Select a Report Type"
                                />
                            </CCol>

                            <CCol xs={12} sm={6} lg={2}>
                                <CFormLabel htmlFor="category">Category</CFormLabel>

                                <br></br>

                                <Select
                                    options={categories}
                                    value={category}
                                    onChange={(selectedOption) => setCategory(selectedOption)}
                                    placeholder="Select a category"
                                />
                            </CCol>


                            <CCol xs={12} sm={6} lg={2} className="d-flex justify-content-end mt-3">
                                <CButton color="dark" className='full-width' onClick={handleGenerateReport}>
                                    Generate Report
                                </CButton>
                            </CCol>
                        </CRow>
                    </CCardBody>
                </CCard>
            </CCol>



            {loading == true ?

                <LoaderPanel message={"Report Data Fetching"} />
                :
                <>



                    {reportDataSet.length > 0 ?
                        <>


                            {reportType?.["value"] === "products_report" ?

                                <>
                                    {category?.value == 3 ?
                                        <LifestylesCategoryData data={reportDataSet}></LifestylesCategoryData>
                                        :
                                        null
                                    }
                                    {category?.value == 1 || category?.value == 2 ?
                                        <EssentialsCategoryData data={reportDataSet} category={category?.value}></EssentialsCategoryData>
                                        :
                                        null
                                    }

                                    {category?.value == 5 ?
                                        <EducationCategoryData data={reportDataSet}></EducationCategoryData>
                                        :
                                        null
                                    }



                                </>
                                :

                                <OrderCheckoutsReport dataSet={reportDataSet} category={category?.value}></OrderCheckoutsReport>


                            }








                        </>

                        :
                        null
                    }



                </>

            }




        </CContainer>
    );
};

export default ReportGenerationPage;
