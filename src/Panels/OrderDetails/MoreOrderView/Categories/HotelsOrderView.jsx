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
import { useEffect, useState } from 'react';
import axios from 'axios';


export default function HotelsOrderView(props) {


  // console.log(props.dataset, "Product Data value issss")
  // console.log(props, "Product Data value issss")

  // console.log(basicDetails?.decoded_data?.hotelMainRequest?.hotelData?.images, "Basic Details value is")




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

  const [bookingData, setBookingData] = useState(null);
  const fetchBookingData = async (data) => {
    try {
      let url = "";
      if (data?.Provider == "hotelTbo") {
        url = `/tbov2/booking/booking-info/${data.checkoutID}`;
      } else if (data?.Provider == "hotelTboH") {
        url = `/tboh/hotels/booking-details/${data.checkoutID}`;
      }
      const response = await axios.get(url);

      if (data?.Provider == "hotelTbo") {
        if (response.data?.data?.bookingData) {
          setBookingData(response.data.data)
        }
      }
      else if (data?.Provider == "hotelTboH") {
        if (response?.data?.data?.BookingDetail) {
          setBookingData(response?.data?.data?.BookingDetail)
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [basicDetails, setBasicDetails] = useState([])

  useEffect(() => {
    fetchBookingData(props.productData);
    setBasicDetails(props?.productData)
  }, [props.productData]);



  const mealAllocation = basicDetails?.decoded_data?.customerDetails?.mealAllocation;



  return (
    <CContainer style={{ backgroundColor: 'white', padding: 20, borderRadius: 20, paddingRight: 60, paddingLeft: 60 }} fluid>
      {props?.productData?.Provider == "hotelAhs" && (
        <>
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
        </>
      )}
      {props?.productData?.Provider == "hotelTboH" && bookingData && (
        <div style={{ fontFamily: 'Arial, sans-serif', margin: '0 auto', padding: '25px', borderRadius: '8px', boxShadow: '0 3px 15px rgba(0,0,0,0.1)', backgroundColor: '#fff' }}>
          {/* <h1 style={{ color: '#2c3e50', borderBottom: '3px solid #3498db', paddingBottom: '10px', marginTop: '0', fontSize: '28px' }}>Booking Confirmation</h1> */}

          {/* Main Booking Info */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '25px' }}>
            <div style={{ flex: '1', minWidth: '250px' }}>
              <div style={{ backgroundColor: '#f8f9fa', padding: '18px', borderRadius: '6px', marginBottom: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h3 style={{ margin: '0 0 12px 0', color: '#2c3e50', fontSize: '18px' }}>Booking Information</h3>
                <p style={{ margin: '8px 0', fontSize: '15px' }}><span style={{ fontWeight: 'bold', color: '#555', width: '160px', display: 'inline-block' }}>Status:</span>
                  <span style={{ color: '#27ae60', fontWeight: 'bold', backgroundColor: 'rgba(39, 174, 96, 0.1)', padding: '3px 8px', borderRadius: '4px' }}>{bookingData.BookingStatus}</span>
                  {bookingData.VoucherStatus && <span style={{ marginLeft: '10px', fontSize: '13px', backgroundColor: '#3498db', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>Voucher Available</span>}
                </p>
                <p style={{ margin: '8px 0', fontSize: '15px' }}><span style={{ fontWeight: 'bold', color: '#555', width: '160px', display: 'inline-block' }}>Confirmation Number:</span> {bookingData.ConfirmationNumber}</p>
                <p style={{ margin: '8px 0', fontSize: '15px' }}><span style={{ fontWeight: 'bold', color: '#555', width: '160px', display: 'inline-block' }}>Invoice Number:</span> {bookingData.InvoiceNumber}</p>
                <p style={{ margin: '8px 0', fontSize: '15px' }}><span style={{ fontWeight: 'bold', color: '#555', width: '160px', display: 'inline-block' }}>Booking Date:</span> {new Date(bookingData.BookingDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p style={{ margin: '8px 0', fontSize: '15px' }}><span style={{ fontWeight: 'bold', color: '#555', width: '160px', display: 'inline-block' }}>Number of Rooms:</span> {bookingData.NoOfRooms}</p>
              </div>
            </div>

            <div style={{ flex: '1', minWidth: '250px' }}>
              <div style={{ backgroundColor: '#f8f9fa', padding: '18px', borderRadius: '6px', marginBottom: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h3 style={{ margin: '0 0 12px 0', color: '#2c3e50', fontSize: '18px' }}>Stay Information</h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <div style={{ textAlign: 'center', flex: '1' }}>
                    <p style={{ margin: '0', fontSize: '13px', color: '#555' }}>CHECK-IN</p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' }}>{new Date(bookingData.CheckIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    <p style={{ margin: '3px 0 0 0', fontSize: '14px' }}>{new Date(bookingData.CheckIn).getFullYear()}</p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', padding: '0 15px' }}>
                    <div style={{ height: '1px', width: '50px', backgroundColor: '#ddd' }}></div>
                    <div style={{ margin: '0 10px', color: '#555', fontSize: '14px' }}>1 Night</div>
                    <div style={{ height: '1px', width: '50px', backgroundColor: '#ddd' }}></div>
                  </div>

                  <div style={{ textAlign: 'center', flex: '1' }}>
                    <p style={{ margin: '0', fontSize: '13px', color: '#555' }}>CHECK-OUT</p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' }}>{new Date(bookingData.CheckOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    <p style={{ margin: '3px 0 0 0', fontSize: '14px' }}>{new Date(bookingData.CheckOut).getFullYear()}</p>
                  </div>
                </div>
                <p style={{ margin: '8px 0', fontSize: '15px', color: '#555' }}><span style={{ fontWeight: 'bold' }}>Check-in Time:</span> 12:00 PM</p>
                <p style={{ margin: '8px 0', fontSize: '15px', color: '#555' }}><span style={{ fontWeight: 'bold' }}>Check-out Time:</span> 12:00 PM</p>
              </div>
            </div>
          </div>

          {/* Hotel Information */}
          <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #eaeaea', paddingBottom: '8px', fontSize: '22px' }}>Hotel Information</h2>
          <div style={{ backgroundColor: '#f8f9fa', padding: '18px', borderRadius: '6px', marginBottom: '25px', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'flex-start' }}>
            <div style={{ flex: '1', minWidth: '300px' }}>
              <p style={{ margin: '5px 0', fontSize: '20px', fontWeight: 'bold', color: '#2c3e50' }}>{bookingData.HotelDetails.HotelName}</p>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'inline-block' }}>
                  {Array(3).fill(0).map((_, i) => (
                    <span key={i} style={{ color: '#f39c12', fontSize: '16px' }}>★</span>
                  ))}
                </div>
                <span style={{ marginLeft: '8px', color: '#555', fontSize: '14px' }}>Three Star</span>
              </div>
              <p style={{ margin: '8px 0', fontSize: '15px' }}><span style={{ fontWeight: 'bold', color: '#555', width: '70px', display: 'inline-block' }}>Address:</span> {bookingData.HotelDetails.AddressLine1}</p>
              <p style={{ margin: '8px 0', fontSize: '15px' }}><span style={{ fontWeight: 'bold', color: '#555', width: '70px', display: 'inline-block' }}>City:</span> {bookingData.HotelDetails.City}</p>
            </div>

            <div style={{ flex: '1', minWidth: '200px', maxWidth: '250px', height: '150px', backgroundColor: '#e9ecef', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center', color: '#7f8c8d' }}>
                <div style={{ fontSize: '24px', marginBottom: '5px' }}>📍</div>
                <div style={{ fontSize: '14px' }}>Map Coordinates:</div>
                <div style={{ fontSize: '13px' }}>{bookingData.HotelDetails.Map}</div>
              </div>
            </div>
          </div>

          {/* Room Details */}
          <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #eaeaea', paddingBottom: '8px', fontSize: '22px' }}>Room Details</h2>
          {bookingData.Rooms.map((room, index) => (
            <div key={index} style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '6px', marginBottom: '20px', borderLeft: '4px solid #3498db', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '25px', marginBottom: '20px' }}>
                <div style={{ flex: '2', minWidth: '300px' }}>
                  <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50', fontSize: '18px' }}>{room.Name[0]}</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                    <div style={{ flex: '1', minWidth: '200px' }}>
                      <p style={{ margin: '5px 0', fontSize: '15px' }}><span style={{ fontWeight: 'bold', color: '#555' }}>Status:</span> <span style={{ color: room.Status === 'Confirmed' ? '#27ae60' : room.Status === 'Not Cancelled' ? '#f39c12' : '#e74c3c' }}>{room.Status}</span></p>
                      <p style={{ margin: '5px 0', fontSize: '15px' }}><span style={{ fontWeight: 'bold', color: '#555' }}>Meal Type:</span> {room.MealType.replace(/_/g, ' ')}</p>
                      <p style={{ margin: '5px 0', fontSize: '15px' }}><span style={{ fontWeight: 'bold', color: '#555' }}>Inclusion:</span> {room.Inclusion}</p>
                      <p style={{ margin: '5px 0', fontSize: '15px' }}><span style={{ fontWeight: 'bold', color: '#555' }}>Refundable:</span> <span style={{ color: room.IsRefundable ? '#27ae60' : '#e74c3c' }}>{room.IsRefundable ? 'Yes' : 'No'}</span></p>
                    </div>
                  </div>
                </div>

                <div style={{ flex: '1', minWidth: '200px', backgroundColor: '#fff', padding: '15px', borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#2c3e50', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>Price Details ({room.Currency})</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', margin: '8px 0' }}>
                    <span style={{ color: '#555' }}>Room Price:</span>
                    <span style={{ fontWeight: 'bold' }}>${(room.TotalFare - room.TotalTax).toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', margin: '8px 0' }}>
                    <span style={{ color: '#555' }}>Tax:</span>
                    <span>${room.TotalTax.toFixed(2)}</span>
                  </div>
                  {room.Supplements && room.Supplements[0] && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '8px 0' }}>
                      <span style={{ color: '#555' }}>{room.Supplements[0][0].Description}:</span>
                      <span>${room.Supplements[0][0].Price.toFixed(2)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', margin: '12px 0 0 0', paddingTop: '12px', borderTop: '1px dashed #eee', fontWeight: 'bold' }}>
                    <span>Total:</span>
                    <span style={{ color: '#2c3e50', fontSize: '18px' }}>${room.TotalFare.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '25px' }}>
                <div style={{ flex: '1', minWidth: '250px' }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#2c3e50' }}>Guests:</h4>
                  <div style={{ backgroundColor: '#fff', borderRadius: '6px', padding: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    {room.CustomerDetails[0].CustomerNames.map((guest, i) => (
                      <div key={i} style={{ padding: '8px', borderBottom: i < room.CustomerDetails[0].CustomerNames.length - 1 ? '1px solid #eee' : 'none', display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#3498db', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px', fontSize: '14px', fontWeight: 'bold' }}>
                          {guest.FirstName[0]}{guest.LastName[0]}
                        </div>
                        <div>
                          <div style={{ fontWeight: 'bold' }}>{guest.Title} {guest.FirstName} {guest.LastName}</div>
                          <div style={{ fontSize: '13px', color: '#7f8c8d' }}>{guest.Type}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ flex: '1', minWidth: '300px' }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#2c3e50' }}>Cancellation Policy:</h4>
                  <div style={{ backgroundColor: '#fff', borderRadius: '6px', padding: '15px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    {room.CancelPolicies.map((policy, i) => (
                      <div key={i} style={{ marginBottom: i < room.CancelPolicies.length - 1 ? '10px' : '0', paddingBottom: i < room.CancelPolicies.length - 1 ? '10px' : '0', borderBottom: i < room.CancelPolicies.length - 1 ? '1px solid #eee' : 'none' }}>
                        <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}>
                          <span style={{ fontWeight: 'bold' }}>From {policy.FromDate.substring(0, 10)}:</span>
                        </p>
                        <p style={{ margin: '0', fontSize: '14px', color: policy.CancellationCharge === 0 ? '#27ae60' : '#e74c3c' }}>
                          {policy.CancellationCharge === 0 ?
                            'Free cancellation' :
                            `${policy.CancellationCharge}% of total amount will be charged`
                          }
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Additional Information */}
          <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #eaeaea', paddingBottom: '8px', fontSize: '22px' }}>Additional Information</h2>
          <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '6px', marginBottom: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ margin: '0 0 12px 0', color: '#2c3e50', fontSize: '18px' }}>Rate Conditions</h3>
              <ul style={{ margin: '0', paddingLeft: '20px' }}>
                {bookingData.RateConditions.filter(condition => !condition.includes('CheckIn Time') && !condition.includes('CheckOut Time') && !condition.includes('CheckIn Instructions') && !condition.includes('Special Instructions') && !condition.includes('Mandatory Fees') && !condition.includes('Optional Fees') && !condition.includes('Cards Accepted') && !condition.includes('Pets not allowed')).map((condition, index) => (
                  <li key={index} style={{ margin: '5px 0', color: '#555' }}>{condition}</li>
                ))}
              </ul>
            </div>

            {bookingData.RateConditions.some(condition => condition.includes('CheckIn Instructions')) && (
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 12px 0', color: '#2c3e50', fontSize: '18px' }}>Check-In Instructions</h3>
                <div style={{ color: '#555' }} dangerouslySetInnerHTML={{ __html: bookingData.RateConditions.find(condition => condition.includes('CheckIn Instructions')).split(': ')[1] }}></div>
              </div>
            )}

            {bookingData.RateConditions.some(condition => condition.includes('Special Instructions')) && (
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 12px 0', color: '#2c3e50', fontSize: '18px' }}>Special Instructions</h3>
                <p style={{ margin: '5px 0', color: '#555' }}>{bookingData.RateConditions.find(condition => condition.includes('Special Instructions')).split(': ')[1]}</p>
              </div>
            )}

            {bookingData.RateConditions.some(condition => condition.includes('Mandatory Fees')) && (
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 12px 0', color: '#2c3e50', fontSize: '18px' }}>Mandatory Fees</h3>
                <div style={{ color: '#555' }} dangerouslySetInnerHTML={{ __html: bookingData.RateConditions.find(condition => condition.includes('Mandatory Fees')).split(': ')[1] }}></div>
              </div>
            )}

            {bookingData.RateConditions.some(condition => condition.includes('Optional Fees')) && (
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 12px 0', color: '#2c3e50', fontSize: '18px' }}>Optional Fees</h3>
                <div style={{ color: '#555' }} dangerouslySetInnerHTML={{ __html: bookingData.RateConditions.find(condition => condition.includes('Optional Fees')).split(': ')[1] }}></div>
              </div>
            )}

            {bookingData.RateConditions.some(condition => condition.includes('Cards Accepted')) && (
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 12px 0', color: '#2c3e50', fontSize: '18px' }}>Payment Information</h3>
                <p style={{ margin: '5px 0', color: '#555' }}><strong>Accepted Payment Methods:</strong> {bookingData.RateConditions.find(condition => condition.includes('Cards Accepted')).split(': ')[1].split(',').join(', ')}</p>
              </div>
            )}

            {bookingData.RateConditions.some(condition => condition.includes('Pets not allowed')) && (
              <div>
                <h3 style={{ margin: '0 0 12px 0', color: '#2c3e50', fontSize: '18px' }}>Property Policies</h3>
                <ul style={{ margin: '0', paddingLeft: '20px' }}>
                  {bookingData.RateConditions.find(condition => condition.includes('Pets not allowed')).split(',').map((policy, index) => (
                    <li key={index} style={{ margin: '5px 0', color: '#555' }}>{policy.trim()}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {props?.productData?.Provider == "hotelTbo" && bookingData && (
        <>
          <div className="p-4">
            {/* Hotel Header Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {bookingData?.bookingData?.HotelName}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    {/* <MapPin className="w-4 h-4 text-gray-500" /> */}
                    <span className="text-gray-600">
                      {bookingData?.bookingData?.City}, {bookingData?.bookingData?.CountryCode}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold">{bookingData?.bookingData?.StarRating}</span>
                  {/* <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" /> */}
                </div>
              </div>
            </div>

            {/* Booking Status Banner */}
            <div className={`mb-6 p-3 rounded-lg text-center ${bookingData?.bookingData?.HotelBookingStatus === 'Confirmed'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
              }`}>
              <span className="font-semibold">
                Status: {bookingData?.bookingData?.HotelBookingStatus}
              </span>
            </div>

            {/* Main Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dates & Room Info */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  {/* <Calendar className="w-5 h-5 text-blue-600" /> */}
                  Stay Details
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-in:</span>
                    <span className="font-medium">
                      {new Date(bookingData?.bookingData?.CheckInDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-out:</span>
                    <span className="font-medium">
                      {new Date(bookingData?.bookingData?.CheckOutDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rooms:</span>
                    <span className="font-medium">{bookingData?.bookingData?.NoOfRooms}</span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  {/* <CreditCard className="w-5 h-5 text-blue-600" /> */}
                  Payment Details
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Invoice Amount:</span>
                    <span className="font-medium">₹{bookingData?.bookingData?.InvoiceAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Invoice No:</span>
                    <span className="font-medium">{bookingData?.bookingData?.InvoiceNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking Source:</span>
                    <span className="font-medium">{bookingData?.bookingData?.BookingSource}</span>
                  </div>
                </div>
              </div>

              {/* Guest Info */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  {/* <User className="w-5 h-5 text-blue-600" /> */}
                  Guest Information
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nationality:</span>
                    <span className="font-medium">{bookingData?.bookingData?.GuestNationality}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Confirmation No:</span>
                    <span className="font-medium">{bookingData?.bookingData?.ConfirmationNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking Ref:</span>
                    <span className="font-medium">{bookingData?.bookingData?.BookingRefNo}</span>
                  </div>
                </div>
              </div>

              {/* Hotel Policy */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  {/* <Flag className="w-5 h-5 text-blue-600" /> */}
                  Hotel Policy
                </h3>
                <p className="text-gray-600">
                  {bookingData?.bookingData?.HotelPolicyDetail || 'No policy information available'}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
      {props?.productData?.Provider != "hotelAhs" && !bookingData && (
        <>
          <div>
            Loading ...
          </div>
        </>
      )}
    </CContainer>
  )
}
