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


export default function LifestylesOrderView(props) {

    console.log(props.productData, "Lifestyle Data")

    const basicDetails = props.productData?.lifestyleBasic
    const inventory = props.productData?.lifestyleInventory
    const rate = props.productData?.lifestyleRateData
    const packageData = props.productData?.lifestylePackageData
    const bookData = props.productData?.lifestyleBookingData

    console.log( basicDetails?.["image"],"Image Data")


    const InventoryDetails = () => {
        const columns = [
            { title: 'Inventory ID', field: 'inventoryId' },
            { title: 'Rate ID', field: 'rateId' },
            { title: 'Pickup Location', field: 'pickupLocation' },
            { title: 'Inventory Date', field: 'inventoryDate' },
            { title: 'Pickup Time', field: 'pickupTime' },
            { title: 'Max Adult Occupancy', field: 'maxAdultOccupancy' },
            { title: 'Max Children Occupancy', field: 'maxChildrenOccupancy' },
            { title: 'Max Total Occupancy', field: 'maxTotalOccupancy' },
            { title: 'Total Inventory', field: 'totalInventory' },
            { title: 'Allotment', field: 'allotment' },
            { title: 'Used', field: 'used' },
            { title: 'Balance', field: 'balance' },
            { title: 'Vehicle Type', field: 'vehicleType' },
            { title: 'Inclusions', field: 'inclusions' },
            { title: 'Exclusions', field: 'exclusions' },
        ];

        const data = [
            {
                inventoryId: inventory?.lifestyle_inventory_id,
                rateId: inventory?.rate_id,
                pickupLocation: inventory?.pickup_location,
                inventoryDate: inventory?.inventory_date,
                pickupTime: inventory?.pickup_time,
                maxAdultOccupancy: inventory?.max_adult_occupancy,
                maxChildrenOccupancy: inventory?.max_children_occupancy,
                maxTotalOccupancy: inventory?.max_total_occupancy,
                totalInventory: inventory?.total_inventory,
                allotment: inventory?.allotment,
                used: inventory?.used,
                balance: inventory?.balance,
                vehicleType: inventory?.vehicle_type,
                inclusions: inventory?.inclusions,
                exclusions: inventory?.exclusions,
            },
            // Add other data rows similarly
        ];

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
                    paging: false,
                    search: false,
                    columnsButton: true,
                    // exportButton: true,
                }}
            />
        );
    };


    const RateDetails = () => {
        const columns = [
            { title: 'Lifestyle ID', field: 'lifestyleId' },
            { title: 'Booking Start Date', field: 'bookingStartDate' },
            { title: 'Booking End Date', field: 'bookingEndDate' },
            { title: 'Travel Start Date', field: 'travelStartDate' },
            { title: 'Travel End Date', field: 'travelEndDate' },
            { title: 'Attraction Category', field: 'attractionCategory' },
            { title: 'Meal Plan', field: 'mealPlan' },
            { title: 'Market', field: 'market' },
            { title: 'Currency', field: 'currency' },
            { title: 'Adult Rate', field: 'adultRate' },
            { title: 'Child Rate', field: 'childRate' },
            { title: 'Student Rate', field: 'studentRate' },
            { title: 'Senior Rate', field: 'seniorRate' },
            { title: 'Military Rate', field: 'militaryRate' },
            { title: 'Other Rate', field: 'otherRate' },
            { title: 'Child FOC Age', field: 'childFOCAge' },
            { title: 'Child Age', field: 'childAge' },
            { title: 'Adult Age', field: 'adultAge' },
            { title: 'CWB Age', field: 'cwbAge' },
            { title: 'CNB Age', field: 'cnbAge' },
            { title: 'Payment Policy', field: 'paymentPolicy' },
            { title: 'Book By Days', field: 'bookByDays' },
            { title: 'Cancellation Days', field: 'cancellationDays' },
            { title: 'Cancellation Policy', field: 'cancellationPolicy' },
            { title: 'Stop Sales Dates', field: 'stopSalesDates' },
            { title: 'Blackout Days', field: 'blackoutDays' },
            { title: 'Blackout Dates', field: 'blackoutDates' },
        ];

        const data = [
            {
                lifestyleId: 1,
                bookingStartDate: '2024-04-09',
                bookingEndDate: '2024-04-15',
                travelStartDate: '2024-05-01',
                travelEndDate: '2024-05-07',
                attractionCategory: 'Adventure',
                mealPlan: 'All Inclusive',
                market: 'Domestic',
                currency: 'USD',
                adultRate: 100,
                childRate: 50,
                studentRate: 80,
                seniorRate: 90,
                militaryRate: 85,
                otherRate: 70,
                childFOCAge: 5,
                childAge: '6-12',
                adultAge: '13+',
                cwbAge: '3-5',
                cnbAge: '0-2',
                paymentPolicy: 'Prepaid',
                bookByDays: 7,
                cancellationDays: 3,
                cancellationPolicy: 'Full Refund',
                stopSalesDates: '2024-04-20',
                blackoutDays: 3,
                blackoutDates: ['2024-06-15', '2024-07-20']
            },
            // Add other data rows similarly
        ];

        return (
            <MaterialTable
                title="Rate Details"
                columns={columns}
                data={data}
                options={{
                    headerStyle: {
                        fontSize: '14px', // Adjust the header font size here
                        backgroundColor: '#FEF5D1',
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



    const PackageDetails = () => {

        const columns = [
            { title: 'Rate ID', field: 'rateId' },
            { title: 'Min Adult Occupancy', field: 'minAdultOccupancy' },
            { title: 'Max Adult Occupancy', field: 'maxAdultOccupancy' },
            { title: 'Min Child Occupancy', field: 'minChildOccupancy' },
            { title: 'Max Child Occupancy', field: 'maxChildOccupancy' },
            { title: 'Total Occupancy', field: 'totalOccupancy' },
            { title: 'Rate type', field: 'rateType' },
            { title: 'Package Rate', field: 'packageRate' },
            { title: 'Adult Rate', field: 'adultRate' },
            { title: 'Child Rate', field: 'childRate' },
            { title: 'Package Name', field: 'packageName' },
            { title: 'Package Type', field: 'packageType' },
        ];

        const data = [
            {
                rateId: packageData?.['rate_id'],
                minAdultOccupancy: packageData?.['min_adult_occupancy'],
                maxAdultOccupancy: packageData?.['max_adult_occupancy'],
                minChildOccupancy: packageData?.['min_child_occupancy'],
                maxChildOccupancy: packageData?.['max_child_occupancy'],
                totalOccupancy: packageData?.['total_occupancy'],
                rateType: packageData?.['rate_type'],
                packageRate: packageData?.['package_rate'],
                adultRate: packageData?.['adult_rate'],
                childRate: packageData?.['child_rate'],
                packageName: packageData?.['package_name'],
                packageType: packageData?.['package_type'],

            },
            // Add other data rows similarly
        ];

        return (
            <MaterialTable
                title="Package Details"
                columns={columns}
                data={data}
                options={{
                    headerStyle: {
                        fontSize: '14px', // Adjust the header font size here
                        backgroundColor: "#CFE8F9"
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
                            // src={basicDetails?.["image"]}
                            src={
                                basicDetails?.["image"]?.includes(',')
                                    ? basicDetails["image"].split(',')[0].trim() // Use the first image from the list
                                    : basicDetails?.["image"] // Use the single image
                            }
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

                    <h4 className='mb-2'>{basicDetails?.['lifestyle_name']}</h4>

                    <CCardText className='mb-4'>{stripHtmlTags(basicDetails?.["lifestyle_description"])}</CCardText>

                    <CRow>
                        <CCol xs="12" lg="4">
                            <div style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '10px', backgroundColor: '#f8f9fa', marginBottom: '20px' }}>
                                <CCardBody>
                                    <CCardTitle className="productTitle">Location</CCardTitle>
                                    <CCardText style={{ color: '#333' }} className="desc">{inventory?.["pickup_location"]}</CCardText>
                                </CCardBody>
                            </div>
                        </CCol>

                        <CCol xs="12" lg="4">
                            <div style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '10px', backgroundColor: '#f8f9fa', marginBottom: '20px' }}>
                                <CCardBody>
                                    <CCardTitle className="productTitle">Time Slot</CCardTitle>
                                    <CCardText style={{ color: '#333' }} className="desc">{inventory?.["pickup_time"]}</CCardText>
                                </CCardBody>
                            </div>
                        </CCol>

                        <CCol xs="12" lg="4">
                            <div style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '10px', backgroundColor: '#f8f9fa', marginBottom: '20px' }}>
                                <CCardBody>
                                    <CCardTitle className="productTitle">Date</CCardTitle>
                                    <CCardText style={{ color: '#333' }} className="desc">{inventory?.["inventory_date"]}</CCardText>
                                </CCardBody>
                            </div>
                        </CCol>

                    </CRow>

                    <CRow>
                        <CCol xs="12" lg="6">
                            <div style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '10px', backgroundColor: '#f8f9fa', marginBottom: '20px' }}>
                                <CCardBody>
                                    <CCardTitle className="productTitle">Package Name</CCardTitle>
                                    <CCardText style={{ color: '#333' }} className="desc">{packageData?.['package_name']}</CCardText>
                                </CCardBody>
                            </div>
                        </CCol>

                        <CCol xs="12" lg="3">
                            <div style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '10px', backgroundColor: '#f8f9fa', marginBottom: '20px' }}>
                                <CCardBody>
                                    <CCardTitle className="productTitle">Adult Count</CCardTitle>
                                    <CCardText style={{ color: '#333' }} className="desc">{bookData?.['lifestyle_adult_count'] == null ? 0 : bookData?.['lifestyle_adult_count']}</CCardText>
                                </CCardBody>
                            </div>
                        </CCol>

                        <CCol xs="12" lg="3">
                            <div style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '10px', backgroundColor: '#f8f9fa', marginBottom: '20px' }}>
                                <CCardBody>
                                    <CCardTitle className="productTitle">Child Count</CCardTitle>
                                    <CCardText style={{ color: '#333' }} className="desc">{bookData?.['lifestyle_child_count'] == null ? 0 : bookData?.['lifestyle_child_count']}</CCardText>
                                </CCardBody>
                            </div>
                        </CCol>
                    </CRow>

                </CCol>

            </CRow>


            <CCol className='my-4'>

                <h5 className='mb-2'>Traveler Details</h5>

                <CRow>
                    <CCol xs="12" lg="6">
                        <div style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '10px', backgroundColor: '#f8f9fa' }}>
                            <CCardBody>
                                <CCardTitle className="productTitle mb-3">Adult Details</CCardTitle>

                                {bookData?.lifestyle_adult_details?.length > 0 ?

                                    <>
                                        {bookData?.lifestyle_adult_details?.split(",").map(data => (
                                            <div style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '10px', backgroundColor: '#f8f9fa', marginTop: 10 }}>
                                                <h5 className="travelerTitle">{data}</h5>
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


                                {bookData?.lifestyle_child_details?.length > 0 ?

                                    <>
                                        {bookData?.lifestyle_child_details?.split(",").map(data => (
                                            <div style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '10px', backgroundColor: '#f8f9fa', marginTop: 10 }}>
                                                <h5 className="travelerTitle">{data}</h5>
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


            <CCol className='my-4'>
            <div style={{ border: '2px solid #CFE8F9', borderRadius: '8px', padding: '10px', backgroundColor: '#F1F6FA', marginBottom: '20px' }}>
                <PackageDetails />
                </div>
            </CCol>




        </CContainer>
    )
}
