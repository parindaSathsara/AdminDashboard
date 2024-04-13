import React, { useEffect, useState } from 'react';
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import discountTotal from '../dcalculator';
import moment from 'moment';
import './OrderDetails.css'
import { getDashboardOrdersIdWise, updateDeliveryStatus } from '../../service/api_calls';
// import { data } from '../../../Data/flight_airports';
import data from '../../Data/flight_airports';
import MaterialTable from 'material-table';
import { Tab, Tabs } from 'react-bootstrap';
import ConfirmationDetails from '../ConfirmationDetails/ConfirmationDetails';
import AccountsDetails from '../AccountsDetails/AccountsDetails';
import SupDetails from '../SupDetails/SupDetails';
import FeebackDetails from '../FeebackDetails/FeebackDetails';
import PaymentModal from '../PaymentModal/PaymentModal';
import { CAlert, CButton, CCard, CCardBody, CCardImage, CCardText, CCardTitle, CCol, CImage, CRow } from '@coreui/react';
import CustomerDetails from '../CustomerDetails/CustomerDetails';
import CheckIcon from '@mui/icons-material/Check';
import { cibAboutMe, cibAbstract, cilCheck, cilCheckAlt, cilCheckCircle, cilDescription, cilInfo, cilViewColumn, cilViewModule, cilXCircle } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import Swal from 'sweetalert2';
import DeliveryDetails from '../DeliveryDetails/DeliveryDetails';
import MoreOrderView from './MoreOrderView/MoreOrderView';
import DetailExpander from './Components/DetailExpander';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsAlt, faChevronDown, faExpand } from '@fortawesome/free-solid-svg-icons';
import BookingExperience from './DepartmentWise/BookingExperience';
import SupplierExperience from './DepartmentWise/SupplierExperience';
import DateWiseSummary from './DateWiseSummary/DateWiseSummary';
import TravellerExperience from './DepartmentWise/TravellerExperience';

