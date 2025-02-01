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

    const basicDetails = props.productData?.productBasicData
    const inventory = props.productData?.productInventory
    const rate = props.productData?.productRates
    // console.log(inventory)
    // const packageData = props.productData?.lifestylePackageData
    const bookData = props.productData?.educationBookData
    const sessionData = props.productData?.productSessions


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
            { title: 'Detail ID', field: 'id' },
            { title: 'Education ID', field: 'edu_id' },
            { title: 'Rate ID', field: 'rate_id' },
            { title: 'Course Start Date', field: 'course_inv_startdate' },
            { title: 'Course End Date', field: 'course_inv_enddate' },
            { title: 'Course Start Time', field: 'course_startime' },
            { title: 'Course End Time', field: 'course_endtime' },
            { title: 'Course Days', field: 'course_day' },
            { title: 'Total Inventory', field: 'total_inventory' },
            { title: 'Used Inventory', field: 'used_inventory' },
            { title: 'Max Adult Occupancy', field: 'max_adult_occupancy' },
            { title: 'Max Child Occupancy', field: 'max_child_occupancy' },
            { title: 'Max Total Occupancy', field: 'max_total_occupancy' },
            { title: 'Created At', field: 'created_at' },
            { title: 'Updated At', field: 'updated_at' },
            { title: 'Updated By', field: 'updated_by' },
        ];

        const data = inventory?.map(item => ({
            id: item?.id,
            edu_id: item?.edu_id,
            rate_id: item?.rate_id,
            course_inv_startdate: item?.course_inv_startdate,
            course_inv_enddate: item?.course_inv_enddate,
            course_startime: item?.course_startime,
            course_endtime: item?.course_endtime,
            course_day: item?.course_day,
            total_inventory: item?.total_inventory,
            used_inventory: item?.used_inventory,
            max_adult_occupancy: item?.max_adult_occupancy,
            max_child_occupancy: item?.max_child_occupancy,
            max_total_occupancy: item?.max_total_occupancy,
            created_at: item?.created_at,
            updated_at: item?.updated_at,
            updated_by: item?.updated_by,
        }));

        return (
            <MaterialTable
            
                title="Inventory Details"
                columns={columns}
                data={data}
                options={{
                    headerStyle: {
                        fontSize: '14px', // Adjust the header font size here
                           backgroundColor: '#E5D3FA'
                    },
                    cellStyle: {
                        fontSize: '14px', // Adjust the column font size here
                    },
                    paging: true,
                    search: false,
                    columnsButton: true,
                    // exportButton: true,
                }}
            />
        );
    };


    const RateDetails = () => {
        const columns = [
            { title: 'Detail ID', field: 'id' },
            { title: 'Education ID', field: 'edu_id' },
            { title: 'Education Detail ID', field: 'edu_detail_id' },
            { title: 'Pricing Type', field: 'pricing_type' },
            { title: 'Currency', field: 'currency' },
            { title: 'Adult Course Fee', field: 'adult_course_fee' },
            { title: 'Child Course Fee', field: 'child_course_fee' },
            { title: 'Military Course Fee', field: 'military_course_fee' },
            { title: 'Senior Citizen Course Fee', field: 'senior_citizen_course_fee' },
            { title: 'Actual Adult Course Fee', field: 'actual_adult_course_fee' },
            { title: 'Actual Child Course Fee', field: 'actual_child_course_fee' },
            { title: 'Total Cost Course', field: 'total_cost_course' },
            { title: 'Actual Total Cost Course', field: 'actual_total_cost_course' },
            { title: 'Course Admission Deadline', field: 'course_admission_deadline' },
            { title: 'Course Mark Up', field: 'course_mark_up' },
            { title: 'Mark Up Type', field: 'mark_up_type' },
            { title: 'Course Refund Policy', field: 'course_refund_policy' },
            { title: 'Sale Start', field: 'sale_start' },
            { title: 'Sale End', field: 'sale_end' },
            { title: 'Service Location Type ID', field: 'service_location_typeid' },
            { title: 'Max Number of Students', field: 'max_num_students' },
            { title: 'Min Number of Students', field: 'min_num_students' },
            { title: 'Deadline Number of Days', field: 'deadline_no_ofdays' },
            { title: 'Created At', field: 'created_at' },
            { title: 'Updated At', field: 'updated_at' },
            { title: 'Updated By', field: 'updated_by' },
        ];

        const data = rate?.map(item => ({
            id: item?.id,
            edu_id: item?.edu_id,
            edu_detail_id: item?.edu_detail_id,
            pricing_type: item?.pricing_type,
            currency: item?.currency,
            adult_course_fee: item?.adult_course_fee,
            child_course_fee: item?.child_course_fee,
            military_course_fee: item?.military_course_fee,
            senior_citizen_course_fee: item?.senior_citizen_course_fee,
            actual_adult_course_fee: item?.actual_adult_course_fee,
            actual_child_course_fee: item?.actual_child_course_fee,
            total_cost_course: item?.total_cost_course,
            actual_total_cost_course: item?.actual_total_cost_course,
            course_admission_deadline: item?.course_admission_deadline,
            course_mark_up: item?.course_mark_up,
            mark_up_type: item?.mark_up_type,
            course_refund_policy: item?.course_refund_policy,
            sale_start: item?.sale_start,
            sale_end: item?.sale_end,
            service_location_typeid: item?.service_location_typeid,
            max_num_students: item?.max_num_students,
            min_num_students: item?.min_num_students,
            deadline_no_ofdays: item?.deadline_no_ofdays,
            created_at: item?.created_at,
            updated_at: item?.updated_at,
            updated_by: item?.updated_by,
        }));


        return (
            <MaterialTable
                title="Rate Details"
                columns={columns}
                data={data}
                style={{ backgroundColor: '#FBFAF4' }}
                options={{
                    headerStyle: {
                          backgroundColor: '#FEF5D1',
                        fontSize: '14px', // Adjust the header font size here
                    },
                    cellStyle: {
                        fontSize: '14px', // Adjust the column font size here
                    },
                    paging: false,
                    search: false,
                    columnsButton: true,
                    // exportButton: true,
                }}
            />
        );
    };

    function stripHtmlTags(html) {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;
        return tempDiv.textContent || tempDiv.innerText || "";
    }


    return (
        <CContainer style={{ backgroundColor: 'white', padding: 20, borderRadius: 20, paddingRight: 60, paddingLeft: 60 }} fluid>
            <CRow>

                <CCol xs="12" lg="3">
                    <div style={{ width: '100%', paddingTop: '100%', position: 'relative', overflow: 'hidden', borderRadius: '12px' }}>
                        <CImage
                            src={basicDetails?.[0]?.["image_path"]?.split(",")?.[0]}
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



                {/* {console.log(sessionData)} */}

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

                    <h4 className='mb-2'>{stripHtmlTags(basicDetails?.[0]?.['course_name'])}</h4>

                    <CCardText className='mb-4' style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                        {stripHtmlTags(basicDetails?.[0]?.["course_description"])}
                    </CCardText>
                </CCol>
            </CRow>




            <CCol className='my-4'>
            <div style={{ border: '2px solid #E5D3FA', borderRadius: '8px', padding: '10px', backgroundColor: '#FAF7FE', marginBottom: '20px' }}>
                <InventoryDetails />
                                </div>

            </CCol>



            <CCol className='my-4'>
            <div style={{ border: '2px solid #FEF5D1', borderRadius: '8px', padding: '10px', backgroundColor: '#FBFAF4', marginBottom: '20px' }}>
                <RateDetails />
                </div>
            </CCol>




        </CContainer>
    )
}