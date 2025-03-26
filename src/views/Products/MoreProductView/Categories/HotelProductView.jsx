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


export default function HotelProductView(props) {

    const basicDetails = props.productData?.productBasicData
    console.log(basicDetails, "Basic Detailss")
    const inventory = props.productData?.productInventory
    const rate = props.productData?.productRates
    const packageData = props.productData?.productPackages
    const details = props.productData?.productDetails

    console.log(props, "Basic Details")

    const LifestylesDetails = () => {
        const columns = [
            { title: 'Detail ID', field: 'id' },
            { title: 'Hotel ID', field: 'hotel_id' },
            { title: 'COVID Safe', field: 'covid_safe' },
            { title: 'AC Status', field: 'ac_status' },
            { title: 'Driver Accommodation', field: 'driver_accomadation' },
            { title: 'Lift Status', field: 'lift_status' },
            { title: 'Vehicle Approachable', field: 'vehicle_approchable' },
        ];

        const data = details?.map(lifestyleDetail => ({
            id: lifestyleDetail?.id,
            hotel_id: lifestyleDetail?.hotel_id,
            covid_safe: lifestyleDetail?.covid_safe,
            ac_status: lifestyleDetail?.ac_status,
            driver_accomadation: lifestyleDetail?.driver_accomadation,
            lift_status: lifestyleDetail?.lift_status,
            vehicle_approchable: lifestyleDetail?.vehicle_approchable,
        }));

        return (

            <CCol xs="12" lg="12">
                <div style={{ border: '2px solid #D1F2D8', borderRadius: '8px', padding: '10px', backgroundColor: '#F2FCF4', marginBottom: '20px' }}>
                    <MaterialTable
                        title="Details"
                        columns={columns}
                        data={data}
                        style={{ backgroundColor: '#F2FCF4' }}
                        options={{
                            headerStyle: {
                                fontSize: '14px',
                                backgroundColor: '#D1F2D8'

                                // Adjust the header font size here
                            },
                            cellStyle: {
                                fontSize: '14px', // Adjust the column font size here

                            },
                            search: false,
                            columnsButton: true,
                            // exportButton: true,
                            paging: false,

                        }}
                    />

                </div>
            </CCol>
        );
    };

    const BasicDetails = () => {
        const columns = [
            { title: 'ID', field: 'id' },
            { title: 'City', field: 'city' },
            { title: 'Country', field: 'country' },
            { title: 'Hotel Name', field: 'hotel_name' },
            // { title: 'Hotel Description', field: 'hotel_description' },
            { title: 'Hotel Address', field: 'hotel_address' },
            { title: 'Hotel Classification', field: 'hotel_classification' },
            { title: 'Star Classification', field: 'star_classification' },
            { title: 'Latitude', field: 'latitude' },
            { title: 'Longitude', field: 'longitude' },
            { title: 'Micro Location', field: 'micro_location' },
            { title: 'TripAdvisor Link', field: 'trip_advisor_link' },
            { title: 'Provider', field: 'provider' },
            { title: 'Vendor ID', field: 'vendor_id' },
            { title: 'Start Date', field: 'start_date' },
            { title: 'End Date', field: 'end_date' },
            { title: 'Hotel Status', field: 'hotel_status' },
            { title: 'Markup', field: 'markup' },
            { title: 'Sub Description', field: 'sub_description' },
            { title: 'Triggers', field: 'triggers' },
        ];

        const data = basicDetails?.map(basicDetails => ({
            id: basicDetails?.id,
            city: basicDetails?.city,
            country: basicDetails?.country,
            hotel_name: basicDetails?.hotel_name,
            // hotel_description: basicDetails?.hotel_description,
            hotel_address: basicDetails?.hotel_address,
            hotel_classification: basicDetails?.hotel_classification,
            star_classification: basicDetails?.star_classification,
            latitude: basicDetails?.latitude,
            longitude: basicDetails?.longitude,
            micro_location: basicDetails?.micro_location,
            trip_advisor_link: basicDetails?.trip_advisor_link,
            provider: basicDetails?.provider,
            vendor_id: basicDetails?.vendor_id,
            start_date: basicDetails?.start_date,
            end_date: basicDetails?.end_date,
            hotel_status: basicDetails?.hotel_status,
            markup: basicDetails?.markup,
            sub_description: basicDetails?.sub_description,
            triggers: basicDetails?.triggers,
        }));


        return (


            <MaterialTable
                title="Basic Details"
                columns={columns}
                data={data}
                options={{
                    headerStyle: {
                        fontSize: '14px', // Adjust the header font size here
                    },
                    cellStyle: {
                        fontSize: '14px', // Adjust the column font size here

                    },

                    search: false,
                    columnsButton: true,
                    // exportButton: true,
                    paging: false

                }}
            />


        );
    };



    const InventoryDetails = () => {
        const columns = [
            { title: 'ID', field: 'id' },
            { title: 'Rate ID', field: 'rate_id' },
            { title: 'Actual Adult Rate', field: 'actual_adult_rate' },
            { title: 'Actual Child With Bed Rate', field: 'actual_child_with_bed_rate' },
            { title: 'Actual Child Without Bed Rate', field: 'actual_child_without_bed_rate' },
            { title: 'Adult Age', field: 'adult_age' },
            { title: 'Adult Rate', field: 'adult_rate' },
            { title: 'Allotment', field: 'allotment' },
            { title: 'Blackout Dates', field: 'blackout_dates' },
            { title: 'Blackout Days', field: 'blackout_days' },
            { title: 'Book By Days', field: 'book_by_days' },
            { title: 'Booking End Date', field: 'booking_end_date' },
            { title: 'Booking Start Date', field: 'booking_start_date' },
            { title: 'Card ID', field: 'card_id' },
            { title: 'Child FOC Age', field: 'child_foc_age' },
            { title: 'Child With Bed Age', field: 'child_with_bed_age' },
            { title: 'Child With Bed Rate', field: 'child_with_bed_rate' },
            { title: 'Child With No Bed Age', field: 'child_with_no_bed_age' },
            { title: 'Child Without Bed Rate', field: 'child_without_bed_rate' },
            { title: 'Created At', field: 'created_at' },
            { title: 'Currency', field: 'currency' },
            { title: 'Deleted At', field: 'deleted_at' },
            { title: 'Hotel ID', field: 'hotel_id' },
            { title: 'Market Nationality', field: 'market_nationality' },
            { title: 'Meal Plan', field: 'meal_plan' },
            { title: 'Payment Type', field: 'payment_type' },
            { title: 'Room Category ID', field: 'room_category_id' },
            { title: 'Room Type ID', field: 'room_type_id' },
            { title: 'Stop Sale Date', field: 'stop_sale_date' },
        ];

        const data = inventory?.map(inventory => ({
            id: inventory?.id,
            rate_id: inventory?.rate_id,
            actual_adult_rate: inventory?.actual_adult_rate,
            actual_child_with_bed_rate: inventory?.actual_child_with_bed_rate,
            actual_child_without_bed_rate: inventory?.actual_child_without_bed_rate,
            adult_age: inventory?.adult_age,
            adult_rate: inventory?.adult_rate,
            allotment: inventory?.allotment,
            blackout_dates: inventory?.blackout_dates,
            blackout_days: inventory?.blackout_days,
            book_by_days: inventory?.book_by_days,
            booking_end_date: inventory?.booking_end_date,
            booking_start_date: inventory?.booking_start_date,
            card_id: inventory?.card_id,
            child_foc_age: inventory?.child_foc_age,
            child_with_bed_age: inventory?.child_with_bed_age,
            child_with_bed_rate: inventory?.child_with_bed_rate,
            child_with_no_bed_age: inventory?.child_with_no_bed_age,
            child_without_bed_rate: inventory?.child_without_bed_rate,
            created_at: inventory?.created_at,
            currency: inventory?.currency,
            deleted_at: inventory?.deleted_at,
            hotel_id: inventory?.hotel_id,
            market_nationality: inventory?.market_nationality,
            meal_plan: inventory?.meal_plan,
            payment_type: inventory?.payment_type,
            room_category_id: inventory?.room_category_id,
            room_type_id: inventory?.room_type_id,
            stop_sale_date: inventory?.stop_sale_date,
        }));



        return (


            <CCol xs="12" lg="12">
                <div style={{ border: '2px solid #E5D3FA', borderRadius: '8px', padding: '10px', backgroundColor: '#FAF7FE', marginBottom: '20px' }}>
                    <MaterialTable
                        title="Inventory Details"
                        columns={columns}
                        data={data}

                        style={{ backgroundColor: '#FAF7FE' }}
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
                            grouping: true
                        }}
                    />
                </div>
            </CCol>

        );
    };


    const RateDetails = () => {
        const columns = [
            { title: 'ID', field: 'id' },
            { title: 'Hotel ID', field: 'hotel_id' },
            { title: 'Actual Adult Rate', field: 'actual_adult_rate' },
            { title: 'Actual Child With Bed Rate', field: 'actual_child_with_bed_rate' },
            { title: 'Actual Child Without Bed Rate', field: 'actual_child_without_bed_rate' },
            { title: 'Adult Age', field: 'adult_age' },
            { title: 'Adult Rate', field: 'adult_rate' },
            { title: 'Blackout Dates', field: 'blackout_dates' },
            { title: 'Blackout Days', field: 'blackout_days' },
            { title: 'Book By Days', field: 'book_by_days' },
            { title: 'Booking End Date', field: 'booking_end_date' },
            { title: 'Booking Start Date', field: 'booking_start_date' },
            { title: 'Card ID', field: 'card_id' },
            { title: 'Child FOC Age', field: 'child_foc_age' },
            { title: 'Child With Bed Age', field: 'child_with_bed_age' },
            { title: 'Child With Bed Rate', field: 'child_with_bed_rate' },
            { title: 'Child With No Bed Age', field: 'child_with_no_bed_age' },
            { title: 'Child Without Bed Rate', field: 'child_without_bed_rate' },
            { title: 'Created At', field: 'created_at' },
            { title: 'Currency', field: 'currency' },
            { title: 'Deleted At', field: 'deleted_at' },
            { title: 'Market Nationality', field: 'market_nationality' },
            { title: 'Meal Plan', field: 'meal_plan' },
            { title: 'Payment Type', field: 'payment_type' },
            { title: 'Room Category ID', field: 'room_category_id' },
            { title: 'Room Type ID', field: 'room_type_id' },
            { title: 'Updated At', field: 'updated_at' },
        ];

        const data = rate?.map(rate => ({
            id: rate?.id,
            hotel_id: rate?.hotel_id,
            actual_adult_rate: rate?.actual_adult_rate,
            actual_child_with_bed_rate: rate?.actual_child_with_bed_rate,
            actual_child_without_bed_rate: rate?.actual_child_without_bed_rate,
            adult_age: rate?.adult_age,
            adult_rate: rate?.adult_rate,
            blackout_dates: rate?.blackout_dates,
            blackout_days: rate?.blackout_days,
            book_by_days: rate?.book_by_days,
            booking_end_date: rate?.booking_end_date,
            booking_start_date: rate?.booking_start_date,
            card_id: rate?.card_id,
            child_foc_age: rate?.child_foc_age,
            child_with_bed_age: rate?.child_with_bed_age,
            child_with_bed_rate: rate?.child_with_bed_rate,
            child_with_no_bed_age: rate?.child_with_no_bed_age,
            child_without_bed_rate: rate?.child_without_bed_rate,
            created_at: rate?.created_at,
            currency: rate?.currency,
            deleted_at: rate?.deleted_at,
            market_nationality: rate?.market_nationality,
            meal_plan: rate?.meal_plan,
            payment_type: rate?.payment_type,
            room_category_id: rate?.room_category_id,
            room_type_id: rate?.room_type_id,
            updated_at: rate?.updated_at,
        }));

        return (
            <CCol xs="12" lg="12">
                <div style={{ border: '2px solid #FEF5D1', borderRadius: '8px', padding: '10px', backgroundColor: '#FBFAF4', marginBottom: '20px' }}>
                    <MaterialTable
                        title="Rate Details"
                        columns={columns}
                        data={data}

                        style={{ backgroundColor: '#FBFAF4' }}
                        options={{
                            headerStyle: {
                                fontSize: '14px', // Adjust the header font size here
                                backgroundColor: '#FEF5D1'
                            },
                            cellStyle: {
                                fontSize: '14px', // Adjust the column font size here
                            },
                            paging: true,
                            search: true,
                            columnsButton: true,
                            // exportButton: true,
                        }}
                    />
                </div>
            </CCol>
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
            { title: 'Description', field: 'description' },
            { title: 'Package Rate', field: 'packageRate' },
            { title: 'Adult Rate', field: 'adultRate' },
            { title: 'Child Rate', field: 'childRate' },
            { title: 'Package Name', field: 'packageName' },
            { title: 'Package Type', field: 'packageType' },
        ];

        const data = packageData?.map(packageItem => ({
            rateId: packageItem.rate_id,
            minAdultOccupancy: packageItem.min_adult_occupancy,
            maxAdultOccupancy: packageItem.max_adult_occupancy,
            minChildOccupancy: packageItem.min_child_occupancy,
            maxChildOccupancy: packageItem.max_child_occupancy,
            totalOccupancy: packageItem.total_occupancy,
            rateType: packageItem.rate_type,
            description: packageItem.description,
            packageRate: packageItem.package_rate,
            adultRate: packageItem.adult_rate,
            childRate: packageItem.child_rate,
            packageName: packageItem.package_name,
            packageType: packageItem.package_type,
        }));


        return (
            <CCol xs="12" lg="12">
                <div style={{ border: '2px solid #CFE8F9', borderRadius: '8px', padding: '10px', backgroundColor: '#F1F6FA', marginBottom: '20px' }}>
                    <MaterialTable
                        title="Package Details"
                        columns={columns}
                        data={data}

                        style={{ backgroundColor: '#F1F6FA' }}
                        options={{
                            headerStyle: {
                                fontSize: '14px', // Adjust the header font size here
                                backgroundColor: "#CFE8F9"
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
                </div>
            </CCol>
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

                <CCol xs="12" lg="4">
                    <div style={{ width: '100%', paddingTop: '100%', position: 'relative', overflow: 'hidden', borderRadius: '12px' }}>
                        <CImage
                            src={basicDetails?.[0]?.["hotel_image"]?.split(",")[0]}
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


                <CCol className='py-4' xs="12" lg="8">

                    <h4 className='mb-2'>{stripHtmlTags(basicDetails?.[0]?.['hotel_name'])}</h4>

                    <CCardText className='mb-4'>{stripHtmlTags(basicDetails?.[0]?.["hotel_description"])}</CCardText>


                    {/* <div style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '10px', backgroundColor: '#f8f9fa', marginBottom: '20px' }}> */}
                    <CCardBody>
                        <BasicDetails></BasicDetails>
                    </CCardBody>
                    {/* </div> */}


                </CCol>



            </CRow>



            <CCol className='my-4'>

                <LifestylesDetails />


            </CCol>

            <CCol className='my-4'>

                <InventoryDetails />


            </CCol>



            <CCol className='my-4'>
                <RateDetails />
            </CCol>


            {/* <CCol className='my-4'>
                <PackageDetails />
            </CCol> */}




        </CContainer>
    )
}
