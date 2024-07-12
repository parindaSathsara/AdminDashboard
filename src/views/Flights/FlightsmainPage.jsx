import CIcon from '@coreui/icons-react'
import React, { useEffect, useState } from 'react'

import { cilFlightTakeoff, cilSortDescending, cilSortAscending, cilInfo } from '@coreui/icons'
import axios from 'axios'

function FlightsmainPage() {


    const [flightDetails, setFlightDetails] = useState([])
    const [flightDetailsCopy, setFlightDetailsCopy] = useState([])

    const [bookingCounts, setBookingCounts] = useState({
        completed: 0,
        cancelled: 0,
        pending: 0,
        refunded: 0,
        total: 0
    })

    const getBookingCounts = () => {
        let completed = 0;
        let pending = 0;
        let refunds = 0;
        let cancelled = 0;
        flightDetails.map((value) => {
            if (value.Status === 'Confirmed') {
                completed += 1
            } else if (value.Status === 'Pending') {
                pending += 1
            } else if (value.Status === 'Cancelled') {
                cancelled += 1
            } else if (value.Status === 'refunded') {
                refunds += 1
            }
        })
        const dataset = {
            completed: completed,
            pending: pending,
            refunds: refunds,
            cancelled: cancelled
        }
        return dataset;

    }

    useEffect(() => {
        let result = getBookingCounts();
        setBookingCounts({
            completed: result.completed,
            cancelled: result.cancelled,
            pending: result.pending,
            refunded: result.refunds,
            total: Number(result.completed) + Number(result.cancelled) + Number(result.pending) + Number(result.refunds)
        })
    }, [])

    const [sortedStatus, setSortedStatus] = useState({
        dataSort: false
    })

    const handleSortDate = () => {
        if (sortedStatus.dataSort) {
            let sortedByDate = flightDetails.toSorted((a, b) => { return new Date(a.departure_dates) - new Date(b.departure_dates) })
            setFlightDetailsCopy(sortedByDate)
            setSortedStatus({ ...sortedStatus, dataSort: false })
        } else {
            let sortedByDate = flightDetails.toSorted((a, b) => { return new Date(b.departure_dates) - new Date(a.departure_dates) })
            setFlightDetailsCopy(sortedByDate)
            setSortedStatus({ ...sortedStatus, dataSort: true })
        }
    }

    const getFlightBookingDetails = async () => {
        await axios.get('http://192.168.1.23:8000/api/bookings').then((response) => {
            console.log(response);
            setBookingCounts({
                completed: response.data.length,
                cancelled: response.data.length,
                pending: 0,
                refunded: 0,
                total: 0
            })
            setFlightDetails(response.data)
            setFlightDetailsCopy(response.data)
        })
    }

    useEffect(() => {
        getFlightBookingDetails()
    }, [])

    const getAmount = (value) => {
        let result = JSON.parse(value);
        return <p>{result.total_amount} : {result.currency}</p>
    }

    const getCustomerDetails = (value) => {
        let result = JSON.parse(value)
        return (
            <div className='d-flex flex-column align-items-center'>
                <p className='m-0 p-0'>{result.email}</p>
                <p className='m-0 p-0'>{result.contact}</p>
            </div>

        )
    }

    const getPaxDetails = (value) => {
        let result = JSON.parse(value)
        console.log(result);
        return <p> Adult x {result.adultCount}, Childs x {result.childCount}, Infants x {result.infCount}</p>
    }

    return (
        <div className='container-fluid p-0 m-0'>

            <h6 className='px-3 py-2 mx-2' style={{ backgroundColor: 'whitesmoke', fontSize: 18, fontWeight: 600, width: 'fit-content', paddingRight: 60 }}>Latest booking list</h6>

            <div className='col-12 mb-4  d-flex justify-content-between'>
                <div className='px-2 py-3 w-100 d-flex align-items-center mx-2 rounded-3' style={{ backgroundColor: 'whitesmoke' }}>
                    <div className='mx-2 p-2 rounded-2' style={{ backgroundColor: 'white', fontSize: 14 }}>
                        <CIcon icon={cilFlightTakeoff} />
                    </div>
                    <div className='d-flex flex-column'>
                        <h6 className='p-0 m-0' style={{ fontSize: 10, color: 'gray' }}>Total air booking</h6>
                        <p className='p-0 m-0' style={{ fontSize: 14, fontWeight: 700, color: 'black' }}>{bookingCounts.total}</p>
                    </div>
                </div>
                <div className='px-2 py-3 w-100 d-flex align-items-center mx-2 rounded-3' style={{ backgroundColor: 'whitesmoke' }}>
                    <div className='mx-2 p-2 rounded-2' style={{ backgroundColor: 'white', fontSize: 14 }}>
                        <CIcon icon={cilFlightTakeoff} />
                    </div>
                    <div className='d-flex flex-column'>
                        <h6 className='p-0 m-0' style={{ fontSize: 10, color: 'gray' }}>Success</h6>
                        <p className='p-0 m-0' style={{ fontSize: 14, fontWeight: 700, color: 'black' }}>{bookingCounts.completed}</p>
                    </div>
                </div>
                <div className='px-2 py-3 w-100 d-flex align-items-center mx-2 rounded-3' style={{ backgroundColor: 'whitesmoke' }}>
                    <div className='mx-2 p-2 rounded-2' style={{ backgroundColor: 'white', fontSize: 14 }}>
                        <CIcon icon={cilFlightTakeoff} />
                    </div>
                    <div className='d-flex flex-column'>
                        <h6 className='p-0 m-0' style={{ fontSize: 10, color: 'gray' }}>Cancelled bookings</h6>
                        <p className='p-0 m-0' style={{ fontSize: 14, fontWeight: 700, color: 'black' }}>{bookingCounts.cancelled}</p>
                    </div>
                </div>
                <div className='px-2 py-3 w-100 d-flex align-items-center mx-2 rounded-3' style={{ backgroundColor: 'whitesmoke' }}>
                    <div className='mx-2 p-2 rounded-2' style={{ backgroundColor: 'white', fontSize: 14 }}>
                        <CIcon icon={cilFlightTakeoff} />
                    </div>
                    <div className='d-flex flex-column'>
                        <h6 className='p-0 m-0' style={{ fontSize: 10, color: 'gray' }}>Pending</h6>
                        <p className='p-0 m-0' style={{ fontSize: 14, fontWeight: 700, color: 'black' }}>{bookingCounts.pending}</p>
                    </div>
                </div>
                <div className='px-2 py-3 w-100 d-flex align-items-center mx-2 rounded-3' style={{ backgroundColor: 'whitesmoke' }}>
                    <div className='mx-2 p-2 rounded-2' style={{ backgroundColor: 'white', fontSize: 14 }}>
                        <CIcon icon={cilFlightTakeoff} />
                    </div>
                    <div className='d-flex flex-column'>
                        <h6 className='p-0 m-0' style={{ fontSize: 10, color: 'gray' }}>Refund status</h6>
                        <p className='p-0 m-0' style={{ fontSize: 14, fontWeight: 700, color: 'black' }}>{bookingCounts.refunded}</p>
                    </div>
                </div>
            </div>

            <div className='d-flex p-0 flex-wrap'>

                <div className='col-12 rounded-2 mx-2' style={{ backgroundColor: 'whitesmoke', height: '800px', overflowY: 'scroll' }}>
                    <div className='d-flex col-12 justify-content-around border-bottom p-0 py-2'>
                        <header className='text-center col-2 rounded-2 py-2' style={{ fontWeight: 600, fontSize: 12, backgroundColor: 'whitesmoke' }}>Order ID</header>
                        <header className='text-center col-2 rounded-2 py-2' style={{ fontWeight: 600, fontSize: 12, backgroundColor: 'whitesmoke' }}>Pax Name</header>
                        <header className='text-center col-2 rounded-2 py-2' style={{ fontWeight: 600, fontSize: 12, backgroundColor: 'whitesmoke' }}>Airline Name</header>
                        <header className='text-center col-2 rounded-2 py-2' style={{ fontWeight: 600, fontSize: 12, backgroundColor: 'whitesmoke' }}>
                            {sortedStatus.dataSort ? <CIcon icon={cilSortAscending} size='sm' className='mx-1' onClick={handleSortDate} /> : <CIcon icon={cilSortDescending} size='sm' className='mx-1' onClick={handleSortDate} />}
                            Flights date Name</header>
                        <header className='text-center col-2 rounded-2 py-2' style={{ fontWeight: 600, fontSize: 12, backgroundColor: 'whitesmoke' }}>Amount</header>
                        <header className='text-center col-2 rounded-2 py-2' style={{ fontWeight: 600, fontSize: 12, backgroundColor: 'whitesmoke' }}>Pax</header>
                    </div>
                    {
                        flightDetailsCopy.length > 0 &&
                        flightDetailsCopy.map((value, key) => (
                            <div className='d-flex col-12 justify-content-around p-0 py-2' key={key}>
                                <span className='text-center col-2 rounded-2 py-2' style={{ fontSize: 12, backgroundColor: 'whitesmoke' }}><CIcon icon={cilInfo} className="text-info" size="sm" style={{ marginRight: 20 }} />{value.order_id}</span>
                                <span className='text-center col-2 rounded-2 py-2' style={{ fontSize: 10, backgroundColor: 'whitesmoke' }}>{getCustomerDetails(value.contact_details)}</span>
                                <span className='text-center col-2 rounded-2 py-2' style={{ fontSize: 12, backgroundColor: 'whitesmoke' }}>"Airline_Name"</span>
                                <span className='text-center col-2 rounded-2 py-2' style={{ fontSize: 12, backgroundColor: 'whitesmoke' }}>{value.departure_dates}</span>
                                <span className='text-center col-2 rounded-2 py-2' style={{ fontSize: 12, backgroundColor: 'whitesmoke' }}>{getAmount(value.baseData)}</span>
                                <span className='text-center col-2 rounded-2 py-2' style={{ fontSize: 12, backgroundColor: 'whitesmoke' }}>{getPaxDetails(value.flightCustomerSearch)}</span>
                            </div>
                        ))
                    }
                </div>


                <div className='col-5 mr-auto m-0 p-0 mt-3'>

                    <div className='col-12 d-flex flex-column'>

                        <h6 className='p-3 rounded-3' style={{ fontWeight: 700, textTransform: 'capitalize', backgroundColor: 'whitesmoke' }}>Latest cancelled</h6>

                        <div className='col-12 d-flex flex-column align-items-center' style={{ backgroundColor: 'whitesmoke', height: "340px", overflowY: 'scroll', overflowX: 'hidden' }}>
                            <div className='d-flex col-12 justify-content-around p-0  border-bottom' style={{ position: 'sticky', top: '0px' }}>
                                <header className='w-100 text-center rounded-2 mx-1 py-1' style={{ fontSize: 12, backgroundColor: 'whitesmoke' }}>PNR No</header>
                                <header className='w-100 text-center rounded-2 mx-1 py-1' style={{ fontSize: 12, backgroundColor: 'whitesmoke' }}>PAX name</header>
                                <header className='w-100 text-center rounded-2 mx-1 py-1' style={{ fontSize: 12, backgroundColor: 'whitesmoke' }}>Amount</header>
                            </div>
                            {
                                flightDetailsCopy.map((value, key) => (
                                    value.Status === "Cancelled" &&
                                    <div className='d-flex col-12 justify-content-around p-0 py-1' key={key}>
                                        <span className='w-100 text-center rounded-2 mx-1 py-1' style={{ fontSize: 12, backgroundColor: 'whitesmoke' }}>{value.PNR_No}</span>
                                        <span className='w-100 text-center rounded-2 mx-1 py-1' style={{ fontSize: 12, backgroundColor: 'whitesmoke' }}>{value.Pax_Name}</span>
                                        <span className='w-100 text-center rounded-2 mx-1 py-1' style={{ fontSize: 12, backgroundColor: 'whitesmoke' }}>{value.Amount}</span>
                                    </div>
                                ))
                            }
                        </div>

                    </div>

                </div>


                <div className='col-6 ms-auto m-0 p-0 mt-3'>

                    <h6 className='p-3 rounded-3' style={{ fontWeight: 700, textTransform: 'capitalize', backgroundColor: 'whitesmoke' }}>Reissue status</h6>

                    <div className='col-12 d-flex flex-column align-items-center' style={{ backgroundColor: 'whitesmoke', height: "340px", overflowY: 'scroll', overflowX: 'hidden' }}>
                        <div className='d-flex col-12 justify-content-around p-0  border-bottom' style={{ position: 'sticky', top: '0px' }}>
                            <header className='w-100 text-center rounded-2 mx-1 py-1' style={{ fontSize: 12, backgroundColor: 'whitesmoke' }}>PNR No</header>
                            <header className='w-100 text-center rounded-2 mx-1 py-1' style={{ fontSize: 12, backgroundColor: 'whitesmoke' }}>PAX name</header>
                            <header className='w-100 text-center rounded-2 mx-1 py-1' style={{ fontSize: 12, backgroundColor: 'whitesmoke' }}>Amount</header>
                        </div>
                        {
                            flightDetailsCopy.map((value, key) => (
                                value.Status === "Pending" &&
                                <div className='d-flex col-12 justify-content-around p-0 py-1' key={key}>
                                    <span className='w-100 text-center rounded-2 mx-1 py-1' style={{ fontSize: 12, backgroundColor: 'whitesmoke' }}>{value.PNR_No}</span>
                                    <span className='w-100 text-center rounded-2 mx-1 py-1' style={{ fontSize: 12, backgroundColor: 'whitesmoke' }}>{value.Pax_Name}</span>
                                    <span className='w-100 text-center rounded-2 mx-1 py-1' style={{ fontSize: 12, backgroundColor: 'whitesmoke' }}>{value.Amount}</span>
                                </div>
                            ))
                        }
                    </div>


                </div>

            </div>

        </div>
    )
}

