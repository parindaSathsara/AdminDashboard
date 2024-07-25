import React from 'react'

import {
    CContainer,
    CHeader,
    CHeaderBrand,
    CHeaderDivider,
    CHeaderNav,
    CHeaderToggler,
    CNavLink,
    CNavItem,
    CRow,
    CCol,
    CImage,
    CCardBody,
    CCardTitle,
    CCardText,
    CButton,
    CBadge,
    CListGroup,
    CListGroupItem,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell
} from '@coreui/react'


import '../MoreProductView.css'
import MaterialTable from 'material-table';


export default function EducationProductView(props) {

    const basicDetails = props.productData?.educationData
    const inventory = props.productData?.educationInventory
    const rate = props.productData?.educationRate
    // const packageData = props.productData?.lifestylePackageData
    const bookData = props.productData?.educationBookData
    const sessionData = props.productData?.sessionData


    console.log(sessionData)

    function renderVariations(value) {
        let variations = [];
        for (let i = 1; i <= 5; i++) {
            if (value?.[`variation_type${i}`] && value?.[`variant_type${i}`]) {
                variations.push(`${value?.[`variation_type${i}`]} - ${value?.[`variant_type${i}`]}`);
            }
        }
        return variations.length > 0 ? variations.join(', ') : '-';
    }


    const InventoryDetails = () => {
        const columns = [
            { title: 'ID', field: 'id' },
            { title: 'Education ID', field: 'edu_id' },
            { title: 'Rate ID', field: 'rate_id' },
            { title: 'Service Location Type ID', field: 'service_location_typeid' },
            { title: 'Course Inventory Start Date', field: 'course_inv_startdate' },
            { title: 'Course Inventory End Date', field: 'course_inv_enddate' },
            { title: 'Course Day', field: 'course_day' },
            { title: 'Session No', field: 'session_no' },
            { title: 'Common Session', field: 'common_session' },
            { title: 'Course Start Time', field: 'course_startime' },
            { title: 'Course End Time', field: 'course_endtime' },
            { title: 'Max Adult Occupancy', field: 'max_adult_occupancy' },
            { title: 'Max Child Occupancy', field: 'max_child_occupancy' },
            { title: 'Max Total Occupancy', field: 'max_total_occupancy' },
            { title: 'Total Inventory', field: 'total_inventory' },
            { title: 'Used Inventory', field: 'used_inventory' },
            { title: 'Blackout Date', field: 'blackout_date' },
            { title: 'Blackout Day', field: 'blackout_day' },
            { title: 'Inclusions', field: 'inclusions' },
            { title: 'Exclusions', field: 'exclusions' },
            { title: 'Created At', field: 'created_at' },
            { title: 'Updated At', field: 'updated_at' },
            { title: 'Updated By', field: 'updated_by' },
        ];

        const data = [
            {
                id: inventory?.id,
                edu_id: inventory?.edu_id,
                rate_id: inventory?.rate_id,
                service_location_typeid: inventory?.service_location_typeid,
                course_inv_startdate: inventory?.course_inv_startdate,
                course_inv_enddate: inventory?.course_inv_enddate,
                course_day: inventory?.course_day,
                session_no: inventory?.session_no,
                common_session: inventory?.common_session,
                course_startime: inventory?.course_startime,
                course_endtime: inventory?.course_endtime,
                max_adult_occupancy: inventory?.max_adult_occupancy,
                max_child_occupancy: inventory?.max_child_occupancy,
                max_total_occupancy: inventory?.max_total_occupancy,
                total_inventory: inventory?.total_inventory,
                used_inventory: inventory?.used_inventory,
                blackout_date: inventory?.blackout_date,
                blackout_day: inventory?.blackout_day,
                inclusions: inventory?.inclusions,
                exclusions: inventory?.exclusions,
                created_at: inventory?.created_at,
                updated_at: inventory?.updated_at,
                updated_by: inventory?.updated_by,
            },
        ];

        return (
            <MaterialTable
                title="Inventory Details"
                columns={columns}
                data={data}
                options={{
                    headerStyle: {
                        fontSize: '14px', // Adjust the header font size here
                    },
                    cellStyle: {
                        fontSize: '14px', // Adjust the column font size here
                    },
                    paging: false,
                    search: false,
                    columnsButton: true,
                    exportButton: true,
                }}
            />
        );
    };


    const RateDetails = () => {
        const columns = [
            { title: 'Rate ID', field: 'rate_id' },
            { title: 'Education ID', field: 'edu_id' },
            { title: 'Education Detail ID', field: 'edu_detail_id' },
            { title: 'Service Location Type ID', field: 'service_location_typeid' },
            { title: 'Education Inventory ID', field: 'edu_inventory_id' },
            { title: 'Pricing Type', field: 'pricing_type' },
            { title: 'Sale Start', field: 'sale_start' },
            { title: 'Sale End', field: 'sale_end' },
            { title: 'Currency', field: 'currency' },
            { title: 'Minimum Number of Students', field: 'min_num_students' },
            { title: 'Maximum Number of Students', field: 'max_num_students' },
            { title: 'Adult Course Fee', field: 'adult_course_fee' },
            { title: 'Child Course Fee', field: 'child_course_fee' },
            { title: 'Senior Citizen Course Fee', field: 'senior_citizen_course_fee' },
            { title: 'Military Course Fee', field: 'military_course_fee' },
            { title: 'Total Cost of Course', field: 'total_cost_course' },
            { title: 'Deadline Number of Days', field: 'deadline_no_ofdays' },
            { title: 'Course Admission Deadline', field: 'course_admission_deadline' },
            { title: 'Course Refund Policy', field: 'course_refund_policy' },
            { title: 'Course Mark Up', field: 'course_mark_up' },
            { title: 'Mark Up Type', field: 'mark_up_type' },
            { title: 'Created At', field: 'created_at' },
            { title: 'Updated At', field: 'updated_at' },
            { title: 'Updated By', field: 'updated_by' },
        ];

        const data = [
            {
                rate_id: rate?.rate_id,
                edu_id: rate?.edu_id,
                edu_detail_id: rate?.edu_detail_id,
                service_location_typeid: rate?.service_location_typeid,
                edu_inventory_id: rate?.edu_inventory_id,
                pricing_type: rate?.pricing_type,
                sale_start: rate?.sale_start,
                sale_end: rate?.sale_end,
                currency: rate?.currency,
                min_num_students: rate?.min_num_students,
                max_num_students: rate?.max_num_students,
                adult_course_fee: rate?.adult_course_fee,
                child_course_fee: rate?.child_course_fee,
                senior_citizen_course_fee: rate?.senior_citizen_course_fee,
                military_course_fee: rate?.military_course_fee,
                total_cost_course: rate?.total_cost_course,
                deadline_no_ofdays: rate?.deadline_no_ofdays,
                course_admission_deadline: rate?.course_admission_deadline,
                course_refund_policy: rate?.course_refund_policy,
                course_mark_up: rate?.course_mark_up,
                mark_up_type: rate?.mark_up_type,
                created_at: rate?.created_at,
                updated_at: rate?.updated_at,
                updated_by: rate?.updated_by,
            },
        ];

        return (
            <MaterialTable
                title="Rate Details"
                columns={columns}
                data={data}
                options={{
                    headerStyle: {
                        fontSize: '14px', // Adjust the header font size here
                    },
                    cellStyle: {
                        fontSize: '14px', // Adjust the column font size here
                    },
                    paging: false,
                    search: false,
                    columnsButton: true,
                    exportButton: true,
                }}
            />
        );
    };




    return (
        <CContainer style={{ backgroundColor: 'white', padding: 20, borderRadius: 20, paddingRight: 60, paddingLeft: 60 }} fluid>
            <CRow>

                <CCol xs="12" lg="3">
                    <div style={{ width: '100%', paddingTop: '100%', position: 'relative', overflow: 'hidden', borderRadius: '12px' }}>
                        <CImage
                            src={basicDetails?.["image_path"]?.split(",")?.[0]}
                            fluid
                            style={{
                                position: 'absolute',
                                top: '0',
                                left: '0',
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                    </div>
                </CCol>



                {console.log(sessionData)}

                <CCol xs="12" lg="3" style={{ backgroundColor: '#EEE2DE', borderRadius: 10, padding: 20 }}>
                    <h6 className='mb-2'>Class Schedule</h6>


                    <CCol style={{ fontSize: 12, height: 350, overflow: 'scroll', scrollbarWidth: 'thin', scrollbarColor: '#888888 #F5F5F5' }}>
                        <CTable>
                            <CTableHead>
                                <CTableRow>

                                    <CTableHeaderCell scope="col">Start Date</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Start Time</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">End Time</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>

                            <CTableBody>

                                {sessionData?.map((data, index) => (
                                    <CTableRow>
                                        <CTableDataCell>{data?.start_date}</CTableDataCell>
                                        <CTableDataCell>{data?.start_time}</CTableDataCell>
                                        <CTableDataCell>{data?.end_time}</CTableDataCell>
                                    </CTableRow>
                                ))}

                            </CTableBody>
                        </CTable>

                    </CCol>

                </CCol>


                <CCol className='py-4'>

                    <h4 className='mb-2'>{basicDetails?.['course_name']}</h4>

                    <CCardText className='mb-4' style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                        {basicDetails?.["course_description"]}
                    </CCardText>

                    <CRow>
                        <CCol xs="12" lg="3">
                            <div style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '10px', backgroundColor: '#f8f9fa', marginBottom: '20px' }}>
                                <CCardBody>
                                    <CCardTitle className="productTitle">Preferred Booking Date</CCardTitle>
                                    <CCardText style={{ color: '#333' }} className="desc">{bookData?.["preffered_booking_date"]}</CCardText>
                                </CCardBody>
                            </div>

                        </CCol>



                        <CCol xs="12" lg="3">
                            <div style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '10px', backgroundColor: '#f8f9fa', marginBottom: '20px' }}>
                                <CCardBody>
                                    <CCardTitle className="productTitle">Course Start Date</CCardTitle>
                                    <CCardText style={{ color: '#333' }} className="desc">{inventory?.["course_inv_startdate"]}</CCardText>
                                </CCardBody>
                            </div>
                        </CCol>

                        <CCol xs="12" lg="3">
                            <div style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '10px', backgroundColor: '#f8f9fa', marginBottom: '20px' }}>
                                <CCardBody>
                                    <CCardTitle className="productTitle">Course End Date</CCardTitle>
                                    <CCardText style={{ color: '#333' }} className="desc">{inventory?.course_inv_enddate}</CCardText>
                                </CCardBody>
                            </div>
                        </CCol>

                        <CCol xs="12" lg="3">
                            <div style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '10px', backgroundColor: '#f8f9fa', marginBottom: '20px' }}>
                                <CCardBody>
                                    <CCardTitle className="productTitle">Course End Date</CCardTitle>
                                    <CCardText style={{ color: '#333' }} className="desc">{inventory?.course_startime} - {inventory?.course_endtime}</CCardText>
                                </CCardBody>
                            </div>
                        </CCol>



                    </CRow>


                    <CRow>
                        <CCol xs="12" lg="6">
                            <div style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '10px', backgroundColor: '#f8f9fa', marginBottom: '20px' }}>
                                <CCardBody>
                                    <CCardTitle className="productTitle">Student Name</CCardTitle>
                                    <CCardText style={{ color: '#333' }} className="desc">{bookData?.["student_name"]}</CCardText>
                                </CCardBody>
                            </div>

                        </CCol>



                        <CCol xs="12" lg="3">
                            <div style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '10px', backgroundColor: '#f8f9fa', marginBottom: '20px' }}>
                                <CCardBody>
                                    <CCardTitle className="productTitle">Student Age</CCardTitle>
                                    <CCardText style={{ color: '#333' }} className="desc">{bookData?.["student_age"]}</CCardText>
                                </CCardBody>
                            </div>
                        </CCol>

                        <CCol xs="12" lg="3">
                            <div style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '10px', backgroundColor: '#f8f9fa', marginBottom: '20px' }}>
                                <CCardBody>
                                    <CCardTitle className="productTitle">Student Type</CCardTitle>
                                    <CCardText style={{ color: '#333' }} className="desc">{bookData?.["student_type"]}</CCardText>
                                </CCardBody>
                            </div>
                        </CCol>


                    </CRow>



                </CCol>




            </CRow>




            <CCol className='my-4'>

                <InventoryDetails />


            </CCol>



            <CCol className='my-4'>
                <RateDetails />
            </CCol>




        </CContainer>
    )
}