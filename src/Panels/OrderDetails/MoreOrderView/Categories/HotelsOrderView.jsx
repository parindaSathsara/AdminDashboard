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


import '../MoreOrderView.css'
import MaterialTable from 'material-table';
import moment from 'moment';


export default function HotelsOrderView(props) {


    // console.log(props.dataset, "Product Data value issss")
    // console.log(props, "Product Data value issss")

    const basicDetails = props.productData
    console.log(basicDetails?.decoded_data?.hotelMainRequest?.hotelData?.images, "Basic Details value is")

    // const InventoryDetails = () => {
    //     const columns = [
    //         { title: 'Inventory ID', field: 'inventoryId' },
    //         { title: 'Rate ID', field: 'rateId' },
    //         { title: 'Pickup Location', field: 'pickupLocation' },
    //         { title: 'Inventory Date', field: 'inventoryDate' },
    //         { title: 'Pickup Time', field: 'pickupTime' },
    //         { title: 'Max Adult Occupancy', field: 'maxAdultOccupancy' },
    //         { title: 'Max Children Occupancy', field: 'maxChildrenOccupancy' },
    //         { title: 'Max Total Occupancy', field: 'maxTotalOccupancy' },
    //         { title: 'Total Inventory', field: 'totalInventory' },
    //         { title: 'Allotment', field: 'allotment' },
    //         { title: 'Used', field: 'used' },
    //         { title: 'Balance', field: 'balance' },
    //         { title: 'Vehicle Type', field: 'vehicleType' },
    //         { title: 'Inclusions', field: 'inclusions' },
    //         { title: 'Exclusions', field: 'exclusions' },
    //     ];

    //     const data = [
    //         {
    //             inventoryId: inventory?.lifestyle_inventory_id,
    //             rateId: inventory?.rate_id,
    //             pickupLocation: inventory?.pickup_location,
    //             inventoryDate: inventory?.inventory_date,
    //             pickupTime: inventory?.pickup_time,
    //             maxAdultOccupancy: inventory?.max_adult_occupancy,
    //             maxChildrenOccupancy: inventory?.max_children_occupancy,
    //             maxTotalOccupancy: inventory?.max_total_occupancy,
    //             totalInventory: inventory?.total_inventory,
    //             allotment: inventory?.allotment,
    //             used: inventory?.used,
    //             balance: inventory?.balance,
    //             vehicleType: inventory?.vehicle_type,
    //             inclusions: inventory?.inclusions,
    //             exclusions: inventory?.exclusions,
    //         },
    //         // Add other data rows similarly
    //     ];

    //     return (
    //         <MaterialTable
    //             title="Inventory Details"
    //             columns={columns}
    //             data={data}
    //             options={{
    //                 headerStyle: {
    //                     fontSize: '14px', // Adjust the header font size here
    //                 },
    //                 cellStyle: {
    //                     fontSize: '14px', // Adjust the column font size here

    //                 },
    //                 paging: false,
    //                 search: false,
    //                 columnsButton: true,
    //                 exportButton: true,
    //             }}
    //         />
    //     );
    // };


    // const RateDetails = () => {
    //     const columns = [
    //         { title: 'Lifestyle ID', field: 'lifestyleId' },
    //         { title: 'Booking Start Date', field: 'bookingStartDate' },
    //         { title: 'Booking End Date', field: 'bookingEndDate' },
    //         { title: 'Travel Start Date', field: 'travelStartDate' },
    //         { title: 'Travel End Date', field: 'travelEndDate' },
    //         { title: 'Attraction Category', field: 'attractionCategory' },
    //         { title: 'Meal Plan', field: 'mealPlan' },
    //         { title: 'Market', field: 'market' },
    //         { title: 'Currency', field: 'currency' },
    //         { title: 'Adult Rate', field: 'adultRate' },
    //         { title: 'Child Rate', field: 'childRate' },
    //         { title: 'Student Rate', field: 'studentRate' },
    //         { title: 'Senior Rate', field: 'seniorRate' },
    //         { title: 'Military Rate', field: 'militaryRate' },
    //         { title: 'Other Rate', field: 'otherRate' },
    //         { title: 'Child FOC Age', field: 'childFOCAge' },
    //         { title: 'Child Age', field: 'childAge' },
    //         { title: 'Adult Age', field: 'adultAge' },
    //         { title: 'CWB Age', field: 'cwbAge' },
    //         { title: 'CNB Age', field: 'cnbAge' },
    //         { title: 'Payment Policy', field: 'paymentPolicy' },
    //         { title: 'Book By Days', field: 'bookByDays' },
    //         { title: 'Cancellation Days', field: 'cancellationDays' },
    //         { title: 'Cancellation Policy', field: 'cancellationPolicy' },
    //         { title: 'Stop Sales Dates', field: 'stopSalesDates' },
    //         { title: 'Blackout Days', field: 'blackoutDays' },
    //         { title: 'Blackout Dates', field: 'blackoutDates' },
    //     ];

    //     const data = [
    //         {
    //             lifestyleId: 1,
    //             bookingStartDate: '2024-04-09',
    //             bookingEndDate: '2024-04-15',
    //             travelStartDate: '2024-05-01',
    //             travelEndDate: '2024-05-07',
    //             attractionCategory: 'Adventure',
    //             mealPlan: 'All Inclusive',
    //             market: 'Domestic',
    //             currency: 'USD',
    //             adultRate: 100,
    //             childRate: 50,
    //             studentRate: 80,
    //             seniorRate: 90,
    //             militaryRate: 85,
    //             otherRate: 70,
    //             childFOCAge: 5,
    //             childAge: '6-12',
    //             adultAge: '13+',
    //             cwbAge: '3-5',
    //             cnbAge: '0-2',
    //             paymentPolicy: 'Prepaid',
    //             bookByDays: 7,
    //             cancellationDays: 3,
    //             cancellationPolicy: 'Full Refund',
    //             stopSalesDates: '2024-04-20',
    //             blackoutDays: 3,
    //             blackoutDates: ['2024-06-15', '2024-07-20']
    //         },
    //         // Add other data rows similarly
    //     ];

    //     return (
    //         <MaterialTable
    //             title="Rate Details"
    //             columns={columns}
    //             data={data}
    //             options={{
    //                 headerStyle: {
    //                     fontSize: '14px', // Adjust the header font size here
    //                 },
    //                 cellStyle: {
    //                     fontSize: '14px', // Adjust the column font size here
    //                 },
    //                 paging: false,
    //                 search: false,
    //                 columnsButton: true,
    //                 exportButton: true,
    //             }}
    //         />
    //     );
    // };



    // const PackageDetails = () => {

    //     const columns = [
    //         { title: 'Rate ID', field: 'rateId' },
    //         { title: 'Min Adult Occupancy', field: 'minAdultOccupancy' },
    //         { title: 'Max Adult Occupancy', field: 'maxAdultOccupancy' },
    //         { title: 'Min Child Occupancy', field: 'minChildOccupancy' },
    //         { title: 'Max Child Occupancy', field: 'maxChildOccupancy' },
    //         { title: 'Total Occupancy', field: 'totalOccupancy' },
    //         { title: 'Rate type', field: 'rateType' },
    //         { title: 'Package Rate', field: 'packageRate' },
    //         { title: 'Adult Rate', field: 'adultRate' },
    //         { title: 'Child Rate', field: 'childRate' },
    //         { title: 'Package Name', field: 'packageName' },
    //         { title: 'Package Type', field: 'packageType' },
    //     ];

    //     const data = [
    //         {
    //             rateId: packageData?.['rate_id'],
    //             minAdultOccupancy: packageData?.['min_adult_occupancy'],
    //             maxAdultOccupancy: packageData?.['max_adult_occupancy'],
    //             minChildOccupancy: packageData?.['min_child_occupancy'],
    //             maxChildOccupancy: packageData?.['max_child_occupancy'],
    //             totalOccupancy: packageData?.['total_occupancy'],
    //             rateType: packageData?.['rate_type'],
    //             packageRate: packageData?.['package_rate'],
    //             adultRate: packageData?.['adult_rate'],
    //             childRate: packageData?.['child_rate'],
    //             packageName: packageData?.['package_name'],
    //             packageType: packageData?.['package_type'],

    //         },
    //         // Add other data rows similarly
    //     ];

    //     return (
    //         <MaterialTable
    //             title="Package Details"
    //             columns={columns}
    //             data={data}
    //             options={{
    //                 headerStyle: {
    //                     fontSize: '14px', // Adjust the header font size here
    //                 },
    //                 cellStyle: {
    //                     fontSize: '14px', // Adjust the column font size here
    //                 },
    //                 paging: false,
    //                 search: false,
    //                 columnsButton: true,
    //                 exportButton: true,
    //             }}

    //         />
    //     );
    // };







    const mealAllocation = basicDetails?.decoded_data?.customerDetails?.mealAllocation;



    return (
        <CContainer style={{ backgroundColor: 'white', padding: 20, borderRadius: 20, paddingRight: 60, paddingLeft: 60 }} fluid>
            <CRow>

                <CCol xs="12" lg="3">
                    <div style={{ width: '100%', paddingTop: '100%', position: 'relative', overflow: 'hidden', borderRadius: '12px' }}>
                        <CImage
                            src={basicDetails?.decoded_data?.hotelMainRequest?.hotelData?.['images']}
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


                <CCol className='py-4'>

                    <h4 className='mb-2'>{basicDetails?.['hotelName']}</h4>

                    <CCardText className='mb-4'>{basicDetails?.["service_location"]}</CCardText>

                    <CRow>
                        <CCol xs="12" lg="4">
                            <div style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '10px', backgroundColor: '#f8f9fa', marginBottom: '20px' }}>
                                <CCardBody>
                                    <CCardTitle className="productTitle">Location</CCardTitle>
                                    <CCardText style={{ color: '#333' }} className="desc">{basicDetails?.["DAddress"]}</CCardText>
                                </CCardBody>
                            </div>
                        </CCol>

                        <CCol xs="12" lg="4">
                            <div style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '10px', backgroundColor: '#f8f9fa', marginBottom: '20px' }}>
                                <CCardBody>
                                    <CCardTitle className="productTitle">Check In Date</CCardTitle>
                                    <CCardText style={{ color: '#333' }} className="desc">{moment(basicDetails?.decoded_data?.["CheckInDate"], 'DD/MM/YYYY').format('YYYY-MM-DD')}</CCardText>
                                </CCardBody>
                            </div>
                        </CCol>

                        <CCol xs="12" lg="4">
                            <div style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '10px', backgroundColor: '#f8f9fa', marginBottom: '20px' }}>
                                <CCardBody>
                                    <CCardTitle className="productTitle">Check Out Date</CCardTitle>
                                    <CCardText style={{ color: '#333' }} className="desc">{
                                        moment(basicDetails?.decoded_data?.["CheckInDate"], 'DD/MM/YYYY').add(basicDetails?.NoOfNights, 'days').format('YYYY-MM-DD')
                                    }</CCardText>
                                </CCardBody>
                            </div>
                        </CCol>

                    </CRow>

                    <CRow>


                        <CCol xs="12" lg="3">
                            <div style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '10px', backgroundColor: '#f8f9fa', marginBottom: '20px' }}>
                                <CCardBody>
                                    <CCardTitle className="productTitle">Adult Count</CCardTitle>
                                    <CCardText style={{ color: '#333' }} className="desc">{basicDetails?.decoded_data?.NoOfAdults == null ? 0 : basicDetails?.decoded_data?.NoOfAdults}</CCardText>
                                </CCardBody>
                            </div>
                        </CCol>

                        <CCol xs="12" lg="3">
                            <div style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '10px', backgroundColor: '#f8f9fa', marginBottom: '20px' }}>
                                <CCardBody>
                                    <CCardTitle className="productTitle">Child Count</CCardTitle>
                                    <CCardText style={{ color: '#333' }} className="desc">{basicDetails?.decoded_data?.NoOfChild == null ? 0 : basicDetails?.decoded_data?.NoOfChild}</CCardText>
                                </CCardBody>
                            </div>
                        </CCol>

                        <CCol xs="12" lg="3">
                            <div style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '10px', backgroundColor: '#f8f9fa', marginBottom: '20px' }}>
                                <CCardBody>
                                    <CCardTitle className="productTitle">Number of Nights</CCardTitle>
                                    <CCardText style={{ color: '#333' }} className="desc">{basicDetails?.decoded_data?.NoOfNights == null ? 0 : basicDetails?.decoded_data?.NoOfNights}</CCardText>
                                </CCardBody>
                            </div>
                        </CCol>


                        <CCol xs="12" lg="3">
                            <div style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '10px', backgroundColor: '#f8f9fa', marginBottom: '20px' }}>
                                <CCardBody>
                                    <CCardTitle className="productTitle">Room Count</CCardTitle>
                                    <CCardText style={{ color: '#333' }} className="desc">
                                        {basicDetails?.decoded_data?.customerDetails?.room_count &&
                                            Object.entries(basicDetails.decoded_data.customerDetails.room_count)
                                                .map(([roomType, count]) => `${roomType}: ${count}`)
                                                .join(', ')
                                        }
                                    </CCardText>
                                </CCardBody>
                            </div>
                        </CCol>

                    </CRow>

                </CCol>

            </CRow>



            <CCol className='my-4'>

                <h5 className='mb-2'>Rate Plan</h5>

                <CRow>

                    <CCol xs="12" lg="12">
                        <div style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '10px', backgroundColor: '#f8f9fa' }}>
                            <CCardBody>
                                <div style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '10px', backgroundColor: '#f8f9fa', marginTop: 10 }}>
                                    <h5 className="travelerTitle">Room Type - {basicDetails?.decoded_data?.hotelRatesRequest?.RoomTypeName}</h5>
                                </div>


                                <div style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '10px', backgroundColor: '#f8f9fa', marginTop: 10 }}>
                                    <h5 className="travelerTitle" style={{ fontSize: 18 }}>Room Meal Plan</h5>

                                    {mealAllocation && Object.entries(mealAllocation).map(([date, meal]) => (

                                        <h5 className="travelerTitle">{date}    {meal}</h5>

                                    ))}
                                </div>

                            </CCardBody>
                        </div>
                    </CCol>

                </CRow>
            </CCol>






            <CCol className='my-4'>

                <h5 className='mb-2'>Traveler Details</h5>

                <CRow>
                    <CCol xs="12" lg="6">
                        <div style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '10px', backgroundColor: '#f8f9fa' }}>
                            <CCardBody>
                                <CCardTitle className="productTitle mb-3">Adult Details</CCardTitle>

                                {basicDetails?.decoded_data?.paxDetails?.filter(data => data?.PaxType == "1").length > 0 ?

                                    <>
                                        {basicDetails?.decoded_data?.paxDetails?.filter(data => data?.PaxType == "1").map(data => (
                                            <div style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '10px', backgroundColor: '#f8f9fa', marginTop: 10 }}>
                                                <h5 className="travelerTitle">{data?.Title}. {data?.FirstName} {data?.MiddleName} {data?.LastName}</h5>
                                            </div>
                                        ))}
                                    </>

                                    :
                                    <h5 className="travelerTitle">No Adult Data Available</h5>
                                }




                            </CCardBody>
                        </div>
                    </CCol>


                    <CCol xs="12" lg="6">
                        <div style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '10px', backgroundColor: '#f8f9fa' }}>
                            <CCardBody>
                                <CCardTitle className="productTitle mb-3">Child Details</CCardTitle>

                                {basicDetails?.decoded_data?.paxDetails?.filter(data => data?.PaxType == "2").length > 0 ?

                                    <>
                                        {basicDetails?.decoded_data?.paxDetails?.filter(data => data?.PaxType == "2").map(data => (
                                            <div style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '10px', backgroundColor: '#f8f9fa', marginTop: 10 }}>
                                                <h5 className="travelerTitle">{data?.Title}. {data?.FirstName} {data?.MiddleName} {data?.LastName}</h5>
                                            </div>
                                        ))}
                                    </>

                                    :
                                    <h5 className="travelerTitle">No Child Data Available</h5>
                                }




                            </CCardBody>
                        </div>
                    </CCol>
                </CRow>
            </CCol>



            {/* 

            <CCol className='my-4'>

                <InventoryDetails />


            </CCol>



            <CCol className='my-4'>
                <RateDetails />
            </CCol>


            <CCol className='my-4'>
                <PackageDetails />
            </CCol> */}




        </CContainer>
    )
}
