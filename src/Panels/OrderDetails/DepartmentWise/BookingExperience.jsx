


import React, { useContext, useState, useEffect } from 'react'
import MaterialTable from 'material-table';
import { CBadge, CButton, CCard, CCardBody, CCardSubtitle, CCardText, CCardTitle, CCloseButton, CCol, CContainer, CDropdown, CDropdownDivider, CDropdownItem, CDropdownMenu, CDropdownToggle, CImage, COffcanvas, COffcanvasBody, COffcanvasHeader, COffcanvasTitle, CPopover, CRow } from '@coreui/react';
import Swal from 'sweetalert2';
import { updateDeliveryStatus, candelOrder } from 'src/service/api_calls';
import rowStyle from '../Components/rowStyle';
import { cilCloudDownload, cilEyedropper, cilInfo } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { Modal, Carousel } from 'react-bootstrap';
import CancellationModal from '../CancelationModal/CancellationModal';
import StarRating from '../Components/StarRating';
import CurrencyConverter from 'src/Context/CurrencyConverter';
import { UserLoginContext } from 'src/Context/UserLoginContext';
import { render } from '@testing-library/react';
import axios from 'axios';
import DiscountView from '../DiscountView.jsx';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { CurrencyContext } from 'src/Context/CurrencyContext';

const mapContainerStyle = {
  width: '40vw',
  height: '40vh',
};

const libraries = ['places'];

