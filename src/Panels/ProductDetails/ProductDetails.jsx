import React, { useEffect, useState } from 'react';
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import discountTotal from '../dcalculator';
import moment from 'moment';
import './ProductDetails.css'
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
import { CButton, CCol, CImage, CRow } from '@coreui/react';
import CustomerDetails from '../CustomerDetails/CustomerDetails';

function ProductDetails(props) {

    console.log(props.orderid)

    const [isLoading, setIsLoading] = useState(true)

    const [productData, setProductData] = useState([])
    const [showModal, setShowModal] = useState(false);
    const [rowDetails, setRowDetails] = useState([])



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
        })
    }



    // const data = {
    //     columns: [
    //         // {
    //         //     title: '#ID', field: 'id', align: 'center', editable: 'never',
    //         // },
    //         { field: 'id', title: '#ID', width: 50 },
    //         { field: 'prod_type', title: 'Product Type', },
    //         { field: 'prod_id', title: 'Product Id', align: 'left', },
    //         { field: 'prod_name', title: 'Product Name', align: 'left', width: 300 },
    //         { field: 'qty', title: 'Qty', align: 'left', },
    //         { field: 'unit_price', title: 'Unit Price', align: 'left', },
    //         { field: 'discount', title: 'Discounts', align: 'left', },
    //         { field: 'total', title: 'Total', align: 'left', },
    //         { field: 'session', title: 'Session', align: 'left', },
    //         { field: 'location', title: 'Location', align: 'left', width: 400 },
    //         { field: 'stock', title: 'Stock', align: 'left', },
    //         { field: 'cancel_dead', title: 'CancelDeadline', align: 'left', },
    //         { field: 'cancel_policy', title: 'CancelPolicy', align: 'left', },


    //     ],
    //     rows: productData?.map((value) => {
    //         return {
    //             id: value.MainTId,
    //             prod_type: value.CategoryType,
    //             // oid: value.OrderId,
    //             prod_id: value.CategoryType == 'Essential' || value.CategoryType == 'Non Essential' ? value.essential_listing_id : value.CategoryType == 'Lifestyle' ? value.lifestyle_id
    //                 : value.CategoryType == 'Education' ? value.education_id : value.CategoryType == 'Hotels' ? value.hotel_id : value.flight_id,
    //             prod_name: value.CategoryType == 'Essential' || value.CategoryType == 'Non Essential' ? value.listing_title : value.CategoryType == 'Lifestyle' ? value.lifestyle_name
    //                 : value.CategoryType == 'Education' ? value.course_name : value.CategoryType == 'Hotels' ? value.hotel_name
    //                     : value.CategoryType == 'Flight' ? 'From: ' + filterJson(value.ori_loccation?.split(',')[0])['city'] + ' - ' + filterJson(value.ori_loccation?.split(',')[0])['airport'] + ' | ' + 'To: ' + filterJson(value.dest_loccation?.split(',')[1])['city'] + ' - ' + filterJson(value.dest_loccation?.split(',')[1])['airport'] : null,
    //             qty: value.CategoryType == 'Essential' || value.CategoryType == 'Non Essential' ? value.ReqQTy :
    //                 value.CategoryType == 'Lifestyle' ? 'Adult Count: ' + value.lifestyle_adult_count + ',' + 'Child Count: ' + value.lifestyle_children_count
    //                     : value.CategoryType == 'Education' ? value['adult_rate'] > 0.00 ? 'Adult: 1 | Child: 0' : value['child_rate'] > 0.00 ? 'Adult: 0 | Child: 1' : value['adult_rate'] || value['child_rate'] > 0.00 ? 'Adult: 1 | Child: 1' : '-'
    //                         : value.CategoryType == 'Hotels' ? 'Single: ' + value.HotelRoomTypes?.split(',')[0] + ', ' + 'Double: ' + value.HotelRoomTypes?.split(',')[1] + ', ' + 'Triple: ' + value.HotelRoomTypes?.split(',')[2]
    //                             + ', ' + 'Quad: ' + value.HotelRoomTypes?.split(',')[3] + ' | ' + 'Total Pax: ' + value.HotelPxCount + ', ' + 'Adult: ' + value.HotelAdtCount + ', ' + 'Child: ' + value.HotelChldCount : value.CategoryType == 'Flight' ? 'Total Pax: ' + value.pax_count : null,
    //             unit_price: value.CategoryType == 'Essential' || value.CategoryType == 'Non Essential' ? value.ESSCurrency + value.mrp
    //                 : value.CategoryType == 'Lifestyle' ? 'Adult Rate: ' + value.LSCurrency + value.adult_rate + ', ' + 'Child Rate: ' + value.LSCurrency + value.child_rate
    //                     : value.CategoryType == 'Education' ? 'Adult Rate: ' + value.EduCurrency + value.adult_course_fee + ', ' + 'Child Rate: ' + value.EduCurrency + value.child_course_fee
    //                         : value.CategoryType == 'Hotels' ? 'N/A' : value.CategoryType == 'Flight' ? value.currency + value.total_amount : null,
    //             discount: value.CategoryType == 'Essential' || value.CategoryType == 'Non Essential' ? value.ESDiscountType == 'fps' ? value.ESSCurrency + value.ESDiscountAmount : value.ESDiscountType == 'ps' ? value.ESDiscountPrecentage.split('.')[0] + '%' : value.ESDiscountType == 'bogof' ? value.ESDiscountOfferTitle : 'N/A'
    //                 : value.CategoryType == 'Lifestyle' ? value.LSDiscountType == 'Amount' ? value.LSCurrency + parseFloat(value.LSDiscountValue).toFixed(2) : value.LSDiscountType == '%' ? value.LSDiscountValue + '%' : 'N/A'
    //                     : value.CategoryType == 'Education' ?
    //                         value.EduDiscountType == '%' ?
    //                             Math.round(value.EduDisValue) + '%' :
    //                             value.EduDiscountType == 'Amount' ?
    //                                 value.EduCurrency + value.EduDisValue : '-' : value.CategoryType == 'Hotels' ? 'N/A' : value.CategoryType == 'Flight' ? 'N/A' : null,
    //             total: value.CategoryType == 'Essential' || value.CategoryType == 'Non Essential' ? value.ItemCurrency + discountTotal(value.ReqQTy, value)['discount_amount'] : value.CategoryType == 'Lifestyle' ? value.ItemCurrency + value.CartEachItemPrice
    //                 : value.CategoryType == 'Education' ? value.EduCurrency + value.CartEachItemPrice : value.CategoryType == 'Hotels' ? value.ItemCurrency + value.CartEachItemPrice : value.CategoryType == 'Flight' ? value.currency + value.total_amount : null,
    //             session: value.CategoryType == 'Essential' || value.CategoryType == 'Non Essential' ? 'N/A' : value.CategoryType == 'Lifestyle' ? value.pickup_time
    //                 : value.CategoryType == 'Education' ? value.session_no + ' Sessions' : value.CategoryType == 'Hotels' ? HotelNightdays(value.HotelCheckin, value.HotelCheckout) + ' Night(s)'
    //                     : value.CategoryType == 'Flight' ? calculateHours(value.departure_time, value.arrival_time) + 'hrs' : 'N/A',
    //             location: value.CategoryType == 'Essential' || value.CategoryType == 'Non Essential' ? value.delivery_address : value.CategoryType == 'Lifestyle' ? value.pickup_location
    //                 : value.CategoryType == 'Education' ? value.session_no + ' Sessions' : value.CategoryType == 'Hotels' ? 'N/A' : value.CategoryType == 'Flight' ? filterJson(value.dest_loccation?.split(',')[1])['city'] : null,
    //             stock: value.CategoryType == 'Essential' || value.CategoryType == 'Non Essential' ? value.qty : value.CategoryType == 'Lifestyle' ? value.LSAllotments
    //                 : value.CategoryType == 'Education' ? 'Total: ' + value.total_inventory + ', ' + 'Used: ' + value.used_inventory : value.CategoryType == 'Hotels' ? 'N/A' : value.CategoryType == 'Flight' ? 'N/A' : null,
    //             cancel_dead: value.CategoryType == 'Essential' || value.CategoryType == 'Non Essential' ? moment(value.delivery_date).add(parseInt(value.cancellationDay) + 1, 'days').format("YYYY-MM-DD")
    //                 : value.CategoryType == 'Lifestyle' ? moment(value.LifeStylePrefDate).add(parseInt(value.LifeStyleCancel), 'days').format("YYYY-MM-DD")
    //                     : value.CategoryType == 'Education' ? moment(value.booking_date).add(parseInt(value.deadline_no_ofdays), 'days').format('YYYY-MM-DD') : value.CategoryType == 'Hotels' ? value.HotelCancelDeadline : 'N/A',
    //             cancel_policy: value.CategoryType == 'Essential' || value.CategoryType == 'Non Essential' ? value.EssRefundPolicy == null ? 'N/A' : value.EssRefundPolicy : value.CategoryType == 'Lifestyle' ? value.LSCancelPolicy
    //                 : value.CategoryType == 'Education' ? value.cancel_policy : value.CategoryType == 'Hotels' ? 'N/A' : 'N/A',
    //         }
    //     })
    // }


    const lifestyles = {
        columns: [
            { field: 'product_title', title: 'Product Title' },
            { field: 'adultCount', title: 'Adult Count', align: 'left' },
            { field: 'childCount', title: 'Child Count', align: 'left' },
            { field: 'booking_date', title: 'Booking Date', align: 'left' },
            { field: 'balance_amount', title: 'Balance Amount', align: 'left' },
            { field: 'paid_amount', title: 'Paid Amount', align: 'left' },
            { field: 'total_amount', title: 'Total Amount', align: 'left' },
            {
                field: 'del_status', title: 'Order Status', align: 'left', hidden: props.hideStatus, render: (e) => {
                    return (
                        <>
                            <select className='form-select required' name='delivery_status' onChange={(value) => handleDelStatusChange(e, value)}>
                                {e.del_status == "Pending" ?
                                    <option value="Pending" selected>Pending</option>
                                    :
                                    <option value="Pending">Pending</option>
                                }
                                {e.del_status == "Confirmed" ?
                                    <option value="Confirmed" selected>Confirmed</option>
                                    :
                                    <option value="Confirmed">Confirmed</option>
                                }
                            </select>
                        </>
                    )
                }
            },
        ],

        rows: lifestylesData?.map(value => ({
            id: value.checkoutID,
            product_title: value.product_title,
            childCount: value.childCount,
            adultCount: value.adultCount,
            balance_amount: value.currency + " " + (value.balance_amount || "0.00"),
            paid_amount: value.currency + " " + (value.paid_amount || "0.00"),
            total_amount: value.currency + " " + (value.total_amount || "0.00"),
            booking_date: value.booking_date,
            del_status: "-" // Default value
        }))
    }

    const educations = {
        columns: [
            // { field: 'id', title: 'ID' },
            { field: 'product_title', title: 'Product Title' },
            { field: 'student_type', title: 'Student Type', align: 'left' },
            { field: 'booking_date', title: 'Booking Date', align: 'left' },
            { field: 'balance_amount', title: 'Balance Amount', align: 'left' },
            { field: 'paid_amount', title: 'Paid Amount', align: 'left' },
            { field: 'total_amount', title: 'Total Amount', align: 'left' },
            {
                field: 'del_status', title: 'Order Status', align: 'left', hidden: props.hideStatus, render: (e) => {
                    return (
                        <>
                            <select className='form-select required' name='delivery_status' onChange={(value) => handleDelStatusChange(e, value)}>
                                {e.del_status == "Pending" ?
                                    <option value="Pending" selected>Pending</option>
                                    :
                                    <option value="Pending">Pending</option>
                                }
                                {e.del_status == "Confirmed" ?
                                    <option value="Confirmed" selected>Confirmed</option>
                                    :
                                    <option value="Confirmed">Confirmed</option>
                                }
                            </select>
                        </>
                    )
                }
            },
        ],

        rows: educationData?.map(value => ({
            id: value.checkoutID,
            product_title: value.product_title,
            student_type: value.student_type,
            balance_amount: value.currency + " " + (value.balance_amount || "0.00"),
            paid_amount: value.currency + " " + (value.paid_amount || "0.00"),
            total_amount: value.currency + " " + (value.total_amount || "0.00"),
            booking_date: value.preffered_booking_date,
            del_status: "-" // Default value
        }))
    }

    const essNEss = {
        columns: [
            { field: 'product_title', title: 'Product Title' },
            { field: 'quantity', title: 'Quantity', align: 'left' },
            { field: 'preffered_date', title: 'Preferred Date', align: 'left' },
            { field: 'balance_amount', title: 'Balance Amount', align: 'left' },
            { field: 'paid_amount', title: 'Paid Amount', align: 'left' },
            { field: 'total_amount', title: 'Total Amount', align: 'left' },
            {
                field: 'del_status', title: 'Order Status', align: 'left', hidden: props.hideStatus, render: (e) => {
                    return (
                        <>
                            <select className='form-select required' name='delivery_status' onChange={(value) => handleDelStatusChange(e, value)}>
                                {e.del_status == "Pending" ?
                                    <option value="Pending" selected>Pending</option>
                                    :
                                    <option value="Pending">Pending</option>
                                }
                                {e.del_status == "Confirmed" ?
                                    <option value="Confirmed" selected>Confirmed</option>
                                    :
                                    <option value="Confirmed">Confirmed</option>
                                }
                            </select>
                        </>
                    )
                }
            },
        ],

        rows: essNEssData?.map(value => ({
            id: value.checkoutID,
            product_title: value.product_title,
            quantity: value.quantity,
            preffered_date: value.preffered_date,
            balance_amount: value.currency + " " + (value.balance_amount || "0.00"),
            paid_amount: value.currency + " " + (value.paid_amount || "0.00"),
            total_amount: value.currency + " " + (value.total_amount || "0.00"),
            del_status: "-" // Default value
        }))
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


    const handleDelStatusChange = (e, val) => {
        console.log(e, "Value Data set is")


        updateDeliveryStatus(e.id, val.target.value, e.category)

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
                field: 'del_status', title: 'Order Status', align: 'left', hidden: props.hideStatus, render: (e) => {
                    return (
                        <>
                            <select className='form-select required' name='delivery_status' onChange={(value) => handleDelStatusChange(e, value)}>
                                {e.del_status == "Pending" ?
                                    <option value="Pending" selected>Pending</option>
                                    :
                                    <option value="Pending">Pending</option>
                                }
                                {e.del_status == "Confirmed" ?
                                    <option value="Confirmed" selected>Confirmed</option>
                                    :
                                    <option value="Confirmed">Confirmed</option>
                                }
                            </select>
                        </>
                    )
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
            del_status: value
        }))
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






                </div>

                {console.log("product data value is ", productData)}

                {props?.accounts ?
                    null :
                    <>
                        <Tabs
                            defaultActiveKey="acc"
                            id="uncontrolled-tab-example"
                            className="mt-4"
                        >
                            {/* <Tab eventKey="confirmation" title="Confirmation Details">
                                <ConfirmationDetails dataset={productData} orderid={props.orderid} relord={() => reload()} />
                            </Tab> */}

                            <Tab eventKey="acc" title="Accounts Details">
                                <AccountsDetails dataset={orderMainDetails} orderid={props.orderid} relord={() => reload()} paymentproof={(val) => handlePaymentProof(val)} />
                            </Tab>
                            <Tab eventKey="sup" title="Supplier Details">
                                <SupDetails dataset={productData} orderid={props.orderid} />
                            </Tab>

                            <Tab eventKey="customer" title="Customer Details">
                                <CustomerDetails dataset={customerData} orderid={props.orderid} />
                            </Tab>

                            {/* <Tab eventKey="feedback" title="Feedback Details">
                                <FeebackDetails dataset={productData} orderid={props.orderid} />
                            </Tab> */}

                        </Tabs>

                        {showModal == true ?
                            <PaymentModal
                                show={showModal}
                                onHide={() => setShowModal(false)}
                                dataset={rowDetails}
                            />
                            :
                            null
                        }
                    </>

                }

            </>
    )


}

export default ProductDetails