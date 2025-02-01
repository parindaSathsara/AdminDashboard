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


export default function EssentialsProductView(props) {

    const basicDetails = props.productData?.productBasicData
    const inventory = props.productData?.productInventory
    const rate = props.productData?.productRates

    const details = props.productData?.productDetails


    // console.log(basicDetails)

    function renderVariations(value) {
        let variations = [];
        for (let i = 1; i <= 5; i++) {
            if (value?.[`variation_type${i}`] && value?.[`variant_type${i}`]) {
                variations.push(`${value?.[`variation_type${i}`]} - ${value?.[`variant_type${i}`]}`);
            }
        }
        return variations.length > 0 ? variations.join(', ') : '-';
    }

    const ProductListingDetails = () => {
        const columns = [
            { title: 'ID', field: 'id' },

            { title: 'Sub Description', field: 'sub_description' },
            { title: 'Cash on Delivery', field: 'cash_onDelivery' },
            { title: 'Discount Status', field: 'discount_status' },
            { title: 'Product Images', field: 'product_images' },
            { title: 'Listing Status', field: 'listing_status' },
            { title: 'SEO Tags', field: 'seo_tags' },
            { title: 'Seller ID', field: 'seller_id' },
            { title: 'Created At', field: 'created_at' },
            { title: 'Updated At', field: 'updated_at' },
            // Add more columns as needed
        ];

        const data = basicDetails?.map(item => ({
            id: item?.id,

            sub_description: item?.sub_description,
            cash_onDelivery: item?.cash_onDelivery,
            discount_status: item?.discount_status,
            product_images: item?.product_images,
            listing_status: item?.listing_status,
            seo_tags: item?.seo_tags,
            seller_id: item?.seller_id,
            created_at: item?.created_at,
            updated_at: item?.updated_at,
            // Map other fields similarly
        }));

        return (

            <MaterialTable
                title="Basic Details"
                columns={columns}
                data={data}

                options={{
                    headerStyle: {
                        fontSize: '14px',


                        // Adjust the header font size here
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


    const InventoryDetails = () => {
        const columns = [
            { title: 'ID', field: 'id' },
            { title: 'Variation Type 1', field: 'variation_type1' },
            { title: 'Variation Type 2', field: 'variation_type2' },
            { title: 'Variation Type 3', field: 'variation_type3' },
            { title: 'Variation Type 4', field: 'variation_type4' },
            { title: 'Variation Type 5', field: 'variation_type5' },
            { title: 'Variant Type 1', field: 'variant_type1' },
            { title: 'Variant Type 2', field: 'variant_type2' },
            { title: 'Variant Type 3', field: 'variant_type3' },
            { title: 'Variant Type 4', field: 'variant_type4' },
            { title: 'Variant Type 5', field: 'variant_type5' },
            { title: 'Variant Image', field: 'variant_image' },
            { title: 'Listing ID', field: 'listing_id' },
            { title: 'Created At', field: 'created_at' },
            { title: 'Updated At', field: 'updated_at' },
            { title: 'Status', field: 'status' },
        ];



        const data = inventory?.map(inventory => (
            {
                id: inventory?.id,
                variation_type1: inventory?.variation_type1,
                variation_type2: inventory?.variation_type2,
                variation_type3: inventory?.variation_type3,
                variation_type4: inventory?.variation_type4,
                variation_type5: inventory?.variation_type5,
                variant_type1: inventory?.variant_type1,
                variant_type2: inventory?.variant_type2,
                variant_type3: inventory?.variant_type3,
                variant_type4: inventory?.variant_type4,
                variant_type5: inventory?.variant_type5,
                variant_image: inventory?.variant_image,
                listing_id: inventory?.listing_id,
                created_at: inventory?.created_at,
                updated_at: inventory?.updated_at,
                status: inventory?.status,
            }
        ));

        return (
            <CCol xs="12" lg="12">
                <div style={{ border: '2px solid #D1F2D8', borderRadius: '8px', padding: '10px', backgroundColor: '#F2FCF4', marginBottom: '20px' }}>
                    <MaterialTable
                        title="Inventory Details"
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
                            paging: false,
                            search: false,
                            columnsButton: true,
                            // exportButton: true,
                        }}
                    />
                </div>
            </CCol>
        );
    };


    const ProductDetails = () => {
        const columns = [
            { title: 'Product Detail ID', field: 'product_detail_id' },
            { title: 'Listing ID', field: 'listing_id' },
            { title: 'Category 1', field: 'category1' },
            { title: 'Category 2', field: 'category2' },
            { title: 'Category 3', field: 'category3' },
            { title: 'Category 4', field: 'category4' },
            { title: 'Search Tags', field: 'search_tags' },
            { title: 'Group Tags', field: 'group_tags' },
            { title: 'Priority', field: 'priority' },
            { title: 'Delivery Type', field: 'delivery_type' },
            { title: 'Payment Options', field: 'payment_options' },
            // Add more columns as needed
        ];

        const data = details?.map(item => ({
            product_detail_id: item?.product_detail_id,
            listing_id: item?.listing_id,
            category1: item?.category1,
            category2: item?.category2,
            category3: item?.category3,
            category4: item?.category4,
            search_tags: item?.search_tags,
            group_tags: item?.group_tags,
            priority: item?.priority,
            delivery_type: item?.delivery_type,
            payment_options: item?.payment_options,
            // Map other fields similarly
        }));

        return (
            <CCol xs="12" lg="12">
                <div style={{ border: '2px solid #F3E4BA', borderRadius: '8px', padding: '10px', backgroundColor: '#FBF5E3', marginBottom: '20px' }}>
                    <MaterialTable
                        title="Product Details"
                        columns={columns}
                        data={data}
                        style={{ backgroundColor: '#FBF5E3' }}
                        options={{
                            headerStyle: {
                                fontSize: '14px',
                                backgroundColor: '#F3E4BA'

                                // Adjust the header font size here
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
                </div>
            </CCol>
        );
    };


    const RateDetails = () => {
        const columns = [
            { title: 'Rate ID', field: 'rate_id' },
            { title: 'Inventory ID', field: 'inventory_id' },
            { title: 'Active Start Date', field: 'active_start_date' },
            { title: 'Active End Date', field: 'active_end_date' },
            { title: 'Currency', field: 'currency' },
            { title: 'MRP', field: 'mrp' },
            { title: 'Selling Rate', field: 'selling_rate' },
            { title: 'Wholesale Rate', field: 'wholesale_rate' },
            { title: 'Purchase Price', field: 'purchase_price' },
            { title: 'Quantity', field: 'qty' },
            { title: 'Min Order Quantity', field: 'min_order_qty' },
            { title: 'Max Order Quantity', field: 'max_order_qty' },
            { title: 'Payment Option', field: 'payment_option' },
            { title: 'Cities Included', field: 'cities_inc' },
            { title: 'Cities Excluded', field: 'cities_exc' },
            { title: 'Blackout Dates', field: 'blackout_dates' },
            { title: 'Blackout Days', field: 'blackout_days' },
        ];

        const data = rate?.map(rate => (
            {
                rate_id: rate?.rate_id,
                inventory_id: rate?.inventory_id,
                active_start_date: rate?.active_start_date,
                active_end_date: rate?.active_end_date,
                currency: rate?.currency,
                mrp: rate?.mrp,
                selling_rate: rate?.selling_rate,
                wholesale_rate: rate?.wholesale_rate,
                purchase_price: rate?.purchase_price,
                qty: rate?.qty,
                min_order_qty: rate?.min_order_qty,
                max_order_qty: rate?.max_order_qty,
                payment_option: rate?.payment_option,
                cities_inc: rate?.cities_inc,
                cities_exc: rate?.cities_exc,
                blackout_dates: rate?.blackout_dates,
                blackout_days: rate?.blackout_days,
            }
        ))


        return (

            <CCol xs="12" lg="12">
                <div style={{ border: '2px solid #E5D3FA', borderRadius: '8px', padding: '10px', backgroundColor: '#FAF7FE', marginBottom: '20px' }}>
                    <MaterialTable
                        title="Rate Details"
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
                            paging: false,
                            search: false,
                            columnsButton: true,
                            // exportButton: true,
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
                            // src={basicDetails?.[0]?.["product_images"].includes("http") ? basicDetails?.[0]?.["product_images"] : "https://supplier.aahaas.com/" + basicDetails?.[0]?.["product_images"]}
                            src={basicDetails?.[0]?.["product_images"] && basicDetails[0]["product_images"].includes("http") ? basicDetails[0]["product_images"] : "https://supplier.aahaas.com/" + basicDetails?.[0]?.["product_images"]}
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


                <CCol className='py-4' lg="8">

                    <CCol xs="12" lg="12">
                        <h4 className='mb-2'>{basicDetails?.[0]?.['listing_title']}</h4>

                        <CCardText className='mb-4'>{basicDetails?.[0]?.["listing_description"]}</CCardText>


                        <CCol xs="12" lg="12">
                            <ProductListingDetails></ProductListingDetails>
                        </CCol>

                    </CCol>


                    {/* <CRow>
                        <CCol xs="12" lg="4">
                            <div style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '10px', backgroundColor: '#f8f9fa', marginBottom: '20px' }}>
                                <CCardBody>
                                    <CCardTitle className="productTitle">Delivery Location</CCardTitle>
                                    <CCardText style={{ color: '#333' }} className="desc">{bookData?.["address"]}</CCardText>
                                </CCardBody>
                            </div>
                        </CCol>


                        <CCol xs="12" lg="4">
                            <div style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '10px', backgroundColor: '#f8f9fa', marginBottom: '20px' }}>
                                <CCardBody>
                                    <CCardTitle className="productTitle">Variations</CCardTitle>
                                    <CCardText style={{ color: '#333' }} className="desc">{renderVariations(inventory)}</CCardText>
                                </CCardBody>
                            </div>
                        </CCol>

                        <CCol xs="12" lg="4">
                            <div style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '10px', backgroundColor: '#f8f9fa', marginBottom: '20px' }}>
                                <CCardBody>
                                    <CCardTitle className="productTitle">Order Preferred Date</CCardTitle>
                                    <CCardText style={{ color: '#333' }} className="desc">{bookData?.["preffered_date"]}</CCardText>
                                </CCardBody>
                            </div>
                        </CCol>



                    </CRow> */}


                </CCol>

            </CRow>



            <CCol className='my-4'>

                <ProductDetails />


            </CCol>

            <CCol className='my-4'>

                <InventoryDetails />


            </CCol>



            <CCol className='my-4'>
                <RateDetails />
            </CCol>




        </CContainer>
    )
}
