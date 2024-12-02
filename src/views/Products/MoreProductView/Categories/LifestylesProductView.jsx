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


export default function LifestylesProductView(props) {

    const basicDetails = props.productData?.productBasicData
    const inventory = props.productData?.productInventory
    const rate = props.productData?.productRates
    const packageData = props.productData?.productPackages
    const details = props.productData?.productDetails



    const LifestylesDetails = () => {
        const columns = [
            { title: 'Detail ID', field: 'lifestyle_detail_id' },
            { title: 'Lifestyle ID', field: 'lifestyle_id' },
            { title: 'Entrance', field: 'entrance' },
            { title: 'Guide', field: 'guide' },
            { title: 'Meal', field: 'meal' },
            { title: 'Meal Transfer', field: 'meal_transfer' },
            { title: 'COVID Safe', field: 'covid_safe' },
            { title: 'Operating Dates', field: 'operating_dates' },
            { title: 'Operating Days', field: 'operating_days' },
            { title: 'Opening Time', field: 'opening_time' },
            { title: 'Closing Time', field: 'closing_time' },
            { title: 'Closed Days', field: 'closed_days' },
            { title: 'Closed Dates', field: 'closed_dates' },

        ];

        const data = details?.map(lifestyleDetail => ({
            lifestyle_detail_id: lifestyleDetail?.lifestyle_detail_id,
            lifestyle_id: lifestyleDetail?.lifestyle_id,
            entrance: lifestyleDetail?.entrance,
            guide: lifestyleDetail?.guide,
            meal: lifestyleDetail?.meal,
            meal_transfer: lifestyleDetail?.meal_transfer,
            covid_safe: lifestyleDetail?.covid_safe,
            operating_dates: lifestyleDetail?.operating_dates,
            operating_days: lifestyleDetail?.operating_days,
            opening_time: lifestyleDetail?.opening_time,
            closing_time: lifestyleDetail?.closing_time,
            closed_days: lifestyleDetail?.closed_days,
            closed_dates: lifestyleDetail?.closed_dates,

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
                            exportButton: true,
                            paging: false,

                        }}
                    />

                </div>
            </CCol>
        );
    };

    const BasicDetails = () => {
        const columns = [
            { title: 'ID', field: 'lifestyle_id' },
            { title: 'City', field: 'lifestyle_city' },
            { title: 'Attraction Type', field: 'lifestyle_attraction_type' },

            { title: 'Latitude', field: 'latitude' },
            { title: 'Longitude', field: 'longitude' },
            { title: 'Address', field: 'address' },
            { title: 'Micro Location', field: 'micro_location' },
            { title: 'TripAdvisor', field: 'tripadvisor' },
            { title: 'Preferred', field: 'preferred' },
            { title: 'Selling Points', field: 'selling_points' },
            { title: 'Start Date', field: 'pref_start_date' },
            { title: 'End Date', field: 'pref_end_date' },
            { title: 'Vendor ID', field: 'vendor_id' },
            { title: 'Provider', field: 'provider' },
            { title: 'Provider ID', field: 'provider_id' },
            { title: 'Active Status', field: 'active_status' },

            { title: 'Category 1', field: 'category1' },
            { title: 'Category 2', field: 'category2' },
            { title: 'Category 3', field: 'category3' },
            { title: 'Category 4', field: 'category4' },

        ];

        const data = basicDetails?.map(basicDetails => ({
            lifestyle_id: basicDetails?.lifestyle_id,
            lifestyle_city: basicDetails?.lifestyle_city,
            lifestyle_attraction_type: basicDetails?.lifestyle_attraction_type,

            latitude: basicDetails?.latitude,
            longitude: basicDetails?.longitude,
            address: basicDetails?.address,
            micro_location: basicDetails?.micro_location,
            tripadvisor: basicDetails?.tripadvisor,
            preferred: basicDetails?.preferred,
            selling_points: basicDetails?.selling_points,
            pref_start_date: basicDetails?.pref_start_date,
            pref_end_date: basicDetails?.pref_end_date,
            vendor_id: basicDetails?.vendor_id,
            provider: basicDetails?.provider,
            provider_id: basicDetails?.provider_id,
            active_status: basicDetails?.active_status,

            category1: inventory?.category1,
            category2: inventory?.category2,
            category3: inventory?.category3,
            category4: inventory?.category4,

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
                    exportButton: true,
                    paging: false

                }}
            />


        );
    };



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




        const data = inventory?.map(inventory => ({
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
        }))



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
                            exportButton: true,
                            grouping: true
                        }}
                    />
                </div>
            </CCol>

        );
    };


    const RateDetails = () => {
        const columns = [
            { title: 'Rate ID', field: 'lifestyle_rate_id' },
            { title: 'Lifestyle ID', field: 'lifestyle_id' },
            { title: 'Booking Start Date', field: 'booking_start_date' },
            { title: 'Booking End Date', field: 'booking_end_date' },
            { title: 'Travel Start Date', field: 'travel_start_date' },
            { title: 'Travel End Date', field: 'travel_end_date' },
            { title: 'Attraction Category', field: 'attraction_category' },
            { title: 'Meal Plan', field: 'meal_plan' },
            { title: 'Market', field: 'market' },
            { title: 'Currency', field: 'currency' },
            { title: 'Adult Rate', field: 'adult_rate' },
            { title: 'Child Rate', field: 'child_rate' },
            { title: 'Student Rate', field: 'student_rate' },
            { title: 'Senior Rate', field: 'senior_rate' },
            { title: 'Military Rate', field: 'military_rate' },
            { title: 'Other Rate', field: 'other_rate' },
            { title: 'Child FOC Age', field: 'child_foc_age' },
            { title: 'Child Age', field: 'child_age' },
            { title: 'Adult Age', field: 'adult_age' },
            { title: 'CWB Age', field: 'cwb_age' },
            { title: 'CNB Age', field: 'cnb_age' },
            { title: 'Payment Policy', field: 'payment_policy' },
            { title: 'Book By Days', field: 'book_by_days' },
            { title: 'Cancellation Days', field: 'cancellation_days' },
            { title: 'Cancellation Policy', field: 'cancel_policy' },
            { title: 'Stop Sales Dates', field: 'stop_sales_Dates' },
            { title: 'Blackout Days', field: 'blackout_days' },
            { title: 'Blackout Dates', field: 'blackout_dates' },
        ];

        const data = rate?.map(rate => ({
            lifestyle_rate_id: rate?.lifestyle_rate_id,
            lifestyle_id: rate?.lifestyle_id,
            booking_start_date: rate?.booking_start_date,
            booking_end_date: rate?.booking_end_date,
            travel_start_date: rate?.travel_start_date,
            travel_end_date: rate?.travel_end_date,
            attraction_category: rate?.attraction_category,
            meal_plan: rate?.meal_plan,
            market: rate?.market,
            currency: rate?.currency,
            adult_rate: rate?.adult_rate,
            child_rate: rate?.child_rate,
            student_rate: rate?.student_rate,
            senior_rate: rate?.senior_rate,
            military_rate: rate?.military_rate,
            other_rate: rate?.other_rate,
            child_foc_age: rate?.child_foc_age,
            child_age: rate?.child_age,
            adult_age: rate?.adult_age,
            cwb_age: rate?.cwb_age,
            cnb_age: rate?.cnb_age,
            payment_policy: rate?.payment_policy,
            book_by_days: rate?.book_by_days,
            cancellation_days: rate?.cancellation_days,
            cancel_policy: rate?.cancel_policy,
            stop_sales_Dates: rate?.stop_sales_Dates,
            blackout_days: rate?.blackout_days,
            blackout_dates: rate?.blackout_dates,
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
                            paging: false,
                            search: false,
                            columnsButton: true,
                            exportButton: true,
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
                            exportButton: true,
                        }}
                    />
                </div>
            </CCol>
        );

    };











    return (
        <CContainer style={{ backgroundColor: 'white', padding: 20, borderRadius: 20, paddingRight: 60, paddingLeft: 60 }} fluid>
            <CRow>

                <CCol xs="12" lg="4">
                    <div style={{ width: '100%', paddingTop: '100%', position: 'relative', overflow: 'hidden', borderRadius: '12px' }}>
                        <CImage
                            src={basicDetails?.[0]?.["image"]?.split(",")[0]}
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

                    <h4 className='mb-2'>{basicDetails?.[0]?.['lifestyle_name']}</h4>

                    <CCardText className='mb-4'>{basicDetails?.[0]?.["lifestyle_description"]}</CCardText>


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


            <CCol className='my-4'>
                <PackageDetails />
            </CCol>




        </CContainer>
    )
}