export default FlightsmainPage

// {
//     "flightValidData": "{\"trip_type\":\"One Way\",\"flightId\":4,\"refKey\":122,\"maindep_datetime_one\":\"2024-06-27\",\"departure_datetime\":\"2024-06-27,2024-06-28,2024-06-28\",\"arrival_datetime\":\"2024-06-27,2024-06-28,2024-06-28\",\"origin_location\":\"LHR,DEL,BOM\",\"dest_location\":\"DEL,BOM,CMB\",\"passenger_type\":\"ADT\",\"seat_count\":1,\"flight_code\":\"UK,UK,UK\",\"flight_number\":\"18,981,131\",\"main_origin_location\":\"LHR\",\"main_dest_location\":\"CMB\"}",
//     "flightsData": null,
//     "flightCustomerSearch": "{\"trip_type\":\"One Way\",\"dep_date\":\"2024-06-27\",\"from_location\":\"LHR\",\"to_location\":\"CMB\",\"passenger_count\":\"1\",\"seat_count\":1,\"passenger_type\":\"ADT\",\"childCount\":0,\"adultCount\":1,\"infCount\":0,\"cabin_code\":\"Y\"}",
//     "adults": "[{\"gender\":\"Male\",\"title\":\"Mr\",\"type\":\"\",\"firstName\":\"Jsnsnns\",\"lastName\":\"Zbannana\",\"dob\":\"\",\"adultFirstName\":\"Znnsnsnsn\",\"adultLastName\":\"Snsjnsnsns\",\"passportDOB\":\"1996-06-18\",\"passportNo\":\"Tsi7189\",\"expiryDate\":\"2024-06-30\"}]",
//     "childs": "[]",
//     "infants": "[]",
//     "departure_dates": "2024-06-27",
//     "arrival_dates": "",
//     "departure_airports": "LHR",
//     "arrival_airports": "CMB",
//     "revalidated_data": null,
//     "passenger_count": 1,
//     "seat_count": 1,
//     "passenger_type": "ADT",
//     "adult_count": 1,
//     "child_count": 0,
//     "infant_count": 0,
//     "cabin_code": "Y",
//     "created_at": "2024-06-18T15:34:23.000000Z",
//     "updated_at": "2024-06-18T15:34:23.000000Z"
// }