export default function BookingExperience(props) {
  const { userData } = useContext(UserLoginContext);

  const customPopoverStyle = {
    '--cui-popover-max-width': '400px',
    '--cui-popover-border-color': '#0F1A36',
    '--cui-popover-header-bg': '#0F1A36',
    '--cui-popover-header-color': 'var(--cui-white)',
    '--cui-popover-body-padding-x': '1rem',
    '--cui-popover-body-padding-y': '.5rem',
  }

  const productData = props.dataset
  console.log(productData, "Product_Datas")

  const [location, setLocation] = useState({ latitude: null, longitude: null });

  // useEffect(() => {
  //     console.log(props?.dataset[0]?.more_info_lat_lon, "More Info Lat Lon");

  // }, [props?.dataset]);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyA39AkmLbtriHvMJ-uqOV4I_6hpVz-4Pbk',
    libraries,
  });

  const QuantityContainer = ({ data }) => {


    // console.log(data, "Data Value is")


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

  const FeedbackContainer = ({ data }) => {
    // console.log(data, "Feedback Container data is");

    return (
      <div>
        {data.map((element, index) => (
          <>
            <CCol key={index} style={{ width: '320px', borderBottom: 1, borderBottomColor: '#E8E8E8', marginBottom: 20 }}>
              <CRow>
                <CCol style={{ flex: 2 }}>
                  <h6>Rating on Aahaas</h6>
                </CCol>
                <CCol style={{ flex: 0.7, textAlign: 'right' }}>
                  <StarRating rating={parseInt(element?.rating_on_aahaas)} />
                </CCol>
              </CRow>

              <CRow>
                <CCol style={{ flex: 2 }}>
                  <h6>Rating on Supplier</h6>
                </CCol>
                <CCol style={{ flex: 0.7, textAlign: 'right' }}>
                  <StarRating rating={parseInt(element?.rating_on_supplier)} />
                </CCol>
              </CRow>

              <CRow>
                <CCol style={{ flex: 2 }}>
                  <h6>Rating on Product</h6>
                </CCol>
                <CCol style={{ flex: 0.7, textAlign: 'right' }}>
                  <StarRating rating={parseInt(element?.rating_on_product)} />
                </CCol>
              </CRow>

              <CRow>
                <CCol style={{ flex: 2 }}>
                  <h6>{element?.review_remarks}</h6>
                </CCol>
              </CRow>
            </CCol>

          </>

        ))}
      </div>
    );
  };




  const [cancellationData, setCancellationData] = useState([])
  const handleCancellationData = (data) => {
    setCancellationReasonModal(true)
    setCancellationData(data)

  }

  const [selectedStatusCheckout, setSelectedStatusCheckout] = useState("")

  const handleDelStatusChange = async (e, val) => {
    // console.log(val, "Value Data set is 123")
    // console.log(e.checkoutID, "Target Value is")

    var title = "";

    var targetvalue = val.target.value

    if (val.target.value !== "") {
      if (val.target.value === "Approved") {
        title = "Do You Want to Confirm This Order";
        Swal.fire({
          title: "Are you sure?",
          text: title,
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#2eb85c",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes"
        }).then((result) => {
          // console.log(result, "IS Confirmed")

          if (result.isConfirmed) {
            Swal.fire({
              title: "Hold On!",
              html: "Order is Updating",
              allowOutsideClick: false,
              showConfirmButton: false,
              onBeforeOpen: () => {
                Swal.showLoading();
              }
            });

            // console.log("Show Loading")
            updateDeliveryStatus(e.checkoutID, targetvalue, "").then(result => {
              console.log("resulttt", result)

              props.reload();

              setSelectedStatusCheckout("Approved")

              // Swal.close(); // Close the loading spinner

            }).catch(error => {


              console.log(error, "Error Value is 1234")
              Swal.fire({
                title: "Error!",
                text: "Failed to update order",
                icon: "error"
              });
            });
          }
        });
      } else if (val.target.value === "Cancel") {

        title = "Do You Want to Cancel";



        let data = {
          reason: "",
          id: e.checkoutID,
          value: val.target.value,
        };

        handleCancellationData(data)


        // Swal.fire({
        //     title: title,
        //     text: "Please Enter the reason for cancel",
        //     input: "text",
        //     icon: "question",
        //     inputAttributes: {
        //         autocapitalize: "off"
        //     },
        //     showCancelButton: true,
        //     confirmButtonText: "Yes, Cancel",
        //     cancelButtonText: "No",
        //     confirmButtonColor: "#d33",
        //     showLoaderOnConfirm: true,

        //     preConfirm: async (reason) => {
        //         try {
        //             if (!reason) {
        //                 return Swal.showValidationMessage(`Reason is required`);
        //             }

        //             let data = {
        //                 reason: reason,
        //                 id: e.checkoutID,
        //                 value: val.target.value,
        //             };

        //             await candelOrder(data);
        //             props.reload();

        //         } catch (error) {
        //             Swal.showValidationMessage(`
        //   Request failed: ${error}`);
        //         }
        //     },
        //     allowOutsideClick: () => !Swal.isLoading()
        // });
      }
    }
  }


  const handleOrderCancellation = async (data) => {

    cancellationData["reason"] = data


    Swal.showLoading()
    await candelOrder(cancellationData)
    Swal.hideLoading()
    props?.reload();

    setSelectedStatusCheckout("Cancel")

  }

  const [clickedStatus, setClickedStatus] = useState("")

  const handleButtonClick = (data) => {
    setClickedStatus(data)
    setSelectedStatusCheckout("")
  }

  const [selectedCancellationModal, setSelectedCancellationModal] = useState([])
  const [cancellationModalState, setCancellationModalState] = useState(false)

  const handleMoreCancellationDetails = (data) => {
    // console.log(data, "cancellation")

    setSelectedCancellationModal(data?.data)
    setCancellationModalState(true)
  }



  const [cancellationReasonModal, setCancellationReasonModal] = useState(false)
  // const [documentViewModal, setDocumentViewModal] = useState(false)
  // const [selectedDocument, setSelectedDocument] = useState([])

  // const handleDocment = (data) => {
  //         console.log(data.data.orderMoreInfo, "Document Data issss");

  //         const fileUrls = data.data.orderMoreInfo?.[0]?.file_urls
  //             ? data.data.orderMoreInfo[0].file_urls.split(',').map(url => url.trim())
  //             : [];

  //         console.log(fileUrls, "Extracted File URLs");
  //         setSelectedDocument(fileUrls)
  //         setDocumentViewModal(true);
  //     };4

  const [documentViewModal, setDocumentViewModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState([]);
  const [cancellationViewModal, setCancellationViewModal] = useState(false);
  const [cancellationDetails, setCancellationDetails] = useState(null);
  const [selectedDocumentLocation, setSelectedDocumentLocation] = useState([]);
  const isImage = (url) => /\.(jpg|jpeg|png|gif|webp|heic)$/i.test(url); // Check for image formats
  const isPDF = (url) => /\.pdf$/i.test(url);

  const handleDocment = (data) => {
    console.log(data.data.longitude, "Document Data issss");
    // console.log(data.data.orderMoreInfo, "Document Data issss");
    const fileUrls = data.data.orderMoreInfo?.[0]?.file_urls
      ? data.data.orderMoreInfo[0].file_urls.split(',').map(url => url.trim())
      : [];
    console.log(fileUrls, "Extracted File URLs");

    if (data.data.orderMoreInfo?.[0]?.customer_lat_lon) {
      const [latitude, longitude] = data.data.orderMoreInfo?.[0]?.customer_lat_lon.split(',').map(coord => parseFloat(coord.trim()));
      setLocation({ latitude, longitude });
    }


    setSelectedDocumentLocation(data.data)
    setSelectedDocument(fileUrls);
    setDocumentViewModal(true);
  };


  // Updated handler function to open modal and set data
  // Updated handler function to open modal and set data with real API data
  // const handleModelShow = async (checkoutID) => {
  //   console.log("Request for checkout ID:", checkoutID);
  //   try {
  //     // Use the actual checkout ID from the parameter when possible
  //     // let url = `/bridgify/carts/cancelation/${checkoutID || '14273'}`;
  //     let url = `/bridgify/carts/cancelation/${checkoutID || '14273'}`;
  //     const response = await axios.get(url);
  //     console.log(response.data.data, "Cancellation Response Data is");

  //     // Extract the cancellation info from the response
  //     const cancellationData = response.data.data['cancellation-info'];

  //     // Get the first cancellation item (using Object.values to get the first object)
  //     const firstCancellationItem = Object.values(cancellationData)[0];

  //     // Get the keys of the cancellation-info object (these are the UUIDs)

  //     if (firstCancellationItem) {
  //       const cancellationKeys = Object.keys(cancellationData);
  //       // if (cancellationKeys.length > 0) {
  //         const cancellationUUID = cancellationKeys[0];
  //         console.log("Cancellation UUID:", cancellationUUID);
  //       // }
  //       // Create properly formatted cancellation details from the API response
  //       const formattedData = {
  //         checkoutID: cancellationUUID,
  //         cancellationPolicy: firstCancellationItem.policy || "No policy information available",
  //         refundAmount: `${firstCancellationItem.currency} ${(firstCancellationItem.merchant_total_price * (firstCancellationItem.percentage / 100)).toFixed(2)}`,
  //         cancellationFee: firstCancellationItem.percentage === 100 ?
  //           `${firstCancellationItem.currency} 0.00` :
  //           `${firstCancellationItem.currency} ${(firstCancellationItem.merchant_total_price * (1 - firstCancellationItem.percentage / 100)).toFixed(2)}`,
  //         cancellationDate: new Date().toISOString(), // Current date since actual date isn't in the response
  //         paymentMethod: "Credit Card", // Assuming this as it's not in the response
  //         travelDate: firstCancellationItem.travel_date,
  //         title: firstCancellationItem.title,
  //         status: firstCancellationItem.status,
  //         paxes: firstCancellationItem.paxes,
  //         cancellationAllowed: firstCancellationItem.cancellation_allowed,
  //         // cancellationSteps: [
  //         //   "Review the cancellation policy shown above",
  //         //   "Confirm you want to proceed with cancellation",
  //         //   "Click the 'Proceed with Cancellation' button below",
  //         //   "Wait for confirmation of your cancellation request"
  //         // ]
  //       };

  //       // Set the cancellation details
  //       setCancellationDetails(formattedData);
  //     } else {
  //       setCancellationDetails({
  //         checkoutID: checkoutID,
  //         cancellationPolicy: "No cancellation information available for this booking.",
  //         cancellationAllowed: false
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error fetching cancellation data:", error);
  //     setCancellationDetails({
  //       checkoutID: checkoutID,
  //       cancellationPolicy: "Unable to retrieve cancellation information. Please contact customer support.",
  //       cancellationAllowed: false
  //     });
  //   }

  //   // Show the modal
  //   setCancellationViewModal(true);
  // };

  const handleModelShow = async (checkoutID) => {
    console.log("Request for checkout ID:", checkoutID);
    try {
      let url = `/bridgify/order-details/${checkoutID || '14273'}`;
      const response = await axios.get(url);
      console.log(response.data.data, "Booking Response Data is");

      // Extract both order details and cancellation info
      const orderDetails = response.data.data.order_details;
      const cancellationData = response.data.data.cancelation_details['cancellation-info'];

      // Get the order ID (the key in order_details)
      const orderId = Object.keys(orderDetails)[0];

      // Get all order items
      const orderItems = orderDetails[orderId] || [];
      const mainOrderItem = orderItems[0] || {};

      // Process tickets information
      const tickets = mainOrderItem.tickets || [];

      // Format data including all arrays
      let formattedData = {
        orderId: orderId,
        checkoutID: checkoutID,
        title: mainOrderItem.attraction_title,
        attractionDate: mainOrderItem.attraction_date,
        attractionTime: mainOrderItem.attraction_time,
        status: mainOrderItem.status,
        currency: mainOrderItem.currency,
        merchantTotalPrice: mainOrderItem.merchant_total_price,
        externalOrderId: mainOrderItem.external_order_id,
        inventorySupplier: mainOrderItem.inventory_supplier,
        orderItemUuid: mainOrderItem.order_item_uuid,
        externalCreatedAt: mainOrderItem.external_created_at,
        cancellationPolicy: mainOrderItem.cancellation_policy,
        customer: mainOrderItem.customer || {},
        tickets: tickets,
        allOrderItems: orderItems, // Store all order items for reference
        cancellationAllowed: true, // Default
        refundAmount: "N/A",
        cancellationFee: "N/A"
      };

      // Add cancellation details if available
      if (cancellationData && Object.keys(cancellationData).length > 0) {
        const cancellationKeys = Object.keys(cancellationData);
        const cancellationUUID = cancellationKeys[0];
        const firstCancellationItem = cancellationData[cancellationUUID];

        formattedData = {
          ...formattedData,
          checkoutID: cancellationUUID,
          cancellationPolicy: firstCancellationItem.policy || mainOrderItem.cancellation_policy,
          refundAmount: `${firstCancellationItem.currency} ${(firstCancellationItem.merchant_total_price * (firstCancellationItem.percentage / 100)).toFixed(2)}`,
          cancellationFee: firstCancellationItem.percentage === 100 ?
            `${firstCancellationItem.currency} 0.00` :
            `${firstCancellationItem.currency} ${(firstCancellationItem.merchant_total_price * (1 - firstCancellationItem.percentage / 100)).toFixed(2)}`,
          cancellationAllowed: firstCancellationItem.cancellation_allowed
        };
      }

      // Set the details
      setCancellationDetails(formattedData);
    } catch (error) {
      console.error("Error fetching booking data:", error);
      setCancellationDetails({
        checkoutID: checkoutID,
        cancellationPolicy: "Unable to retrieve booking information. Please contact customer support.",
        cancellationAllowed: false
      });
    }

    // Show the modal
    setCancellationViewModal(true);
  };

  const [selectedDiscountModal, setSelectedDiscountModal] = useState(false);
  const [selectDiscount, setSelectDiscount] = useState([]);
  const handleDiscount = (data) => {
    console.log(data.data, "Discount Data issss");
    setSelectDiscount(data.data);
    setSelectedDiscountModal(true);
  }

  const [bookingDataModel, setBookingDataModel] = useState(false);
  const [hotelProvider, setHotelProvider] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [modelDefaultMessage, setModelDefaultMessage] = useState("Loading booking data...");

  // const showBookingDataModal = async (data) => {
  //   try {

  //     console.log(`/tbov2/booking/booking-info/${data.checkoutID}`, "Checkout ID value dat aisssssssssssss")
  //     setBookingDataModel(true);
  //     let url = "";
  //     if (data?.Provider == "hotelTbo") {
  //       url = `/tbov2/booking/booking-info/${data.checkoutID}`;
  //     } else if (data?.Provider == "hotelTboH") {
  //       url = `/tboh/hotels/booking-details/${data.checkoutID}`;
  //     }
  //     const response = await axios.get(url);
  //     console.log(response.data, "Booking Response Data is");

  //     if (data?.Provider == "hotelTbo") {
  //       if (response.data?.data?.bookingData) {
  //         setHotelProvider('hotelTbo')
  //         setBookingData(response.data.data)
  //       }
  //       else {
  //         setModelDefaultMessage("No booking data found for this order.")
  //       }
  //       setBookingData(response.data.data)
  //     }
  //     else if (data?.Provider == "hotelTboH") {
  //       if (response?.data?.data?.BookingDetail) {
  //         setHotelProvider('hotelTboH')
  //         setBookingData(response?.data?.data?.BookingDetail)
  //       }
  //       else {
  //         setModelDefaultMessage("No booking data found for this order.")
  //       }
  //     }
  //     console.log(bookingData);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const showBookingDataModal = async (data) => {
    try {
      console.log(data, "Booking Data from props");

      // Set the booking data directly from the props
      setBookingData({
        bookingData: {
          HotelName: data.PName,
          City: data.DAddress.split(',').slice(-3, -2)[0].trim(),
          CountryCode: data.DAddress.split(',').pop().trim(),
          HotelBookingStatus: data.supplier_status === "Pending" ? "Pending" : "Confirmed",
          CheckInDate: data.checkInDate,
          CheckOutDate: data.checkOutDate,
          NoOfRooms: 1, // Assuming 1 room since it's not in your data
          InvoiceAmount: data.total_amount,
          InvoiceNo: data.checkoutID.toString(),
          BookingSource: "Aahaas",
          GuestNationality: "Not specified",
          ConfirmationNo: data.checkoutID.toString(),
          BookingRefNo: data.orderID.toString(),
          HotelPolicyDetail: "Standard hotel policy applies",
          StarRating: "3" // Assuming 3 stars since it's not in your data
        },
        basicInfo: {
          checkIn: data.checkInDate,
          checkOut: data.checkOutDate,
          hotelName: data.PName,
          address: data.DAddress,
          totalAmount: data.total_amount,
          currency: data.currency
        }
      });

      setHotelProvider('hotelTbo');
      setBookingDataModel(true);

    } catch (error) {
      console.error("Error setting booking data:", error);
      setModelDefaultMessage("Error loading booking details");
      setBookingDataModel(true);
    }
  };
  useEffect(() => {
    setModelDefaultMessage("Loading booking data...");
  }, [bookingDataModel]);

  const columns = [
    { title: 'Product ID', field: 'pid' },

    { title: 'Name', field: 'name' },
    {
      title: 'QTY', field: 'qty', render: rowData => {
        return rowData?.category !== "flights" ? (
          // <CPopover
          //     content={<QuantityContainer data={rowData?.data} />}
          //     placement="right"
          //     title="Quantity Data"
          //     style={customPopoverStyle}
          //     trigger="focus"
          // >
          //     <CButton color="info" style={{ fontSize: 14, color: 'white' }}>View</CButton>
          // </CPopover>
          <span>{rowData?.data?.Quantity !== null ? rowData?.data?.Quantity : 'Not mention'}</span>
        ) : (
          <span>{rowData?.qty}</span>
        );
      }

    },
    { title: 'Date', field: 'date' },
    { title: 'Address', field: 'address' },

    { title: 'Total Amount', field: 'total_amount' },
    { title: 'Paid Amount', field: 'paid_amount' },
    { title: 'Balance Amount', field: 'balance_amount' },
    {
      title: 'Feedbacks', field: 'feedbacks', render: rowData => {
        if (rowData?.data?.orderFeedbacks?.length > 0) {
          return (
            <CPopover
              content={<FeedbackContainer data={rowData.data?.orderFeedbacks} />}
              placement="top"
              title="Quantity Data"
              style={customPopoverStyle}
              trigger="focus"
            >
              <CButton color="success" style={{ fontSize: 12, color: 'white' }}>View Feedbacks</CButton>
            </CPopover>
          )
        }
        else {
          return (
            <CBadge color="danger" style={{ padding: 8, fontSize: 12 }} > No Feedbacks</CBadge>
          )

        }

      }


    },
    {
      title: 'Supplier Confirmation', field: 'supplier_status', render: rowData => rowData?.supplier_status == "Pending" ?
        <CBadge color="danger" style={{ padding: 8, fontSize: 12 }}>Pending</CBadge> : rowData?.supplier_status == "Cancel" ? <CBadge color="danger" style={{ padding: 8, fontSize: 12 }}>Cancelled</CBadge> : <CBadge color="success" style={{ padding: 8, fontSize: 12 }}>Confirmed</CBadge>
    },
    {
      title: 'View Documents',
      field: 'orderMoreInfo',
      render: (rowData) => {
        return (
          <CButton color="info" style={{ fontSize: 12, color: 'white' }} onClick={() => handleDocment(rowData)}>View</CButton>
        )
      }
    },
    {
      title: 'View Discount',
      field: 'discountData',
      render: (rowData) => {
        return rowData.data.discountData ? (
          <CButton color="warning" style={{ fontSize: 12, color: 'white' }} onClick={() => handleDiscount(rowData)}>View</CButton>
        ) : (
          <CBadge color="secondary" style={{ padding: 8, fontSize: 12 }}>No Discount</CBadge>
        )
      }
    },



    {
      field: 'status',
      title: 'Order Status',
      align: 'left',
      // hidden: rowData => console.log(rowData?.supplier_status, "Row Data"),
      render: (e) => {

        var status = e?.data?.status
        var supplier_status = e?.data?.supplier_status

        console.log(e?.data, "Provider Value is");

        var cancel_role = e?.data?.cancel_role

        var edit = e?.data?.edit_status

        // console.log(edit, "Edit Coming Data Is")

        if (edit == "Edited") {
          return (
            <CCol style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>



              <CBadge color='info' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 14, color: 'white' }}>

                <CCardText>Order Edit Requested</CCardText>
              </CBadge>


            </CCol >
          )
        }
        else {



          if (cancel_role == "Supplier") {
            return (
              <CCol style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

                <CCardText color='danger' style={{ fontSize: 13, fontWeight: '600', textAlign: 'center' }}>Supplier Cancelled</CCardText>

                <CButton color='danger' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 14, color: 'white' }} onClick={() => handleMoreCancellationDetails(e)}>
                  <CIcon icon={cilInfo} size="xl" style={{ color: 'white', marginRight: 10 }} />
                  <CCardText>More Details</CCardText>
                </CButton>


              </CCol >
            )
          }

          else if (cancel_role == "Admin") {
            return (
              <CCol style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

                <CCardText color='danger' style={{ fontSize: 13, fontWeight: '600', textAlign: 'center' }}>Admin Cancelled</CCardText>

                <CButton color='danger' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 14, color: 'white' }} onClick={() => handleMoreCancellationDetails(e)}>
                  <CIcon icon={cilInfo} size="xl" style={{ color: 'white', marginRight: 10 }} />
                  <CCardText>More Details</CCardText>
                </CButton>


              </CCol >
            )
          }

          else if (cancel_role == "CUSTOMER") {
            return (

              <CCol style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

                <CCardText color='danger' style={{ fontSize: 13, fontWeight: '600', textAlign: 'center' }}>Customer Cancelled</CCardText>

                <CButton color='danger' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 14, color: 'white' }} onClick={() => handleMoreCancellationDetails(e)}>
                  <CIcon icon={cilInfo} size="xl" style={{ color: 'white', marginRight: 10 }} />
                  <CCardText>More Details</CCardText>
                </CButton>


              </CCol >
            )
          }
          else {
            return (
              <>
                {e?.data?.Provider == "hotelTbo" || e?.data?.Provider === "hotelTboH" ?
                  <CButton color="warning" style={{ fontSize: 11, color: 'white', marginBottom: 2 }} onClick={() => showBookingDataModal(e?.data)}>View Booking Details</CButton>
                  :
                  ""
                }

                {e?.data?.checkoutID == clickedStatus && status == "CustomerOrdered" ?
                  <select
                    className='form-select required'
                    name='delivery_status'
                    onChange={(value) => handleDelStatusChange(e, value)}
                    value={selectedStatusCheckout}
                    defaultValue={e?.data?.status}
                  // value={e?.data.status} // Set the selected value here
                  >
                    <option value="" >Select</option>
                    <option value="Approved">Confirm</option>
                    <option value="Cancel">Cancel</option>
                  </select>
                  :

                  <>

                    {/* {status == "Approved" ?
                      <CBadge color="success" style={{ padding: 8, fontSize: 12 }}>Admin Confirmed</CBadge> :
                      status == "Completed" ?
                        <CBadge color="success" style={{ padding: 8, fontSize: 12 }}>Order Delivered</CBadge>

                        :
                        (["change booking order status"].some(permission => userData?.permissions?.includes(permission))) &&
                        <CButton color={status == "Cancel" ? "danger" : "success"} style={{ fontSize: 14, color: 'white' }} onClick={() => handleButtonClick(e?.data?.checkoutID)}>Change Order Status</CButton>

                    } */}
                    {status == "Approved" ? (
                      <CBadge color="success" style={{ padding: 8, fontSize: 12 }}>
                        Admin Confirmed
                      </CBadge>
                    ) : status == "Completed" ? (
                      <CBadge color="success" style={{ padding: 8, fontSize: 12 }}>
                        Order Delivered
                      </CBadge>
                    ) : (
                      <>
                        {["change booking order status"].some(permission =>
                          userData?.permissions?.includes(permission)
                        ) && (
                            <>
                              {/* ✅ New Button Added Above */}
                              {e?.data?.Provider == "bridgify" ?
                                <CButton
                                  color="info"
                                  style={{ fontSize: 14, marginBottom: 8, color: 'white' }}
                                  onClick={() => handleModelShow(e?.data?.checkoutID)}
                                >
                                  Booking Details
                                </CButton> : ""}


                              {/* ✅ Existing Button */}
                              <CButton
                                color={status == "Cancel" ? "danger" : "success"}
                                style={{ fontSize: 14, color: 'white' }}
                                onClick={() => handleButtonClick(e?.data?.checkoutID)}
                              >
                                Change Order Status
                              </CButton>
                            </>
                          )}
                      </>
                    )}



                  </>

                }

              </>
            );
          }
        }


      }
    },
  ]
  const { currencyData, setCurrencyData } = useContext(CurrencyContext);

  const data = productData?.map(value => ({
    pid: value?.['PID'],
    name: value?.['PName'],
    qty: value?.['Quantity'],
    date: value?.['DDate'],
    address: value?.['DAddress'],
    total_amount: CurrencyConverter(value.currency, value?.['total_amount'], currencyData),
    paid_amount: CurrencyConverter(value.currency, value?.['paid_amount'], currencyData),
    balance_amount: CurrencyConverter(value.currency, value?.['balance_amount'], currencyData),
    checkoutID: value?.checkoutID,
    supplier_status: value?.supplier_status,
    data: value,
    data: value
  }))


  // console.log(productData, "Product dat avalue is")

  return (
    <>
      <CancellationModal show={cancellationReasonModal} onHide={() => setCancellationReasonModal(!cancellationReasonModal)} onConfirm={handleOrderCancellation}> </CancellationModal>

      <COffcanvas backdrop="static" placement="end" visible={cancellationModalState} onHide={() => setCancellationModalState(false)} >
        <COffcanvasHeader>
          <COffcanvasTitle style={{ fontWeight: 'bold' }}>Order Cancellation Details</COffcanvasTitle>
          <CCloseButton className="text-reset" onClick={() => setCancellationModalState(false)} />
        </COffcanvasHeader>
        <COffcanvasBody>

          <CCol>
            <CCardTitle>Product Name</CCardTitle>
            <CCardSubtitle>{selectedCancellationModal?.product_title}</CCardSubtitle>
          </CCol>

          <br></br>

          {selectedCancellationModal?.cancel_order_remarks ?
            <CCol>
              <CCardTitle>Cancel Order Remarks</CCardTitle>
              <CCardSubtitle>{selectedCancellationModal?.cancel_order_remarks}</CCardSubtitle>
              <br></br>
            </CCol>
            :
            null
          }



          <CCol>
            <CCardTitle>Cancel Order Reason</CCardTitle>
            <CCardSubtitle>{selectedCancellationModal?.cancel_reason}</CCardSubtitle>
          </CCol>


          <br></br>

          {selectedCancellationModal?.cancel_ref_image != "" ?
            <CCol>
              <CCardTitle>Cancellation Reference Image</CCardTitle>


              <img
                src={axios.defaults.imageUrl + selectedCancellationModal?.cancel_ref_image}
                fluid
                style={{


                  width: '100%',
                  height: '50%',
                  objectFit: 'cover',
                  marginTop: 10
                }}
              />
            </CCol>
            :
            null

          }

        </COffcanvasBody>
      </COffcanvas>


      <MaterialTable
        title="Booking Experience"
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
          rowStyle: rowStyle,
          grouping: true
        }}

      />


      <Modal
        show={cancellationViewModal}
        style={{ marginTop: '0%', zIndex: 999999999 }}
        onHide={() => setCancellationViewModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Booking Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {cancellationDetails ? (
            <div>
              <h5>{cancellationDetails.title}</h5>

              <div className="d-flex justify-content-between mb-3">
                <p><strong>Order ID:</strong> {cancellationDetails.orderId}</p>
                <p><strong>External Order ID:</strong> {cancellationDetails.externalOrderId}</p>
              </div>

              <div className="mb-4">
                <h6 className="fw-bold text-primary">Cancellation Policy</h6>
                <p>{cancellationDetails.cancellationPolicy}</p>
              </div>

              <div className="row mb-4">
                <div className="col-md-6">
                  <h6 className="fw-bold text-primary">Booking Information</h6>
                  <p><strong>Travel Date:</strong> {cancellationDetails.attractionDate}</p>
                  <p><strong>Time:</strong> {cancellationDetails.attractionTime}</p>
                  <p>
                    <strong>Status:</strong>
                    {cancellationDetails.status === "CNL" ? (
                      <CBadge color="danger" style={{ padding: 8, fontSize: 12, color: "white" }}>
                        Cancelled
                      </CBadge>
                    ) : cancellationDetails.status === "FAL" ? (
                      <CBadge color="danger" style={{ padding: 8, fontSize: 12, color: "white" }}>
                        Failed
                      </CBadge>
                    ) : (
                      <CBadge color="warning" style={{ padding: 8, fontSize: 12 }}>
                        {cancellationDetails.status}
                      </CBadge>
                    )}
                  </p>
                  <p><strong>Price:</strong> {cancellationDetails.currency} {cancellationDetails.merchantTotalPrice}</p>
                  <p><strong>Supplier:</strong> {cancellationDetails.inventorySupplier}</p>
                  <p><strong>Created:</strong> {new Date(cancellationDetails.externalCreatedAt).toLocaleString()}</p>
                </div>

                <div className="col-md-6">
                  <h6 className="fw-bold text-primary">Customer Information</h6>
                  <p><strong>Name:</strong> {cancellationDetails.customer.first_name} {cancellationDetails.customer.last_name}</p>
                  <p><strong>Email:</strong> {cancellationDetails.customer.email}</p>
                  <p><strong>Phone:</strong> {cancellationDetails.customer.phone}</p>

                  <h6 className="fw-bold text-primary mt-4">Ticket Information</h6>
                  {cancellationDetails.tickets && cancellationDetails.tickets.length > 0 ? (
                    <div>
                      {cancellationDetails.tickets.map((ticket, index) => (
                        <div key={index} className="mb-2">
                          <p><strong>Type:</strong> {ticket.title}</p>
                          <p><strong>Quantity:</strong> {ticket.quantity}</p>
                          <p><strong>ID:</strong> {ticket.external_ticket_id}</p>
                          {ticket.voucher_url && ticket.voucher_url.length > 0 && (
                            <p><strong>Voucher:</strong> <a href={ticket.voucher_url[0]} target="_blank" rel="noopener noreferrer">View Voucher</a></p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No ticket information available</p>
                  )}
                </div>
              </div>

              {/* Additional information for multiple order items if available */}
              {cancellationDetails.allOrderItems && cancellationDetails.allOrderItems.length > 1 && (
                <div className="mb-4">
                  <h6 className="fw-bold text-primary">Additional Order Items</h6>
                  <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                      <thead>
                        <tr>
                          <th>Attraction</th>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Status</th>
                          <th>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cancellationDetails.allOrderItems.slice(1).map((item, index) => (
                          <tr key={index}>
                            <td>{item.attraction_title}</td>
                            <td>{item.attraction_date}</td>
                            <td>{item.attraction_time}</td>
                            <td>
                              {item.status === "CNL" ? (
                                <CBadge color="danger" style={{ padding: 5, fontSize: 10, color: "white" }}>
                                  Cancelled
                                </CBadge>
                              ) : item.status === "FAL" ? (
                                <CBadge color="danger" style={{ padding: 5, fontSize: 10, color: "white" }}>
                                  Failed
                                </CBadge>
                              ) : (
                                <CBadge color="warning" style={{ padding: 5, fontSize: 10 }}>
                                  {item.status}
                                </CBadge>
                              )}
                            </td>
                            <td>{item.currency} {item.merchant_total_price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Refund Information */}
              <div className="mb-4">
                <h6 className="fw-bold text-primary">Refund Information</h6>
                <p><strong>Refund Amount:</strong> {cancellationDetails.refundAmount}</p>
                <p><strong>Cancellation Fee:</strong> {cancellationDetails.cancellationFee}</p>
                <p><strong>Cancellation Allowed:</strong> {cancellationDetails.cancellationAllowed ? 'Yes' : 'No'}</p>
              </div>
            </div>
          ) : (
            <p>Loading booking details...</p>
          )}
        </Modal.Body>
        {/* <Modal.Body>
          {cancellationDetails ? (
            <div>
              <h5>{cancellationDetails.title}</h5>
              <p><strong>Order ID:</strong> {cancellationDetails.checkoutID}</p>

              <div className="mb-4">
                <h6 className="fw-bold text-primary">Cancellation Policy</h6>
                <p>{cancellationDetails.cancellationPolicy}</p>
              </div>

              <div className="row mb-4">
                <div className="col-md-6">
                  <h6 className="fw-bold text-primary">Booking Information</h6>
                  <p><strong>Travel Date:</strong> {cancellationDetails.travelDate}</p>
                  <p><strong>Status:</strong> 
                  {cancellationDetails.status == "CNL" ?  <CBadge color="danger" style={{ padding: 8, fontSize: 12, color: "white" }}>
                  {cancellationDetails.status}
                      </CBadge>: <CBadge color="warning" style={{ padding: 8, fontSize: 12 }}>
                  {cancellationDetails.status}
                      </CBadge>} 
                 
                  </p>
                  <p><strong>Passengers:</strong> {cancellationDetails.paxes ?
                    Object.entries(cancellationDetails.paxes).map(([type, count]) =>
                      `${type}: ${count}`).join(', ') : 'N/A'}</p>
                </div>
                <div className="col-md-6">
                  <h6 className="fw-bold text-primary">Refund Information</h6>
                  <p><strong>Refund Amount:</strong> {cancellationDetails.refundAmount}</p>
                  <p><strong>Cancellation Fee:</strong> {cancellationDetails.cancellationFee}</p>
                  <p><strong>Cancellation Allowed:</strong> {cancellationDetails.cancellationAllowed ? 'Yes' : 'No'}</p>
                </div>
              </div>

             
            </div>
          ) : (
            <p>Loading cancellation details...</p>
          )}
        </Modal.Body> */}
        <Modal.Footer>
          <CButton color="secondary" onClick={() => setCancellationViewModal(false)}>
            Close
          </CButton>
          {cancellationDetails && cancellationDetails.cancellationAllowed && (
            <CButton color="danger" onClick={() => alert("Cancellation process initiated")}>
              Proceed with Cancellation
            </CButton>
          )}
        </Modal.Footer>
      </Modal>

      <Modal show={documentViewModal} style={{ marginTop: '10%', zIndex: 999999999 }} onHide={() => setDocumentViewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Document View</Modal.Title>
          {/* <CButton color="primary" size='sm' style={{ fontSize: 12, color: 'white', marginLeft: "10%" }} onClick={() => console.log('View Map Clicked')}>View Map</CButton> */}
        </Modal.Header>
        <Modal.Body>
          {selectedDocument && selectedDocument.length > 0 ? (
            <ul style={{ padding: 0, listStyleType: 'none' }}>
              {selectedDocument.map((url, index) => {
                const fileName = url.split('/').pop(); // Extract the file name from the URL
                return (
                  <li
                    key={index}
                    style={{
                      marginBottom: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between', // Align file name and icon
                      borderBottom: '1px solid #ddd', // Add a divider between items
                      paddingBottom: '5px',
                    }}
                  >
                    <span style={{ fontWeight: '500' }}>{fileName}</span>
                    <a
                      href={axios.defaults.imageUrl + url}
                      download={fileName} // This attribute will prompt a download
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#007bff',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <CIcon icon={cilInfo} size="lg" />
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>No documents available to display.</p>
          )}

          <div>
            {location?.latitude && location?.longitude ? (
              <GoogleMap
                mapContainerClassName="map-container"
                mapContainerStyle={mapContainerStyle}
                center={{ lat: parseFloat(location?.latitude), lng: parseFloat(location?.longitude) }}
                zoom={10}
              >
                <Marker
                  position={{ lat: parseFloat(location?.latitude), lng: parseFloat(location?.longitude) }}
                >
                </Marker>
              </GoogleMap>
            ) : (
              <p>No shared location available.</p>
            )}
          </div>
        </Modal.Body>
      </Modal>



      <Modal show={selectedDiscountModal} style={{ zIndex: 999999999 }} onHide={() => setSelectedDiscountModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Discount Product View</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DiscountView data={selectDiscount} />
        </Modal.Body>
      </Modal>


      <Modal show={bookingDataModel} style={{ zIndex: 999999999 }} onHide={() => setBookingDataModel(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Booking details</Modal.Title>
          {/* <CButton color="primary" size='sm' style={{ fontSize: 12, color: 'white', marginLeft: "10%" }} onClick={() => console.log('View Map Clicked')}>View Map</CButton> */}
        </Modal.Header>
        <Modal.Body className="max-h-[80vh] overflow-y-auto">
          {console.log(productData, "Booking Data is coming from props")}

          {(!bookingData && (!productData || productData?.length === 0)) ? (
            <div className="p-8 flex flex-col items-center justify-center">
              <p className="text-gray-500">{modelDefaultMessage}</p>
            </div>
          ) : (
            (productData?.length > 0 && productData[0]?.Provider === "hotelTbo") ? (
              productData.length > 1 ? (
                <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '850px', margin: '0 auto', padding: '25px', borderRadius: '8px', boxShadow: '0 3px 15px rgba(0,0,0,0.1)', backgroundColor: '#fff' }}>
                  <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #eaeaea', paddingBottom: '8px', fontSize: '22px', marginBottom: '20px' }}>
                    {productData.length > 1 ? `${productData.length} Bookings` : 'Booking Details'}
                  </h2>

                  {productData.map((product, index) => (
                    <div key={index} style={{ marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
                      <h3 style={{ color: '#3498db', marginBottom: '15px' }}>Booking #{index + 1}</h3>

                      {/* Booking Information */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '25px' }}>
                        <div style={{ flex: '1', minWidth: '250px' }}>
                          <div style={{ backgroundColor: '#f8f9fa', padding: '18px', borderRadius: '6px', marginBottom: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                            <h4 style={{ margin: '0 0 12px 0', color: '#2c3e50', fontSize: '16px' }}>Booking Information</h4>
                            <p style={{ margin: '8px 0', fontSize: '15px' }}>
                              <span style={{ fontWeight: 'bold', color: '#555', width: '160px', display: 'inline-block' }}>Status:</span>
                              <span style={{
                                color: product?.supplier_status === 'Confirmed' ? '#27ae60' : '#f39c12',
                                fontWeight: 'bold',
                                backgroundColor: product?.supplier_status === 'Confirmed' ? 'rgba(39, 174, 96, 0.1)' : 'rgba(243, 156, 18, 0.1)',
                                padding: '3px 8px',
                                borderRadius: '4px'
                              }}>
                                {product?.supplier_status || 'Pending'}
                              </span>
                            </p>
                            <p style={{ margin: '8px 0', fontSize: '15px' }}>
                              <span style={{ fontWeight: 'bold', color: '#555', width: '160px', display: 'inline-block' }}>Confirmation No:</span>
                              {product?.orderID || 'N/A'}
                            </p>
                            <p style={{ margin: '8px 0', fontSize: '15px' }}>
                              <span style={{ fontWeight: 'bold', color: '#555', width: '160px', display: 'inline-block' }}>Booking Ref:</span>
                              {product?.checkoutID || 'N/A'}
                            </p>
                          </div>
                        </div>

                        {/* Stay Information */}
                        <div style={{ flex: '1', minWidth: '250px' }}>
                          <div style={{ backgroundColor: '#f8f9fa', padding: '18px', borderRadius: '6px', marginBottom: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                            <h4 style={{ margin: '0 0 12px 0', color: '#2c3e50', fontSize: '16px' }}>Stay Information</h4>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                              <div style={{ textAlign: 'center', flex: '1' }}>
                                <p style={{ margin: '0', fontSize: '13px', color: '#555' }}>CHECK-IN</p>
                                <p style={{ margin: '5px 0 0 0', fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' }}>
                                  {new Date(product?.service_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </p>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', padding: '0 15px' }}>
                                <div style={{ height: '1px', width: '50px', backgroundColor: '#ddd' }}></div>
                                <div style={{ margin: '0 10px', color: '#555', fontSize: '14px' }}>
                                  {product?.NoOfNights || 1} {product?.NoOfNights > 1 ? 'Nights' : 'Night'}
                                </div>
                                <div style={{ height: '1px', width: '50px', backgroundColor: '#ddd' }}></div>
                              </div>

                              <div style={{ textAlign: 'center', flex: '1' }}>
                                <p style={{ margin: '0', fontSize: '13px', color: '#555' }}>CHECK-OUT</p>
                                <p style={{ margin: '5px 0 0 0', fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' }}>
                                  {new Date(product?.DDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Hotel Information */}
                      <div style={{ backgroundColor: '#f8f9fa', padding: '18px', borderRadius: '6px', marginBottom: '15px' }}>
                        <h4 style={{ margin: '0 0 12px 0', color: '#2c3e50', fontSize: '16px' }}>Hotel Information</h4>
                        <p style={{ margin: '5px 0', fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' }}>
                          {product?.PName}
                        </p>
                        <p style={{ margin: '8px 0', fontSize: '15px' }}>
                          <span style={{ fontWeight: 'bold', color: '#555', width: '70px', display: 'inline-block' }}>Address:</span>
                          {product?.address}
                        </p>
                      </div>

                      {/* Pricing Information */}
                      <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '6px', marginBottom: '15px' }}>
                        <h4 style={{ margin: '0 0 12px 0', color: '#2c3e50', fontSize: '16px' }}>Pricing Information</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontWeight: 'bold', color: '#555' }}>Amount:</span>
                          <span style={{ fontWeight: 'bold' }}>₹{product?.paid_amount}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Summary Section (if multiple bookings) */}
                  {productData.length > 1 && (
                    <div style={{ backgroundColor: '#e8f4fd', padding: '20px', borderRadius: '6px', marginTop: '20px' }}>
                      <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>Booking Summary</h3>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span style={{ fontWeight: 'bold', color: '#555' }}>Total Bookings:</span>
                        <span style={{ fontWeight: 'bold' }}>{productData.length}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span style={{ fontWeight: 'bold', color: '#555' }}>Total Amount:</span>
                        <span style={{ fontWeight: 'bold' }}>₹{productData.reduce((sum, item) => sum + parseFloat(item.paid_amount || 0), 0)}</span>
                      </div>
                    </div>
                  )}
                </div>

              ) :
                (<div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '850px', margin: '0 auto', padding: '25px', borderRadius: '8px', boxShadow: '0 3px 15px rgba(0,0,0,0.1)', backgroundColor: '#fff' }}>
                  {/* Main Booking Info */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '25px' }}>
                    <div style={{ flex: '1', minWidth: '250px' }}>
                      <div style={{ backgroundColor: '#f8f9fa', padding: '18px', borderRadius: '6px', marginBottom: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ margin: '0 0 12px 0', color: '#2c3e50', fontSize: '18px' }}>Booking Information</h3>
                        <p style={{ margin: '8px 0', fontSize: '15px' }}>
                          <span style={{ fontWeight: 'bold', color: '#555', width: '160px', display: 'inline-block' }}>Status:</span>
                          <span style={{
                            color: (bookingData?.bookingData?.HotelBookingStatus || productData[0]?.supplier_status) === 'Confirmed' ? '#27ae60' : '#f39c12',
                            fontWeight: 'bold',
                            backgroundColor: (bookingData?.bookingData?.HotelBookingStatus || productData[0]?.supplier_status) === 'Confirmed' ? 'rgba(39, 174, 96, 0.1)' : 'rgba(243, 156, 18, 0.1)',
                            padding: '3px 8px',
                            borderRadius: '4px'
                          }}>
                            {bookingData?.bookingData?.HotelBookingStatus || productData[0]?.supplier_status || 'Pending'}
                          </span>
                        </p>
                        <p style={{ margin: '8px 0', fontSize: '15px' }}>
                          <span style={{ fontWeight: 'bold', color: '#555', width: '160px', display: 'inline-block' }}>Confirmation No:</span>
                          {bookingData?.bookingData?.ConfirmationNo || productData[0]?.orderID || 'N/A'}
                        </p>
                        <p style={{ margin: '8px 0', fontSize: '15px' }}>
                          <span style={{ fontWeight: 'bold', color: '#555', width: '160px', display: 'inline-block' }}>Invoice No:</span>
                          {bookingData?.bookingData?.InvoiceNo || productData[0]?.orderID || 'N/A'}
                        </p>
                        <p style={{ margin: '8px 0', fontSize: '15px' }}>
                          <span style={{ fontWeight: 'bold', color: '#555', width: '160px', display: 'inline-block' }}>Booking Ref:</span>
                          {bookingData?.bookingData?.BookingRefNo || productData[0]?.checkoutID || 'N/A'}
                        </p>
                        <p style={{ margin: '8px 0', fontSize: '15px' }}>
                          <span style={{ fontWeight: 'bold', color: '#555', width: '160px', display: 'inline-block' }}>Rooms:</span>
                          {bookingData?.bookingData?.NoOfRooms || productData[0]?.decoded_data?.NoOfRooms || 1}
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
                              {new Date(bookingData?.bookingData?.CheckInDate || productData[0]?.service_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </p>
                            <p style={{ margin: '3px 0 0 0', fontSize: '14px' }}>
                              {new Date(bookingData?.bookingData?.CheckInDate || productData[0]?.service_date).getFullYear()}
                            </p>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', padding: '0 15px' }}>
                            <div style={{ height: '1px', width: '50px', backgroundColor: '#ddd' }}></div>
                            <div style={{ margin: '0 10px', color: '#555', fontSize: '14px' }}>
                              {(bookingData?.bookingData?.NoOfNights || productData[0]?.NoOfNights || 1)} {(bookingData?.bookingData?.NoOfNights || productData[0]?.NoOfNights || 1) > 1 ? 'Nights' : 'Night'}
                            </div>
                            <div style={{ height: '1px', width: '50px', backgroundColor: '#ddd' }}></div>
                          </div>

                          <div style={{ textAlign: 'center', flex: '1' }}>
                            <p style={{ margin: '0', fontSize: '13px', color: '#555' }}>CHECK-OUT</p>
                            <p style={{ margin: '5px 0 0 0', fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' }}>
                              {new Date(bookingData?.bookingData?.CheckOutDate || productData[0]?.DDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </p>
                            <p style={{ margin: '3px 0 0 0', fontSize: '14px' }}>
                              {new Date(bookingData?.bookingData?.CheckOutDate || productData[0]?.DDate).getFullYear()}
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
                      <p style={{ margin: '5px 0', fontSize: '20px', fontWeight: 'bold', color: '#2c3e50' }}>
                        {bookingData?.bookingData?.HotelName || productData[0]?.PName}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ display: 'inline-block' }}>
                          {Array(Math.floor(bookingData?.bookingData?.StarRating || 5)).fill(0).map((_, i) => (
                            <span key={i} style={{ color: '#f39c12', fontSize: '16px' }}>★</span>
                          ))}
                        </div>
                        <span style={{ marginLeft: '8px', color: '#555', fontSize: '14px' }}>
                          {bookingData?.bookingData?.StarRating || 5} Star
                        </span>
                      </div>
                      <p style={{ margin: '8px 0', fontSize: '15px' }}>
                        <span style={{ fontWeight: 'bold', color: '#555', width: '70px', display: 'inline-block' }}>Address:</span>
                        {bookingData?.bookingData?.Address || productData[0]?.address}
                      </p>
                      <p style={{ margin: '8px 0', fontSize: '15px' }}>
                        <span style={{ fontWeight: 'bold', color: '#555', width: '70px', display: 'inline-block' }}>City:</span>
                        {bookingData?.bookingData?.City || 'Kuala Lumpur'}
                      </p>
                      <p style={{ margin: '8px 0', fontSize: '15px' }}>
                        <span style={{ fontWeight: 'bold', color: '#555', width: '70px', display: 'inline-block' }}>Country:</span>
                        {bookingData?.bookingData?.CountryCode || 'Malaysia'}
                      </p>
                    </div>

                    <div style={{ flex: '1', minWidth: '200px', maxWidth: '250px', height: '150px', backgroundColor: '#e9ecef', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ textAlign: 'center', color: '#7f8c8d' }}>
                        <div style={{ fontSize: '24px', marginBottom: '5px' }}>📍</div>
                        <div style={{ fontSize: '14px' }}>Location:</div>
                        <div style={{ fontSize: '13px' }}>{bookingData?.bookingData?.City || 'Kuala Lumpur'}, {bookingData?.bookingData?.CountryCode || 'Malaysia'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Information */}
                  <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #eaeaea', paddingBottom: '8px', fontSize: '22px' }}>Pricing Information</h2>
                  <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '6px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ fontWeight: 'bold', color: '#555' }}>Invoice Amount:</span>
                      <span style={{ fontWeight: 'bold' }}>₹{bookingData?.bookingData?.InvoiceAmount || productData[0]?.paid_amount}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ color: '#555' }}>Taxes:</span>
                      <span>Included</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ color: '#555' }}>Booking Source:</span>
                      <span>{bookingData?.bookingData?.BookingSource || 'Online'}</span>
                    </div>
                  </div>

                  {/* Guest Information */}
                  <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #eaeaea', paddingBottom: '8px', fontSize: '22px' }}>Guest Information</h2>
                  <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '6px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ fontWeight: 'bold', color: '#555' }}>Nationality:</span>
                      <span>{bookingData?.bookingData?.GuestNationality || 'Not specified'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ fontWeight: 'bold', color: '#555' }}>Primary Guest:</span>
                      <span>{bookingData?.bookingData?.PrimaryGuest || productData[0]?.decoded_data?.paxDetails?.[0]?.FirstName + ' ' + productData[0]?.decoded_data?.paxDetails?.[0]?.LastName || 'Not specified'}</span>
                    </div>
                  </div>

                  {/* Hotel Policy */}
                  <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #eaeaea', paddingBottom: '8px', fontSize: '22px' }}>Hotel Policy</h2>
                  <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '6px', marginBottom: '20px' }}>
                    <p style={{ color: '#555' }}>
                      {bookingData?.bookingData?.HotelPolicyDetail || 'Standard hotel policy applies. Please contact the hotel directly for specific policies.'}
                    </p>
                  </div>
                </div>)

            )
              : (
                <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '850px', margin: '0 auto', padding: '25px', borderRadius: '8px', boxShadow: '0 3px 15px rgba(0,0,0,0.1)', backgroundColor: '#fff' }}>

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
                                  <span style={{ fontWeight: 'bold' }}>From {new Date(policy.FromDate.replace(/-/g, '/')).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}:</span>
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
              )
          )}
        </Modal.Body>
      </Modal>
    </>
  )
}