function OrderDetails(props) {

    console.log(props.orderid)

    const [isLoading, setIsLoading] = useState(true)

    const [productData, setProductData] = useState([])
    const [showModal, setShowModal] = useState(false);
    const [rowDetails, setRowDetails] = useState([])

    const [dates, setDates] = useState([])



    const [lifestylesData, setLifestylesData] = useState([])
    const [essNEssData, setEssNEssData] = useState([])
    const [hotelData, setHotelData] = useState([])
    const [educationData, setEducationData] = useState([])
    const [flightsData, setFlightsData] = useState([])

    const handlePaymentProof = (e) => {
        setShowModal(true)
        console.log(e)
        setRowDetails(e);
    }

    function generateRandom() {
        var length = 8,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    }

    const HotelNightdays = (date_1, date_2) => {
        let date1 = new Date(date_1)
        let date2 = new Date(date_2)

        let difference = date2.getTime() - date1.getTime();
        let totalDays = Math.ceil(difference / (1000 * 3600 * 24))

        return totalDays;
    }

    const filterJson = (code) => {

        var airport = '';
        var city = '';

        data.filter((value) => {
            if (value.code === code) {
                airport = value.name
                city = value.city;
            }
        })



        return {
            'airport': airport,
            'city': city
        }
    }

    const calculateHours = (val1, val2) => {

        var startdate = moment(val1)
        var enddate = moment(val2)
        var difference = enddate.diff(startdate);
        var duration = moment.duration(difference);
        var hours = duration.asHours().toFixed(2);

        return hours
    }


    const [detailsLoading, setDetailsLoading] = useState(false)

    const [orderMainDetails, setOrderMainDetails] = useState([])
    const [customerData, setCustomerData] = useState([])


    console.log("Order Main Details DAtaqaaaaaaaaaaaaaa,", props.orderData)

    useEffect(() => {

        console.log("Order id", props.orderid)

        // setProductData(props.dataset)
        setOrderMainDetails(props.orderData)
        setDetailsLoading(true)

        getDashboardOrdersIdWise(props.orderid).then((res) => {
            setDetailsLoading(false)
            setLifestylesData(res.lifestyleData)
            setEssNEssData(res.essNEssData)
            setEducationData(res.educationData)
            setFlightsData(res.flightsData)
            setHotelData(res.hotelData)
            setProductData(res.productData)
            setCustomerData(res.customerData)
            setDates(res.dates)

            console.log(res.customerData, "CustomerData value is data ")
        })

    }, [props.orderid, props.orderData])


    const reload = () => {

        setDetailsLoading(true)

        getDashboardOrdersIdWise(props.orderid).then((res) => {
            setDetailsLoading(false)
            setLifestylesData(res.lifestyleData)
            setEssNEssData(res.essNEssData)
            setEducationData(res.educationData)
            setFlightsData(res.flightsData)
            setHotelData(res.hotelData)
            setProductData(res.productData)

            setCustomerData(res.customerData)
        })
    }





    const [moreOrderDetails, setMoreOrderDetails] = useState("")
    const [moreOrderModal, setMoreOrderModal] = useState(false)
    const [moreOrderModalCategory, setMoreOrderModalCategory] = useState("")

    const handleMoreInfoModal = (e, category) => {
        console.log("More Info Modal", e)

        setMoreOrderModalCategory(category)
        if (category == 3) {
            setMoreOrderDetails(e.lifestyle_booking_id)
            setMoreOrderModal(true)
        }
        else if (category == 1) {
            setMoreOrderDetails(e.essential_pre_order_id)
            setMoreOrderModal(true)
        }

        else if (category == 5) {
            setMoreOrderDetails(e.booking_id)
            setMoreOrderModal(true)
        }




    }



    const lifestyles = {
        columns: [

            {
                field: 'view', width: 5, title: '', align: 'left', render: (e) => {
                    return (
                        <>
                            <CButton style={{ backgroundColor: 'transparent', padding: 0, borderWidth: 0 }} onClick={() => handleMoreInfoModal(e, 3)}>
                                <CIcon icon={cilInfo} className="text-info" size="xl" />
                            </CButton>

                        </>
                    );
                }
            },

            { field: 'pid', title: 'Product ID' },

            { field: 'product_title', title: 'Product Title' },
            { field: 'adultCount', title: 'Adult Count', align: 'left' },
            { field: 'childCount', title: 'Child Count', align: 'left' },
            { field: 'service_date', title: 'Service Date', align: 'left' },
            { field: 'pickup_time', title: 'Pickup Time', align: 'left' },
            { field: 'location', title: 'Location', align: 'left' },
            { field: 'balance_amount', title: 'Balance Amount', align: 'left' },
            { field: 'paid_amount', title: 'Paid Amount', align: 'left' },
            { field: 'total_amount', title: 'Total Amount', align: 'left' },
            {
                field: 'supplier_order', title: 'Supplier Confirmation', align: 'left', render: (e) => {
                    return (
                        <>
                            {e.supplier_order === 'Pending' ? (
                                <CIcon icon={cilCheckCircle} className="text-success" size="xl" />
                            ) : (
                                <CIcon icon={cilXCircle} className="text-danger" size="xl" />
                            )}
                        </>
                    );
                }
            },
            {
                field: 'status',
                title: 'Order Status',
                align: 'left',
                hidden: props.hideStatus,
                render: (e) => {
                    console.log(e, "Data set delivery is")
                    console.log(e.status, "Delivery status")
                    return (
                        <>
                            <select
                                className='form-select required'
                                name='delivery_status'
                                onChange={(value) => handleDelStatusChange(e, value)}
                                value={e.status} // Set the selected value here
                            >
                                <option value="Approved">Confirm Order</option>
                                <option value="Cancelled">Cancel Order</option>
                            </select>
                        </>
                    );
                }
            },
        ],

        rows: lifestylesData?.map(value => ({

            id: value.checkoutID,
            pid: value.PID,
            product_title: value.product_title,
            childCount: value.childCount,
            adultCount: value.adultCount,
            service_date: value.service_date,
            balance_amount: value.currency + " " + (value.balance_amount || "0.00"),
            paid_amount: value.currency + " " + (value.paid_amount || "0.00"),
            total_amount: value.currency + " " + (value.total_amount || "0.00"),
            booking_date: value.booking_date,
            supplier_order: value.supplier_status,
            status: value.status,
            pickup_time: value.pickupTime,
            location: value.location,



            lifestyle_inventory_id: value.lifestyle_inventory_id,
            lifestyle_rate_id: value.lifestyle_rate_id,
            package_id: value.package_id,
            lifestyle_booking_id: value.lifestyle_booking_id,
            lifestyle_id: value.lifestyle_id
        }))
    }

    console.log(lifestylesData, "Lifestyle Dataaaaaaa")



    const educations = {
        columns: [
            // { field: 'id', title: 'ID' },



            {

                field: 'view', width: 5, title: '', align: 'left', render: (e) => {
                    return (
                        <>
                            <CButton style={{ backgroundColor: 'transparent', padding: 0, borderWidth: 0 }} onClick={() => handleMoreInfoModal(e, 5)}>
                                <CIcon icon={cilInfo} className="text-info" size="xl" />
                            </CButton>

                        </>
                    );
                }

            },

            { field: 'pid', title: 'Product ID' },

            { field: 'product_title', title: 'Product Title' },
            { field: 'student_type', title: 'Student Type', align: 'left' },

            { field: 'inven_start_date', title: 'Start Date', align: 'left' },
            { field: 'inven_end_date', title: 'End Date', align: 'left' },

            { field: 'course_startime', title: 'Start Time', align: 'left' },
            { field: 'course_endtime', title: 'End Time', align: 'left' },


            { field: 'balance_amount', title: 'Balance Amount', align: 'left' },
            { field: 'paid_amount', title: 'Paid Amount', align: 'left' },




            { field: 'total_amount', title: 'Total Amount', align: 'left' },
            {
                field: 'supplier_order', title: 'Supplier Confirmation', align: 'left', render: (e) => {
                    return (
                        <>
                            {e.supplier_order === 'Pending' ? (
                                <CIcon icon={cilCheckCircle} className="text-success" size="xl" />
                            ) : (
                                <CIcon icon={cilXCircle} className="text-danger" size="xl" />
                            )}
                        </>
                    );
                }
            },
            {
                field: 'status',
                title: 'Order Status',
                align: 'left',
                hidden: props.hideStatus,
                render: (e) => {

                    return (
                        <>
                            <select
                                className='form-select required'
                                name='delivery_status'
                                onChange={(value) => handleDelStatusChange(e, value)}
                                value={e.status} // Set the selected value here
                            >

                                <option value="Approved">Confirm Order</option>
                                <option value="Cancelled">Cancel Order</option>
                            </select>
                        </>
                    );
                }
            },
        ],

        rows: educationData?.map(value => ({
            id: value.checkoutID,
            pid: value.PID,
            product_title: value.product_title,
            student_type: value.student_type,
            balance_amount: value.currency + " " + (value.balance_amount || "0.00"),
            paid_amount: value.currency + " " + (value.paid_amount || "0.00"),
            total_amount: value.currency + " " + (value.total_amount || "0.00"),
            booking_date: value.preffered_booking_date,
            supplier_order: value.supplier_status,
            status: value.status,
            inven_start_date: value.course_inv_startdate,
            inven_end_date: value.course_inv_enddate,

            course_startime: value.course_startime,
            course_endtime: value.course_endtime,
            booking_id: value.booking_id

        }))
    }

    const essNEss = {
        columns: [
            {
                field: 'view', width: 5, title: '', align: 'left', render: (e) => {
                    return (
                        <>
                            <CButton style={{ backgroundColor: 'transparent', padding: 0, borderWidth: 0 }} onClick={() => handleMoreInfoModal(e, 1)}>
                                <CIcon icon={cilInfo} className="text-info" size="xl" />
                            </CButton>

                        </>
                    );
                }
            },

            { field: 'pid', title: 'Product ID' },
            { field: 'product_title', title: 'Product Title' },
            { field: 'quantity', title: 'Quantity', align: 'left' },
            { field: 'preffered_date', title: 'Preferred Date', align: 'left' },
            { field: 'features', title: 'Features', align: 'left' }, // New column for variations
            { field: 'address', title: 'Address', align: 'left' },

            { field: 'balance_amount', title: 'Balance Amount', align: 'left' },
            { field: 'paid_amount', title: 'Paid Amount', align: 'left' },
            { field: 'total_amount', title: 'Total Amount', align: 'left' },

            // {
            //     field: 'supplier_order', title: 'Supplier Confirmation', align: 'left', render: (e) => {
            //         return (
            //             <>
            //                 {e.supplier_order === 'Pending' ? (
            //                     <CIcon icon={cilCheckCircle} className="text-success" size="xl" />
            //                 ) : (
            //                     <CIcon icon={cilXCircle} className="text-danger" size="xl" />
            //                 )}
            //             </>
            //         );
            //     }
            // },
            {
                field: 'status',
                title: 'Order Status',
                align: 'left',
                hidden: props.hideStatus,
                render: (e) => {
                    console.log(e.status, "Delivery status")
                    return (
                        <>
                            <select
                                className='form-select required'
                                name='delivery_status'
                                onChange={(value) => handleDelStatusChange(e, value)}
                                value={e.status} // Set the selected value here
                            >

                                <option value="Approved">Confirm Order</option>
                                <option value="Cancelled">Cancel Order</option>
                            </select>
                        </>
                    );
                }
            },
        ],

        rows: essNEssData?.map(value => ({
            id: value.checkoutID,

            pid: value.PID,
            product_title: value.product_title,
            quantity: value.quantity,
            preffered_date: value.preffered_date,
            address: value.location,
            balance_amount: value.currency + " " + (value.balance_amount || "0.00"),
            paid_amount: value.currency + " " + (value.paid_amount || "0.00"),
            total_amount: value.currency + " " + (value.total_amount || "0.00"),
            features: renderVariations(value), // Render variations
            supplier_order: value.supplier_status,
            status: value.status, // Default value
            essential_pre_order_id: value.essential_pre_order_id
        }))
    }




    // Function to render variations
    function renderVariations(value) {
        let variations = [];
        for (let i = 1; i <= 5; i++) {
            if (value[`variation_type${i}`] && value[`variant_type${i}`]) {
                variations.push(`${value[`variation_type${i}`]} - ${value[`variant_type${i}`]}`);
            }
        }
        return variations.length > 0 ? variations.join(', ') : '-';
    }

    const flights = {
        columns: [
            {
                field: 'flightData', title: 'Flight Data', align: 'left', width: 500,
                render: (e) => {
                    var originData = e.flightData.ori_loccation?.split(',')
                    var destData = e.flightData.dest_loccation?.split(',')

                    var depDates = e.flightData.departure_datetime?.split(',')
                    var flights = e.flightData.flight_code?.split(',')
                    return (
                        <>
                            <CRow>
                                <CCol lg={3}>
                                    <h6 style={{ fontWeight: 'bold' }}>Departure</h6>
                                </CCol>
                                <CCol lg={1}>

                                </CCol>
                                <CCol lg={3}>
                                    <h6 style={{ textAlign: 'right', fontWeight: 'bold' }}>Arrival</h6>
                                </CCol>

                                <CCol lg={2}>
                                    <h6 style={{ textAlign: 'left', fontWeight: 'bold' }}>Flight</h6>
                                </CCol>
                                <CCol lg={3}>
                                    <h6 style={{ textAlign: 'right', fontWeight: 'bold' }}>Departure Date</h6>
                                </CCol>

                            </CRow>

                            {originData?.map((origin, indexOrigin) => (
                                <CRow>

                                    <CCol lg={3}>
                                        <h6>{origin}</h6>

                                    </CCol>
                                    <CCol lg={1}>
                                        <h6>✈️</h6>
                                    </CCol>
                                    <CCol lg={3}>
                                        <h6 style={{ textAlign: 'right' }}>{destData[indexOrigin]}</h6>
                                    </CCol>


                                    <CCol lg={1}>
                                        <CImage src={`https://gateway.aahaas.com/Airlines/${flights[indexOrigin]}.png`} height={20} width={20} style={{ borderRadius: 15, resizeMode: 'contain' }}></CImage>

                                    </CCol>

                                    <CCol lg={3}>
                                        <h6 style={{ textAlign: 'right' }}>{depDates[indexOrigin]}</h6>
                                    </CCol>

                                </CRow>
                            ))}
                        </>





                    )

                }
            },

            { field: 'total_amount', title: 'Total Amount', align: 'left' },

        ],

        rows: flightsData?.map(value => {
            // const oriLocations = value.ori_loccation.split(',');
            // const departureTimes = value.departure_datetime.split(',');
            // const flightsInfo = [];

            // for (let i = 0; i < oriLocations.length; i++) {
            //     flightsInfo.push({
            //         ori_location: oriLocations[i].trim(),
            //         departure_time: departureTimes[i].trim()
            //     });
            // }

            return {
                flightData: value,

                total_amount: value.currency + " " + value.total_amount,
            }
        })
    }



    const [detailExpander, setDetailExpander] = useState(false)

    const handleDelStatusChange = (e, val) => {
        console.log(e, "Value Data set is 123")
        console.log(val.target.value, "Target Value is")

        var title = ""



        if (val.target.value == "Approved") {
            title = "Do You Want to Confirm This Order"
        }
        else {
            title = "Do You Want to Cancel This Order"
        }

        // Swal.fire({
        //     title: "Are you sure?",
        //     text: title,
        //     icon: "question",
        //     showCancelButton: true,
        //     confirmButtonColor: "#2eb85c",
        //     cancelButtonColor: "#d33",
        //     confirmButtonText: "Yes"
        // }).then((result) => {
        //     console.log(result, "IS Confirmed")

        //     if (result.isConfirmed) {

        updateDeliveryStatus(e.id, val.target.value, e.category).then(result => {
            console.log(result)
            reload()
            Swal.fire({
                title: "Order " + e.id + " Confirmed",
                text: "Order - " + e.id + " Order Confirmed",
                icon: "success"
            });
        })

        //     }
        // });



        // props.relord();
    }


    const hotels = {
        columns: [
            { field: 'hotelName', title: 'Hotel Name' },
            { field: 'Provider', title: 'Provider', align: 'left' },
            { field: 'NoOfNights', title: 'No of Nights', align: 'left' },
            { field: 'NoOfAdults', title: 'No of Adults', align: 'left' },
            { field: 'checkInDate', title: 'Check In Date', align: 'left' },
            { field: 'balance_amount', title: 'Balance Amount', align: 'left' },
            { field: 'paid_amount', title: 'Paid Amount', align: 'left' },
            { field: 'total_amount', title: 'Total Amount', align: 'left' },
            {
                field: 'supplier_order', title: 'Supplier Confirmation', align: 'left', render: (e) => {
                    return (
                        <>
                            {e.supplier_order === 'Pending' ? (
                                <CIcon icon={cilCheckCircle} className="text-success" size="xl" />
                            ) : (
                                <CIcon icon={cilXCircle} className="text-danger" size="xl" />
                            )}
                        </>
                    );
                }
            },
            {
                field: 'status',
                title: 'Order Status',
                align: 'left',
                hidden: props.hideStatus,
                render: (e) => {
                    return (
                        <>
                            <select
                                className='form-select required'
                                name='delivery_status'
                                onChange={(value) => handleDelStatusChange(e, value)}
                                value={e.status} // Set the selected value here
                            >
                                <option value="Approved">Confirm Order</option>
                                <option value="Cancelled">Cancel Order</option>
                            </select>
                        </>
                    );
                }
            },
        ],

        rows: hotelData?.map(value => ({
            id: value.checkoutID,
            hotelName: value.hotelName,
            Provider: value.Provider == "hotelAhs" ? "Aahaas" : "TBO",
            NoOfNights: value.NoOfNights,
            NoOfAdults: value.NoOfAdults,
            checkInDate: value.checkInDate,
            balance_amount: value.currency + " " + (value.balance_amount || "0.00"),
            paid_amount: value.currency + " " + (value.paid_amount || "0.00"),
            total_amount: value.currency + " " + (value.total_amount || "0.00"),
            supplier_order: value.supplier_status,
            status: value.status
        }))
    }




    const ServiceWiseSummary = () => {
        return (
            <>
                {lifestylesData?.length > 0 ?
                    <MaterialTable
                        data={lifestyles.rows}
                        columns={lifestyles.columns}
                        title="Lifestyles Details"
                        options={{
                            sorting: true, search: true,
                            searchFieldAlignment: "right", searchAutoFocus: true, searchFieldVariant: "standard",
                            filtering: false, paging: false, pageSize: 3,
                            paginationType: "stepped", showFirstLastPageButtons: false, paginationPosition: "both", exportButton: true,
                            exportAllData: true, exportFileName: "TableData", addRowPosition: "first", actionsColumnIndex: -1, selection: false,
                            showSelectAllCheckbox: false, showTextRowsSelected: false,
                            grouping: false, columnsButton: false,
                            rowStyle: { fontSize: "15px", width: "100%", color: "#000" },
                            editCellStyle: { width: "100%" },
                            headerStyle: { fontSize: "15px", backgroundColor: '#EFF6F9' }

                            // fixedColumns: {
                            //     left: 6
                            // }
                        }}
                    />
                    :
                    null
                }

                <br></br>


                {educationData?.length > 0 ?
                    <MaterialTable
                        data={educations.rows}
                        columns={educations.columns}
                        title="Education Details"
                        options={{
                            sorting: true, search: true,
                            searchFieldAlignment: "right", searchAutoFocus: true, searchFieldVariant: "standard",
                            filtering: false, paging: false, pageSize: 3,
                            paginationType: "stepped", showFirstLastPageButtons: false, paginationPosition: "both", exportButton: true,
                            exportAllData: true, exportFileName: "TableData", addRowPosition: "first", actionsColumnIndex: -1, selection: false,
                            showSelectAllCheckbox: false, showTextRowsSelected: false,
                            grouping: false, columnsButton: false,
                            rowStyle: { fontSize: "15px", width: "100%", color: "#000" },
                            editCellStyle: { width: "100%" },
                            headerStyle: { fontSize: "15px", backgroundColor: '#EFF6F9' }

                            // fixedColumns: {
                            //     left: 6
                            // }
                        }}
                    />
                    :
                    null
                }

                <br></br>

                {essNEssData?.length > 0 ?
                    <MaterialTable
                        data={essNEss.rows}
                        columns={essNEss.columns}
                        title="Essentials/Non Essentials Details"
                        options={{
                            sorting: true, search: true,
                            searchFieldAlignment: "right", searchAutoFocus: true, searchFieldVariant: "standard",
                            filtering: false, paging: false, pageSize: 3,
                            paginationType: "stepped", showFirstLastPageButtons: false, paginationPosition: "both", exportButton: true,
                            exportAllData: true, exportFileName: "TableData", addRowPosition: "first", actionsColumnIndex: -1, selection: false,
                            showSelectAllCheckbox: false, showTextRowsSelected: false,
                            grouping: false, columnsButton: false,
                            rowStyle: { fontSize: "15px", width: "100%", color: "#000" },
                            editCellStyle: { width: "100%" },
                            headerStyle: { fontSize: "15px", backgroundColor: '#EFF6F9' }

                            // fixedColumns: {
                            //     left: 6
                            // }
                        }}
                    />
                    :
                    null
                }


                {hotelData?.length > 0 ?
                    <MaterialTable
                        data={hotels.rows}
                        columns={hotels.columns}
                        title="Hotels Details"
                        options={{
                            sorting: true, search: true,
                            searchFieldAlignment: "right", searchAutoFocus: true, searchFieldVariant: "standard",
                            filtering: false, paging: false, pageSize: 3,
                            paginationType: "stepped", showFirstLastPageButtons: false, paginationPosition: "both", exportButton: true,
                            exportAllData: true, exportFileName: "TableData", addRowPosition: "first", actionsColumnIndex: -1, selection: false,
                            showSelectAllCheckbox: false, showTextRowsSelected: false,
                            grouping: false, columnsButton: false,
                            rowStyle: { fontSize: "15px", width: "100%", color: "#000" },
                            editCellStyle: { width: "100%" },
                            headerStyle: { fontSize: "15px", backgroundColor: '#EFF6F9' }

                            // fixedColumns: {
                            //     left: 6
                            // }
                        }}
                    />
                    :
                    null

                }



                {flightsData?.length > 0 ?
                    <MaterialTable
                        data={flights.rows}
                        columns={flights.columns}
                        title="Flights Details"
                        options={{
                            tableLayout: "auto",
                            sorting: true, search: true,
                            searchFieldAlignment: "right", searchAutoFocus: true, searchFieldVariant: "standard",
                            filtering: false, paging: false, pageSize: 3,
                            paginationType: "stepped", showFirstLastPageButtons: false, paginationPosition: "both", exportButton: true,
                            exportAllData: true, exportFileName: "TableData", addRowPosition: "first", actionsColumnIndex: -1, selection: false,
                            showSelectAllCheckbox: false, showTextRowsSelected: false,
                            grouping: false, columnsButton: false,
                            rowStyle: { fontSize: "15px", width: "100%", color: "#000" },
                            editCellStyle: { width: "100%" },
                            headerStyle: { fontSize: "15px", backgroundColor: '#EFF6F9' }

                            // fixedColumns: {
                            //     left: 6
                            // }
                        }}
                    />
                    :
                    null
                }
            </>
        )
    }



    return (
        detailsLoading == true ?
            <div class="d-flex justify-content-center">
                <div class="d-flex align-items-center">

                    <div class="spinner-border text-secondary ml-auto" style={{ marginRight: 15 }} role="status" aria-hidden="true"></div>
                    <strong className='text-secondary'>Loading...</strong>
                </div>

            </div>
            :
            <>
                <div className="prod_container">

                    <CAlert color="success" style={{ fontSize: 22, fontWeight: "bold" }}>
                        Order ID - {props.orderid}
                    </CAlert>

                    <CCard style={{ maxWidth: '100vw' }}>
                        <CRow className="g-0">
                            <CCol md={1}>
                                <CCardImage src={"https://gateway.aahaas.com/" + customerData.customer_profilepic} style={{ height: '100%', objectFit: 'cover' }} />
                            </CCol>
                            <CCol md={11}>
                                <CCardBody>
                                    <h4 style={{ fontWeight: 'bold' }}>Customer Details</h4>
                                    <CustomerDetails dataset={customerData} orderid={props.orderid} />
                                </CCardBody>
                            </CCol>
                        </CRow>
                    </CCard>


                    <hr></hr>


                    <h4 style={{ position: 'relative', top: 0 }}>Order Summary</h4>

                    <Tabs
                        defaultActiveKey="service"
                        id="uncontrolled-tab-example"
                        className="mt-4"
                        style={{
                            fontSize: 16
                        }}
                    >

                        <Tab eventKey="service" title="Service Wise">
                            <ServiceWiseSummary></ServiceWiseSummary>
                        </Tab>
                        <Tab eventKey="date" title="Day Wise">
                            <DateWiseSummary dataset={productData} orderid={props.orderid} dates={dates} handleMoreInfoModal={handleMoreInfoModal} />
                        </Tab>


                    </Tabs>





                </div>


                {props?.accounts ?
                    null :
                    <>

                        <CCol style={{ width: '100%' }}>



                            <button onClick={() => setDetailExpander(true)} style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', float: 'right', top: '20px' }}>
                                <FontAwesomeIcon icon={faExpand} size={30} />
                            </button>


                            <Tabs
                                defaultActiveKey="bookingexperience"
                                id="uncontrolled-tab-example"
                                className="mt-4"
                            >

                                <Tab eventKey="bookingexperience" title="Booking Experience">
                                    <BookingExperience dataset={productData} orderid={props.orderid} />
                                </Tab>

                                <Tab eventKey="supplierexperience" title="Supplier Experience">
                                    <SupplierExperience dataset={productData} orderid={props.orderid} />
                                </Tab>

                                <Tab eventKey="travellerExperience" title="Traveller Experience">
                                    <TravellerExperience dataset={productData} orderid={props.orderid} />
                                </Tab>


                                <Tab eventKey="acc" title="Accounts Details">
                                    <AccountsDetails dataset={orderMainDetails} orderid={props.orderid} relord={() => reload()} paymentproof={(val) => handlePaymentProof(val)} />
                                </Tab>
                                {/* 
                                <Tab eventKey="location" title="Location Details">
                                    <DeliveryDetails dataset={productData} />
                                </Tab> */}




                            </Tabs>




                        </CCol>

                        {showModal == true ?
                            <PaymentModal
                                show={showModal}
                                onHide={() => setShowModal(false)}
                                dataset={rowDetails}
                            />
                            :
                            null
                        }



                        <MoreOrderView
                            show={moreOrderModal}
                            onHide={() => setMoreOrderModal(false)}
                            preID={moreOrderDetails}
                            category={moreOrderModalCategory}
                        >
                        </MoreOrderView>

                        <DetailExpander
                            show={detailExpander}
                            onHide={() => setDetailExpander(false)}
                            orderid={props.orderid}

                            component={
                                <Tabs
                                    defaultActiveKey="bookingexperience"
                                    id="uncontrolled-tab-example"
                                    className="mt-4"
                                >


                                    <Tab eventKey="bookingexperience" title="Booking Experience">
                                        <BookingExperience dataset={productData} orderid={props.orderid} />
                                    </Tab>

                                    <Tab eventKey="supplierexperience" title="Supplier Experience">
                                        <SupplierExperience dataset={productData} orderid={props.orderid} />
                                    </Tab>

                                    <Tab eventKey="travellerExperience" title="Traveller Experience">
                                        <TravellerExperience dataset={productData} orderid={props.orderid} />
                                    </Tab>


                                    <Tab eventKey="acc" title="Accounts Details">
                                        <AccountsDetails dataset={orderMainDetails} orderid={props.orderid} relord={() => reload()} paymentproof={(val) => handlePaymentProof(val)} />
                                    </Tab>
                                    {/* 
                                    <Tab eventKey="location" title="Location Details">
                                        <DeliveryDetails dataset={productData} />
                                    </Tab>
 */}



                                </Tabs>
                            }
                        >

                        </DetailExpander>


                    </>

                }




            </>
    )


}

export default OrderDetails