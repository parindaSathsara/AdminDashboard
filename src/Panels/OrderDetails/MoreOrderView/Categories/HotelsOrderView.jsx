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
  console.log(props, "Hotel Order View Props");
  // const { bookingData } = props || {};


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
  const [nightCount, setNightCount] = useState(0);
  const [starCount, setStarCount] = useState(0);


  const fetchBookingData = async (data) => {
    console.log(data, "Data value is");
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
          console.log(response.data?.data?.bookingData, "Booking Data");
          setBookingData(response.data.data)
        }
      }
      else if (data?.Provider == "hotelTboH") {
        if (response?.data?.data?.BookingDetail) {
          setBookingData(response?.data?.data?.BookingDetail)
          console.log(response?.data?.data?.BookingDetail, "Booking Data");

        }
      }

      const checkInDate = new Date(bookingData.CheckIn);
      const checkOutDate = new Date(bookingData.CheckOut);
      nightCount = Math.max(1, (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)); // Calculate nights

      console.log(nightCount, "Night Count");

    } catch (error) {
      console.log(error);
    }
  };

  // Recalculate nightCount when bookingData updates
  useEffect(() => {
    if (bookingData?.CheckIn && bookingData?.CheckOut) {
      const checkInDate = new Date(bookingData.CheckIn);
      const checkOutDate = new Date(bookingData.CheckOut);
      setNightCount(Math.max(1, (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)));
      const ratingMap = {
        OneStar: 1,
        TwoStar: 2,
        ThreeStar: 3,
        FourStar: 4,
        FiveStar: 5
      };

      setStarCount(ratingMap[bookingData?.HotelDetails?.Rating] || 0);
    }
  }, [bookingData]);


  const [basicDetails, setBasicDetails] = useState([])

  useEffect(() => {

    fetchBookingData(props.productData);
    setBasicDetails(props?.productData)


  }, [props.productData]);

  console.log(basicDetails, "Basic Details value is")


  const mealAllocation = basicDetails?.decoded_data?.customerDetails?.mealAllocation;


  return (
    <CContainer style={{ backgroundColor: 'white', padding: 20, borderRadius: 20, paddingRight: 60, paddingLeft: 60 }} fluid>
      {(props?.productData?.Provider == "hotelAhs" || props?.productData?.Provider === "ratehawk") && (
        <div style={{ fontFamily: 'Arial, sans-serif', margin: '0 auto', padding: '25px', borderRadius: '8px', boxShadow: '0 3px 15px rgba(0,0,0,0.1)', backgroundColor: '#fff' }}>
          {/* Main Booking Info */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '25px' }}>
            <div style={{ flex: '1', minWidth: '250px' }}>
              <div style={{ backgroundColor: '#f8f9fa', padding: '18px', borderRadius: '6px', marginBottom: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h3 style={{ margin: '0 0 12px 0', color: '#2c3e50', fontSize: '18px' }}>Booking Information</h3>
                <p style={{ margin: '8px 0', fontSize: '15px' }}>
                  <span style={{ fontWeight: 'bold', color: '#555', width: '160px', display: 'inline-block' }}>Status:</span>
                  <span style={{
                    color: basicDetails?.status === 'CustomerOrdered' ? '#f39c12' :
                      basicDetails?.status === 'Confirmed' ? '#27ae60' : '#e74c3c',
                    fontWeight: 'bold',
                    backgroundColor: basicDetails?.status === 'CustomerOrdered' ? 'rgba(243, 156, 18, 0.1)' :
                      basicDetails?.status === 'Confirmed' ? 'rgba(39, 174, 96, 0.1)' : 'rgba(231, 76, 60, 0.1)',
                    padding: '3px 8px',
                    borderRadius: '4px'
                  }}>
                    {basicDetails?.status}
                  </span>
                </p>
                <p style={{ margin: '8px 0', fontSize: '15px' }}>
                  <span style={{ fontWeight: 'bold', color: '#555', width: '160px', display: 'inline-block' }}>Order ID:</span>
                  {basicDetails?.orderID}
                </p>
                <p style={{ margin: '8px 0', fontSize: '15px' }}>
                  <span style={{ fontWeight: 'bold', color: '#555', width: '160px', display: 'inline-block' }}>Booking Date:</span>
                  {moment(basicDetails?.booked_date).format('MMMM Do YYYY, h:mm a')}
                </p>
                <p style={{ margin: '8px 0', fontSize: '15px' }}>
                  <span style={{ fontWeight: 'bold', color: '#555', width: '160px', display: 'inline-block' }}>Total Amount:</span>
                  {basicDetails?.currency} {basicDetails?.total_amount}
                </p>
              </div>
            </div>

            <div style={{ flex: '1', minWidth: '250px' }}>
              <div style={{ backgroundColor: '#f8f9fa', padding: '18px', borderRadius: '6px', marginBottom: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h3 style={{ margin: '0 0 12px 0', color: '#2c3e50', fontSize: '18px' }}>Stay Information</h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <div style={{ textAlign: 'center', flex: '1' }}>
                    <p style={{ margin: '0', fontSize: '13px', color: '#555' }}>CHECK-IN</p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' }}>
                      {moment(basicDetails?.checkInDate, 'DD/MM/YYYY').format('MMM D')}
                    </p>
                    <p style={{ margin: '3px 0 0 0', fontSize: '14px' }}>
                      {moment(basicDetails?.checkInDate, 'DD/MM/YYYY').format('YYYY')}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', padding: '0 15px' }}>
                    <div style={{ height: '1px', width: '50px', backgroundColor: '#ddd' }}></div>
                    <div style={{ margin: '0 10px', color: '#555', fontSize: '14px' }}>
                      {basicDetails?.NoOfNights} {basicDetails?.NoOfNights > 1 ? "Nights" : "Night"}
                    </div>
                    <div style={{ height: '1px', width: '50px', backgroundColor: '#ddd' }}></div>
                  </div>

                  <div style={{ textAlign: 'center', flex: '1' }}>
                    <p style={{ margin: '0', fontSize: '13px', color: '#555' }}>CHECK-OUT</p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' }}>
                      {moment(basicDetails?.checkInDate, 'DD/MM/YYYY').add(basicDetails?.NoOfNights, 'days').format('MMM D')}
                    </p>
                    <p style={{ margin: '3px 0 0 0', fontSize: '14px' }}>
                      {moment(basicDetails?.checkInDate, 'DD/MM/YYYY').add(basicDetails?.NoOfNights, 'days').format('YYYY')}
                    </p>
                  </div>
                </div>
                <p style={{ margin: '8px 0', fontSize: '15px', color: '#555' }}>
                  <span style={{ fontWeight: 'bold' }}>Check-in Time:</span> 12:00 PM
                </p>
                <p style={{ margin: '8px 0', fontSize: '15px', color: '#555' }}>
                  <span style={{ fontWeight: 'bold' }}>Check-out Time:</span> 12:00 PM
                </p>
              </div>
            </div>
          </div>

          {/* Hotel Information */}
          <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #eaeaea', paddingBottom: '8px', fontSize: '22px' }}>Hotel Information</h2>
          <div style={{ backgroundColor: '#f8f9fa', padding: '18px', borderRadius: '6px', marginBottom: '25px', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'flex-start' }}>
            <div style={{ flex: '1', minWidth: '300px' }}>
              <p style={{ margin: '5px 0', fontSize: '20px', fontWeight: 'bold', color: '#2c3e50' }}>{basicDetails?.hotelName}</p>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                {/* You can add star rating here if available in your data */}
                <div style={{ display: 'inline-block' }}>
                  {Array(starCount).fill(0).map((_, i) => (
                    <span key={i} style={{ color: '#f39c12', fontSize: '16px' }}>★</span>
                  ))}
                </div>
              </div>
              <p style={{ margin: '8px 0', fontSize: '15px' }}>
                <span style={{ fontWeight: 'bold', color: '#555', width: '70px', display: 'inline-block' }}>Address:</span>
                {basicDetails?.address}
              </p>
            </div>

            <div style={{ flex: '1', minWidth: '200px', maxWidth: '250px', height: '150px', backgroundColor: '#e9ecef', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* <CImage
                src={basicDetails?.product_image}
                fluid
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '6px'
                }}
              /> */}
              <CImage
                src={basicDetails?.product_image?.includes(',')
                  ? basicDetails.product_image.split(',')[0]
                  : basicDetails?.product_image}
                fluid
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '6px'
                }}
              />
            </div>
          </div>

          {/* Room Details */}
          <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #eaeaea', paddingBottom: '8px', fontSize: '22px' }}>Room Details</h2>
          <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '6px', marginBottom: '20px', borderLeft: '4px solid #3498db', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '25px', marginBottom: '20px' }}>
              <div style={{ flex: '2', minWidth: '300px' }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50', fontSize: '18px' }}>
                  {basicDetails?.decoded_data?.hotelRatesRequest?.RoomTypeName}
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                  <div style={{ flex: '1', minWidth: '200px' }}>
                    <p style={{ margin: '5px 0', fontSize: '15px' }}>
                      <span style={{ fontWeight: 'bold', color: '#555' }}>Room Type:</span>
                      {basicDetails?.decoded_data?.hotelRatesRequest?.RoomTypeName}
                    </p>
                    <p style={{ margin: '5px 0', fontSize: '15px' }}>
                      <span style={{ fontWeight: 'bold', color: '#555' }}>Meal Plan:</span>
                      {basicDetails?.decoded_data?.customerDetails?.mealAllocation &&
                        Object.values(basicDetails.decoded_data.customerDetails.mealAllocation).join(', ')}
                    </p>
                    <p style={{ margin: '5px 0', fontSize: '15px' }}>
                      <span style={{ fontWeight: 'bold', color: '#555' }}>Room Count:</span>
                      {basicDetails?.decoded_data?.customerDetails?.room_count &&
                        Object.entries(basicDetails.decoded_data.customerDetails.room_count)
                          .map(([roomType, count]) => `${count} ${roomType}`)
                          .join(', ')}
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ flex: '1', minWidth: '200px', backgroundColor: '#fff', padding: '15px', borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#2c3e50', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                  Price Details ({basicDetails?.currency})
                </h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', margin: '8px 0' }}>
                  <span style={{ color: '#555' }}>Total Price:</span>
                  <span style={{ fontWeight: 'bold' }}>{basicDetails?.currency} {basicDetails?.total_amount}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', margin: '8px 0' }}>
                  <span style={{ color: '#555' }}>Paid Amount:</span>
                  <span>{basicDetails?.currency} {basicDetails?.paid_amount}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', margin: '8px 0' }}>
                  <span style={{ color: '#555' }}>Balance Amount:</span>
                  <span>{basicDetails?.currency} {basicDetails?.balance_amount}</span>
                </div>
              </div>
            </div>

            {/* Guest Information */}
            <h4 style={{ margin: '20px 0 10px 0', fontSize: '16px', color: '#2c3e50' }}>Guest Information</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              {/* Adult Guests */}
              <div style={{ flex: '1', minWidth: '250px' }}>
                <h5 style={{ margin: '0 0 10px 0', fontSize: '15px', color: '#2c3e50' }}>Adultsp ({basicDetails?.decoded_data?.NoOfAdults || 0})</h5>
                <div style={{ backgroundColor: '#fff', borderRadius: '6px', padding: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  {basicDetails?.decoded_data?.paxDetails?.filter(data => data?.PaxType == "1").length > 0 ? (
                    basicDetails?.decoded_data?.paxDetails?.filter(data => data?.PaxType == "1").map((guest, i) => (
                      <div key={i} style={{ padding: '8px', borderBottom: i < basicDetails.decoded_data.paxDetails.filter(data => data?.PaxType == "1").length - 1 ? '1px solid #eee' : 'none', display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#3498db', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px', fontSize: '14px', fontWeight: 'bold' }}>
                          {guest?.FirstName?.[0]}{guest?.LastName?.[0]}
                        </div>
                        <div>
                          <div style={{ fontWeight: 'bold' }}>{guest?.Title} {guest?.FirstName} {guest?.LastName}</div>
                          <div style={{ fontWeight: 'bold' }}>+{guest?.Phoneno} </div>
                          <div style={{ fontWeight: 'bold' }}>{guest?.Email} </div>
                          <div style={{ fontSize: '13px', color: '#7f8c8d' }}>Adult</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '8px', color: '#7f8c8d', fontStyle: 'italic' }}>No adult guests</div>
                  )}
                </div>
              </div>

              {/* Child Guests */}
              <div style={{ flex: '1', minWidth: '250px' }}>
                <h5 style={{ margin: '0 0 10px 0', fontSize: '15px', color: '#2c3e50' }}>Children ({basicDetails?.decoded_data?.NoOfChild || 0})</h5>
                <div style={{ backgroundColor: '#fff', borderRadius: '6px', padding: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  {basicDetails?.decoded_data?.paxDetails?.filter(data => data?.PaxType == "2").length > 0 ? (
                    basicDetails?.decoded_data?.paxDetails?.filter(data => data?.PaxType == "2").map((guest, i) => (
                      <div key={i} style={{ padding: '8px', borderBottom: i < basicDetails.decoded_data.paxDetails.filter(data => data?.PaxType == "2").length - 1 ? '1px solid #eee' : 'none', display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#2ecc71', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px', fontSize: '14px', fontWeight: 'bold' }}>
                          {guest?.FirstName?.[0]}{guest?.LastName?.[0]}
                        </div>
                        <div>
                          <div style={{ fontWeight: 'bold' }}>{guest?.Title} {guest?.FirstName} {guest?.LastName}</div>
                          <div style={{ fontSize: '13px', color: '#7f8c8d' }}>Child</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '8px', color: '#7f8c8d', fontStyle: 'italic' }}>No child guests</div>
                  )}
                </div>
              </div>
            </div>

            {/* Meal Plan Details */}
            {basicDetails?.decoded_data?.customerDetails?.mealAllocation && (
              <>
                <h4 style={{ margin: '20px 0 10px 0', fontSize: '16px', color: '#2c3e50' }}>Meal Plan Details</h4>
                <div style={{ backgroundColor: '#fff', borderRadius: '6px', padding: '15px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #eee' }}>
                        <th style={{ textAlign: 'left', padding: '8px', color: '#555' }}>Date</th>
                        <th style={{ textAlign: 'left', padding: '8px', color: '#555' }}>Meal Plan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(basicDetails.decoded_data.customerDetails.mealAllocation).map(([date, meal], i) => (
                        <tr key={i} style={{ borderBottom: i < Object.entries(basicDetails.decoded_data.customerDetails.mealAllocation).length - 1 ? '1px solid #eee' : 'none' }}>
                          <td style={{ padding: '8px' }}>{date}</td>
                          <td style={{ padding: '8px' }}>{meal}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>

          {/* Contact Information */}
          <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #eaeaea', paddingBottom: '8px', fontSize: '22px' }}>Contact Information</h2>
          <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '6px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              <div style={{ flex: '1', minWidth: '250px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#2c3e50' }}>Supplier Details</h4>
                <p style={{ margin: '8px 0', fontSize: '15px' }}>
                  <span style={{ fontWeight: 'bold', color: '#555', width: '100px', display: 'inline-block' }}>Email:</span>
                  {basicDetails?.email}
                </p>
                <p style={{ margin: '8px 0', fontSize: '15px' }}>
                  <span style={{ fontWeight: 'bold', color: '#555', width: '100px', display: 'inline-block' }}>Phone:</span>
                  {basicDetails?.phone}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {props?.productData?.Provider === "hotelTboH" && (
        <div style={{ fontFamily: 'Arial, sans-serif', margin: '0 auto', padding: '25px', borderRadius: '8px', boxShadow: '0 3px 15px rgba(0,0,0,0.1)', backgroundColor: '#fff' }}>
          {/* Main Booking Info */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '25px' }}>
            <div style={{ flex: '1', minWidth: '250px' }}>
              <div style={{ backgroundColor: '#f8f9fa', padding: '18px', borderRadius: '6px', marginBottom: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h3 style={{ margin: '0 0 12px 0', color: '#2c3e50', fontSize: '18px' }}>Booking Information</h3>
                <p style={{ margin: '8px 0', fontSize: '15px' }}>
                  <span style={{ fontWeight: 'bold', color: '#555', width: '160px', display: 'inline-block' }}>Status:</span>
                  <span style={{
                    color: bookingData?.BookingStatus ? '#27ae60' : props.productData?.status === 'Approved' ? '#27ae60' : '#e74c3c',
                    fontWeight: 'bold',
                    backgroundColor: bookingData?.BookingStatus ? 'rgba(39, 174, 96, 0.1)' : props.productData?.status === 'Approved' ? 'rgba(39, 174, 96, 0.1)' : 'rgba(231, 76, 60, 0.1)',
                    padding: '3px 8px',
                    borderRadius: '4px'
                  }}>
                    {bookingData?.BookingStatus || props.productData?.status}
                  </span>
                  {bookingData?.VoucherStatus && (
                    <span style={{ marginLeft: '10px', fontSize: '13px', backgroundColor: '#3498db', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>
                      Voucher Available
                    </span>
                  )}
                </p>
                <p style={{ margin: '8px 0', fontSize: '15px' }}>
                  <span style={{ fontWeight: 'bold', color: '#555', width: '160px', display: 'inline-block' }}>Invoice Number:</span>
                  {bookingData?.InvoiceNumber || props.productData?.orderID}
                </p>
                <p style={{ margin: '8px 0', fontSize: '15px' }}>
                  <span style={{ fontWeight: 'bold', color: '#555', width: '160px', display: 'inline-block' }}>Booking Date:</span>
                  {bookingData?.BookingDate
                    ? new Date(bookingData.BookingDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                    : new Date(props.productData.booked_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p style={{ margin: '8px 0', fontSize: '15px' }}>
                  <span style={{ fontWeight: 'bold', color: '#555', width: '160px', display: 'inline-block' }}>Number of Rooms:</span>
                  {bookingData?.NoOfRooms || props.productData?.decoded_data?.NoOfRooms || 1}
                </p>
              </div>
            </div>

            <div style={{ flex: '1', minWidth: '250px' }}>
              <div style={{ backgroundColor: '#f8f9fa', padding: '18px', borderRadius: '6px', marginBottom: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h3 style={{ margin: '0 0 12px 0', color: '#2c3e50', fontSize: '18px' }}>Stay Information</h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <div style={{ textAlign: 'center', flex: '1' }}>
                    <p style={{ margin: '0', fontSize: '13px', color: '#555' }}>CHECK-IN</p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' }}>
                      {bookingData?.CheckIn
                        ? new Date(bookingData.CheckIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                        : new Date(props.productData.checkInDate.split('/').reverse().join('-')).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                    <p style={{ margin: '3px 0 0 0', fontSize: '14px' }}>
                      {bookingData?.CheckIn
                        ? new Date(bookingData.CheckIn).getFullYear()
                        : new Date(props.productData.checkInDate.split('/').reverse().join('-')).getFullYear()}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', padding: '0 15px' }}>
                    <div style={{ height: '1px', width: '50px', backgroundColor: '#ddd' }}></div>
                    <div style={{ margin: '0 10px', color: '#555', fontSize: '14px' }}>
                      {bookingData?.CheckIn && bookingData?.CheckOut
                        ? Math.ceil((new Date(bookingData.CheckOut) - new Date(bookingData.CheckIn)) / (1000 * 60 * 60 * 24))
                        : props.productData?.NoOfNights || 1}
                      {((bookingData?.CheckIn && bookingData?.CheckOut
                        ? Math.ceil((new Date(bookingData.CheckOut) - new Date(bookingData.CheckIn)) / (1000 * 60 * 60 * 24))
                        : props.productData?.NoOfNights || 1) > 1) ? "Nights" : "Night"}
                    </div>
                    <div style={{ height: '1px', width: '50px', backgroundColor: '#ddd' }}></div>
                  </div>

                  <div style={{ textAlign: 'center', flex: '1' }}>
                    <p style={{ margin: '0', fontSize: '13px', color: '#555' }}>CHECK-OUT</p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' }}>
                      {bookingData?.CheckOut 
                        ? new Date(bookingData.CheckOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                        : new Date(props.productData.checkOutDate.split('/').reverse().join('-')).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                    <p style={{ margin: '3px 0 0 0', fontSize: '14px' }}>
                      {bookingData?.CheckOut 
                        ? new Date(bookingData.CheckOut).getFullYear()
                        : new Date(props.productData.checkOutDate.split('/').reverse().join('-')).getFullYear()}
                    </p>
                  </div>
                </div>
                <p style={{ margin: '8px 0', fontSize: '15px', color: '#555' }}><span style={{ fontWeight: 'bold' }}>Check-in Time:</span> 12:00 PM</p>
                <p style={{ margin: '8px 0', fontSize: '15px', color: '#555' }}><span style={{ fontWeight: 'bold' }}>Check-out Time:</span> 12:00 PM</p>
              </div>
            </div>
          </div>

          {/* Hotel Information */}
          <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #eaeaea', paddingBottom: '8px', fontSize: '22px' }}>Hotel Information3</h2>
          <div style={{ backgroundColor: '#f8f9fa', padding: '18px', borderRadius: '6px', marginBottom: '25px', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'flex-start' }}>
            <div style={{ flex: '1', minWidth: '300px' }}>
              <p style={{ margin: '5px 0', fontSize: '20px', fontWeight: 'bold', color: '#2c3e50' }}>
                {bookingData?.HotelDetails?.HotelName || props.productData?.hotelName || props.productData?.PName}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'inline-block' }}>
                  {Array(bookingData?.HotelDetails?.StarRating || props.productData?.decoded_data?.hotelMainRequest?.hotelData?.class || 4).fill(0).map((_, i) => (
                    <span key={i} style={{ color: '#f39c12', fontSize: '16px' }}>★</span>
                  ))}
                </div>
              </div>
              <p style={{ margin: '8px 0', fontSize: '15px' }}>
                <span style={{ fontWeight: 'bold', color: '#555', width: '70px', display: 'inline-block' }}>Address:</span>
                {bookingData?.HotelDetails?.AddressLine1 || props.productData?.address}
              </p>
              <p style={{ margin: '8px 0', fontSize: '15px' }}>
                <span style={{ fontWeight: 'bold', color: '#555', width: '70px', display: 'inline-block' }}>City:</span>
                {bookingData?.HotelDetails?.City || props.productData?.decoded_data?.hotelMainRequest?.hotelData?.city}
              </p>
            </div>

            <div style={{ flex: '1', minWidth: '200px', maxWidth: '250px', height: '150px', backgroundColor: '#e9ecef', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CImage
                src={basicDetails?.product_image}
                fluid
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '6px'
                }}
              />
            </div>

            <div style={{ flex: '1', minWidth: '200px', maxWidth: '250px', height: '150px', backgroundColor: '#e9ecef', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center', color: '#7f8c8d' }}>
                <div style={{ fontSize: '24px', marginBottom: '5px' }}>📍</div>
                <div style={{ fontSize: '14px' }}>Map Coordinates:</div>
                <div style={{ fontSize: '13px' }}>
                  {bookingData?.HotelDetails?.Map ||
                    `${props.productData?.decoded_data?.hotelMainRequest?.hotelData?.latitude}, ${props.productData?.decoded_data?.hotelMainRequest?.hotelData?.longitude}`}
                </div>
              </div>
            </div>
          </div>

          {/* Room Details */}
          <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #eaeaea', paddingBottom: '8px', fontSize: '22px' }}>Room Details</h2>
          {(bookingData?.Rooms || [props.productData?.decoded_data?.preBooking?.[0]?.Rooms?.[0] || {}]).map((room, index) => (
            <div key={index} style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '6px', marginBottom: '20px', borderLeft: '4px solid #3498db', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '25px', marginBottom: '20px' }}>
                <div style={{ flex: '2', minWidth: '300px' }}>
                  <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50', fontSize: '18px' }}>
                    {room.Name?.[0] || props.productData?.decoded_data?.preBooking?.[0]?.RoomTypeName?.[0]}
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                    <div style={{ flex: '1', minWidth: '200px' }}>
                      <p style={{ margin: '5px 0', fontSize: '15px' }}>
                        <span style={{ fontWeight: 'bold', color: '#555' }}>Status:</span>
                        <span style={{ color: room.Status === 'Confirmed' ? '#27ae60' : room.Status === 'Not Cancelled' ? '#f39c12' : '#e74c3c' }}>
                          {room.Status || 'Confirmed'}
                        </span>
                      </p>
                      <p style={{ margin: '5px 0', fontSize: '15px' }}>
                        <span style={{ fontWeight: 'bold', color: '#555' }}>Meal Type:</span>
                        {(room.MealType || props.productData?.decoded_data?.preBooking?.[0]?.Inclusions?.[0])?.replace(/_/g, ' ')}
                      </p>
                      <p style={{ margin: '5px 0', fontSize: '15px' }}>
                        <span style={{ fontWeight: 'bold', color: '#555' }}>Inclusion:</span>
                        {room.Inclusion || props.productData?.decoded_data?.preBooking?.[0]?.Inclusions?.[0]}
                      </p>
                      <p style={{ margin: '5px 0', fontSize: '15px' }}>
                        <span style={{ fontWeight: 'bold', color: '#555' }}>Refundable:</span>
                        <span style={{ color: room.IsRefundable ? '#27ae60' : '#e74c3c' }}>
                          {room.IsRefundable ? 'Yes' : 'No'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div style={{ flex: '1', minWidth: '200px', backgroundColor: '#fff', padding: '15px', borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#2c3e50', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                    Price Details ({room.Currency || props.productData?.currency || 'USD'})
                  </h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', margin: '8px 0' }}>
                    <span style={{ color: '#555' }}>Room Price:</span>
                    <span style={{ fontWeight: 'bold' }}>
                      ${((room.TotalFare || props.productData?.paid_amount) - (room.TotalTax || 0)).toFixed(2)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', margin: '8px 0' }}>
                    <span style={{ color: '#555' }}>Tax:</span>
                    <span>${(room.TotalTax || 0).toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', margin: '12px 0 0 0', paddingTop: '12px', borderTop: '1px dashed #eee', fontWeight: 'bold' }}>
                    <span>Total:</span>
                    <span style={{ color: '#2c3e50', fontSize: '18px' }}>
                      ${(room.TotalFare || props.productData?.paid_amount || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Guests Information */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '25px' }}>
                <div style={{ flex: '1', minWidth: '250px' }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#2c3e50' }}>Guests:</h4>
                  <div style={{ backgroundColor: '#fff', borderRadius: '6px', padding: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    {(room.CustomerDetails?.[0]?.CustomerNames || props.productData?.decoded_data?.paxDetails || []).map((guest, i) => (
                      <div key={i} style={{ padding: '8px', borderBottom: i < (room.CustomerDetails?.[0]?.CustomerNames?.length || props.productData?.decoded_data?.paxDetails?.length || 1) - 1 ? '1px solid #eee' : 'none', display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#3498db', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px', fontSize: '14px', fontWeight: 'bold' }}>
                          {guest.FirstName?.[0]}{guest.LastName?.[0]}
                        </div>
                        <div>
                          <div style={{ fontWeight: 'bold' }}>{guest.Title} {guest.FirstName} {guest.LastName}</div>
                          <div style={{ fontSize: '13px', color: '#7f8c8d' }}>{guest.Type || 'Adult'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cancellation Policy */}
                <div style={{ flex: '1', minWidth: '300px' }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#2c3e50' }}>Cancellation Policy:</h4>
                  <div style={{ backgroundColor: '#fff', borderRadius: '6px', padding: '15px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    {(room.CancelPolicies || props.productData?.decoded_data?.preBooking?.[0]?.CancellationPolicy || []).map((policy, i) => (
                      <div key={i} style={{ marginBottom: i < (room.CancelPolicies?.length || props.productData?.decoded_data?.preBooking?.[0]?.CancellationPolicy?.length || 1) - 1 ? '10px' : '0', paddingBottom: i < (room.CancelPolicies?.length || props.productData?.decoded_data?.preBooking?.[0]?.CancellationPolicy?.length || 1) - 1 ? '10px' : '0', borderBottom: i < (room.CancelPolicies?.length || props.productData?.decoded_data?.preBooking?.[0]?.CancellationPolicy?.length || 1) - 1 ? '1px solid #eee' : 'none' }}>
                        <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}>
                          <span style={{ fontWeight: 'bold' }}>From {policy.FromDate?.substring(0, 10)}:</span>
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
                {(bookingData?.RateConditions || props.productData?.decoded_data?.preBooking?.[0]?.RateConditions || [])
                  .filter(condition => condition &&
                    !condition.includes('CheckIn Time') &&
                    !condition.includes('CheckOut Time') &&
                    !condition.includes('CheckIn Instructions') &&
                    !condition.includes('Special Instructions') &&
                    !condition.includes('Mandatory Fees') &&
                    !condition.includes('Optional Fees') &&
                    !condition.includes('Cards Accepted') &&
                    !condition.includes('Pets not allowed'))
                  .map((condition, index) => (
                    <li key={index} style={{ margin: '5px 0', color: '#555' }}>{condition}</li>
                  ))}
              </ul>
            </div>

            {(bookingData?.RateConditions || props.productData?.decoded_data?.preBooking?.[0]?.RateConditions || []).some(condition => condition?.includes('CheckIn Instructions')) && (
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 12px 0', color: '#2c3e50', fontSize: '18px' }}>Check-In Instructions</h3>
                <div style={{ color: '#555' }} dangerouslySetInnerHTML={{
                  __html: (bookingData?.RateConditions || props.productData?.decoded_data?.preBooking?.[0]?.RateConditions || [])
                    .find(condition => condition?.includes('CheckIn Instructions'))
                    ?.split(': ')[1] || ''
                }}></div>
              </div>
            )}

            {(bookingData?.RateConditions || props.productData?.decoded_data?.preBooking?.[0]?.RateConditions || []).some(condition => condition?.includes('Special Instructions')) && (
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 12px 0', color: '#2c3e50', fontSize: '18px' }}>Special Instructions</h3>
                <p style={{ margin: '5px 0', color: '#555' }}>
                  {(bookingData?.RateConditions || props.productData?.decoded_data?.preBooking?.[0]?.RateConditions || [])
                    .find(condition => condition?.includes('Special Instructions'))
                    ?.split(': ')[1] || ''}
                </p>
              </div>
            )}

            {(bookingData?.RateConditions || props.productData?.decoded_data?.preBooking?.[0]?.RateConditions || []).some(condition => condition?.includes('Mandatory Fees')) && (
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 12px 0', color: '#2c3e50', fontSize: '18px' }}>Mandatory Fees</h3>
                <div style={{ color: '#555' }} dangerouslySetInnerHTML={{
                  __html: (bookingData?.RateConditions || props.productData?.decoded_data?.preBooking?.[0]?.RateConditions || [])
                    .find(condition => condition?.includes('Mandatory Fees'))
                    ?.split(': ')[1] || ''
                }}></div>
              </div>
            )}

            {(bookingData?.RateConditions || props.productData?.decoded_data?.preBooking?.[0]?.RateConditions || []).some(condition => condition?.includes('Optional Fees')) && (
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 12px 0', color: '#2c3e50', fontSize: '18px' }}>Optional Fees</h3>
                <div style={{ color: '#555' }} dangerouslySetInnerHTML={{
                  __html: (bookingData?.RateConditions || props.productData?.decoded_data?.preBooking?.[0]?.RateConditions || [])
                    .find(condition => condition?.includes('Optional Fees'))
                    ?.split(': ')[1] || ''
                }}></div>
              </div>
            )}

            {(bookingData?.RateConditions || props.productData?.decoded_data?.preBooking?.[0]?.RateConditions || []).some(condition => condition?.includes('Cards Accepted')) && (
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 12px 0', color: '#2c3e50', fontSize: '18px' }}>Payment Information</h3>
                <p style={{ margin: '5px 0', color: '#555' }}>
                  <strong>Accepted Payment Methods:</strong>
                  {(bookingData?.RateConditions || props.productData?.decoded_data?.preBooking?.[0]?.RateConditions || [])
                    .find(condition => condition?.includes('Cards Accepted'))
                    ?.split(': ')[1]?.split(',').join(', ') || ''}
                </p>
              </div>
            )}

            {(bookingData?.RateConditions || props.productData?.decoded_data?.preBooking?.[0]?.RateConditions || []).some(condition => condition?.includes('Pets not allowed')) && (
              <div>
                <h3 style={{ margin: '0 0 12px 0', color: '#2c3e50', fontSize: '18px' }}>Property Policies</h3>
                <ul style={{ margin: '0', paddingLeft: '20px' }}>
                  {(bookingData?.RateConditions || props.productData?.decoded_data?.preBooking?.[0]?.RateConditions || [])
                    .find(condition => condition?.includes('Pets not allowed'))
                    ?.split(',').map((policy, index) => (
                      <li key={index} style={{ margin: '5px 0', color: '#555' }}>{policy.trim()}</li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {props?.productData?.Provider == "hotelTbo" && bookingData && (
        <div style={{ fontFamily: 'Arial, sans-serif', margin: '0 auto', padding: '25px', borderRadius: '8px', boxShadow: '0 3px 15px rgba(0,0,0,0.1)', backgroundColor: '#fff' }}>
          {/* Main Booking Info */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '25px' }}>
            <div style={{ flex: '1', minWidth: '250px' }}>
              <div style={{ backgroundColor: '#f8f9fa', padding: '18px', borderRadius: '6px', marginBottom: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h3 style={{ margin: '0 0 12px 0', color: '#2c3e50', fontSize: '18px' }}>Booking Information</h3>
                <p style={{ margin: '8px 0', fontSize: '15px' }}>
                  <span style={{ fontWeight: 'bold', color: '#555', width: '160px', display: 'inline-block' }}>Status:</span>
                  <span style={{
                    color: props?.productData?.status === 'CustomerOrdered' ? '#f39c12' :
                      props?.productData?.status === 'Confirmed' ? '#27ae60' : '#e74c3c',
                    fontWeight: 'bold',
                    backgroundColor: props?.productData?.status === 'CustomerOrdered' ? 'rgba(243, 156, 18, 0.1)' :
                      props?.productData?.status === 'Confirmed' ? 'rgba(39, 174, 96, 0.1)' : 'rgba(231, 76, 60, 0.1)',
                    padding: '3px 8px',
                    borderRadius: '4px'
                  }}>
                    {props?.productData?.status}
                  </span>
                </p>
                <p style={{ margin: '8px 0', fontSize: '15px' }}>
                  <span style={{ fontWeight: 'bold', color: '#555', width: '160px', display: 'inline-block' }}>Order ID:</span>
                  {props?.productData?.orderID}
                </p>
                <p style={{ margin: '8px 0', fontSize: '15px' }}>
                  <span style={{ fontWeight: 'bold', color: '#555', width: '160px', display: 'inline-block' }}>Booking Date:</span>
                  {moment(props?.productData?.booked_date).format('MMMM Do YYYY, h:mm a')}
                </p>
                <p style={{ margin: '8px 0', fontSize: '15px' }}>
                  <span style={{ fontWeight: 'bold', color: '#555', width: '160px', display: 'inline-block' }}>Total Amount:</span>
                  {props?.productData?.currency} {props?.productData?.total_amount}
                </p>
              </div>
            </div>

            <div style={{ flex: '1', minWidth: '250px' }}>
              <div style={{ backgroundColor: '#f8f9fa', padding: '18px', borderRadius: '6px', marginBottom: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h3 style={{ margin: '0 0 12px 0', color: '#2c3e50', fontSize: '18px' }}>Stay Information</h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <div style={{ textAlign: 'center', flex: '1' }}>
                    <p style={{ margin: '0', fontSize: '13px', color: '#555' }}>CHECK-IN</p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' }}>
                      {moment(props?.productData?.checkInDate, 'DD/MM/YYYY').format('MMM D')}
                    </p>
                    <p style={{ margin: '3px 0 0 0', fontSize: '14px' }}>
                      {moment(props?.productData?.checkInDate, 'DD/MM/YYYY').format('YYYY')}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', padding: '0 15px' }}>
                    <div style={{ height: '1px', width: '50px', backgroundColor: '#ddd' }}></div>
                    <div style={{ margin: '0 10px', color: '#555', fontSize: '14px' }}>
                      {props?.productData?.NoOfNights} {props?.productData?.NoOfNights > 1 ? "Nights" : "Night"}
                    </div>
                    <div style={{ height: '1px', width: '50px', backgroundColor: '#ddd' }}></div>
                  </div>

                  <div style={{ textAlign: 'center', flex: '1' }}>
                    <p style={{ margin: '0', fontSize: '13px', color: '#555' }}>CHECK-OUT</p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' }}>
                      {moment(props?.productData?.checkInDate, 'DD/MM/YYYY').add(props?.productData?.NoOfNights, 'days').format('MMM D')}
                    </p>
                    <p style={{ margin: '3px 0 0 0', fontSize: '14px' }}>
                      {moment(props?.productData?.checkInDate, 'DD/MM/YYYY').add(props?.productData?.NoOfNights, 'days').format('YYYY')}
                    </p>
                  </div>
                </div>
                <p style={{ margin: '8px 0', fontSize: '15px', color: '#555' }}>
                  <span style={{ fontWeight: 'bold' }}>Check-in Time:</span> 12:00 PM
                </p>
                <p style={{ margin: '8px 0', fontSize: '15px', color: '#555' }}>
                  <span style={{ fontWeight: 'bold' }}>Check-out Time:</span> 12:00 PM
                </p>
              </div>
            </div>
          </div>

          {/* Hotel Information */}
          <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #eaeaea', paddingBottom: '8px', fontSize: '22px' }}>Hotel Information</h2>
          <div style={{ backgroundColor: '#f8f9fa', padding: '18px', borderRadius: '6px', marginBottom: '25px', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'flex-start' }}>
            <div style={{ flex: '1', minWidth: '300px' }}>
              <p style={{ margin: '5px 0', fontSize: '20px', fontWeight: 'bold', color: '#2c3e50' }}>{props?.productData?.hotelName}</p>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                {/* Star rating can be added here if available */}
              </div>
              <p style={{ margin: '8px 0', fontSize: '15px' }}>
                <span style={{ fontWeight: 'bold', color: '#555', width: '70px', display: 'inline-block' }}>Address:</span>
                {props?.productData?.address}
              </p>
              <p style={{ margin: '8px 0', fontSize: '15px' }}>
                <span style={{ fontWeight: 'bold', color: '#555', width: '70px', display: 'inline-block' }}>Location:</span>
                {props?.productData?.location}
              </p>
            </div>

            <div style={{ flex: '1', minWidth: '200px', maxWidth: '250px', height: '150px', backgroundColor: '#e9ecef', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src={props?.productData?.product_image}
                alt={props?.productData?.hotelName}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '6px'
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  // e.target.src = "https://via.placeholder.com/300x150?text=Hotel+Image";
                  e.target.src = "https://cdn.pixabay.com/photo/2021/12/11/07/59/hotel-6862159_1280.jpg";
                }}
              />
            </div>
          </div>

          {/* Room Details */}
          <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #eaeaea', paddingBottom: '8px', fontSize: '22px' }}>Room Details</h2>
          <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '6px', marginBottom: '20px', borderLeft: '4px solid #3498db', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '25px', marginBottom: '20px' }}>
              <div style={{ flex: '2', minWidth: '300px' }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50', fontSize: '18px' }}>
                  {props?.productData?.decoded_data?.hotelRatesRequest?.RoomTypeName || "Standard Room"}
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                  <div style={{ flex: '1', minWidth: '200px' }}>
                    <p style={{ margin: '5px 0', fontSize: '15px' }}>
                      <span style={{ fontWeight: 'bold', color: '#555' }}>Room Type:</span>
                      {props?.productData?.decoded_data?.hotelRatesRequest?.RoomTypeName || "Standard Room"}
                    </p>
                    <p style={{ margin: '5px 0', fontSize: '15px' }}>
                      <span style={{ fontWeight: 'bold', color: '#555' }}>Adults:</span>
                      {props?.productData?.NoOfAdults || 1}
                    </p>
                    <p style={{ margin: '5px 0', fontSize: '15px' }}>
                      <span style={{ fontWeight: 'bold', color: '#555' }}>Nights:</span>
                      {props?.productData?.NoOfNights || 1}
                    </p>  <p style={{ margin: '5px 0', fontSize: '15px' }}>
                      <span style={{ fontWeight: 'bold', color: '#555' }}>Meal Plan:</span>
                      {props.productData?.decoded_data.customerDetails.mealAllocation || 1}
                    </p>

                  </div>
                </div>
              </div>

              <div style={{ flex: '1', minWidth: '200px', backgroundColor: '#fff', padding: '15px', borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#2c3e50', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                  Price Details ({props?.productData?.currency || "USD"})
                </h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', margin: '8px 0' }}>
                  <span style={{ color: '#555' }}>Total Price:</span>
                  <span style={{ fontWeight: 'bold' }}>{props?.productData?.currency} {props?.productData?.total_amount}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', margin: '8px 0' }}>
                  <span style={{ color: '#555' }}>Paid Amount:</span>
                  <span>{props?.productData?.currency} {props?.productData?.paid_amount}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', margin: '8px 0' }}>
                  <span style={{ color: '#555' }}>Balance Amount:</span>
                  <span>{props?.productData?.currency} {props?.productData?.balance_amount}</span>
                </div>
              </div>
            </div>

            {/* Guest Information */}
            <h4 style={{ margin: '20px 0 10px 0', fontSize: '16px', color: '#2c3e50' }}>Guest Information</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              {/* Adult Guests */}
              <div style={{ flex: '1', minWidth: '250px' }}>
                <h5 style={{ margin: '0 0 10px 0', fontSize: '15px', color: '#2c3e50' }}>Adultss ({props?.productData?.NoOfAdults || 1})</h5>
                <div style={{ backgroundColor: '#fff', borderRadius: '6px', padding: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  {props?.productData?.decoded_data?.paxDetails?.filter(data => data?.PaxType == "1").length > 0 ? (
                    props?.productData?.decoded_data?.paxDetails?.filter(data => data?.PaxType == "1").map((guest, i) => (
                      <div key={i} style={{ padding: '8px', borderBottom: i < props.productData.decoded_data.paxDetails.filter(data => data?.PaxType == "1").length - 1 ? '1px solid #eee' : 'none', display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#3498db', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px', fontSize: '14px', fontWeight: 'bold' }}>
                          {guest?.FirstName?.[0]}{guest?.LastName?.[0]}
                        </div>
                        <div>
                          <div style={{ fontWeight: 'bold' }}>{guest?.Title} {guest?.FirstName} {guest?.LastName}</div>
                          <div >{guest?.Phoneno}</div>
                          <div >{guest?.Email} </div>
                          <div style={{ fontSize: '13px', color: '#7f8c8d' }}>Adult</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '8px', color: '#7f8c8d', fontStyle: 'italic' }}>No adult guests specified</div>
                  )}
                </div>
              </div>

              {/* Child Guests */}
              <div style={{ flex: '1', minWidth: '250px' }}>
                <h5 style={{ margin: '0 0 10px 0', fontSize: '15px', color: '#2c3e50' }}>Children ({props?.productData?.decoded_data?.NoOfChild || 0})</h5>
                <div style={{ backgroundColor: '#fff', borderRadius: '6px', padding: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  {props?.productData?.decoded_data?.paxDetails?.filter(data => data?.PaxType == "2").length > 0 ? (
                    props?.productData?.decoded_data?.paxDetails?.filter(data => data?.PaxType == "2").map((guest, i) => (
                      <div key={i} style={{ padding: '8px', borderBottom: i < props.productData.decoded_data.paxDetails.filter(data => data?.PaxType == "2").length - 1 ? '1px solid #eee' : 'none', display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#2ecc71', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px', fontSize: '14px', fontWeight: 'bold' }}>
                          {guest?.FirstName?.[0]}{guest?.LastName?.[0]}
                        </div>
                        <div>
                          <div style={{ fontWeight: 'bold' }}>{guest?.Title} {guest?.FirstName} {guest?.LastName}</div>
                          <div style={{ fontSize: '13px', color: '#7f8c8d' }}>Child</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '8px', color: '#7f8c8d', fontStyle: 'italic' }}>No child guests</div>
                  )}
                </div>
              </div>
            </div>

            {/* Meal Plan Details - if available */}
            {/* {props?.productData?.decoded_data?.customerDetails?.mealAllocation && (
              <>
                <h4 style={{ margin: '20px 0 10px 0', fontSize: '16px', color: '#2c3e50' }}>Meal Plan Details</h4>
                <div style={{ backgroundColor: '#fff', borderRadius: '6px', padding: '15px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #eee' }}>
                        <th style={{ textAlign: 'left', padding: '8px', color: '#555' }}>Date</th>
                        <th style={{ textAlign: 'left', padding: '8px', color: '#555' }}>Meal Plan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {props.productData.decoded_data.customerDetails.mealAllocation === "All" ? (
                        <tr>
                          <td style={{ padding: '8px' }}>All Dates</td>
                          <td style={{ padding: '8px' }}>All</td>
                        </tr>
                      ) : (
                        Object.entries(props.productData.decoded_data.customerDetails.mealAllocation).map(([date, meal], i) => (
                          <tr key={i} style={{ borderBottom: i < Object.entries(props.productData.decoded_data.customerDetails.mealAllocation).length - 1 ? '1px solid #eee' : 'none' }}>
                            <td style={{ padding: '8px' }}>{date}</td>
                            <td style={{ padding: '8px' }}>{meal}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )} */}

          </div>

          {/* Contact Information */}
          <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #eaeaea', paddingBottom: '8px', fontSize: '22px' }}>Contact Information</h2>
          <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '6px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              <div style={{ flex: '1', minWidth: '250px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#2c3e50' }}>Supplier Details</h4>
                <p style={{ margin: '8px 0', fontSize: '15px' }}>
                  <span style={{ fontWeight: 'bold', color: '#555', width: '100px', display: 'inline-block' }}>Email:</span>
                  {props?.productData?.customerData?.customer_email || "Not specified"}
                </p>
                <p style={{ margin: '8px 0', fontSize: '15px' }}>
                  <span style={{ fontWeight: 'bold', color: '#555', width: '100px', display: 'inline-block' }}>Phone:</span>
                  {props?.productData?.customerData?.contact_number || "Not specified"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* {props?.productData?.Provider != "hotelAhs" && !bookingData && ( */}
      {props?.productData?.Provider != "hotelAhs" && (
        <>
          <div>
            {/* Loading ... */}
          </div>
        </>
      )}
    </CContainer>
  )
}
