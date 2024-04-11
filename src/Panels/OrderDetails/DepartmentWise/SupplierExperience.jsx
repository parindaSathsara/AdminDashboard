


import React from 'react'
import MaterialTable from 'material-table';
import { CButton, CCard, CCardBody, CCol, CPopover, CRow } from '@coreui/react';


export default function SupplierExperience(props) {

    const customPopoverStyle = {
        '--cui-popover-max-width': '400px',
        '--cui-popover-border-color': '#0F1A36',
        '--cui-popover-header-bg': '#0F1A36',
        '--cui-popover-header-color': 'var(--cui-white)',
        '--cui-popover-body-padding-x': '1rem',
        '--cui-popover-body-padding-y': '.5rem',
    }

    const productData = [
        {
            "checkoutID": 2239,
            "service_date": "2024-04-10",
            "supplier_status": "Pending",
            "product_title": "Lunch by Colombo Cooking Class for 1 Pax",
            "course_inv_startdate": "2024-04-10",
            "course_inv_enddate": "2025-03-19",
            "booking_id": 941,
            "course_startime": "10:00:00",
            "course_endtime": "13:00:00",
            "preffered_booking_date": "2024-04-10",
            "balance_amount": "0.00",
            "paid_amount": "100.00",
            "total_amount": "100.00",
            "each_item_price": null,
            "currency": "USD",
            "student_type": "Adult",
            "first_name": "Susantha ",
            "last_name": "Kumara",
            "email": "no-reply_it@aahaas.com",
            "address": "No 275/1, Hospital Road,Angoda, Colombo,Sri Lanka.",
            "company_name": "Colombo cooking class",
            "phone": "+94774479787",
            "status": "CustomerOrdered",
            "PID": 1,
            "PName": "Lunch by Colombo Cooking Class for 1 Pax",
            "PaxType": "Adult",
            "Age": 28,
            "MaxAdultOccupancy": 7,
            "MaxChildOccupancy": 3,
            "TotalOccupancy": 10,
            "DDate": "2024-04-10",
            "category": "Education"
        },
        {
            "checkoutID": 2240,
            "service_date": "2024-04-10",
            "supplier_status": "Pending",
            "product_title": "Lunch by Colombo Cooking Lunch Class for 2 or More Pax",
            "course_inv_startdate": "2024-04-10",
            "course_inv_enddate": "2025-03-19",
            "booking_id": 942,
            "course_startime": "10:00:00",
            "course_endtime": "13:00:00",
            "preffered_booking_date": "2024-04-10",
            "balance_amount": "0.00",
            "paid_amount": "80.00",
            "total_amount": "80.00",
            "each_item_price": null,
            "currency": "USD",
            "student_type": "Adult",
            "first_name": "Susantha ",
            "last_name": "Kumara",
            "email": "no-reply_it@aahaas.com",
            "address": "No 275/1, Hospital Road,Angoda, Colombo,Sri Lanka.",
            "company_name": "Colombo cooking class",
            "phone": "+94774479787",
            "status": "CustomerOrdered",
            "PID": 2,
            "PName": "Lunch by Colombo Cooking Lunch Class for 2 or More Pax",
            "PaxType": "Adult",
            "Age": 28,
            "MaxAdultOccupancy": 7,
            "MaxChildOccupancy": 3,
            "TotalOccupancy": 10,
            "DDate": "2024-04-10",
            "category": "Education"
        },
        {
            "product_title": "CASUAL WEAR CUBAN COLLAR S/S SHIRT",
            "product_image": "https://carloclothing.com/cdn/shop/files/websizeArtboard15_98a56995-7087-4274-b0d8-36c4de121178_grande.jpg?v=1702537596",
            "quantity": 1,
            "balance_amount": "11.37",
            "paid_amount": "0.00",
            "total_amount": "11.37",
            "each_item_price": "11.37",
            "currency": "USD",
            "preffered_date": "2024-04-30",
            "status": "CustomerOrdered",
            "essential_pre_order_id": 2178,
            "location": "Level 5-14, One Galle Face Mall, Colombo - Galle Main Rd, Colombo, Sri Lanka",
            "latlon": "6.9279369,79.8451521",
            "variation_type1": "Size",
            "variation_type2": null,
            "variation_type3": null,
            "variation_type4": null,
            "variation_type5": null,
            "variant_type1": "M",
            "variant_type2": null,
            "variant_type3": null,
            "variant_type4": null,
            "variant_type5": null,
            "checkoutID": 2241,
            "service_date": "2024-04-30",
            "supplier_status": "Pending",
            "first_name": null,
            "last_name": null,
            "email": "no-reply_it@aahaas.com",
            "address": "No 49, Sir Ernest de Silva Mawatha (Flower Road)",
            "company_name": "Dilly Carlo {Ladies}",
            "phone": "+94112693344",
            "cusLat": "6.9279369",
            "cusLon": "79.8451521",
            "latitude": "6.529019832611084",
            "longitude": "81.1271743774414",
            "PID": 198,
            "PName": "CASUAL WEAR CUBAN COLLAR S/S SHIRT",
            "Quantity": 1,
            "SKU": "(S/M/L/XL)",
            "Unit": "Size",
            "DDate": "2024-04-30",
            "DAddress": "Level 5-14, One Galle Face Mall, Colombo - Galle Main Rd, Colombo, Sri Lanka",
            "category": "Essentials/Non Essentials"
        },
        {
            "product_title": "Casual Wear Knitted S/S Shirt",
            "product_image": "https://carloclothing.com/cdn/shop/files/websizeArtboard4_6d19888b-9a0f-43a0-b8f7-2b35bc52c144_grande.jpg?v=1702536611",
            "quantity": 1,
            "balance_amount": "11.37",
            "paid_amount": "0.00",
            "total_amount": "11.37",
            "each_item_price": "11.37",
            "currency": "USD",
            "preffered_date": "2024-04-30",
            "status": "CustomerOrdered",
            "essential_pre_order_id": 2177,
            "location": "Level 5-14, One Galle Face Mall, Colombo - Galle Main Rd, Colombo, Sri Lanka",
            "latlon": "6.9279337,79.8451516",
            "variation_type1": "Size",
            "variation_type2": null,
            "variation_type3": null,
            "variation_type4": null,
            "variation_type5": null,
            "variant_type1": "L",
            "variant_type2": null,
            "variant_type3": null,
            "variant_type4": null,
            "variant_type5": null,
            "checkoutID": 2242,
            "service_date": "2024-04-30",
            "supplier_status": "Pending",
            "first_name": null,
            "last_name": null,
            "email": "no-reply_it@aahaas.com",
            "address": "No 49, Sir Ernest de Silva Mawatha (Flower Road)",
            "company_name": "Dilly Carlo {Ladies}",
            "phone": "+94112693344",
            "cusLat": "6.9279337",
            "cusLon": "79.8451516",
            "latitude": "6.529019832611084",
            "longitude": "81.1271743774414",
            "PID": 199,
            "PName": "Casual Wear Knitted S/S Shirt",
            "Quantity": 1,
            "SKU": "(S/M/L/XL)",
            "Unit": "Size",
            "DDate": "2024-04-30",
            "DAddress": "Level 5-14, One Galle Face Mall, Colombo - Galle Main Rd, Colombo, Sri Lanka",
            "category": "Essentials/Non Essentials"
        },
        {
            "product_title": "PARTY WEAR L/S SHIRT",
            "product_image": "https://carloclothing.com/cdn/shop/files/websizeArtboard38_grande.jpg?v=1701934470",
            "quantity": 1,
            "balance_amount": "14.62",
            "paid_amount": "0.00",
            "total_amount": "14.62",
            "each_item_price": "14.62",
            "currency": "USD",
            "preffered_date": "2024-04-30",
            "status": "CustomerOrdered",
            "essential_pre_order_id": 2176,
            "location": "Level 5-14, One Galle Face Mall, Colombo - Galle Main Rd, Colombo, Sri Lanka",
            "latlon": "6.9279337,79.8451516",
            "variation_type1": "Size",
            "variation_type2": null,
            "variation_type3": null,
            "variation_type4": null,
            "variation_type5": null,
            "variant_type1": "L",
            "variant_type2": null,
            "variant_type3": null,
            "variant_type4": null,
            "variant_type5": null,
            "checkoutID": 2243,
            "service_date": "2024-04-30",
            "supplier_status": "Pending",
            "first_name": null,
            "last_name": null,
            "email": "no-reply_it@aahaas.com",
            "address": "No 49, Sir Ernest de Silva Mawatha (Flower Road)",
            "company_name": "Dilly Carlo {Ladies}",
            "phone": "+94112693344",
            "cusLat": "6.9279337",
            "cusLon": "79.8451516",
            "latitude": "6.529019832611084",
            "longitude": "81.1271743774414",
            "PID": 200,
            "PName": "PARTY WEAR L/S SHIRT",
            "Quantity": 1,
            "SKU": "(S/M/L/XL)",
            "Unit": "Size",
            "DDate": "2024-04-30",
            "DAddress": "Level 5-14, One Galle Face Mall, Colombo - Galle Main Rd, Colombo, Sri Lanka",
            "category": "Essentials/Non Essentials"
        },
        {
            "product_title": "BAIGE INNOVEX D/C REFREGIRATOR",
            "product_image": "https://brownsdeals.com/cdn/shop/products/cd32eda4d051b46537e22bdd342b3b62.jpg?v=1680603250",
            "quantity": 1,
            "balance_amount": "315.59",
            "paid_amount": "0.00",
            "total_amount": "315.59",
            "each_item_price": "315.59",
            "currency": "USD",
            "preffered_date": "2024-04-30",
            "status": "CustomerOrdered",
            "essential_pre_order_id": 2182,
            "location": "Level 5-14, One Galle Face Mall, Colombo - Galle Main Rd, Colombo, Sri Lanka",
            "latlon": "6.9279418,79.8451573",
            "variation_type1": null,
            "variation_type2": null,
            "variation_type3": null,
            "variation_type4": null,
            "variation_type5": null,
            "variant_type1": null,
            "variant_type2": null,
            "variant_type3": null,
            "variant_type4": null,
            "variant_type5": null,
            "checkoutID": 2244,
            "service_date": "2024-04-30",
            "supplier_status": "Pending",
            "first_name": "Dulana",
            "last_name": null,
            "email": "no-reply_it@aahaas.com",
            "address": "No 34, Sir Mohamed Macan Markar Mawatha, Colombo 03, Sri La",
            "company_name": "Browns Group( PVT) LTD",
            "phone": "+94115063000",
            "cusLat": "6.9279418",
            "cusLon": "79.8451573",
            "latitude": "6.941162",
            "longitude": " 79.860538",
            "PID": 486,
            "PName": "BAIGE INNOVEX D/C REFREGIRATOR",
            "Quantity": 1,
            "SKU": null,
            "Unit": "1",
            "DDate": "2024-04-30",
            "DAddress": "Level 5-14, One Galle Face Mall, Colombo - Galle Main Rd, Colombo, Sri Lanka",
            "category": "Essentials/Non Essentials"
        },
        {
            "product_title": "ANGLE GRINDER 180MM 2200W",
            "product_image": "https://brownsdeals.com/cdn/shop/products/MakitaAngleGrinder180mm2200w-M0920G.png?v=1642671030",
            "quantity": 1,
            "balance_amount": "136.11",
            "paid_amount": "0.00",
            "total_amount": "136.11",
            "each_item_price": "136.11",
            "currency": "USD",
            "preffered_date": "2024-04-30",
            "status": "CustomerOrdered",
            "essential_pre_order_id": 2183,
            "location": "Level 5-14, One Galle Face Mall, Colombo - Galle Main Rd, Colombo, Sri Lanka",
            "latlon": "6.9279384,79.8451539",
            "variation_type1": null,
            "variation_type2": null,
            "variation_type3": null,
            "variation_type4": null,
            "variation_type5": null,
            "variant_type1": null,
            "variant_type2": null,
            "variant_type3": null,
            "variant_type4": null,
            "variant_type5": null,
            "checkoutID": 2245,
            "service_date": "2024-04-30",
            "supplier_status": "Pending",
            "first_name": "Dulana",
            "last_name": null,
            "email": "no-reply_it@aahaas.com",
            "address": "No 34, Sir Mohamed Macan Markar Mawatha, Colombo 03, Sri La",
            "company_name": "Browns Group( PVT) LTD",
            "phone": "+94115063000",
            "cusLat": "6.9279384",
            "cusLon": "79.8451539",
            "latitude": "6.941162",
            "longitude": " 79.860538",
            "PID": 485,
            "PName": "ANGLE GRINDER 180MM 2200W",
            "Quantity": 1,
            "SKU": null,
            "Unit": "1",
            "DDate": "2024-04-30",
            "DAddress": "Level 5-14, One Galle Face Mall, Colombo - Galle Main Rd, Colombo, Sri Lanka",
            "category": "Essentials/Non Essentials"
        },
        {
            "lifestyle_inventory_id": 40611,
            "lifestyle_rate_id": 112,
            "package_id": 112,
            "lifestyle_id": 112,
            "lifestyle_booking_id": 1367,
            "location": "Colombo 5",
            "service_date": "2024-04-30",
            "pickupTime": "9:00-11:00",
            "latitude": "6.884340614",
            "longitude": "79.86206839",
            "product_image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNyg4fmGJsyCOeVKqyvQc41D0sAbM-VlBkH3MwMv0XhOivrilsn9O5QG4088Sk8CXHriQ&usqp=CAU",
            "product_title": "Hair cut by Salon Miracles",
            "childCount": 0,
            "adultCount": 1,
            "booking_date": "2024-04-30",
            "balance_amount": "0.00",
            "paid_amount": "14.66",
            "total_amount": "14.66",
            "each_item_price": null,
            "currency": "USD",
            "checkoutID": 2246,
            "supplier_status": "Pending",
            "status": "CustomerOrdered",
            "first_name": "shani",
            "last_name": null,
            "email": "no-reply_it@aahaas.com",
            "address": "No.37 , Kashyapa Road Jawatta, Thimbirigasyaya, Colombo, Colombo, Western 05",
            "company_name": "Miracles Salon",
            "phone": "+94777851319",
            "PID": 112,
            "PName": "Hair cut by Salon Miracles",
            "ChildCount": 0,
            "AdultCount": 1,
            "Age": null,
            "VehicleType": "0",
            "TotalOccupancy": 10,
            "MaxAdultOccupancy": 5,
            "MaxChildOccupancy": 5,
            "DDate": "2024-04-30",
            "DAddress": "Colombo 5",
            "category": "Lifestyles"
        },
        {
            "lifestyle_inventory_id": 40976,
            "lifestyle_rate_id": 113,
            "package_id": 113,
            "lifestyle_id": 113,
            "lifestyle_booking_id": 1368,
            "location": "Colombo 5",
            "service_date": "2024-04-30",
            "pickupTime": "9:00-11:00",
            "latitude": "6.884340614",
            "longitude": "79.86206839",
            "product_image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaNSKiii_KxQEuF-6oIWtxOmRHLt5ZpOdmCg&usqp=CAU",
            "product_title": "Hair cut for kids by Salon Miracles",
            "childCount": 0,
            "adultCount": 1,
            "booking_date": "2024-04-30",
            "balance_amount": "0.00",
            "paid_amount": "6.51",
            "total_amount": "6.51",
            "each_item_price": null,
            "currency": "USD",
            "checkoutID": 2247,
            "supplier_status": "Pending",
            "status": "CustomerOrdered",
            "first_name": "shani",
            "last_name": null,
            "email": "no-reply_it@aahaas.com",
            "address": "No.37 , Kashyapa Road Jawatta, Thimbirigasyaya, Colombo, Colombo, Western 05",
            "company_name": "Miracles Salon",
            "phone": "+94777851319",
            "PID": 113,
            "PName": "Hair cut for kids by Salon Miracles",
            "ChildCount": 0,
            "AdultCount": 1,
            "Age": null,
            "VehicleType": "0",
            "TotalOccupancy": 10,
            "MaxAdultOccupancy": 5,
            "MaxChildOccupancy": 5,
            "DDate": "2024-04-30",
            "DAddress": "Colombo 5",
            "category": "Lifestyles"
        },
        {
            "lifestyle_inventory_id": 41341,
            "lifestyle_rate_id": 114,
            "package_id": 114,
            "lifestyle_id": 114,
            "lifestyle_booking_id": 1369,
            "location": "Colombo 5",
            "service_date": "2024-04-30",
            "pickupTime": "9:00-11:00",
            "latitude": "6.884340614",
            "longitude": "79.86206839",
            "product_image": "https://media.allure.com/photos/5c2e8ec54325fe2d62c0943a/1:1/w_1999,h_1999,c_limit/how-often-should-you-get-a-facial-lede.jpg",
            "product_title": "Facial by Salon Miracles",
            "childCount": 0,
            "adultCount": 1,
            "booking_date": "2024-04-30",
            "balance_amount": "0.00",
            "paid_amount": "27.69",
            "total_amount": "27.69",
            "each_item_price": null,
            "currency": "USD",
            "checkoutID": 2248,
            "supplier_status": "Pending",
            "status": "CustomerOrdered",
            "first_name": "shani",
            "last_name": null,
            "email": "no-reply_it@aahaas.com",
            "address": "No.37 , Kashyapa Road Jawatta, Thimbirigasyaya, Colombo, Colombo, Western 05",
            "company_name": "Miracles Salon",
            "phone": "+94777851319",
            "PID": 114,
            "PName": "Facial by Salon Miracles",
            "ChildCount": 0,
            "AdultCount": 1,
            "Age": null,
            "VehicleType": "0",
            "TotalOccupancy": 10,
            "MaxAdultOccupancy": 5,
            "MaxChildOccupancy": 5,
            "DDate": "2024-04-30",
            "DAddress": "Colombo 5",
            "category": "Lifestyles"
        }
    ]



    const QuantityContainer = ({ data }) => {


        console.log(data, "Data Value is")


        if (data.category == "Education") {
            return (
                <CCol style={{ width: '320px' }}>
                    <CRow>
                        <CCol style={{ flex: 2 }}><h6>Max Adult Occupancy</h6></CCol>
                        <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data.MaxAdultOccupancy}</h6></CCol>
                    </CRow>
                    <CRow>
                        <CCol style={{ flex: 2 }}><h6>Max Child Occupancy</h6></CCol>
                        <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data.MaxChildOccupancy}</h6></CCol>
                    </CRow>
                    <CRow>
                        <CCol style={{ flex: 2 }}><h6>Total Occupancy</h6></CCol>
                        <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data.TotalOccupancy}</h6></CCol>
                    </CRow>
                </CCol>
            )
        }

        else if (data.category == "Essentials/Non Essentials") {
            return (
                <CCol style={{ width: '320px' }}>
                    <CRow>
                        <CCol style={{ flex: 2 }}><h6>Quantity</h6></CCol>
                        <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data.Quantity}</h6></CCol>
                    </CRow>


                    <CRow>
                        <CCol style={{ flex: 2 }}><h6>SKU</h6></CCol>
                        <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data.SKU} {data.Unit}</h6></CCol>
                    </CRow>


                </CCol>
            )
        }

        else if (data.category == "Lifestyles") {
            return (
                <CCol style={{ width: '320px' }}>

                    <CRow>
                        <CCol style={{ flex: 2 }}><h6>Adult Count</h6></CCol>
                        <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data.AdultCount}</h6></CCol>
                    </CRow>

                    <CRow>
                        <CCol style={{ flex: 2 }}><h6>Child Count</h6></CCol>
                        <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data.ChildCount}</h6></CCol>
                    </CRow>


                    {data.ChildCount > 0 ?
                        <CRow>
                            <CCol style={{ flex: 2 }}><h6>Child Ages</h6></CCol>
                            <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data.Age}</h6></CCol>
                        </CRow>
                        :
                        null
                    }



                    <CRow>
                        <CCol style={{ flex: 2 }}><h6>Total Occupancy</h6></CCol>
                        <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data.TotalOccupancy}</h6></CCol>
                    </CRow>


                    <CRow>
                        <CCol style={{ flex: 2 }}><h6>Max Adult Occupancy</h6></CCol>
                        <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data.MaxAdultOccupancy}</h6></CCol>
                    </CRow>


                    <CRow>
                        <CCol style={{ flex: 2 }}><h6>Max Child Occupancy</h6></CCol>
                        <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data.MaxChildOccupancy}</h6></CCol>
                    </CRow>

                </CCol>
            )
        }

    }

    const columns = [
        { title: 'Product ID', field: 'pid' },
        { title: 'Name', field: 'name' },

        { title: 'Date', field: 'date' },
        { title: 'Address', field: 'address' },

        { title: 'Total Amount', field: 'total_amount' },
        { title: 'Paid Amount', field: 'paid_amount' },
        { title: 'Balance Amount', field: 'balance_amount' }
    ]


    const data = productData.map(value => ({
        pid: value?.['PID'],
        name: value?.['PName'],

        date: value?.['DDate'],
        address: value?.['DAddress'],
        total_amount: value?.['total_amount'],
        paid_amount: value?.['paid_amount'],
        balance_amount: value?.['balance_amount']
    }))


    return (
        <>
            <MaterialTable
                title="Product Data"
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
        </>
    )
}
